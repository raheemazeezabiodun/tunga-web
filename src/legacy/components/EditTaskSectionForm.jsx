import React from 'react';

import TaskForm from './TaskForm';

export default class EditTaskSectionForm extends React.Component {
    render() {
        var new_props = {...this.props};

        if (this.props.params && this.props.params.editSection) {
            let editSection = this.props.params.editSection;
            new_props.enabledWidgets = [this.props.params.editSection];
        }

        return <TaskForm {...new_props} />;
    }
}
