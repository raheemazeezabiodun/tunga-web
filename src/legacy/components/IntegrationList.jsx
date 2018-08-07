import React from 'react';
import {Link} from 'react-router';
import Progress from './status/Progress';
import FormStatus from './status/FormStatus';
import ComponentWithModal from './ComponentWithModal';

import {
    SOCIAL_PROVIDERS,
    SOCIAL_LOGIN_URLS,
    INTEGRATION_TYPE_CHOICES,
    INTEGRATION_TYPE_REPO,
    INTEGRATION_TYPE_ISSUE,
    GIT_INTEGRATION_EVENT_CHOICES,
    CHAT_INTEGRATION_EVENT_CHOICES,
    INTEGRATION_EVENT_ISSUE_COMMENT,
} from '../constants/Api';

import {getAuth} from '../utils/auth';

export default class IntegrationList extends ComponentWithModal {
    constructor(props) {
        super(props);
        this.state = {
            integration_type: null,
            events: [],
            repo: null,
            issue: null,
            channel: null,
            team: null,
        };
    }

    componentDidMount() {
        const {Task} = this.props;
        const {integrations} = Task.detail;

        const provider = this.getProvider();

        this.initializeIntegrationInfo(provider);

        this.updateIntegrationInfo(this.props);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (
            (!nextProps.Task.detail.integrations.isSaved &&
                this.props.Task.detail.integrations.isSaved) ||
            nextProps.Task.detail.integrations.integration.id !=
                this.props.Task.detail.integrations.integration.id
        ) {
            this.updateIntegrationInfo(nextProps);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.params.provider != prevProps.params.provider) {
            this.initializeIntegrationInfo(this.getProvider());
        }
    }

    getProvider() {
        return this.props.params.provider;
    }

    initializeIntegrationInfo(provider) {
        const {TaskActions, Task} = this.props;
        const {task} = Task.detail;

        TaskActions.retrieveTaskIntegration(task.id, provider);

        switch (provider) {
            case SOCIAL_PROVIDERS.github:
                TaskActions.listRepos(SOCIAL_PROVIDERS.github, task.id);
                TaskActions.listIssues(SOCIAL_PROVIDERS.github, task.id);
                break;
            case SOCIAL_PROVIDERS.slack:
                TaskActions.getSlackApp(task.id);
                TaskActions.listSlackChannels(task.id);
                break;
            default:
                break;
        }
    }

    updateIntegrationInfo(props) {
        const {Task} = props;
        const {integration} = Task.detail.integrations;
        var events = [];
        var integration_type = null;

        if (integration.id) {
            events = [...integration.events];
            integration_type = integration.type;
        } else {
            integration_type = INTEGRATION_TYPE_REPO;
        }
        this.setState({integration_type, events});
    }

    onIntegrationTypeChange(integration_type) {
        this.setState({integration_type});
    }

    onRepoChange(e) {
        let id = e.target.value;
        var repo = null;
        if (id) {
            const {github} = getAuth().connections;
            repo = github.repos.items[id];
        }
        this.setState({repo, issue: null});
    }

    onIssueChange(e) {
        let id = e.target.value;
        var issue = null;
        var repo = null;
        if (id) {
            const {github} = getAuth().connections;
            issue = github.issues.items[id];
            repo = issue['repository'];
        }
        this.setState({repo, issue});
    }

    onEventChange(e) {
        let event = e.target.value;
        let idx = this.state.events.indexOf(event);
        var new_events = [...this.state.events];
        if (e.target.checked && idx == -1) {
            new_events.push(event);
        } else if (!e.target.checked && idx > -1) {
            new_events = [
                ...new_events.slice(0, idx),
                ...new_events.slice(idx + 1),
            ];
        }
        this.setState({events: new_events});
    }

    onChannelChange(e) {
        let id = e.target.value;
        const {slack} = getAuth().connections;

        var channel = null;
        if (id) {
            channel = slack.channels.items[id];
        }
        this.setState({channel, team: slack.details.team});
    }

    handleSubmit(e) {
        e.preventDefault();
        var type = this.state.integration_type;
        var events = this.state.events;
        var repo = this.state.repo;
        var issue = this.state.issue;
        var channel = this.state.channel;
        var team = this.state.team;
        const {Task, TaskActions} = this.props;
        const {task} = Task.detail;
        const provider = this.getProvider();

        var details = null;
        switch (provider) {
            case SOCIAL_PROVIDERS.github:
                details = {type, events, repo, issue};
                break;
            case SOCIAL_PROVIDERS.slack:
                details = {team, channel, events};
                break;
            default:
                break;
        }

        TaskActions.createTaskIntegration(task.id, provider, details);
    }

    render() {
        const {Task} = this.props;
        const {task, integrations} = Task.detail;
        const {integration} = integrations;
        const {github, slack} = getAuth().connections;
        const provider = this.getProvider();

        var event_choices = [];
        switch (provider) {
            case SOCIAL_PROVIDERS.github:
                event_choices = GIT_INTEGRATION_EVENT_CHOICES;
                break;
            case SOCIAL_PROVIDERS.slack:
                event_choices = CHAT_INTEGRATION_EVENT_CHOICES;
                break;
        }

        return (
            <div className="form-wrapper">
                {/*<div className="clearfix">
                    <ul className="integration-options">
                        <li>
                            <Link to={`/work/${task.id}/integrations/${SOCIAL_PROVIDERS.github}`}
                                  activeClassName="active"
                                  className="github-button"
                                  title="GitHub">
                                <i className="fa fa-github"/>
                            </Link>
                        </li>
                        <li>
                            <Link to={`/work/${task.id}/integrations/${SOCIAL_PROVIDERS.slack}`}
                                  activeClassName="active"
                                  className="slack-button"
                                  title="Slack">
                                <i className="fa fa-slack"/>
                            </Link>
                        </li>
                    </ul>
                </div>*/}
                {Task.detail.isRetrieving ||
                Task.detail.integrations.isRetrieving ||
                github.repos.isFetching ||
                github.issues.isFetching ||
                slack.isRetrieving ? (
                    <Progress />
                ) : (
                    <div>
                        {provider == SOCIAL_PROVIDERS.slack ? (
                            <div>
                                <div className="card">
                                    {slack.isConnected ? (
                                        <div>
                                            <p>
                                                Select events to share to your
                                                Slack channel.
                                            </p>
                                            Team:{' '}
                                            <strong>
                                                {integration.team_name}
                                            </strong>
                                            <br />
                                            Channel:{' '}
                                            <strong>
                                                {integration.channel_name}
                                            </strong>
                                        </div>
                                    ) : (
                                        'Connect your task to your Slack team to send task activity to Slack.'
                                    )}
                                </div>
                                {!slack.isConnected ? (
                                    <a
                                        href={
                                            SOCIAL_LOGIN_URLS.slack +
                                            `?action=connect&task=${
                                                task.id
                                            }&next=${
                                                window.location.protocol
                                            }//${window.location.host}/work/${
                                                task.id
                                            }/integrations/slack`
                                        }
                                        className="btn slack-connect-button"
                                        title="Connect with Slack">
                                        <i className="fa fa-slack fa-lg" />{' '}
                                        Connect with Slack
                                    </a>
                                ) : null}
                            </div>
                        ) : null}

                        {provider == SOCIAL_PROVIDERS.github ? (
                            <div>
                                <div className="card">
                                    Connect your task to a GitHub repository or
                                    issue to show GitHub activity (e.g comments,
                                    pull requests, push events) in your task
                                    activity stream.
                                </div>
                                {!github.isConnected ? (
                                    <a
                                        href={
                                            SOCIAL_LOGIN_URLS.github +
                                            `?action=connect&task=${
                                                task.id
                                            }&next=${
                                                window.location.protocol
                                            }//${window.location.host}/work/${
                                                task.id
                                            }/integrations/${
                                                SOCIAL_PROVIDERS.github
                                            }`
                                        }
                                        className="btn github-connect-button"
                                        title="Connect with GitHub">
                                        <i className="fa fa-github-square fa-lg" />{' '}
                                        Connect with GitHub
                                    </a>
                                ) : null}
                            </div>
                        ) : null}

                        {(provider == SOCIAL_PROVIDERS.github &&
                            github.isConnected) ||
                        (provider == SOCIAL_PROVIDERS.slack &&
                            slack.isConnected) ? (
                            <form
                                onSubmit={this.handleSubmit.bind(this)}
                                name="task"
                                role="form"
                                ref="integration_form">
                                <FormStatus
                                    loading={Task.detail.integrations.isSaving}
                                    success={Task.detail.integrations.isSaved}
                                    message={'Integration saved successfully'}
                                    error={
                                        Task.detail.integrations.error.create
                                    }
                                />

                                {provider == SOCIAL_PROVIDERS.github ? (
                                    <div>
                                        <div className="form-group">
                                            <label className="control-label">
                                                Integration type *
                                            </label>
                                            <div>
                                                <div
                                                    className="btn-group btn-choices select"
                                                    role="group"
                                                    aria-label="integration type">
                                                    {INTEGRATION_TYPE_CHOICES.map(
                                                        integration_type => {
                                                            return (
                                                                <button
                                                                    key={
                                                                        integration_type.id
                                                                    }
                                                                    type="button"
                                                                    className={
                                                                        'btn ' +
                                                                        (this
                                                                            .state
                                                                            .integration_type ==
                                                                        integration_type.id
                                                                            ? ' active'
                                                                            : '')
                                                                    }
                                                                    onClick={this.onIntegrationTypeChange.bind(
                                                                        this,
                                                                        integration_type.id,
                                                                    )}>
                                                                    {
                                                                        integration_type.name
                                                                    }
                                                                </button>
                                                            );
                                                        },
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {this.state.integration_type ==
                                        INTEGRATION_TYPE_REPO ? (
                                            <div className="form-group">
                                                <label className="control-label">
                                                    Repository *
                                                </label>
                                                <div>
                                                    <select
                                                        type="text"
                                                        className="form-control"
                                                        ref="repo"
                                                        onChange={this.onRepoChange.bind(
                                                            this,
                                                        )}
                                                        defaultValue={
                                                            integration.repo_id
                                                        }>
                                                        <option value="">
                                                            -- Select a repo --
                                                        </option>
                                                        {github.repos.ids.map(
                                                            id => {
                                                                let repo =
                                                                    github.repos
                                                                        .items[
                                                                        id
                                                                    ];
                                                                return (
                                                                    <option
                                                                        key={
                                                                            repo.id
                                                                        }
                                                                        value={
                                                                            repo.id
                                                                        }>
                                                                        {
                                                                            repo.name
                                                                        }
                                                                    </option>
                                                                );
                                                            },
                                                        )}
                                                    </select>
                                                </div>
                                            </div>
                                        ) : null}

                                        {this.state.integration_type ==
                                        INTEGRATION_TYPE_ISSUE ? (
                                            <div className="form-group">
                                                <label className="control-label">
                                                    Issue *
                                                </label>
                                                <div>
                                                    <select
                                                        type="text"
                                                        className="form-control"
                                                        ref="issue"
                                                        onChange={this.onIssueChange.bind(
                                                            this,
                                                        )}
                                                        defaultValue={
                                                            integration.issue_id
                                                        }>
                                                        <option value="">
                                                            -- Select an issue
                                                            --
                                                        </option>
                                                        {github.issues.ids.map(
                                                            id => {
                                                                let issue =
                                                                    github
                                                                        .issues
                                                                        .items[
                                                                        id
                                                                    ];
                                                                return (
                                                                    <option
                                                                        key={
                                                                            issue.id
                                                                        }
                                                                        value={
                                                                            issue.id
                                                                        }>
                                                                        {
                                                                            issue.title
                                                                        }
                                                                    </option>
                                                                );
                                                            },
                                                        )}
                                                    </select>
                                                </div>
                                            </div>
                                        ) : null}
                                    </div>
                                ) : null}

                                {provider == SOCIAL_PROVIDERS.slack ? (
                                    <div className="form-group">
                                        <label className="control-label">
                                            Channel *
                                        </label>
                                        <div>
                                            <select
                                                type="text"
                                                className="form-control"
                                                ref="slack_channel"
                                                onChange={this.onChannelChange.bind(
                                                    this,
                                                )}
                                                defaultValue={
                                                    integration.channel_id
                                                }>
                                                <option value="">
                                                    -- channel --
                                                </option>
                                                {slack.channels.ids.map(id => {
                                                    let channel =
                                                        slack.channels.items[
                                                            id
                                                        ];
                                                    return (
                                                        <option
                                                            key={channel.id}
                                                            value={channel.id}>
                                                            {channel.name}
                                                        </option>
                                                    );
                                                })}
                                            </select>
                                        </div>
                                    </div>
                                ) : null}

                                <div className="form-group">
                                    <label className="control-label">
                                        Events *
                                    </label>
                                    {event_choices.map(event => {
                                        if (
                                            this.state.integration_type ==
                                                INTEGRATION_TYPE_ISSUE &&
                                            event.id !=
                                                INTEGRATION_EVENT_ISSUE_COMMENT
                                        ) {
                                            return null;
                                        }
                                        return (
                                            <div
                                                key={event.id}
                                                className="checkbox">
                                                <label className="control-label">
                                                    <input
                                                        type="checkbox"
                                                        value={event.id}
                                                        onChange={this.onEventChange.bind(
                                                            this,
                                                        )}
                                                        checked={
                                                            this.state.events.indexOf(
                                                                event.id,
                                                            ) > -1
                                                        }
                                                    />
                                                    {event.name}
                                                </label>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="text-center">
                                    <button
                                        type="submit"
                                        className="btn"
                                        disabled={
                                            Task.detail.integrations.isSaving
                                        }>
                                        Save Integration
                                    </button>
                                    {provider == SOCIAL_PROVIDERS.slack ? (
                                        <a
                                            href={
                                                SOCIAL_LOGIN_URLS.slack +
                                                `?action=connect&task=${
                                                    task.id
                                                }&next=${
                                                    window.location.protocol
                                                }//${
                                                    window.location.host
                                                }/work/${
                                                    task.id
                                                }/integrations/slack`
                                            }
                                            className="btn slack-connect-button"
                                            title="Connect with Slack">
                                            <i className="fa fa-slack fa-lg" />{' '}
                                            Re-connect with Slack
                                        </a>
                                    ) : null}

                                    {provider == SOCIAL_PROVIDERS.github ? (
                                        <a
                                            href={
                                                SOCIAL_LOGIN_URLS.github +
                                                `?action=connect&task=${
                                                    task.id
                                                }&next=${
                                                    window.location.protocol
                                                }//${
                                                    window.location.host
                                                }/work/${
                                                    task.id
                                                }/integrations/${
                                                    SOCIAL_PROVIDERS.github
                                                }`
                                            }
                                            className="btn github-connect-button"
                                            title="Connect with GitHub">
                                            <i className="fa fa-github-square fa-lg" />{' '}
                                            Re-connect with GitHub
                                        </a>
                                    ) : null}
                                </div>
                            </form>
                        ) : null}
                    </div>
                )}
            </div>
        );
    }
}
