import React from 'react';
import connect from '../utils/connectors/TaskConnector';

class TaskContainer extends React.Component {
    renderChildren() {
        return React.Children.map(
            this.props.children,
            function(child) {
                return React.cloneElement(child, {
                    Task: this.props.Task,
                    Application: this.props.Application,
                    TaskActions: this.props.TaskActions,
                });
            }.bind(this),
        );
    }

    render() {
        return <div>{this.renderChildren()}</div>;
    }
}

export default connect(TaskContainer);
