import React from 'react';
import {Link} from 'react-router';
import moment from 'moment';
import Linkify from './Linkify';

import Progress from './status/Progress';
import UserCardProfile from './UserCardProfile';
import ComponentWithModal from './ComponentWithModal';
import LargeModal from './LargeModal';

import confirm from '../utils/confirm';
import {getTotalFee, getAcquisitionUrl, hasStarted} from '../utils/tasks';
import {sendGAPageView} from '../utils/tracking';
import {truncateWords} from '../utils/helpers';

import {
    STATUS_REJECTED,
    STATUS_INITIAL,
    STATUS_ACCEPTED,
} from '../constants/Api';

export default class ApplicationList extends ComponentWithModal {
    constructor(props) {
        super(props);
        this.state = {
            application: null,
            modalStep: 'select',
            close_applications: false,
        };
    }

    componentDidMount() {
        const {TaskActions, Task} = this.props;
        TaskActions.listApplications({
            task: Task.detail.task.id,
            //status: STATUS_INITIAL,
        });
    }

    componentDidUpdate(prevProps, prevState) {
        if (
            this.props.Task.detail.applications.isSaved &&
            !prevProps.Task.detail.applications.isSaved
        ) {
            const {Task} = this.props;
            if (this.state.application) {
                this.setState({
                    application:
                        Task.detail.applications.items[
                            this.state.application.id
                        ],
                    modalStep: 'confirm',
                });
            }

            if (hasStarted(prevProps.task)) {
                this.props.TaskActions.retrieveTask(this.props.task.id);
            }
        }

        if (prevProps.task && this.props.task) {
            const had_started = hasStarted(prevProps.task);
            const has_started = hasStarted(this.props.task);

            if (!had_started && has_started) {
                sendGAPageView(getAcquisitionUrl(this.props.task, true));

                this.props.TaskActions.retrieveTask(this.props.task.id);
            }
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

    handleSelectDeveloper(application, accepted = false) {
        this.setState({
            application,
            modalStep: 'select',
            close_applications: false,
        });
        this.open();
    }

    handleAcceptApplication(close_applications) {
        const {TaskActions, task} = this.props;
        var assignee = !task.assignee;
        this.setState({close_applications});
        const application = this.state.application;
        TaskActions.updateApplication(application.id, {
            status: STATUS_ACCEPTED,
        });
        TaskActions.updateTask(application.task, {
            apply: !close_applications,
            participation: [
                {user: application.user.id, assignee, status: STATUS_ACCEPTED},
            ],
        });
    }

    handleRejectApplication(application) {
        const {TaskActions} = this.props;
        confirm(`Decline ${application.user.display_name}'s application`).then(
            function() {
                TaskActions.updateApplication(application.id, {
                    status: STATUS_REJECTED,
                });
            },
        );
    }

    renderModalContent() {
        const {Task} = this.props;
        const {task, applications} = Task.detail;
        let work_type = task.is_task ? 'task' : 'project';

        return (
            <div>
                <LargeModal
                    title="Developer Selection"
                    bsStyle="md"
                    show={this.state.showModal}
                    onHide={this.close.bind(this)}
                    bsStyle="modal-md">
                    {this.state.application ? (
                        <div>
                            {this.state.modalStep == 'select' ? (
                                <div>
                                    Would you like to work with one developer or
                                    create a team for this {work_type}?
                                    <div className="popup-actions">
                                        <button
                                            type="button"
                                            className="btn"
                                            onClick={this.handleAcceptApplication.bind(
                                                this,
                                                true,
                                            )}>
                                            Select{' '}
                                            {
                                                this.state.application.details
                                                    .user.first_name
                                            }{' '}
                                            and close applications
                                        </button>
                                        <button
                                            type="button"
                                            className="btn"
                                            onClick={this.handleAcceptApplication.bind(
                                                this,
                                                false,
                                            )}>
                                            Select{' '}
                                            {
                                                this.state.application.details
                                                    .user.first_name
                                            }{' '}
                                            and add more developers to create a
                                            team for this {work_type}
                                        </button>
                                    </div>
                                </div>
                            ) : null}
                            {this.state.modalStep == 'confirm' ? (
                                <div>
                                    {
                                        this.state.application.details.user
                                            .display_name
                                    }{' '}
                                    {this.state.close_applications
                                        ? `received a confirmation of your selection. ${
                                              this.state.application.details
                                                  .user.first_name
                                          } now has access to the ${work_type} page and will contact you soon.`
                                        : 'has been added to the team'}
                                    <div className="popup-actions">
                                        {this.state.close_applications ? (
                                            <Link
                                                to={`/work/${task.id}`}
                                                className="btn"
                                                onClick={this.close.bind(this)}>
                                                Go to {work_type} page
                                            </Link>
                                        ) : (
                                            <button
                                                type="button"
                                                className="btn"
                                                onClick={this.close.bind(this)}>
                                                Select more developers
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    ) : null}
                </LargeModal>
            </div>
        );
    }

    render() {
        const {Task} = this.props;
        const {task, applications} = Task.detail;

        let work_type = task.is_task ? 'task' : 'project';

        return (
            <div>
                {this.renderModalContent()}
                {Task.detail.isRetrieving ||
                Task.detail.applications.isRetrieving ? (
                    <Progress />
                ) : (
                    <div>
                        <div className="nav-top-filter">
                            {task.apply ? (
                                <button
                                    type="button"
                                    className="btn "
                                    onClick={this.handleCloseApplications.bind(
                                        this,
                                    )}>
                                    Close applications
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    className="btn "
                                    onClick={this.handleOpenApplications.bind(
                                        this,
                                    )}>
                                    Open applications
                                </button>
                            )}
                            <Link
                                to={`/work/${task.id}/edit/complete-task`}
                                className="btn">
                                Edit {work_type}
                            </Link>
                            <Link
                                to={`/work/${task.id}/edit/developers`}
                                className="btn">
                                Add another developer to this {work_type}
                            </Link>
                        </div>
                        <div className="row flex-row">
                            {applications.ids.map(id => {
                                const application = applications.items[id];
                                const {user} = application.details;
                                return (
                                    <div className="col-sm-6 col-md-4" key={id}>
                                        <div
                                            className={
                                                'card application-card' +
                                                (application.status ==
                                                STATUS_REJECTED
                                                    ? ' rejected'
                                                    : '')
                                            }>
                                            <UserCardProfile user={user} />
                                            {user.profile &&
                                            user.profile.skills.length ? (
                                                <div>
                                                    <p className="title">
                                                        Skillset
                                                    </p>
                                                    {user.profile.skills
                                                        .map(skill => {
                                                            return skill.name;
                                                        })
                                                        .join(', ')}
                                                </div>
                                            ) : null}
                                            <div>
                                                {application.pitch ? (
                                                    <div>
                                                        <p className="title">
                                                            Motivation
                                                        </p>
                                                        <div className="description">
                                                            <Linkify
                                                                properties={{
                                                                    target:
                                                                        '_blank',
                                                                }}>
                                                                {truncateWords(
                                                                    application.pitch,
                                                                    12,
                                                                )}
                                                            </Linkify>
                                                        </div>
                                                    </div>
                                                ) : null}
                                                {application.hours_needed ? (
                                                    <div>
                                                        <p className="title">
                                                            Workload
                                                        </p>
                                                        <div>
                                                            {
                                                                application
                                                                    .details
                                                                    .user
                                                                    .first_name
                                                            }{' '}
                                                            estimates{' '}
                                                            {
                                                                application.hours_needed
                                                            }{' '}
                                                            hours for this{' '}
                                                            {work_type}
                                                        </div>
                                                    </div>
                                                ) : null}
                                                {application.hours_needed &&
                                                task.is_task ? (
                                                    <div>
                                                        <p className="title">
                                                            Fee
                                                        </p>
                                                        <div>
                                                            You will be charged{' '}
                                                            <span className="bold">
                                                                €{getTotalFee(
                                                                    application.hours_needed,
                                                                    task.dev_rate,
                                                                )}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ) : null}
                                                {application.days_available ? (
                                                    <div>
                                                        <p className="title">
                                                            Availabilty
                                                        </p>
                                                        <div>
                                                            {
                                                                application
                                                                    .details
                                                                    .user
                                                                    .first_name
                                                            }{' '}
                                                            is available for{' '}
                                                            {
                                                                application.days_available
                                                            }{' '}
                                                            days for this{' '}
                                                            {work_type}
                                                        </div>
                                                    </div>
                                                ) : null}
                                                {application.deliver_at ? (
                                                    <div>
                                                        <p className="title">
                                                            Delivery Date
                                                        </p>
                                                        {moment
                                                            .utc(
                                                                application.deliver_at,
                                                            )
                                                            .local()
                                                            .format(
                                                                'dddd, Do MMMM, YYYY',
                                                            )}
                                                    </div>
                                                ) : null}
                                            </div>
                                            {task.closed ||
                                            application.status !=
                                                STATUS_INITIAL ? null : (
                                                <div className="actions">
                                                    <div>
                                                        <Link
                                                            to={`/work/${
                                                                application.task
                                                            }/applications/${
                                                                application.id
                                                            }`}
                                                            className="btn btn-block">
                                                            View full
                                                            Application
                                                        </Link>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-md-6">
                                                            <button
                                                                type="button"
                                                                className="btn btn-block "
                                                                onClick={this.handleSelectDeveloper.bind(
                                                                    this,
                                                                    application,
                                                                    true,
                                                                )}>
                                                                Accept
                                                            </button>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <button
                                                                type="button"
                                                                className="btn btn-block "
                                                                onClick={this.handleRejectApplication.bind(
                                                                    this,
                                                                    application,
                                                                )}>
                                                                Decline
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        {applications.ids.length ? null : (
                            <div className="alert alert-info text-center">
                                Developers can now apply for your {work_type}.{' '}
                                <br />
                                You will receive an email when a developer
                                applies for your {work_type}.
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }
}
