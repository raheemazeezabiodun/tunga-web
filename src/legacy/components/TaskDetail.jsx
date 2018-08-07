import React from 'react';
import {Link} from 'react-router';
import moment from 'moment';
import TimeAgo from 'react-timeago';
import Linkify from './Linkify';

import Progress from './status/Progress';
import TagList from './TagList';
import Avatar from './Avatar';

import {parse_task_status} from '../utils/tasks';
import {
    getUser,
    isDeveloper,
    isProjectManager,
    isAdmin,
    openProfileWizard,
} from '../utils/auth';

export default class TaskDetail extends React.Component {
    onClaimProject() {
        const {TaskActions} = this.props;
        const task = this.props.task || {};
        TaskActions.claimTask(task.id);
    }

    render() {
        const {Task} = this.props;
        const task = this.props.task || {};
        var task_status = parse_task_status(task);
        var work_type = task.is_task ? 'task' : 'project';

        return (
            <div className="estimate-presentation">
                {Task.detail.isRetrieving ? (
                    <Progress />
                ) : (
                    <div className="task-page">
                        {task.can_apply ? (
                            <div className="pull-right">
                                {/*<Link to={`/work/${task.id}/apply`} className="btn">
                      Apply for this {work_type}
                    </Link>
                    <Link
                      to={`/conversation/start/task/${task.id}`}
                      className="btn">
                      Send message
                    </Link>*/}
                            </div>
                        ) : !isDeveloper() ||
                        getUser().can_contribute ? null : (
                            <div style={{marginBottom: '20px'}}>
                                <div className="alert alert-info">
                                    You need to complete your profile before you
                                    can apply for {work_type}s
                                </div>
                                <div>
                                    <Link
                                        to="/profile"
                                        onClick={e => {
                                            e.preventDefault();
                                            openProfileWizard();
                                        }}>
                                        <i className="fa fa-arrow-right" />{' '}
                                        Continue to your profile
                                    </Link>
                                </div>
                            </div>
                        )}
                        {(isProjectManager() || isAdmin()) && task.can_claim ? (
                            <div className="pull-right">
                                <button
                                    className="btn btn-block"
                                    onClick={this.onClaimProject.bind(this)}>
                                    Claim {work_type}
                                </button>
                            </div>
                        ) : null}
                        <h3 className="title pull-left">
                            <Link to={`/work/${task.id}/`}>{task.summary}</Link>
                        </h3>
                        <div className="time pull-left">
                            Posted{' '}
                            <TimeAgo
                                date={moment
                                    .utc(task.created_at)
                                    .local()
                                    .format()}
                            />
                        </div>
                        <div className="clearfix" />
                        <div className="pledge">{task.display_fee}</div>
                        <div className="task-status">
                            <i className={'fa fa-circle ' + task_status.css} />{' '}
                            {task_status.message}
                        </div>
                        <Avatar src={task.user.avatar_url} />{' '}
                        <Link to={`/people/${task.user.username}/`}>
                            {task.user.display_name}
                        </Link>
                        {task.deadline ? (
                            <div className="title">
                                <span>Deadline: </span>
                                <span>
                                    {moment
                                        .utc(task.deadline)
                                        .local()
                                        .format('Do, MMMM YYYY')}
                                </span>
                            </div>
                        ) : null}
                        {task.details ? (
                            <TagList
                                tags={task.details.skills}
                                linkPrefix="/work/skill/"
                            />
                        ) : null}
                        <div>
                            <strong>Created</strong>{' '}
                            <span>
                                {moment
                                    .utc(task.created_at)
                                    .local()
                                    .format('Do, MMMM YYYY')}
                            </span>
                        </div>
                        {[
                            {key: 'description', title: 'Description'},
                            {key: 'deliverables', title: 'Deliverables'},
                            {
                                key: 'stack_description',
                                title: 'Technology Stack',
                            },
                        ].map(item => {
                            if (task[item.key]) {
                                return (
                                    <div>
                                        <h5>{item.title}</h5>
                                        <div className="card">
                                            <Linkify
                                                properties={{target: '_blank'}}>
                                                {task[item.key]}
                                            </Linkify>
                                        </div>
                                    </div>
                                );
                            }
                            return null;
                        })}
                        {task.update_schedule_display ? (
                            <div>
                                <h5>Update schedule for this {work_type}</h5>
                                <div className="card">
                                    As a developer for this {work_type}, you
                                    have to update the client{' '}
                                    {task.update_schedule_display.toLowerCase()}
                                </div>
                            </div>
                        ) : null}
                        {task.milestones.length ? (
                            <div>
                                <strong>Milestones</strong>
                                <div className="card">
                                    {task.milestones.map(milestone => {
                                        return (
                                            <p key={milestone.id}>
                                                <span
                                                    style={{
                                                        marginRight: '5px',
                                                    }}>
                                                    {moment
                                                        .utc(milestone.due_at)
                                                        .local()
                                                        .format(
                                                            'Do MMM YY',
                                                        )}:{' '}
                                                </span>
                                                <span>{milestone.title}</span>
                                            </p>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : null}
                        {task.uploads.length ? (
                            <div>
                                <h5>Files</h5>
                                <div className="card">
                                    {task.uploads.map(upload => {
                                        return (
                                            <div
                                                key={upload.id}
                                                className="file">
                                                <a href={upload.url}>
                                                    <i className="fa fa-download" />{' '}
                                                    {upload.name}{' '}
                                                    <strong>
                                                        [{upload.display_size}]
                                                    </strong>
                                                </a>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : null}
                        {task.url ? (
                            <div>
                                <h5>Code location</h5>
                                <div className="card">
                                    <a href={task.url}>{task.url}</a>
                                </div>
                            </div>
                        ) : null}
                        {task.remarks ? (
                            <div>
                                <h5>
                                    Files {task.user.display_name} can provide
                                </h5>
                                <div className="card">
                                    <Linkify properties={{target: '_blank'}}>
                                        {task.remarks}
                                    </Linkify>
                                </div>
                            </div>
                        ) : null}
                    </div>
                )}
            </div>
        );
    }
}
