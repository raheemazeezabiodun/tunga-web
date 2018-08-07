import PropTypes from 'prop-types';
import React from 'react';
import Helmet from 'react-helmet';

import BreadCrumb from '../containers/BreadCrumb';
import TaskDetail from '../components/TaskDetail';
import Progress from '../components/status/Progress';
import Success from '../components/status/Success';

import {getRouteCrumb} from '../utils/router';
import {render_excerpt} from '../utils/html';
import {
    isAdmin,
    isDeveloper,
    isProjectManager,
    getUser,
    isAuthenticated,
} from '../utils/auth';

export default class TaskDetailPage extends React.Component {
    componentDidMount() {
        this.props.TaskActions.retrieveTask(this.props.params.taskId);
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.params.taskId != prevProps.params.taskId) {
            this.props.TaskActions.retrieveTask(this.props.params.taskId);
        }

        if (
            isAuthenticated() &&
            this.props.Task.detail.isSaved &&
            !prevProps.Task.detail.isSaved &&
            this.props.Task.detail.task.id != this.props.params.taskId
        ) {
            const {router} = this.context;
            router.replace(`/work/${this.props.Task.detail.task.id}`);
        }
    }

    getApplication() {
        let id = this.getApplicationId();
        const applications = this.props.Task.detail.applications.items;
        return applications[id];
    }

    getApplicationId() {
        if (this.props.params) {
            return this.props.params.applicationId;
        }
        return null;
    }

    getCrumbSection() {
        var section = this.getEditSection();
        if (section) {
            return section;
        }
        section = this.getProvider();
        if (section) {
            return section;
        }
        return null;
    }

    getEditSection() {
        if (this.props.params) {
            return this.props.params.editSection;
        }
        return null;
    }

    getLastRoute() {
        const {routes} = this.props;
        if (routes && routes.length) {
            return routes[routes.length - 1];
        }
        return null;
    }

    getProvider() {
        if (this.props.params) {
            return this.props.params.provider;
        }
        return null;
    }

    renderChildren() {
        return React.Children.map(
            this.props.children,
            function(child) {
                return React.cloneElement(child, {
                    Task: this.props.Task,
                    task: this.props.Task.detail.task,
                    TaskActions: this.props.TaskActions,
                    location: this.props.location,
                });
            }.bind(this),
        );
    }

    render() {
        const {Task, TaskActions, params, routes} = this.props;
        const {task} = Task.detail;
        let lastRoute = this.getLastRoute();
        let meta_title = 'Tunga | ' + task.summary;
        let meta_description = render_excerpt(task.description) || task.summary;

        var crumb_parents = [];

        let application_id = this.getApplicationId();
        let application = this.getApplication();

        if (task) {
            let can_prevent_redirect =
                !task.is_task ||
                task.approved /*&& task.participation && task.participation.length*/;
            if (task.parent) {
                crumb_parents.push({
                    name: task.details.parent.summary,
                    link: `/work/${task.parent}${
                        can_prevent_redirect ? '?nr=true' : ''
                    }`,
                });
            }
            crumb_parents.push({
                name: task.summary,
                link: `/work/${task.id}${
                    can_prevent_redirect ? '?nr=true' : ''
                }`,
            });
            if (application_id) {
                crumb_parents.push({
                    name: 'Applications',
                    link: `/work/${task.id}/applications/`,
                });
            }
        }

        return Task.detail.isRetrieving ? (
            <Progress />
        ) : task.id && task.id == this.props.params.taskId ? (
            <div>
                <Helmet
                    title={meta_title}
                    meta={[
                        {name: 'twitter:title', content: meta_title},
                        {property: 'og:title', content: meta_title},
                        {name: 'description', content: meta_description},
                        {
                            name: 'twitter:description',
                            content: meta_description,
                        },
                        {property: 'og:description', content: meta_description},
                    ]}
                />

                {isDeveloper() && Task.detail.applications.isSaved ? (
                    <Success message="Application sent successfully" />
                ) : null}

                {[task.user.id, task.owner].indexOf(getUser().id) > -1 ||
                task.is_admin ||
                task.is_participant ||
                task.pm == getUser().id ||
                isAdmin() ||
                (lastRoute && lastRoute.path == 'apply' && task.can_apply) ? (
                    <div>
                        <BreadCrumb
                            section={
                                application_id
                                    ? application
                                      ? application.user.display_name
                                      : `Application #${application_id}`
                                    : getRouteCrumb(
                                          routes,
                                          this.getCrumbSection(),
                                      )
                            }
                            parents={crumb_parents}
                        />

                        {this.renderChildren()}
                    </div>
                ) : (
                    <TaskDetail
                        Task={Task}
                        TaskActions={TaskActions}
                        params={params}
                        task={task}
                    />
                )}
            </div>
        ) : (
            <div className="alert alert-danger">Task not found</div>
        );
    }
}

TaskDetailPage.contextTypes = {
    router: PropTypes.object.isRequired,
};
