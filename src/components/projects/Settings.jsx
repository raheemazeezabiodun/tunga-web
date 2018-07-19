import PropTypes from 'prop-types';
import React from 'react';
import {FormGroup, Row, Col} from 'reactstrap';
import {NavLink} from 'react-router-dom';
import Avatar from "../core/Avatar";
import ChoiceGroup from "../core/ChoiceGroup";
import Icon from "../core/Icon";

import {SOCIAL_LOGIN_URLS, SOCIAL_PROVIDERS} from "../../legacy/constants/Api";
import CustomInputGroup from "../core/CustomInputGroup";
import Button from "../core/Button";
import Success from "../core/Success";
import {isAdminOrPMOrClient} from "../utils/auth";
import Info from "../core/Info";
import Select from "../core/Select";
import {SLACK_SHARE_COMMENTS, SLACK_SHARE_DOCS, SLACK_SHARE_EVENTS, SLACK_SHARE_REPORTS} from "../../actions/utils/api";
import {openConfirm} from "../core/utils/modals";

export default class Settings extends React.Component {
    static defaultProps = {
        section: null
    };

    static propTypes = {
        project: PropTypes.object,
        section: PropTypes.string,
        ProjectActions: PropTypes.object,
    };

    constructor(props) {
        super(props);
        this.state = {trello_board_url: '', google_drive_url: '', github_repo_url: '', github_issue_url: '', ...this.parseMetaMap(props.project.meta)}
    }

    onToggleUpdates(participation) {
        const {ProjectActions} = this.props;
        ProjectActions.updateParticipation(participation.id, {updates_enabled: !participation.updates_enabled});
    }

    parseMetaMap(meta, returnId=false) {
        let metaMap = {};
        (meta || []).forEach(item => {
            metaMap[item.meta_key] = returnId?item.id:item.meta_value;
        });
        return metaMap;
    }

    parseJSON(value) {
        try {
            return JSON.parse(value);
        } catch (e) {
            return null;
        }
    }

    onChangeValue(key, value) {
        let newState = {};
        newState[key] = value;
        this.setState(newState);
    }

    onChangeInput(key, e) {
        this.onChangeValue(key, e.target.value);
    }

    onChangeChannel(channelId) {
        let newState = {};
        newState['slack_channel_id'] = channelId;
        (this.parseJSON(this.state.slack_channels) || []).forEach(channel => {
            if(channel.id === channelId) {
                newState['slack_channel_name'] = channel.name;
            }
        });
        this.setState(newState);
    }

    onSaveMeta = (e) => {
        e.preventDefault();
        const { project, section, ProjectActions } = this.props;
        const targetKeysMap = {
            'google-drive': ['google_drive_url'],
            'trello': ['trello_board_url'],
            'github': ['github_repo_url', 'github_issue_url'],
            'slack': [
                'slack_channel_id', 'slack_channel_name',
                SLACK_SHARE_COMMENTS, SLACK_SHARE_DOCS, SLACK_SHARE_REPORTS
            ]
        };

        if(targetKeysMap[section]) {
            let metaData = {};
            targetKeysMap[section].forEach(key => {
                if(typeof this.state[key] === 'boolean' || this.state[key]) {
                    metaData[key] = this.state[key].toString();
                }
            });

            if(Object.keys(metaData).length) {
                let reqData = [], idMap = this.parseMetaMap(project.meta, true);
                Object.keys(metaData).map(key => {
                    let metaInfo = {meta_key: key, meta_value: metaData[key]},
                        metaId = idMap[key];
                    if(metaId) {
                        metaInfo.id = metaId;
                    }
                    reqData.push(metaInfo);
                });

                ProjectActions.updateProject(project.id, {meta: reqData});
            }
        }

    };

    onToggleArchiveProject = () => {
        const {project, ProjectActions} = this.props;
        openConfirm(`Are you sure you want to ${project.archived?'un-archive':'archive'} this project?`,
            null, false, {ok: 'Yes', cancel: 'No'}
        ).then(response => {
            ProjectActions.updateProject(project.id, {archived: !project.archived});
        }, error => {
            // do nothing
        });
    };

    render() {
        const { project, section, isSaved } = this.props;

        return (
            <div className="project-settings">
                <div className="section">
                    <div className="font-weight-normal">Integrations</div>
                    <div className="text text-sm font-weight-thin">Add an integration by clicking on the icons</div>

                    <div className="clearfix">
                        <ul className="integration-options pull-right">
                            <li>
                                <NavLink
                                    to={`/projects/${
                                        project.id
                                        }/settings/${
                                        SOCIAL_PROVIDERS.slack
                                        }`}
                                    activeClassName="active"
                                    title="Slack">
                                    <Icon name="slack" />
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to={`/projects/${
                                        project.id
                                        }/settings/${
                                        SOCIAL_PROVIDERS.github
                                        }`}
                                    activeClassName="active"
                                    title="GitHub">
                                    <Icon name="github" />
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to={`/projects/${project.id}/settings/${
                                        SOCIAL_PROVIDERS.trello
                                        }`}
                                    activeClassName="active"
                                    title="Trello">
                                    <Icon name="trello" />
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to={`/projects/${project.id}/settings/${
                                        SOCIAL_PROVIDERS['google-drive']
                                        }`}
                                    activeClassName="active"
                                    title="Google Drive">
                                    <Icon name="g-drive" />
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="section">
                    {section === 'slack'?(
                        <div className="section">
                            <div className="font-weight-normal">Slack</div>

                            {isAdminOrPMOrClient() && !project.archived?(
                                <div>
                                    <p>Connect your project to your Slack team to send task activity to Slack.</p>

                                    <form onSubmit={this.onSaveMeta} className="slack-form">
                                        {isSaved[project.id]?(
                                            <Success message="Changes saved successfully!"/>
                                        ):null}
                                        {this.state.slack_channels?(
                                            <div>
                                                <FormGroup>
                                                    Team: <strong>{this.state.slack_team_name}</strong>
                                                </FormGroup>
                                                <FormGroup>
                                                    <div>Channel: </div>
                                                    <Select placeholder="-- Select channel --"
                                                            options={(this.parseJSON(this.state.slack_channels) || []).map(channel => {
                                                                return [channel.id, channel.name];
                                                            })}
                                                            selected={this.state.slack_channel_id}
                                                            onChange={value => this.onChangeChannel(value)}/>
                                                </FormGroup>

                                                <FormGroup>
                                                    <div>
                                                        Select items to share with Slack.
                                                    </div>

                                                    {SLACK_SHARE_EVENTS.map(event => {
                                                        let eventId = event[0], elementId = `slack-event-${eventId}`;
                                                        return (
                                                            <div key={eventId} className="form-check">
                                                                <input className="form-check-input"
                                                                       id={elementId}
                                                                       type="checkbox"
                                                                       checked={typeof this.state[eventId] === 'boolean'?this.state[eventId]:['True', 'true'].includes(this.state[eventId])}
                                                                       onChange={e => this.onChangeValue(eventId, e.target.checked)}
                                                                />
                                                                <label className="form-check-label" htmlFor={elementId}>
                                                                    {event[1]}
                                                                </label>
                                                            </div>
                                                        );
                                                    })}
                                                </FormGroup>
                                            </div>
                                        ):null}

                                        <div>
                                            {this.state.slack_channels?(
                                                <Button type="submit">Save</Button>
                                            ):null}

                                            <a href={`${SOCIAL_LOGIN_URLS.slack}?action=connect&project=${project.id}&next=${window.location.protocol}//${window.location.host}/projects/${project.id}/settings/slack`}
                                               className="btn btn-primary"
                                               title="Connect with Slack">
                                                <Icon name="slack" size="main"/> {this.state.slack_token?'Reconnect':'Connect'} with Slack
                                            </a>
                                        </div>
                                    </form>
                                </div>
                            ):this.state.slack_team_name && this.state.slack_channel_name?(
                                <div>
                                    <div>
                                        Team: <strong>{this.state.slack_team_name}</strong>
                                    </div>
                                    <div>
                                        Channel: <strong>{this.state.slack_channel_name}</strong>
                                    </div>
                                    <div>
                                        <div>Shared items:</div>
                                        {SLACK_SHARE_EVENTS.map(event => {
                                            let eventId = event[0];
                                            if(eventId && this.state[eventId] && !['False', 'false'].includes(this.state[eventId])) {
                                                return (
                                                    <div><Icon name="check"/> <strong>{event[1]}</strong></div>
                                                )
                                            }
                                            return null;
                                        })}
                                    </div>
                                </div>
                            ):(
                                <Info message="Integration is not yet configured"/>
                            )}
                        </div>
                    ):null}

                    {['trello', 'google-drive'].indexOf(section) > -1?(
                        <div className="clearfix">
                            <div className="font-weight-normal">{section === 'trello'?'Trello':'Google Drive'}</div>
                            {isAdminOrPMOrClient() && !project.archived?(
                                <form onSubmit={this.onSaveMeta}>
                                    {isSaved[project.id]?(
                                        <Success message="Changes saved successfully!"/>
                                    ):null}
                                    <Row>
                                        <Col>
                                            <FormGroup>
                                                <CustomInputGroup variant="url"
                                                                  placeholder={`${section === 'trello'?'Trello Board':'Google Drive'} URL`}
                                                                  onChange={this.onChangeInput.bind(this, section === 'trello'?'trello_board_url':'google_drive_url')}
                                                                  value={this.state[section === 'trello'?'trello_board_url':'google_drive_url']}
                                                                  required/>
                                            </FormGroup>
                                        </Col>
                                        <Col>
                                            <Button type="submit">Save</Button>
                                        </Col>
                                    </Row>
                                </form>
                            ):(
                                <div>
                                    {this.state[section === 'trello'?'trello_board_url':'google_drive_url']?(
                                        <div>
                                            <a href={this.state.github_repo_url} target="_blank"><Icon name="link"/> {this.state[section === 'trello'?'trello_board_url':'google_drive_url']}</a>
                                        </div>
                                    ):(
                                        <Info message="Integration is not yet configured"/>
                                    )}
                                </div>
                            )}
                        </div>
                    ):null}

                    {section === 'github'?(
                        <div>
                            <div className="font-weight-normal">GitHub</div>
                            {isAdminOrPMOrClient() && !project.archived?(
                                <form onSubmit={this.onSaveMeta}>
                                    {isSaved[project.id]?(
                                        <Success message="Changes saved successfully!"/>
                                    ):null}
                                    <Row>
                                        <Col sm="5">
                                            <label className="font-weight-light">Repo URL</label>
                                        </Col>
                                        <Col sm="5">
                                            <label className="font-weight-light">Issue URL</label>
                                        </Col>
                                        <Col></Col>
                                    </Row>
                                    <Row>
                                        <Col sm="5">
                                            <FormGroup>
                                                <CustomInputGroup variant="url" placeholder="GitHub Repo URL"
                                                                  onChange={this.onChangeInput.bind(this, 'github_repo_url')}
                                                                  value={this.state.github_repo_url}
                                                                  required/>
                                            </FormGroup>
                                        </Col>
                                        <Col sm="5">
                                            <FormGroup>
                                                <CustomInputGroup variant="url" placeholder="GitHub Issue URL"
                                                                  onChange={this.onChangeInput.bind(this, 'github_issue_url')}
                                                                  value={this.state.github_issue_url}/>
                                            </FormGroup>
                                        </Col>
                                        <Col>
                                            <Button type="submit">Save</Button>
                                        </Col>
                                    </Row>
                                </form>
                            ):(
                                <div>
                                    {this.state.github_repo_url || this.state.github_issue_url?(
                                        <div>
                                            {this.state.github_repo_url?(
                                                <p>
                                                    <div className="font-weight-light">Repo URL</div>
                                                    <a href={this.state.github_repo_url} target="_blank"><Icon name="link"/> {this.state.github_repo_url}</a>
                                                </p>
                                            ):null}

                                            {this.state.github_issue_url?(
                                                <p>
                                                    <div className="font-weight-light">Issue URL</div>
                                                    <a href={this.state.github_issue_url} target="_blank"><Icon name="link"/> {this.state.github_issue_url}</a>
                                                </p>
                                            ):null}
                                        </div>
                                    ):(
                                        <Info message="Integration is not yet configured"/>
                                    )}
                                </div>
                            )}
                        </div>
                    ):null}
                </div>

                {isAdminOrPMOrClient()?(
                    <div>
                        <div className="section">
                            <div className="font-weight-normal">Progress reports</div>
                            <div className="text text-sm font-weight-thin">Turn progress reports on and off for specific developers</div>
                        </div>

                        <div className="section developers-list">
                            {project.participation.map(participation => {
                                return (
                                    <div key={participation.id} className="clearfix developer">
                                        <div className="float-left">
                                            <Avatar key={participation.id}
                                                    image={participation.user.avatar_url}
                                                    title={participation.user.display_name}/>

                                        </div>
                                        <div className="float-left dev-name">
                                            <div className="font-weight-normal">{participation.user.display_name}</div>
                                            <div className="text text-sm font-weight-light">@{participation.user.username}</div>
                                        </div>

                                        <ChoiceGroup choices={[[true, 'on'], [false, 'off']]} selected={participation.updates_enabled}
                                                     onChange={this.onToggleUpdates.bind(this, participation)} disabled={!isAdminOrPMOrClient() || project.archived}/>
                                    </div>
                                )
                            })}
                        </div>

                        <div className="section">
                            <div className="font-weight-normal">{project.archived?'Un-archive':'Archive'} project</div>
                            {project.archived?(
                                <div>
                                    Un-archive this project to re-enable project activity.
                                </div>
                            ):(
                                <div>
                                    Mark this project as archived and readonly.<br/>
                                    This will also remove this project from your project list and send it to the archived list.
                                </div>
                            )}
                            <Button onClick={this.onToggleArchiveProject}>{project.archived?'Un-archive':'Archive'} project</Button>
                        </div>
                    </div>
                ):null}
            </div>
        );
    }
}
