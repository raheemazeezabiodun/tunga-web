import PropTypes from 'prop-types';
import React from 'react';

import TaskForm from './TaskForm';

export default class ProjectTaskForm extends React.Component {
    render() {
        const {task} = this.props;
        var new_props = {...this.props};
        new_props.task = null;
        return <TaskForm project={task} {...new_props} />;
    }
}

ProjectTaskForm.propTypes = {
    task: PropTypes.object.isRequired,
};
