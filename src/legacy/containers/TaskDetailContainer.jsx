import PropTypes from 'prop-types';
import React from 'react';

import Progress from '../components/status/Progress';

export default class TaskDetailContainer extends React.Component {
    componentDidMount() {
        const {taskId, editToken} = this.props;
        this.props.TaskActions.retrieveTask(taskId, editToken);
    }

    componentDidUpdate(prevProps, prevState) {
        const {taskId, editToken} = this.props;
        if (taskId != prevProps.taskId) {
            this.props.TaskActions.retrieveTask(taskId, editToken);
        }
    }

    renderChildren() {
        return React.Children.map(
            this.props.children,
            function(child) {
                return React.cloneElement(child, {
                    Task: this.props.Task,
                    task: this.props.Task.detail.task,
                    taskId: this.props.taskId,
                    editToken:
                        this.props.editToken ==
                        this.props.Task.detail.task.edit_token
                            ? this.props.editToken
                            : '',
                    analyticsId: this.props.Task.detail.task.analytics_id,
                    TaskActions: this.props.TaskActions,
                    location: this.props.location,
                });
            }.bind(this),
        );
    }

    render() {
        return <div>{this.renderChildren()}</div>;
    }
}

TaskDetailContainer.contextTypes = {
    router: PropTypes.object.isRequired,
};
