import React from 'react';
import {Link} from 'react-router';
import moment from 'moment';
import TimeAgo from 'react-timeago';
import {ProgressBar} from 'react-bootstrap';
import Linkify from './Linkify';
import randomstring from 'randomstring';

import Progress from './status/Progress';
import LoadMore from './status/LoadMore';
import Avatar from './Avatar';
import Attachments from './Attachments';

import {
    PROGRESS_EVENT_TYPE_MILESTONE,
    PROGRESS_EVENT_TYPE_SUBMIT,
    PROGRESS_EVENT_TYPE_COMPLETE,
    PROGRESS_EVENT_TYPE_PM,
    PROGRESS_EVENT_TYPE_CLIENT,
    PROGRESS_EVENT_TYPE_CLIENT_MID_SPRINT,
} from '../constants/Api';
import {
    isAuthenticated,
    getUser,
    isAdmin,
    isProjectOwner,
    isAdminOrProjectOwner,
    isDeveloper,
    isProjectManager,
} from '../utils/auth';
import {getPayDetails} from '../utils/tasks';

export function scrollList(listId) {
    var activity_list = $(`#list${listId}.activity-list`);
    activity_list.scrollTop(activity_list.find('.item-wrapper').height());
}

export default class ActivityList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {listId: randomstring.generate()};
    }

    componentDidMount() {
        scrollList(this.state.listId);
    }

    componentDidUpdate(prevProps, prevState) {
        if (
            this.props.activities &&
            (!prevProps.activities ||
                this.props.activities.length != prevProps.activities.length)
        ) {
            scrollList(this.state.listId);
        }
    }

    cleanActivity(item) {
        let object = item.activity;
        let activity_type = item.activity_type;
        var creator = null;
        var created_at = item.timestamp;
        var body = null;
        var summary = null;
        var uploads = null;
        var more = null;

        const {
            showMessages,
            showNotifications,
            showFiles,
            showProgressReports,
        } = this.props;

        switch (activity_type) {
            case 'message':
                if (item.action == 'send' && showMessages) {
                    creator = object.sender || object.user;
                    if (!creator) {
                        creator = {
                            id: 'guest',
                            username: 'guest',
                            short_name: isAuthenticated() ? 'Guest' : 'You',
                            display_name: isAuthenticated() ? 'Guest' : 'You',
                        };
                    }
                    created_at = object.created_at;
                    body = object.isForm ? (
                        object.text_body || object.body
                    ) : (
                        <Linkify properties={{target: '_blank'}}>
                            {object.text_body || object.body}
                        </Linkify>
                    );
                    uploads = object.attachments;
                }
                break;
            case 'comment':
                if (showMessages) {
                    creator = object.user;
                    created_at = object.created_at;
                    body = (
                        <Linkify properties={{target: '_blank'}}>
                            {object.text_body || object.body}
                        </Linkify>
                    );
                    uploads = object.uploads;
                }
                break;
            case 'upload':
                if (showFiles) {
                    creator = object.user;
                    created_at = object.created_at;
                    uploads = [object];
                }
                break;
            case 'participation':
                if (item.action == 'add' && showNotifications) {
                    creator = object.created_by;
                    created_at = object.created_at;
                    let participant = object.details.user;
                    body = (
                        <div>
                            <div>Added a participant:</div>
                            <Avatar src={participant.avatar_url} size="xs" />
                            <Link to={`/people/${participant.username}/`}>
                                {participant.display_name}
                            </Link>
                        </div>
                    );
                }
                break;
            case 'estimate':
            case 'quote':
                if (
                    showNotifications &&
                    [
                        'create',
                        'submit',
                        'approve',
                        'decline',
                        'accept',
                        'reject',
                    ].indexOf(item.action) > -1
                ) {
                    creator = object.user;

                    let verb_map = {
                        create: 'Created',
                        submit: 'Submitted',
                        approve: 'Approved',
                        decline: 'Declined',
                        accept: 'Accepted',
                        reject: 'Rejected',
                    };

                    object.icon = 'fa-file-text';

                    if (['approve', 'decline'].indexOf(item.action) > -1) {
                        creator = object.moderated_by;
                        created_at = object.moderated_at;
                    }

                    if (['accept', 'reject'].indexOf(item.action) > -1) {
                        creator = object.reviewed_by;
                        created_at = object.reviewed_at;
                    }

                    if (item.action == 'submit') {
                        object.icon = 'fa-send';
                    } else if (
                        ['approve', 'accept'].indexOf(item.action) > -1
                    ) {
                        object.icon = 'fa-check-square-o';
                    } else if (
                        ['decline', 'reject'].indexOf(item.action) > -1
                    ) {
                        object.icon = 'fa-times-circle';
                    }

                    var comment_txt = null;
                    if (item.action == 'decline') {
                        comment_txt = object.moderator_comment;
                    } else if (item.action == 'reject') {
                        comment_txt = object.reviewer_comment;
                    }

                    let task = object.details ? object.details.task || {} : {};
                    let payDetails = getPayDetails(
                        object.activities,
                        task.dev_rate,
                        task.pm_rate,
                        task.pm_time_ratio,
                    );

                    object.total_hours = payDetails.total.hours;
                    object.total_pay = payDetails.total.fee;

                    body = (
                        <div>
                            <Link
                                to={`/work/${object.task}/${activity_type}/${
                                    object.id
                                }/`}>
                                <i className={`fa ${object.icon}`} />{' '}
                                {verb_map[item.action]} a{activity_type ==
                                'estimate'
                                    ? 'n'
                                    : ''}{' '}
                                {activity_type}
                            </Link>
                            {comment_txt ? (
                                <div style={{margin: '10px 0'}}>
                                    {comment_txt}
                                </div>
                            ) : null}
                            <div>Hours: {object.total_hours} hours</div>
                            {isAdminOrProjectOwner() ? (
                                <div>Cost: €{object.total_pay}</div>
                            ) : null}
                            <div>
                                <Link
                                    to={`/work/${
                                        object.task
                                    }/${activity_type}/${object.id}/`}>
                                    View details
                                </Link>
                            </div>
                        </div>
                    );
                }
                break;
            case 'sprint':
                if (showNotifications && item.action == 'create') {
                    creator = object.user;
                    created_at = object.created_at;

                    let isCurrentYear =
                            moment
                                .utc(object.start_date)
                                .local()
                                .format('YYYY') ==
                            moment()
                                .local()
                                .format('YYYY'),
                        isSameYear =
                            moment
                                .utc(object.start_date)
                                .local()
                                .format('YYYY') ==
                            moment
                                .utc(object.end_date)
                                .local()
                                .format('YYYY');

                    body = (
                        <div>
                            <div>
                                <i className="fa fa-flag-checkered" /> Created a
                                sprint:
                            </div>
                            <Link
                                to={`/work/${object.task}/planning/${
                                    object.id
                                }/`}>
                                {object.title || `Sprint #${object.id}`}
                            </Link>
                            <div>
                                Period:{' '}
                                {moment
                                    .utc(object.start_date)
                                    .local()
                                    .format(
                                        `Do MMM${
                                            isCurrentYear || isSameYear
                                                ? ''
                                                : ' YYYY'
                                        }`,
                                    )}{' '}
                                -{' '}
                                {moment
                                    .utc(object.end_date)
                                    .local()
                                    .format(
                                        `Do MMM${isCurrentYear ? '' : ' YYYY'}`,
                                    )}
                            </div>
                        </div>
                    );
                }
                break;
            case 'progress_event':
                if (
                    isDeveloper() &&
                    [
                        PROGRESS_EVENT_TYPE_PM,
                        PROGRESS_EVENT_TYPE_CLIENT,
                        PROGRESS_EVENT_TYPE_CLIENT_MID_SPRINT,
                    ].indexOf(object.type) > -1
                ) {
                    break;
                }
                if (
                    isProjectManager() &&
                    [
                        PROGRESS_EVENT_TYPE_CLIENT,
                        PROGRESS_EVENT_TYPE_CLIENT_MID_SPRINT,
                    ].indexOf(object.type) > -1
                ) {
                    break;
                }
                if (
                    isProjectOwner() &&
                    !isAdmin() &&
                    object.type == PROGRESS_EVENT_TYPE_PM
                ) {
                    break;
                }
                if (showNotifications && item.action == 'create') {
                    creator = object.created_by || {
                        id: 'tunga',
                        username: null,
                        short_name: 'Tunga',
                        display_name: 'Tunga Bot',
                        avatar_url:
                            'https://tunga.io/icons/Tunga_squarex150.png',
                    };
                    created_at = object.created_at;
                    body = (
                        <div>
                            {[
                                PROGRESS_EVENT_TYPE_MILESTONE,
                                PROGRESS_EVENT_TYPE_SUBMIT,
                                PROGRESS_EVENT_TYPE_COMPLETE,
                            ].indexOf(object.type) > -1 ? (
                                <div>
                                    <i
                                        className={
                                            'fa fa-flag' +
                                            (object.type == 4
                                                ? '-checkered'
                                                : '-o')
                                        }
                                    />{' '}
                                    Created a milestone:
                                </div>
                            ) : null}
                            <Link
                                to={`/work/${object.task}/event/${object.id}/`}>
                                {object.title || (
                                    <span>
                                        <i className="fa fa-flag-o" /> Scheduled{' '}
                                        {[
                                            PROGRESS_EVENT_TYPE_CLIENT,
                                            PROGRESS_EVENT_TYPE_CLIENT_MID_SPRINT,
                                        ].indexOf(object.type) > -1
                                            ? 'a weekly survey'
                                            : 'an update'}
                                    </span>
                                )}
                            </Link>
                            <div>
                                Due:{' '}
                                {moment
                                    .utc(object.due_at)
                                    .local()
                                    .format('Do, MMMM YYYY')}
                            </div>
                        </div>
                    );
                }
                break;
            case 'progress_report':
                if (
                    isDeveloper() &&
                    [
                        PROGRESS_EVENT_TYPE_PM,
                        PROGRESS_EVENT_TYPE_CLIENT,
                        PROGRESS_EVENT_TYPE_CLIENT_MID_SPRINT,
                    ].indexOf(object.details.event.type) > -1
                ) {
                    break;
                }
                if (
                    isProjectManager() &&
                    [
                        PROGRESS_EVENT_TYPE_CLIENT,
                        PROGRESS_EVENT_TYPE_CLIENT_MID_SPRINT,
                    ].indexOf(object.details.event.type) > -1
                ) {
                    break;
                }
                if (
                    isProjectOwner() &&
                    !isAdmin() &&
                    object.details.event.type == PROGRESS_EVENT_TYPE_PM
                ) {
                    break;
                }
                if (showProgressReports && item.action == 'report') {
                    creator = object.user;
                    created_at = object.created_at;
                    uploads = object.uploads;
                    more = {
                        link: `/work/${object.details.event.task}/event/${
                            object.event
                        }/`,
                        text: 'View full report',
                    };
                    let progress = object.percentage || 0;
                    body = (
                        <div>
                            <p>
                                <i className="fa fa-newspaper-o" />{' '}
                                {[
                                    PROGRESS_EVENT_TYPE_CLIENT,
                                    PROGRESS_EVENT_TYPE_CLIENT_MID_SPRINT,
                                ].indexOf(object.details.event.type) > -1
                                    ? 'Weekly survey'
                                    : 'Progress report'}:{' '}
                            </p>
                            <Link
                                to={`/work/${object.details.event.task}/event/${
                                    object.event
                                }/`}>
                                {[
                                    PROGRESS_EVENT_TYPE_CLIENT,
                                    PROGRESS_EVENT_TYPE_CLIENT_MID_SPRINT,
                                ].indexOf(object.details.event.type) > -1
                                    ? 'Weekly survey'
                                    : object.details.event.title ||
                                      'Scheduled Update'}
                            </Link>
                            {[
                                PROGRESS_EVENT_TYPE_CLIENT,
                                PROGRESS_EVENT_TYPE_CLIENT_MID_SPRINT,
                            ].indexOf(object.details.event.type) > -1 ? null : (
                                <div>
                                    <div>Status: {object.status_display}</div>
                                    <div>
                                        <ProgressBar
                                            bsStyle="success"
                                            now={progress}
                                            label={`${progress}% Completed`}
                                        />
                                    </div>
                                    {object.accomplished ? (
                                        <Linkify
                                            properties={{target: '_blank'}}>
                                            {object.accomplished}
                                        </Linkify>
                                    ) : null}
                                </div>
                            )}
                        </div>
                    );
                }
                break;
            case 'integration_activity':
                if (showNotifications && item.action == 'report') {
                    creator = {
                        short_name: object.user_display_name,
                        display_name: object.user_display_name,
                        avatar_url: object.avatar_url,
                    };
                    created_at = object.created_at;
                    body = (
                        <div>
                            {object.title || object.body}
                            {!(object.title || object.body) && object.url ? (
                                <div>
                                    <a href={object.url} target="_blank">
                                        {object.url}
                                    </a>
                                </div>
                            ) : null}
                        </div>
                    );
                    summary = object.url ? (
                        <a href={object.url} target="_blank">
                            {object.summary}
                        </a>
                    ) : (
                        object.summary
                    );
                }
                break;
            default:
                break;
        }
        if (creator) {
            return {
                id: item.id,
                type: activity_type,
                user: creator,
                created_at,
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
        var last_sent_day = '';
        let today = moment
            .utc()
            .local()
            .format(day_format);

        let is_current_user =
            (isAuthenticated() && activity.user.id == getUser().id) ||
            (!isAuthenticated() &&
                (activity.user.inquirer || activity.user.id == 'guest'));

        let display_name = is_current_user ? 'You' : activity.user.short_name;

        let avatar_div = activity.user.hide ? null : (
            <div className={is_current_user ? 'media-right' : 'media-left'}>
                <Avatar src={activity.user.avatar_url} />
            </div>
        );

        return (
            <div
                key={activity.id}
                id={'activity' + activity.id}
                className={
                    'media message' +
                    (last_read != null &&
                    activity.user.id != getUser().id &&
                    last_read < activity.id
                        ? ' new'
                        : '') +
                    (is_current_user ? ' pull-right clearfix' : '')
                }>
                {is_current_user ? null : avatar_div}
                <div className="media-body">
                    <div className="body">
                        {activity.user.hide ? null : (
                            <p>
                                {activity.user.id && activity.user.username ? (
                                    <Link
                                        to={`/people/${
                                            activity.user.username
                                        }/`}>
                                        {display_name}
                                    </Link>
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
                                        className="pull-right"
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
                                    className="pull-right">
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
                                      {sent_day == last_sent_day ||
                                      sent_day != today ||
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
                                                  className="pull-right"
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
                                                  className="pull-right">
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
            loadMoreUrl,
            loadMoreCallback,
            loadMoreText,
        } = this.props;
        var last_sender = null;
        var thread = {};

        return isLoading ? (
            <Progress />
        ) : (
            <div id={`list${this.state.listId}`} className="activity-list">
                <div className="item-wrapper">
                    {
                        <LoadMore
                            url={loadMoreUrl}
                            callback={loadMoreCallback}
                            loading={isLoadingMore}
                            direction="up"
                            text={loadMoreText || 'Show older activity'}
                        />
                    }

                    {activities &&
                        activities.map((item, idx, all_msgs) => {
                            var activity = this.cleanActivity(item);
                            var msgs = [];
                            if (activity) {
                                if (
                                    activity.user.id != null &&
                                    activity.user.id == last_sender
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

                            if (idx + 1 == all_msgs.length) {
                                msgs = [...msgs, this.renderThread(thread)];
                            }

                            return msgs;
                        })}
                </div>
            </div>
        );
    }
}

ActivityList.propTypes = {
    activities: React.PropTypes.array.isRequired,
    isLoading: React.PropTypes.bool,
    isLoadingMore: React.PropTypes.bool,
    loadMoreUrl: React.PropTypes.string,
    loadMoreCallback: React.PropTypes.func,
    loadMoreText: React.PropTypes.string,
    showMessages: React.PropTypes.bool,
    showNotifications: React.PropTypes.bool,
    showFiles: React.PropTypes.bool,
    showProgressReports: React.PropTypes.bool,
};

ActivityList.defaultProps = {
    activities: [],
    isLoading: false,
    isLoadingMore: false,
    showMessages: true,
    showNotifications: true,
    showFiles: true,
    showProgressReports: true,
};
