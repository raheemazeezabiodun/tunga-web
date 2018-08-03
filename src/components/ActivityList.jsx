import PropTypes from 'prop-types';
import React from 'react';
import {Link} from 'react-router-dom';
import moment from 'moment';
import TimeAgo from 'react-timeago';
import {ProgressBar} from 'react-bootstrap';

import Linkify from './Linkify';
import randomstring from 'randomstring';

import Avatar from './core/Avatar';
import Attachments from './Attachments';
import Icon from "./core/Icon";

import {
    LEGACY_PROGRESS_EVENT_TYPE_MILESTONE,
    LEGACY_PROGRESS_EVENT_TYPE_SUBMIT,
    LEGACY_PROGRESS_EVENT_TYPE_COMPLETE,
    LEGACY_PROGRESS_EVENT_TYPE_PM,
    LEGACY_PROGRESS_EVENT_TYPE_CLIENT,
    LEGACY_PROGRESS_EVENT_TYPE_CLIENT_MID_SPRINT,
} from '../legacy/constants/Api';
import {
    isAuthenticated,
    getUser,
    isAdmin,
    isClient,
    isDev,
    isPM,
} from './utils/auth';
import Progress from "./core/Progress";
import LoadMore from "./core/LoadMore";
import {
    DOC_TYPE_OTHER, INVOICE_TYPE_SALE,
    PROGRESS_EVENT_TYPE_CLIENT, PROGRESS_EVENT_TYPE_CLIENT_MID_SPRINT, PROGRESS_EVENT_TYPE_MILESTONE,
    PROGRESS_EVENT_TYPE_PM
} from "../actions/utils/api";

export function scrollList(listId) {
    let activity_list = $(`#list${listId}.activity-list`);
    activity_list.scrollTop(activity_list.find('.activity-wrapper').height());
}

export default class ActivityList extends React.Component {
    static propTypes = {
        activities: PropTypes.array.isRequired,
        isLoading: PropTypes.bool,
        isLoadingMore: PropTypes.bool,
        hasMore: PropTypes.bool,
        onLoadMore: PropTypes.func,
        loadMoreText: PropTypes.string,
        showMessages: PropTypes.bool,
        showNotifications: PropTypes.bool,
        showFiles: PropTypes.bool,
        showProgressReports: PropTypes.bool,
    };

    static defaultProps = {
        activities: [],
        isLoading: false,
        isLoadingMore: false,
        showMessages: true,
        showNotifications: true,
        showFiles: true,
        showProgressReports: true,
    };

    constructor(props) {
        super(props);
        this.state = {listId: randomstring.generate()};
    }

    componentDidMount() {
        scrollList(this.state.listId);
    }

    componentDidUpdate(prevProps, prevState, snapShot) {
        if (
            this.props.activities &&
            (!prevProps.activities ||
                this.props.activities.length !== prevProps.activities.length)
        ) {
            if(!this.props.isLoadingMore && prevProps.isLoadingMore) {
                // no reason to scroll
            } else {
                scrollList(this.state.listId);
            }
        }
    }

    cleanActivity(item) {
        let activity = item.activity;
        let activityType = item.activity_type;
        let creator = null;
        let createdAt = item.timestamp;
        let body = null;
        let summary = null;
        let uploads = null;
        let more = null;

        const {
            showMessages,
            showNotifications,
            showFiles,
            showProgressReports,
        } = this.props;

        switch (activityType) {
            case 'message':
                if (item.action === 'send' && showMessages) {
                    creator = activity.sender || activity.user;
                    if (!creator) {
                        creator = {
                            id: 'guest',
                            username: 'guest',
                            short_name: isAuthenticated() ? 'Guest' : 'You',
                            display_name: isAuthenticated() ? 'Guest' : 'You',
                        };
                    }
                    createdAt = activity.created_at;
                    body = activity.isForm ? (
                        activity.text_body || activity.body
                    ) : (
                        <Linkify properties={{target: '_blank'}}>
                            {activity.text_body || activity.body}
                        </Linkify>
                    );
                    uploads = activity.attachments;
                }
                break;
            case 'comment':
                if (showMessages) {
                    creator = activity.user;
                    createdAt = activity.created_at;
                    body = (
                        <Linkify properties={{target: '_blank'}}>
                            {activity.text_body || activity.body}
                        </Linkify>
                    );
                    uploads = activity.uploads;
                }
                break;
            case 'upload':
            case 'legacy_upload':
                if (showFiles) {
                    creator = activity.user;
                    createdAt = activity.created_at;
                    uploads = [activity];
                }
                break;
            case 'document':
                if (showFiles) {
                    creator = activity.created_by;
                    createdAt = activity.created_at;
                    body = (
                        <div>
                            <div>Added a {activity.type !== DOC_TYPE_OTHER?activity.type:''} document:</div>
                            <a href={activity.download_url} target="_blank">
                                <Icon name={activity.file?'download':'link'}/> {activity.title?`${activity.title} | `:''} {activity.download_url}
                            </a>
                        </div>
                    );
                }
                break;
            case 'invoice':
                if (showNotifications) {
                    if(isDev() && activity.user.id !== getUser().id) {
                        // Devs only see their own invoices
                        break;
                    }

                    if(isClient() && !isAdmin() && activity.type !== INVOICE_TYPE_SALE) {
                        // Clients only see sales invoices
                        break;
                    }

                    creator = activity.created_by;
                    createdAt = activity.created_at;
                    body = (
                        <div>
                            <div>Generated an invoice:</div>
                            <div>{activity.title}</div>
                            <a href={activity.download_url} target="_blank">
                                {activity.number}
                            </a>
                        </div>
                    );
                }
                break;
            case 'field_change_log':
                if (showNotifications) {
                    if(!['start_date', 'deadline', 'due_at'].includes(activity.field)) {
                        // On date changes
                        break;
                    }

                    creator = activity.created_by;
                    createdAt = activity.created_at;
                    const fieldDisplayMap = {
                        start_date: 'start date',
                        deadline: 'deadline',
                        due_at: 'milestone',
                    };
                    body = (
                        <div>
                            <div><Icon name="flag-checkered"/> Changed {activity.target_type === 'progress_event'?<span>due date for <Link to={`/projects/${activity.target.project.id}/events/${activity.target.id}`}>{activity.target.title}</Link></span>:<span>project {fieldDisplayMap[activity.field] || 'planning'}</span>} to {moment.utc(activity.new_value).local().format('Do, MMMM YYYY')}</div>
                            <div>{activity.reason}</div>
                        </div>
                    );
                }
                break;
            case 'participation':
                if (['add', 'create'].includes(item.action) && showNotifications) {
                    creator = activity.created_by;
                    createdAt = activity.created_at;
                    let participant = activity.user;
                    body = (
                        <div>
                            <div>Added a participant:</div>
                            <Avatar image={participant.avatar_url} size="xs" />
                            <Link to={`/network/${participant.username}/`}>
                                {participant.display_name}
                            </Link>
                        </div>
                    );
                }
                break;
            case 'legacy_participation':
                if (['add', 'create'].includes(item.action) && showNotifications) {
                    creator = activity.created_by;
                    createdAt = activity.created_at;
                    let participant = activity.details.user;
                    body = (
                        <div>
                            <div>Added a participant:</div>
                            <Avatar image={participant.avatar_url} size="xs" />
                            <Link to={`/network/${participant.username}/`}>
                                {participant.display_name}
                            </Link>
                        </div>
                    );
                }
                break;
            case 'progress_event':
                if (
                    isDev() &&
                    [
                        PROGRESS_EVENT_TYPE_PM,
                        PROGRESS_EVENT_TYPE_CLIENT,
                        LEGACY_PROGRESS_EVENT_TYPE_CLIENT_MID_SPRINT,
                    ].includes(activity.type)
                ) {
                    break;
                }
                if (
                    isPM() &&
                    [
                        PROGRESS_EVENT_TYPE_CLIENT,
                        LEGACY_PROGRESS_EVENT_TYPE_CLIENT_MID_SPRINT,
                    ].includes(activity.type)
                ) {
                    break;
                }
                if (
                    isClient() &&
                    !isAdmin() &&
                    activity.type === PROGRESS_EVENT_TYPE_PM
                ) {
                    break;
                }
                if (showNotifications && item.action === 'create') {
                    creator = activity.created_by || {
                        id: 'tunga',
                        username: null,
                        short_name: 'Tunga',
                        display_name: 'Tunga Bot',
                        avatar_url:
                            'https://tunga.io/icons/Tunga_squarex150.png',
                    };
                    createdAt = activity.created_at;
                    body = (
                        <div>
                            {[
                                PROGRESS_EVENT_TYPE_MILESTONE,
                                LEGACY_PROGRESS_EVENT_TYPE_SUBMIT,
                                LEGACY_PROGRESS_EVENT_TYPE_COMPLETE,
                            ].includes(activity.type) ? (
                                <div>
                                    <Icon
                                        name={
                                            'flag' +
                                            ([PROGRESS_EVENT_TYPE_MILESTONE, LEGACY_PROGRESS_EVENT_TYPE_SUBMIT].includes(activity.type)
                                                ? '-checkered'
                                                : '-o')
                                        }
                                    />{' '}
                                    Created a milestone:
                                </div>
                            ) : null}
                            <Link
                                to={`/projects/${activity.project.id}/events/${activity.id}/`}>
                                {activity.title || (
                                    <span>
                                        <Icon name="flag-o" /> Scheduled{' '}
                                        {[
                                            PROGRESS_EVENT_TYPE_CLIENT,
                                            LEGACY_PROGRESS_EVENT_TYPE_CLIENT_MID_SPRINT,
                                        ].includes(activity.type) ||
                                        (PROGRESS_EVENT_TYPE_MILESTONE === activity.event.type && activity.user.is_project_owner)
                                            ? 'a progress survey'
                                            : 'an update'}
                                    </span>
                                )}
                            </Link>
                            <div>
                                Due:{' '}
                                {moment
                                    .utc(activity.due_at)
                                    .local()
                                    .format('Do, MMMM YYYY')}
                            </div>
                        </div>
                    );
                }
                break;
            case 'progress_report':
                if (
                    isDev() && (
                    [
                        PROGRESS_EVENT_TYPE_PM,
                        PROGRESS_EVENT_TYPE_CLIENT,
                        PROGRESS_EVENT_TYPE_CLIENT_MID_SPRINT,
                    ].includes(activity.event.type) ||
                    (PROGRESS_EVENT_TYPE_MILESTONE === activity.event.type && !activity.user.is_developer))
                ) {
                    break;
                }
                if (
                    isPM() && (
                    [
                        PROGRESS_EVENT_TYPE_CLIENT,
                        PROGRESS_EVENT_TYPE_CLIENT_MID_SPRINT,
                    ].includes(activity.event.type) ||
                    (PROGRESS_EVENT_TYPE_MILESTONE === activity.event.type && activity.user.is_project_owner))
                ) {
                    break;
                }
                if (
                    isClient() &&
                    !isAdmin() &&
                    (activity.event.type === PROGRESS_EVENT_TYPE_PM ||
                        (PROGRESS_EVENT_TYPE_MILESTONE === activity.event.type && activity.user.is_project_manager))
                ) {
                    break;
                }
                if (showProgressReports && item.action === 'create') {
                    creator = activity.user;
                    createdAt = activity.created_at;
                    uploads = activity.uploads;
                    more = {
                        link: `/projects/${activity.event.project.id}/events/${
                            activity.event.id
                        }/`,
                        text: 'View full report',
                    };
                    let progress = activity.percentage || 0;
                    body = (
                        <div>
                            <p>
                                <Icon name="newspaper-o" />{' '}
                                {[
                                    PROGRESS_EVENT_TYPE_CLIENT,
                                    PROGRESS_EVENT_TYPE_CLIENT_MID_SPRINT,
                                ].includes(activity.event.type) ||
                                (PROGRESS_EVENT_TYPE_MILESTONE === activity.event.type && activity.user.is_project_owner)
                                    ? 'Progress survey'
                                    : 'Progress report'}:{' '}
                            </p>
                            <Link
                                to={`/projects/${activity.event.project.id}/events/${
                                    activity.event.id
                                }/`}>
                                {[
                                    PROGRESS_EVENT_TYPE_CLIENT,
                                    PROGRESS_EVENT_TYPE_CLIENT_MID_SPRINT,
                                ].includes(activity.event.type) ||
                                (PROGRESS_EVENT_TYPE_MILESTONE === activity.event.type && activity.user.is_project_owner)
                                    ? 'Progress survey'
                                    : activity.event.title ||
                                      'Scheduled Update'}
                            </Link>
                            {[
                                PROGRESS_EVENT_TYPE_CLIENT,
                                PROGRESS_EVENT_TYPE_CLIENT_MID_SPRINT,
                            ].includes(activity.event.type) ||
                            (PROGRESS_EVENT_TYPE_MILESTONE === activity.event.type && activity.user.is_project_owner) ? null : (
                                <div>
                                    <div>Status: {activity.status_display}</div>
                                    <div>
                                        <ProgressBar
                                            bsStyle="success"
                                            now={progress}
                                            label={`${progress}% Completed`}
                                        />
                                    </div>
                                    {activity.accomplished ? (
                                        <Linkify
                                            properties={{target: '_blank'}}>
                                            {activity.accomplished}
                                        </Linkify>
                                    ) : null}
                                </div>
                            )}
                        </div>
                    );
                }
                break;
            case 'legacy_progress_event':
                if (
                    isDev() &&
                    [
                        LEGACY_PROGRESS_EVENT_TYPE_PM,
                        LEGACY_PROGRESS_EVENT_TYPE_CLIENT,
                        LEGACY_PROGRESS_EVENT_TYPE_CLIENT_MID_SPRINT,
                    ].indexOf(activity.type) > -1
                ) {
                    break;
                }
                if (
                    isPM() &&
                    [
                        LEGACY_PROGRESS_EVENT_TYPE_CLIENT,
                        LEGACY_PROGRESS_EVENT_TYPE_CLIENT_MID_SPRINT,
                    ].indexOf(activity.type) > -1
                ) {
                    break;
                }
                if (
                    isClient() &&
                    !isAdmin() &&
                    activity.type === LEGACY_PROGRESS_EVENT_TYPE_PM
                ) {
                    break;
                }
                if (showNotifications && item.action === 'create') {
                    creator = activity.created_by || {
                        id: 'tunga',
                        username: null,
                        short_name: 'Tunga',
                        display_name: 'Tunga Bot',
                        avatar_url:
                            'https://tunga.io/icons/Tunga_squarex150.png',
                    };
                    createdAt = activity.created_at;
                    body = (
                        <div>
                            {[
                                LEGACY_PROGRESS_EVENT_TYPE_MILESTONE,
                                LEGACY_PROGRESS_EVENT_TYPE_SUBMIT,
                                LEGACY_PROGRESS_EVENT_TYPE_COMPLETE,
                            ].indexOf(activity.type) > -1 ? (
                                <div>
                                    <Icon
                                        name={
                                            'flag' +
                                            (activity.type === LEGACY_PROGRESS_EVENT_TYPE_SUBMIT
                                                ? '-checkered'
                                                : '-o')
                                        }
                                    />{' '}
                                    Created a milestone:
                                </div>
                            ) : null}
                            <Link
                                to={`/work/${activity.task}/event/${activity.id}/`}>
                                {activity.title || (
                                    <span>
                                        <Icon name="flag-o" /> Scheduled{' '}
                                        {[
                                            LEGACY_PROGRESS_EVENT_TYPE_CLIENT,
                                            LEGACY_PROGRESS_EVENT_TYPE_CLIENT_MID_SPRINT,
                                        ].indexOf(activity.type) > -1
                                            ? 'a weekly survey'
                                            : 'an update'}
                                    </span>
                                )}
                            </Link>
                            <div>
                                Due:{' '}
                                {moment
                                    .utc(activity.due_at)
                                    .local()
                                    .format('Do, MMMM YYYY')}
                            </div>
                        </div>
                    );
                }
                break;
            case 'legacy_progress_report':
                if (
                    isDev() &&
                    [
                        LEGACY_PROGRESS_EVENT_TYPE_PM,
                        LEGACY_PROGRESS_EVENT_TYPE_CLIENT,
                        LEGACY_PROGRESS_EVENT_TYPE_CLIENT_MID_SPRINT,
                    ].indexOf(activity.details.event.type) > -1
                ) {
                    break;
                }
                if (
                    isPM() &&
                    [
                        LEGACY_PROGRESS_EVENT_TYPE_CLIENT,
                        LEGACY_PROGRESS_EVENT_TYPE_CLIENT_MID_SPRINT,
                    ].indexOf(activity.details.event.type) > -1
                ) {
                    break;
                }
                if (
                    isClient() &&
                    !isAdmin() &&
                    activity.details.event.type === LEGACY_PROGRESS_EVENT_TYPE_PM
                ) {
                    break;
                }
                if (showProgressReports && item.action === 'report') {
                    creator = activity.user;
                    createdAt = activity.created_at;
                    uploads = activity.uploads;
                    more = {
                        link: `/work/${activity.details.event.task}/event/${
                            activity.event
                            }/`,
                        text: 'View full report',
                    };
                    let progress = activity.percentage || 0;
                    body = (
                        <div>
                            <p>
                                <Icon name="newspaper-o" />{' '}
                                {[
                                    LEGACY_PROGRESS_EVENT_TYPE_CLIENT,
                                    LEGACY_PROGRESS_EVENT_TYPE_CLIENT_MID_SPRINT,
                                ].indexOf(activity.details.event.type) > -1
                                    ? 'Weekly survey'
                                    : 'Progress report'}:{' '}
                            </p>
                            <Link
                                to={`/work/${activity.details.event.task}/event/${
                                    activity.event
                                    }/`}>
                                {[
                                    LEGACY_PROGRESS_EVENT_TYPE_CLIENT,
                                    LEGACY_PROGRESS_EVENT_TYPE_CLIENT_MID_SPRINT,
                                ].indexOf(activity.details.event.type) > -1
                                    ? 'Weekly survey'
                                    : activity.details.event.title ||
                                    'Scheduled Update'}
                            </Link>
                            {[
                                LEGACY_PROGRESS_EVENT_TYPE_CLIENT,
                                LEGACY_PROGRESS_EVENT_TYPE_CLIENT_MID_SPRINT,
                            ].indexOf(activity.details.event.type) > -1 ? null : (
                                <div>
                                    <div>Status: {activity.status_display}</div>
                                    <div>
                                        <ProgressBar
                                            bsStyle="success"
                                            now={progress}
                                            label={`${progress}% Completed`}
                                        />
                                    </div>
                                    {activity.accomplished ? (
                                        <Linkify
                                            properties={{target: '_blank'}}>
                                            {activity.accomplished}
                                        </Linkify>
                                    ) : null}
                                </div>
                            )}
                        </div>
                    );
                }
                break;
            case 'integration_activity':
                if (showNotifications && item.action === 'report') {
                    creator = {
                        short_name: activity.user_display_name,
                        display_name: activity.user_display_name,
                        avatar_url: activity.avatar_url,
                    };
                    createdAt = activity.created_at;
                    body = (
                        <div>
                            {activity.title || activity.body}
                            {!(activity.title || activity.body) && activity.url ? (
                                <div>
                                    <a href={activity.url} target="_blank">
                                        {activity.url}
                                    </a>
                                </div>
                            ) : null}
                        </div>
                    );
                    summary = activity.url ? (
                        <a href={activity.url} target="_blank">
                            {activity.summary}
                        </a>
                    ) : (
                        activity.summary
                    );
                }
                break;
            default:
                break;
        }
        if (creator) {
            return {
                id: item.id,
                type: activityType,
                user: creator,
                created_at: createdAt,
                body,
                summary,
                uploads,
                more,
            };
        }
        return null;
    }

    renderThread(thread) {
        if (!thread.first) {
            return null;
        }

        const {last_read} = this.props;
        let activity = thread.first;
        let day_format = 'd/MM/YYYY';
        let last_sent_day = '';
        let today = moment
            .utc()
            .local()
            .format(day_format);

        let is_current_user =
            (isAuthenticated() && activity.user.id === getUser().id) ||
            (!isAuthenticated() &&
                (activity.user.inquirer || activity.user.id === 'guest'));

        let display_name = is_current_user ? 'You' : activity.user.short_name;

        let avatar_div = activity.user.hide ? null : (
            <div className={is_current_user ? 'media-right' : 'media-left'}>
                <Avatar image={activity.user.avatar_url} />
            </div>
        );

        return (
            <div
                key={activity.id}
                id={'activity' + activity.id}
                className={
                    'media message' +
                    (last_read != null &&
                    activity.user.id !== getUser().id &&
                    last_read < activity.id
                        ? ' new'
                        : '') +
                    (is_current_user ? ' float-right clearfix' : '')
                }>
                {is_current_user ? null : avatar_div}
                <div className="media-body">
                    <div className="body">
                        {activity.user.hide ? null : (
                            <p>
                                {activity.user.id && activity.user.username ? (
                                    <a href={`/network/${
                                            activity.user.username
                                        }/`} target="_blank">
                                        {display_name}
                                    </a>
                                ) : (
                                    <span className="username">
                                        {display_name}
                                    </span>
                                )}
                                {activity.summary ? (
                                    <span> {activity.summary}</span>
                                ) : null}

                                {activity.created_at ? (
                                    <TimeAgo
                                        date={moment
                                            .utc(activity.created_at)
                                            .local()
                                            .format()}
                                        className="float-right"
                                    />
                                ) : null}
                            </p>
                        )}
                        <div>{activity.body}</div>
                        {activity.uploads && activity.uploads.length ? (
                            <Attachments attachments={activity.uploads} />
                        ) : null}
                        {activity.more ? (
                            <div className="clearfix">
                                <Link
                                    to={activity.more.link}
                                    className="float-right">
                                    {activity.more.text || 'Read more'}
                                </Link>
                            </div>
                        ) : null}
                    </div>

                    {thread.others
                        ? thread.others.map(other_msg => {
                              let sent_day = moment
                                  .utc(other_msg.created_at)
                                  .local()
                                  .format(day_format);
                              let msg = (
                                  <div
                                      id={'activity' + other_msg.id}
                                      key={'activity' + other_msg.id}
                                      className={
                                          [
                                              'message',
                                              'comment',
                                              'upload',
                                          ].indexOf(other_msg.type) > -1
                                              ? 'sub-message'
                                              : 'sub-thread'
                                      }>
                                      {sent_day === last_sent_day ||
                                      sent_day !== today ||
                                      activity.summary ? null : (
                                          <p>
                                              {activity.summary ? (
                                                  <span>
                                                      {' '}
                                                      {activity.summary}
                                                  </span>
                                              ) : null}
                                              <TimeAgo
                                                  date={moment
                                                      .utc(other_msg.created_at)
                                                      .local()
                                                      .format()}
                                                  className="float-right"
                                              />
                                          </p>
                                      )}
                                      <div>{other_msg.body}</div>
                                      {other_msg.uploads &&
                                      other_msg.uploads.length ? (
                                          <Attachments
                                              attachments={other_msg.uploads}
                                          />
                                      ) : null}
                                      {other_msg.more ? (
                                          <div className="clearfix">
                                              <Link
                                                  to={other_msg.more.link}
                                                  className="float-right">
                                                  {other_msg.more.text ||
                                                      'Read more'}
                                              </Link>
                                          </div>
                                      ) : null}
                                  </div>
                              );

                              last_sent_day = sent_day;
                              return msg;
                          })
                        : null}
                </div>
                {is_current_user ? avatar_div : null}
            </div>
        );
    }

    render() {
        const {
            activities,
            isLoading,
            isLoadingMore,
            hasMore,
            onLoadMore
        } = this.props;
        let last_sender = null;
        let thread = {};

        return (
            <div id={`list${this.state.listId}`} className="activity-list">
                <div className="activity-wrapper">
                    {isLoading?(
                        <Progress/>
                    ):activities && activities.length?(
                        <div>
                            <LoadMore hasMore={hasMore} isLoadingMore={isLoadingMore} onLoadMore={onLoadMore}>Show older activity</LoadMore>

                            {activities &&
                            activities.map((item, idx, all_msgs) => {
                                let activity = this.cleanActivity(item);
                                let msgs = [];
                                if (activity) {
                                    if (
                                        activity.user.id != null &&
                                        activity.user.id === last_sender
                                    ) {
                                        thread.others = [
                                            ...thread.others,
                                            activity,
                                        ];
                                    } else {
                                        msgs = [...msgs, this.renderThread(thread)];
                                        thread.first = activity;
                                        thread.others = [];
                                    }

                                    last_sender = activity.user.id;
                                }

                                if (idx + 1 === all_msgs.length) {
                                    msgs = [...msgs, this.renderThread(thread)];
                                }

                                return msgs;
                            })}
                        </div>
                    ):null}
                </div>
            </div>
        );
    }
}
