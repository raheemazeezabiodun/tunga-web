import PropTypes from 'prop-types';
import React from 'react';
import {renderToString} from 'react-dom/server';
import {Link} from 'react-router';
import moment from 'moment';
import TimeAgo from 'react-timeago';
import Linkify from './Linkify';
import Joyride from 'react-joyride';

import CommentSection from '../containers/CommentSection';
import Avatar from './Avatar';
import CommentForm from './CommentForm';
import ActivityList from './ActivityList';
import LargeModal from './LargeModal';
import ComponentWithModal from './ComponentWithModal';
import Timeline from './Timeline';
import MilestoneContainer from '../containers/MilestoneContainer';
import Milestone from './Milestone';
import TagList from './TagList';

import {
    parse_task_status,
    canAddEstimate,
    canEditEstimate,
    canViewEstimate,
    getAcquisitionUrl,
    hasStarted,
} from '../utils/tasks';
import {render_summary, nl_to_br} from '../utils/html';
import {getTaskKey} from '../utils/reducers';
import confirm from '../utils/confirm';

import {
    SOCIAL_PROVIDERS,
    ENDPOINT_TASK,
    TASK_DOCUMENT_TYPES,
} from '../constants/Api';
import {
    isAdmin,
    getUser,
    isProjectManager,
    isDeveloper,
    isProjectOwner,
} from '../utils/auth';
import {sendGAPageView} from '../utils/tracking';

import {
    STATUS_REJECTED,
    STATUS_ACCEPTED,
    STATUS_INITIAL,
} from '../constants/Api';

export function resizeOverviewBox() {
    var w_h = $(window).height();
    var nav_h = $('nav.navbar').height();
    var wf_h = $('.workflow-head').height();
    var t_h = nav_h + wf_h + ($(window).width() >= 768 ? 80 : 90);
    if (w_h > t_h) {
        $('.workflow-overview').css('height', w_h - t_h + 'px');
    }
}

export default class TaskWorkflow extends ComponentWithModal {
    constructor(props) {
        super(props);
        this.state = {
            ratings_map: null,
            modalEvent: {},
            messages: true,
            notifications: true,
            files: true,
            progress_reports: true,
            showFilter: false,
            sideSection: 'details',
            showBrowserWarnings: true,
        };
    }

    UNSAFE_componentWillMount() {
        this.intervals = [];
        this.redirectToNextStep(this.props);

        if (this.props.params && this.props.params.eventId) {
            this.openMilestone(this.props.params.eventId);
        }
    }

    componentDidMount() {
        const {TaskActions, Task} = this.props;
        const {task} = Task.detail;

        TaskActions.listTaskActivity(task.id);

        resizeOverviewBox();
        $(window).resize(resizeOverviewBox);

        if (this.props.params.taskId) {
            this.setInterval(this.getNewActivity.bind(this), 5000);
        }

        $(window).click({ref: this}, function(e) {
            //e.data.ref.setState({showFilter: false});
        });
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (
            nextProps.params &&
            nextProps.params.eventId != this.props.params.eventId
        ) {
            this.openMilestone(nextProps.params.eventId);
        }

        if (
            nextProps.Task.detail.task.closed &&
            !this.props.Task.detail.task.closed
        ) {
            this.redirectToNextStep(nextProps, true);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.task && this.props.task) {
            const had_started = hasStarted(prevProps.task);
            const has_started = hasStarted(this.props.task);

            if (!had_started && has_started) {
                sendGAPageView(getAcquisitionUrl(this.props.task, true));
            }
        }
    }

    componentWillUnmount() {
        this.intervals.map(clearInterval);
    }

    setInterval() {
        this.intervals.push(setInterval.apply(null, arguments));
    }

    redirectToNextStep(props, force_redirect = false) {
        const {task} = props;

        if (
            getUser().id == task.user.id &&
            (task.closed ||
                (task.is_task &&
                    (!task.approved ||
                        !task.participation ||
                        !task.participation.length))) &&
            (!this.props.location.query ||
                !this.props.location.query.nr ||
                force_redirect) &&
            (!props.params || !props.params.eventId)
        ) {
            const {router} = this.context;
            var next = null;
            if (!task.approved) {
                next = `/work/${task.id}/edit/complete-task`;
            } else if (!task.payment_approved) {
                next = `/work/${task.id}/invoice`;
            } else if (task.paid) {
                /*else if (!task.participation || !task.participation.length) {
        next = `/work/${task.id}/applications`;
      }*/ next = `/work/${
                    task.id
                }/rate`;
            } else {
                next = `/work/${task.id}/pay`;
            }

            if (next) {
                router.replace(next);
            }
        }
    }

    getNewActivity() {
        const {Task, TaskActions, search, filters} = this.props;
        let taskId = this.props.params.taskId;
        let task_key = getTaskKey(taskId);

        if (taskId && !Task.detail.activity.isFetching[task_key]) {
            var since = 0;
            const task_activity_items = Task.detail.activity.items[task_key];
            if (task_activity_items.length) {
                since = task_activity_items[task_activity_items.length - 1].id;
                if (since === undefined || since === null) {
                    [...task_activity_items].reverse().some(item => {
                        if (item.id) {
                            since = item.id;
                        }
                        return item.id;
                    });
                }
            }
            TaskActions.listTaskActivity(taskId, {since, ...filters, search});
        }
    }

    handleCloseApplications() {
        const {TaskActions, Task} = this.props;

        confirm('Confirm close applications').then(function() {
            TaskActions.updateTask(Task.detail.task.id, {
                apply: false,
                apply_closed_at: moment.utc().format(),
            });
        });
    }

    handleOpenApplications() {
        const {TaskActions, Task} = this.props;
        TaskActions.updateTask(Task.detail.task.id, {
            apply: true,
            apply_closed_at: null,
        });
    }

    handleCloseTask() {
        const {TaskActions, Task} = this.props;

        confirm('Confirm close task').then(function() {
            TaskActions.updateTask(Task.detail.task.id, {
                closed: true,
                closed_at: moment.utc().format(),
            });
        });
    }

    handleOpenTask() {
        const {TaskActions, Task} = this.props;
        TaskActions.updateTask(Task.detail.task.id, {
            closed: false,
            closed_at: null,
        });
    }

    handleMarkPaid() {
        const {TaskActions, Task, task} = this.props;
        if (task.invoice) {
            confirm('Confirm mark as paid').then(function() {
                TaskActions.updateTask(Task.detail.task.id, {
                    paid: true,
                    paid_at: moment.utc().format(),
                });
            });
        } else {
            let wf = this;
            const gotoInvoice = function() {
                const {router} = wf.context;
                router.replace(`/work/${task.id}/invoice`);
            };

            confirm('You need to generate an invoice first', false, {
                hideCancel: true,
            }).then(gotoInvoice, gotoInvoice);
        }
    }

    handleApproveDistribution() {
        const {TaskActions, Task} = this.props;
        confirm(
            <div>
                <p>Confirm payout approval</p>
                <p>
                    Make sure funds have already been sent to Payoneer account
                    before approving payout.
                </p>
            </div>,
            false,
            {ok: 'Approve'},
        ).then(function() {
            TaskActions.updateTask(Task.detail.task.id, {
                distribution_approved: true,
                distribution_approved_at: moment.utc().format(),
            });
        });
    }

    handleDeleteTask() {
        const {TaskActions, Task} = this.props;
        confirm('Confirm delete Task').then(function() {
            TaskActions.deleteTask(Task.detail.task.id);
        });
    }

    handleAcceptTask() {
        const {TaskActions, Task} = this.props;
        TaskActions.updateTask(Task.detail.task.id, {
            participation: [{user: getUser().id, status: STATUS_ACCEPTED}],
        });
    }

    handleRejectTask() {
        const {TaskActions, Task} = this.props;
        confirm('Confirm reject task').then(function() {
            TaskActions.updateTask(Task.detail.task.id, {
                participation: [{user: getUser().id, status: STATUS_REJECTED}],
            });
        });
    }

    onReturnProject() {
        const {TaskActions, task} = this.props;
        confirm('Confirm return project').then(function() {
            TaskActions.returnTask(task.id);
        });
    }

    onUpload(files) {
        const {Task, TaskActions} = this.props;
        const {task} = Task.detail;
        TaskActions.updateTask(task.id, null, files);
    }

    openMilestone(event) {
        if (event) {
            this.setState({modalEvent: {id: event}});
            this.open();
        }
    }

    onToggleFilter(key, e) {
        e.stopPropagation();
        var new_state = {};
        new_state[key] = !this.state[key];
        this.setState(new_state);
    }

    renderModalContent() {
        return (
            <div>
                <LargeModal
                    title={this.state.modalEvent.title || 'Task Update'}
                    show={this.state.showModal}
                    onHide={this.close.bind(this)}>
                    <MilestoneContainer>
                        <Milestone milestone_id={this.state.modalEvent.id} />
                    </MilestoneContainer>
                </LargeModal>
            </div>
        );
    }

    getNewApplications() {
        const {task, Task, TaskActions} = this.props;
        var new_applications = [];
        task.details.applications.map(application => {
            if (application.status == STATUS_INITIAL) {
                new_applications.push(application);
            }
        });
        return new_applications.length;
    }

    toggleSideSection(section) {
        this.setState({
            sideSection: this.state.sideSection == section ? '' : section,
        });
    }

    getApprovedDevelopers() {
        const {task, Task, TaskActions} = this.props;
        let devs = [];
        if (task.details && task.details.participation) {
            task.details.participation.map(participation => {
                const participant = participation.user;
                if (participation.status == STATUS_ACCEPTED) {
                    devs.push(participant);
                }
            });
        }
        return devs;
    }

    getInvitedDevelopers() {
        const {task, Task, TaskActions} = this.props;
        let devs = [];
        if (task.details && task.details.participation) {
            task.details.participation.map(participation => {
                const participant = participation.user;
                if (participation.status == STATUS_INITIAL) {
                    devs.push(participant);
                }
            });
        }
        return devs;
    }

    getLatestSprint() {
        const {task, Task, TaskActions} = this.props;
        if (task.sprints && task.sprints.length) {
            return task.sprints[0];
        }
        return null;
    }

    render() {
        const {task, Task, TaskActions} = this.props;
        const {uploads} = Task.detail;
        var task_status = parse_task_status(task);

        let is_owner = [task.user.id, task.owner].indexOf(getUser().id) > -1,
            is_pm = task.pm == getUser().id;
        let is_admin_or_owner = is_owner || isAdmin();
        let is_admin_or_owner_or_pm = is_admin_or_owner || is_pm;

        let workflow_link = `/work/${task.id}/?nr=true`;
        let can_pay = is_admin_or_owner && task.closed && !task.paid;
        let can_rate = is_admin_or_owner && task.closed && task.paid;
        let can_edit_shares = isAdmin() || is_pm;
        let work_type = task.is_project ? 'project' : 'task';
        let new_applications = this.getNewApplications();

        let is_project_task = task && task.parent;
        let approved_devs = this.getApprovedDevelopers(),
            invited_devs = this.getInvitedDevelopers(),
            latestSprint = this.getLatestSprint();

        let steps = [
            ...steps,
            {
                title: 'View Applications',
                text: 'View Task Applications from developers',
                selector: '#view-applications-btn',
                position: 'bottom',
            },
            {
                title: 'Project Board',
                text: 'View Project Board',
                selector: '#project-board-btn',
                position: 'bottom',
            },
            {
                title: 'Make Payment',
                text: 'Make payments to developers',
                selector: '#make-payment-btn',
                position: 'bottom',
            },
            {
                title: 'Rate Developers',
                text: 'Rate Project Developers',
                selector: '#rate-developers-btn',
                position: 'bottom',
            },
            {
                title: 'Participation Shares',
                text: 'Participation shares',
                selector: '#participation-shares-btn',
                position: 'bottom',
            },
            {
                title: 'Configure updates',
                text: 'Manage updates',
                selector: '#configure-updates-btn',
                position: 'bottom',
            },
            {
                title: 'Settings',
                text: 'Manage Settings',
                selector: '#menu-btn',
                position: 'bottom',
            },
            {
                title: 'Github Repo',
                text: 'View project or task on github',
                selector: '#github-btn',
                position: 'left',
            },
            {
                title: 'Slack team',
                text: 'Go to project or task slack team',
                selector: '#slack-btn',
                position: 'left',
            },
            {
                title: 'Comment Area',
                text: 'View activity about your task or project',
                selector: '#comment-box',
                position: 'top',
            },
            {
                title: 'Comment Widget',
                text: 'Share messages and upload files',
                selector: '#comment-widget',
                position: 'top',
            },
            {
                title: 'Sidebar Bar',
                text: 'View your task or project details',
                selector: '#sidebox',
                position: 'left',
            },
        ];

        return (
            <div>
                <div
                    className={`browser-warning clearfix hidden-md hidden-lg ${
                        this.state.showBrowserWarnings ? '' : 'hide'
                    }`}>
                    <span
                        className="close-icon"
                        onClick={() => {
                            this.setState({showBrowserWarnings: false});
                        }}>
                        <i className="fa fa-close" />
                    </span>
                    <span>
                        For all functionalities, use the desktop version of
                        Tunga
                    </span>
                </div>

                {this.renderModalContent()}

                {/*<Joyride
          ref="joyride_workflow"
          steps={steps}
          run={!__PRODUCTION__ || __PRERELEASE__}
          debug={!__PRODUCTION__ || __PRERELEASE__}
          autoStart={!__PRODUCTION__ || __PRERELEASE__}
          type="continuous"
          showStepsProgress={true}
          showSkipButton={true}
        />*/}

                <div className="workflow-head clearfix">
                    <div className="clearfix">
                        <div className="pull-right hidden-xs hidden-sm">
                            {is_admin_or_owner_or_pm || isProjectOwner() ? (
                                <Link
                                    to="/work/new"
                                    className="btn btn-grey btn-create">
                                    <i className="fa fa-plus" /> Create a new
                                    task
                                </Link>
                            ) : null}
                            {is_admin_or_owner_or_pm ? (
                                <span className="overview-dropdown">
                                    <span className="dropdown">
                                        <button
                                            className="btn btn-grey btn-create"
                                            type="button"
                                            id="chat-overflow"
                                            data-toggle="dropdown"
                                            aria-haspopup="true"
                                            aria-expanded="true">
                                            <i className="fa fa-ellipsis-v" />
                                        </button>
                                        <ul
                                            className="dropdown-menu dropdown-menu-right"
                                            aria-labelledby="chat-overflow">
                                            {is_admin_or_owner_or_pm
                                                ? [
                                                      !task.closed &&
                                                      is_admin_or_owner_or_pm ? (
                                                          <li>
                                                              {task.apply ? (
                                                                  <button
                                                                      type="button"
                                                                      className="btn "
                                                                      onClick={this.handleCloseApplications.bind(
                                                                          this,
                                                                      )}>
                                                                      Close
                                                                      applications
                                                                  </button>
                                                              ) : (
                                                                  <button
                                                                      type="button"
                                                                      className="btn "
                                                                      onClick={this.handleOpenApplications.bind(
                                                                          this,
                                                                      )}>
                                                                      Open
                                                                      applications
                                                                  </button>
                                                              )}
                                                          </li>
                                                      ) : null,
                                                      task.closed &&
                                                      !task.paid &&
                                                      is_admin_or_owner_or_pm ? (
                                                          <li>
                                                              <button
                                                                  type="button"
                                                                  className="btn"
                                                                  onClick={this.handleOpenTask.bind(
                                                                      this,
                                                                  )}>
                                                                  Open{' '}
                                                                  {work_type}
                                                              </button>
                                                          </li>
                                                      ) : null,
                                                      task.closed &&
                                                      isAdmin() ? (
                                                          task.paid ? null : task.payment_approved ? (
                                                              <li>
                                                                  <button
                                                                      type="button"
                                                                      className="btn"
                                                                      onClick={this.handleMarkPaid.bind(
                                                                          this,
                                                                      )}>
                                                                      Mark as
                                                                      paid
                                                                  </button>
                                                              </li>
                                                          ) : (
                                                              <li>
                                                                  <Link
                                                                      to={`/work/${
                                                                          task.id
                                                                      }/edit/payment-approval/`}
                                                                      className="btn"
                                                                      id="payment-approval-btn">
                                                                      Approve
                                                                      payment
                                                                  </Link>
                                                              </li>
                                                          )
                                                      ) : null,
                                                      task.closed &&
                                                      isAdmin() &&
                                                      task.payment_approved &&
                                                      !task.distribution_approved ? (
                                                          <li>
                                                              <button
                                                                  type="button"
                                                                  className="btn"
                                                                  onClick={this.handleApproveDistribution.bind(
                                                                      this,
                                                                  )}>
                                                                  Approve payout
                                                                  via Payoneer
                                                              </button>
                                                          </li>
                                                      ) : null,
                                                  ]
                                                : null}
                                            {!is_project_task &&
                                            is_admin_or_owner_or_pm ? (
                                                <li>
                                                    <Link
                                                        to={`/work/${
                                                            task.id
                                                        }/edit/updates/`}
                                                        className="btn"
                                                        id="configure-updates-btn">
                                                        Configure updates
                                                    </Link>
                                                </li>
                                            ) : null}

                                            {can_edit_shares &&
                                            task.details &&
                                            task.details.participation &&
                                            task.details.participation
                                                .length ? (
                                                <li>
                                                    <Link
                                                        to={`/work/${
                                                            task.id
                                                        }/edit/participation/`}
                                                        className="btn"
                                                        id="participation-shares-btn">
                                                        Participation shares
                                                    </Link>
                                                </li>
                                            ) : null}

                                            {!task.closed ? (
                                                <li>
                                                    <button
                                                        type="button"
                                                        className="btn"
                                                        onClick={this.handleCloseTask.bind(
                                                            this,
                                                        )}>
                                                        Close {work_type}
                                                    </button>
                                                </li>
                                            ) : null}
                                            {is_admin_or_owner ? (
                                                <li>
                                                    <button
                                                        type="button"
                                                        className="btn"
                                                        onClick={this.handleDeleteTask.bind(
                                                            this,
                                                        )}>
                                                        <i className="fa fa-trash-o" />{' '}
                                                        Delete {work_type}
                                                    </button>
                                                </li>
                                            ) : null}
                                        </ul>
                                    </span>
                                </span>
                            ) : null}
                        </div>
                        <div className="title pull-left">
                            {task.parent && task.details ? (
                                <span>
                                    <Link
                                        to={`/work/${task.parent}/`}
                                        className="small">
                                        {render_summary(
                                            task.details.parent.title ||
                                                task.summary,
                                            30,
                                        )}
                                    </Link>
                                </span>
                            ) : null}
                            <span>{task.summary}</span>
                        </div>
                    </div>

                    <div
                        className="hidden-xs hidden-sm"
                        style={{marginBottom: '10px'}}>
                        {task.is_developer_ready ? (
                            <span className="task-status">
                                <i
                                    className={
                                        'fa fa-circle ' + task_status.css
                                    }
                                />{' '}
                                {task_status.message} |{' '}
                            </span>
                        ) : null}
                        <span className="time">
                            Posted{' '}
                            <TimeAgo
                                date={moment
                                    .utc(task.created_at)
                                    .local()
                                    .format()}
                            />
                        </span>
                    </div>

                    <div className="clearfix hidden-xs">
                        <div className="nav-top-filter pull-left">
                            <Link
                                to={`/work/${task.id}/?nr=true`}
                                activeClassName="active">
                                Meeting room
                            </Link>

                            {!task.is_developer_ready ? (
                                <span className="hidden-xs hidden-sm">
                                    {canAddEstimate(task) ? (
                                        <Link
                                            to={`/work/${task.id}/estimate/new`}
                                            className="btn">
                                            Proposal
                                        </Link>
                                    ) : canEditEstimate(task) ? (
                                        <Link
                                            to={`/work/${task.id}/estimate/${
                                                task.estimate.id
                                            }/edit`}
                                            className="btn">
                                            Proposal
                                        </Link>
                                    ) : canViewEstimate(task) ? (
                                        <Link
                                            to={`/work/${task.id}/estimate/${
                                                task.estimate.id
                                            }`}
                                            className="btn">
                                            Proposal
                                        </Link>
                                    ) : null}
                                </span>
                            ) : null}

                            {is_admin_or_owner_or_pm ||
                            (latestSprint && latestSprint.id) ? (
                                <Link
                                    to={`/work/${task.id}/planning/${
                                        latestSprint && latestSprint.id
                                            ? latestSprint.id
                                            : ''
                                    }`}
                                    className="btn">
                                    Planning
                                </Link>
                            ) : null}

                            {is_admin_or_owner_or_pm ||
                            task.is_admin ||
                            task.is_participant ? (
                                <span className="hidden-xs hidden-sm">
                                    {is_admin_or_owner_or_pm ||
                                    can_edit_shares ? (
                                        <span>
                                            {is_admin_or_owner_or_pm &&
                                            task.is_project ? (
                                                <Link
                                                    to={`/work/${
                                                        task.id
                                                    }/board/`}
                                                    className="btn"
                                                    id="project-board-btn">
                                                    Project Board
                                                </Link>
                                            ) : null}
                                        </span>
                                    ) : null}

                                    {is_admin_or_owner ? (
                                        <span>
                                            {can_pay ? (
                                                <Link
                                                    to={`/work/${task.id}/${
                                                        task.payment_approved
                                                            ? 'pay'
                                                            : 'invoice'
                                                    }/`}
                                                    className="btn"
                                                    id="make-payment-btn">
                                                    {task.payment_approved
                                                        ? 'Make payment'
                                                        : 'Manage Invoice'}
                                                </Link>
                                            ) : null}
                                            {can_rate ? (
                                                <Link
                                                    to={`/work/${
                                                        task.id
                                                    }/rate/`}
                                                    className="btn"
                                                    id="rate-developers-btn">
                                                    Rate Developers
                                                </Link>
                                            ) : null}
                                        </span>
                                    ) : null}
                                </span>
                            ) : null}
                        </div>

                        <div className="pull-right hidden-xs hidden-sm">
                            {is_admin_or_owner_or_pm && !task.parent ? (
                                <ul className="integration-options pull-right">
                                    <li id="github-btn">
                                        <Link
                                            to={`/work/${
                                                task.id
                                            }/integrations/${
                                                SOCIAL_PROVIDERS.github
                                            }`}
                                            activeClassName="active"
                                            title="GitHub">
                                            <i className="fa fa-github" />
                                        </Link>
                                    </li>
                                    <li id="slack-btn">
                                        <Link
                                            to={`/work/${
                                                task.id
                                            }/integrations/${
                                                SOCIAL_PROVIDERS.slack
                                            }`}
                                            activeClassName="active"
                                            title="Slack">
                                            <i className="fa fa-slack" />
                                        </Link>
                                    </li>
                                    <li id="trello-btn">
                                        <Link
                                            to={`/work/${task.id}/edit/${
                                                SOCIAL_PROVIDERS.trello
                                            }`}
                                            activeClassName="active"
                                            title="Trello">
                                            <i className="fa fa-trello" />
                                        </Link>
                                    </li>
                                    <li id="google-drive-btn">
                                        <Link
                                            to={`/work/${task.id}/edit/${
                                                SOCIAL_PROVIDERS['google-drive']
                                            }`}
                                            activeClassName="active"
                                            title="Google Drive">
                                            <i className="tunga-icon-google-drive" />
                                        </Link>
                                    </li>
                                </ul>
                            ) : (
                                <span>&nbsp;</span>
                            )}
                        </div>

                        {!task.payment_approved &&
                        !task.paid &&
                        task.is_participant &&
                        task.my_participation &&
                        task.my_participation.status == STATUS_INITIAL ? (
                            <div className="pull-right hidden-xs hidden-sm">
                                <button
                                    type="button"
                                    className="btn"
                                    onClick={this.handleAcceptTask.bind(this)}>
                                    Accept {work_type}
                                </button>
                                <button
                                    type="button"
                                    className="btn"
                                    onClick={this.handleRejectTask.bind(this)}>
                                    Reject {work_type}
                                </button>
                            </div>
                        ) : null}
                    </div>

                    <Timeline
                        task={task}
                        start={task.created_at}
                        end={task.deadline}
                        events={task.progress_events}
                        openMilestone={this.openMilestone.bind(this)}
                        className="hidden-xs hidden-sm"
                    />

                    <div className="clearfix hidden-xs">
                        <div
                            className={`activity-filter ${
                                this.state.showFilter ? 'open' : ''
                            }`}
                            onClick={() => {
                                this.setState({
                                    showFilter: !this.state.showFilter,
                                });
                            }}>
                            <button className="btn filter-btn">
                                <i className="tunga-icon-filter-alt" />
                            </button>
                            <div className="switches">
                                <div>
                                    <i
                                        className={`switch fa fa-toggle-${
                                            this.state.messages ? 'on' : 'off'
                                        }`}
                                        onClick={this.onToggleFilter.bind(
                                            this,
                                            'messages',
                                        )}
                                    />
                                    <span>Messages</span>
                                </div>
                                <div>
                                    <i
                                        className={`switch fa fa-toggle-${
                                            this.state.notifications
                                                ? 'on'
                                                : 'off'
                                        }`}
                                        onClick={this.onToggleFilter.bind(
                                            this,
                                            'notifications',
                                        )}
                                    />
                                    <span>Notifications</span>
                                </div>
                                <div>
                                    <i
                                        className={`switch fa fa-toggle-${
                                            this.state.progress_reports
                                                ? 'on'
                                                : 'off'
                                        }`}
                                        onClick={this.onToggleFilter.bind(
                                            this,
                                            'progress_reports',
                                        )}
                                    />
                                    <span>Progress Reports</span>
                                </div>
                                <div>
                                    <i
                                        className={`switch fa fa-toggle-${
                                            this.state.files ? 'on' : 'off'
                                        }`}
                                        onClick={this.onToggleFilter.bind(
                                            this,
                                            'files',
                                        )}
                                    />
                                    <span>Files</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="workflow-overview overview">
                    <div className="mainbox chatbox">
                        {task.details ? (
                            <div className="list-box">
                                <ActivityList
                                    activities={
                                        Task.detail.activity.items[
                                            getTaskKey(task.id)
                                        ] || []
                                    }
                                    isLoading={
                                        Task.detail.activity.isFetching[
                                            getTaskKey(task.id)
                                        ] || false
                                    }
                                    isLoadingMore={
                                        Task.detail.activity.isFetchingMore[
                                            getTaskKey(task.id)
                                        ] || false
                                    }
                                    loadMoreUrl={
                                        Task.detail.activity.next[
                                            getTaskKey(task.id)
                                        ] || null
                                    }
                                    loadMoreCallback={
                                        TaskActions.listMoreTaskActivity
                                    }
                                    loadMoreText="Show older activity"
                                    showMessages={this.state.messages}
                                    showNotifications={this.state.notifications}
                                    showProgressReports={
                                        this.state.progress_reports
                                    }
                                    showFiles={this.state.files}
                                />
                            </div>
                        ) : null}
                        {task.details ? (
                            <CommentSection
                                className="comment-box"
                                id="comment-box">
                                <CommentForm
                                    object_details={{
                                        content_type: task.content_type,
                                        object_id: task.id,
                                    }}
                                    uploadCallback={this.onUpload.bind(this)}
                                    uploadSaved={Task.detail.isSaved}
                                    isSaving={Task.detail.isSaving}
                                    id="comment-widget"
                                />
                            </CommentSection>
                        ) : null}
                    </div>

                    <div className="sidebox" id="sidebox">
                        <div
                            className={`overview-details ${
                                this.state.sideSection == 'team' ? 'on' : ''
                            }`}>
                            <div>
                                <Link
                                    to={workflow_link}
                                    className="title"
                                    onClick={this.toggleSideSection.bind(
                                        this,
                                        'team',
                                    )}>
                                    <i className="tunga-icon-arrow-right" />
                                    <i className="tunga-icon-arrow-down" /> Team
                                </Link>
                            </div>

                            <div className="content">
                                <div className="clearfix">
                                    <div>
                                        {task.is_project ? 'Project' : 'Task'}{' '}
                                        Owner
                                    </div>
                                    <div>
                                        {task.owner &&
                                        task.details &&
                                        task.details.owner ? (
                                            <span>
                                                <Avatar
                                                    src={
                                                        task.details.owner
                                                            .avatar_url
                                                    }
                                                    title={
                                                        task.details.owner
                                                            .display_name
                                                    }
                                                    url={`/people/${
                                                        task.details.owner
                                                            .username
                                                    }/`}
                                                />
                                            </span>
                                        ) : (
                                            <span>
                                                <Avatar
                                                    src={task.user.avatar_url}
                                                    title={
                                                        task.user.display_name
                                                    }
                                                    url={`/people/${
                                                        task.user.username
                                                    }/`}
                                                />
                                            </span>
                                        )}
                                        {(isAdmin() ||
                                            is_pm ||
                                            (is_owner && isProjectManager())) &&
                                        !task.payment_approved &&
                                        !task.paid ? (
                                            <Link
                                                to={`/work/${
                                                    task.id
                                                }/edit/owner`}
                                                className="btn btn-borderless">
                                                <i className="fa fa-pencil-square-o edit-icon" />
                                            </Link>
                                        ) : null}
                                    </div>
                                </div>

                                {task.details &&
                                task.details.admins &&
                                task.details.admins.length ? (
                                    <div className="clearfix">
                                        <div>Administrators</div>
                                        <div>
                                            {task.details.admins.map(user => {
                                                return (
                                                    <span>
                                                        <Avatar
                                                            src={
                                                                user.avatar_url
                                                            }
                                                            title={
                                                                user.display_name
                                                            }
                                                            url={`/people/${
                                                                user.username
                                                            }/`}
                                                        />
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ) : null}

                                {task.is_project || task.pm ? (
                                    <div>
                                        {task.pm || isAdmin() ? (
                                            <div>Project Manager</div>
                                        ) : null}
                                        {task.pm &&
                                        task.details &&
                                        task.details.pm ? (
                                            <span>
                                                <Avatar
                                                    src={
                                                        task.details.pm
                                                            .avatar_url
                                                    }
                                                    title={
                                                        task.details.pm
                                                            .display_name
                                                    }
                                                    url={`/people/${
                                                        task.details.pm.username
                                                    }`}
                                                />
                                            </span>
                                        ) : null}
                                        {isAdmin() &&
                                        !(
                                            task.payment_approved || task.paid
                                        ) ? (
                                            <Link
                                                to={`/work/${task.id}/edit/pm`}
                                                className="btn btn-borderless">
                                                <i
                                                    className={`edit-icon ${
                                                        task.pm
                                                            ? 'fa fa-pencil-square-o'
                                                            : 'tunga-icon-create'
                                                    }`}
                                                />
                                            </Link>
                                        ) : null}
                                    </div>
                                ) : null}

                                <div>
                                    <div>Developers</div>
                                    <div>
                                        {approved_devs.map(participant => {
                                            return (
                                                <span
                                                    className="collaborator"
                                                    key={participant.id}>
                                                    <Avatar
                                                        src={
                                                            participant.avatar_url
                                                        }
                                                        title={
                                                            participant.display_name
                                                        }
                                                        url={`/people/${
                                                            participant.username
                                                        }/`}
                                                    />
                                                </span>
                                            );
                                        })}

                                        {is_admin_or_owner_or_pm &&
                                        !(
                                            task.payment_approved || task.paid
                                        ) ? (
                                            <Link
                                                to={`/work/${
                                                    task.id
                                                }/edit/developers`}
                                                className="btn btn-borderless">
                                                <i className="edit-icon tunga-icon-create" />
                                            </Link>
                                        ) : null}
                                    </div>
                                </div>

                                {invited_devs.length ? (
                                    <div>
                                        <div>Pending Invitations</div>
                                        <div>
                                            {invited_devs.map(participant => {
                                                return (
                                                    <span
                                                        className="collaborator"
                                                        key={participant.id}>
                                                        <Avatar
                                                            src={
                                                                participant.avatar_url
                                                            }
                                                            title={
                                                                participant.display_name
                                                            }
                                                            url={`/people/${
                                                                participant.username
                                                            }/`}
                                                        />
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        </div>

                        <div
                            className={`overview-details ${
                                this.state.sideSection == 'details' ? 'on' : ''
                            }`}>
                            <div className="clearfix">
                                <Link
                                    to={workflow_link}
                                    className="title"
                                    onClick={this.toggleSideSection.bind(
                                        this,
                                        'details',
                                    )}>
                                    <i className="tunga-icon-arrow-right" />
                                    <i className="tunga-icon-arrow-down" />{' '}
                                    {task.is_project ? 'Project' : 'Task'}{' '}
                                    details
                                </Link>

                                <div className="overview-dropdown pull-right">
                                    {is_admin_or_owner_or_pm ? (
                                        <div className="dropdown">
                                            <button
                                                className="btn btn-borderless"
                                                type="button"
                                                id="chat-overflow"
                                                data-toggle="dropdown"
                                                aria-haspopup="true"
                                                aria-expanded="true">
                                                <i className="fa fa-pencil-square-o" />
                                            </button>
                                            <ul
                                                className="dropdown-menu dropdown-menu-right"
                                                aria-labelledby="chat-overflow">
                                                {is_admin_or_owner_or_pm
                                                    ? [
                                                          <li>
                                                              <Link
                                                                  to={`/work/${
                                                                      task.id
                                                                  }/edit/title`}
                                                                  className="btn">
                                                                  Edit{' '}
                                                                  {work_type}{' '}
                                                                  title
                                                              </Link>
                                                          </li>,
                                                          <li>
                                                              <Link
                                                                  to={`/work/${
                                                                      task.id
                                                                  }/edit/description`}
                                                                  className="btn">
                                                                  Edit{' '}
                                                                  {work_type}{' '}
                                                                  description
                                                              </Link>
                                                          </li>,
                                                          is_admin_or_owner &&
                                                          !task.paid ? (
                                                              <li>
                                                                  <Link
                                                                      to={`/work/${
                                                                          task.id
                                                                      }/edit/fee`}
                                                                      className="btn">
                                                                      Edit the
                                                                      fee for
                                                                      the{' '}
                                                                      {
                                                                          work_type
                                                                      }
                                                                  </Link>
                                                              </li>
                                                          ) : null,
                                                          <li>
                                                              <Link
                                                                  to={`/work/${
                                                                      task.id
                                                                  }/edit/deadline`}
                                                                  className="btn">
                                                                  Edit deadline
                                                              </Link>
                                                          </li>,
                                                          <li>
                                                              <Link
                                                                  to={`/work/${
                                                                      task.id
                                                                  }/edit/skills`}
                                                                  className="btn">
                                                                  Add skills
                                                              </Link>
                                                          </li>,
                                                        !task.parent ? (
                                                              <li>
                                                                  <Link
                                                                      to={`/work/${
                                                                          task.id
                                                                      }/edit/milestone`}
                                                                      className="btn">
                                                                      Add a
                                                                      milestone
                                                                  </Link>
                                                              </li>
                                                          ) : null,
                                                          <li>
                                                              <Link
                                                                  to={`/work/${
                                                                      task.id
                                                                  }/documents`}
                                                                  className="btn">
                                                                  Upload
                                                                  documents
                                                              </Link>
                                                          </li>,
                                                      ]
                                                    : null}
                                            </ul>
                                        </div>
                                    ) : null}
                                </div>
                            </div>

                            <div className="content">
                                {task.description ? (
                                    <div>
                                        <strong>About</strong>
                                        <div className="description">
                                            <div
                                                dangerouslySetInnerHTML={{
                                                    __html: nl_to_br(
                                                        renderToString(
                                                            <Linkify
                                                                properties={{
                                                                    target:
                                                                        '_blank',
                                                                }}>
                                                                {
                                                                    task.description
                                                                }
                                                            </Linkify>,
                                                        ),
                                                    ),
                                                }}
                                            />
                                        </div>
                                    </div>
                                ) : null}

                                {task.display_fee ? (
                                    <div>
                                        <strong>Fee</strong>
                                        <div className="pledge">
                                            {task.display_fee}
                                        </div>
                                    </div>
                                ) : null}

                                {task.schedule_call_start ? (
                                    <div>
                                        <strong>Call Window:</strong>
                                        <div>
                                            <i className="fa fa-calendar-o" />{' '}
                                            <span>
                                                {moment
                                                    .utc(
                                                        task.schedule_call_start,
                                                    )
                                                    .local()
                                                    .format("Do MMM 'YY")}
                                            </span>
                                        </div>
                                        <div>
                                            <i className="fa fa-clock-o" />{' '}
                                            <span>
                                                {moment
                                                    .utc(
                                                        task.schedule_call_start,
                                                    )
                                                    .local()
                                                    .format('hh:mm A')}
                                            </span>
                                            {task.schedule_call_end ? (
                                                <span>
                                                    {' - '}
                                                    <span>
                                                        {moment
                                                            .utc(
                                                                task.schedule_call_end,
                                                            )
                                                            .local()
                                                            .format('hh:mm A')}
                                                    </span>
                                                </span>
                                            ) : null}
                                        </div>
                                    </div>
                                ) : null}

                                {task.url ? (
                                    <div>
                                        <strong>
                                            <i className="tunga-icon-web-alt" />{' '}
                                            Code Location
                                        </strong>
                                        <p>
                                            <a href={task.url} target="_blank">
                                                {task.url}
                                            </a>
                                        </p>
                                    </div>
                                ) : null}
                                {task.details && task.details.skills.length ? (
                                    <div>
                                        <strong>Stack</strong>
                                        <TagList
                                            tags={task.details.skills}
                                            max={3}
                                            linkPrefix="/work/skill/"
                                            moreLink={`/work/${task.id}/`}
                                        />
                                    </div>
                                ) : null}
                                {task.trello_board_url ? (
                                    <div>
                                        <strong>
                                            <i className="fa fa-trello trello" />{' '}
                                            Trello board
                                        </strong>
                                        <p>
                                            <a
                                                href={task.trello_board_url}
                                                target="_blank">
                                                {task.trello_board_url}
                                            </a>
                                        </p>
                                    </div>
                                ) : null}
                                {task.google_drive_url ? (
                                    <div>
                                        <strong>
                                            <i className="tunga-icon-google-drive google" />{' '}
                                            Google Drive
                                        </strong>
                                        <p>
                                            <a
                                                href={task.google_drive_url}
                                                target="_blank">
                                                {task.google_drive_url}
                                            </a>
                                        </p>
                                    </div>
                                ) : null}
                                {task.milestones.length ? (
                                    <div>
                                        <strong>Milestones</strong>
                                        {task.milestones.map(milestone => {
                                            return (
                                                <div key={milestone.id}>
                                                    <Link
                                                        to={`/work/${
                                                            task.id
                                                        }/event/${
                                                            milestone.id
                                                        }`}>
                                                        <i
                                                            className={
                                                                'fa fa-flag' +
                                                                (milestone.type ==
                                                                4
                                                                    ? '-checkered'
                                                                    : '-o')
                                                            }
                                                        />{' '}
                                                        {milestone.title}
                                                        <span
                                                            style={{
                                                                marginLeft:
                                                                    '5px',
                                                            }}>
                                                            {moment
                                                                .utc(
                                                                    milestone.due_at,
                                                                )
                                                                .local()
                                                                .format(
                                                                    'Do, MMMM YYYY',
                                                                )}
                                                        </span>
                                                    </Link>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : null}

                                {[
                                    {
                                        key: 'deliverables',
                                        title: 'Deliverables',
                                    },
                                    {
                                        key: 'stack_description',
                                        title: 'Technology Stack',
                                    },
                                ].map(item => {
                                    if (task[item.key]) {
                                        return (
                                            <div>
                                                <strong>{item.title}</strong>
                                                <div>
                                                    <Linkify
                                                        properties={{
                                                            target: '_blank',
                                                        }}>
                                                        {task[item.key]}
                                                    </Linkify>
                                                </div>
                                            </div>
                                        );
                                    }
                                    return null;
                                })}

                                {task.invoice ? (
                                    <div>
                                        <div>
                                            <strong>
                                                Invoice{isDeveloper() ||
                                                isAdmin()
                                                    ? 's'
                                                    : ''}
                                            </strong>
                                        </div>
                                        <a
                                            href={`${ENDPOINT_TASK}${
                                                task.id
                                            }/download/invoice/?format=pdf&type=client`}
                                            target="_blank">
                                            <span>
                                                <i className="fa fa-download" />{' '}
                                                {isDeveloper() ||
                                                isProjectManager() ||
                                                isAdmin()
                                                    ? 'Client'
                                                    : 'Download'}{' '}
                                                Invoice(s)
                                            </span>
                                        </a>
                                        <br />
                                        {(isDeveloper() || isAdmin()) &&
                                        task.participation &&
                                        task.participation.length ? (
                                            <div>
                                                {task.invoice.version >
                                                1 ? null : (
                                                    <div>
                                                        <a
                                                            href={`${ENDPOINT_TASK}${
                                                                task.id
                                                            }/download/invoice/?format=pdf&type=developer`}
                                                            target="_blank">
                                                            <span>
                                                                <i className="fa fa-download" />{' '}
                                                                Developer
                                                                Invoice(s)
                                                            </span>
                                                        </a>
                                                        <br />
                                                    </div>
                                                )}
                                                <a
                                                    href={`${ENDPOINT_TASK}${
                                                        task.id
                                                    }/download/invoice/?format=pdf&type=tunga`}
                                                    target="_blank">
                                                    <span>
                                                        <i className="fa fa-download" />{' '}
                                                        Tunga Invoice(s)
                                                    </span>
                                                </a>
                                            </div>
                                        ) : null}
                                    </div>
                                ) : null}

                                {task.documents && task.documents.length ? (
                                    <div>
                                        <strong>Documents</strong>

                                        <div className="attachments">
                                            {task.documents.map(attachment => {
                                                return (
                                                    <div
                                                        key={attachment.id}
                                                        className="file">
                                                        <div>
                                                            {
                                                                TASK_DOCUMENT_TYPES[
                                                                    attachment
                                                                        .file_type
                                                                ]
                                                            }
                                                        </div>
                                                        <a
                                                            href={
                                                                attachment.url
                                                            }
                                                            target="_blank">
                                                            <i className="fa fa-download" />{' '}
                                                            {attachment.name}{' '}
                                                        </a>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

TaskWorkflow.contextTypes = {
    router: PropTypes.object.isRequired,
};
