import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as ProjectActions from '../../actions/ProjectActions';
import * as TaskActions from '../../actions/TaskActions';

function mapStateToProps(state) {
    return {Auth: state.Auth, Project: state.Project, Task: state.Task};
}

function mapDispatchToProps(dispatch) {
    return {
        ProjectActions: bindActionCreators(ProjectActions, dispatch),
        TaskActions: bindActionCreators(TaskActions, dispatch),
    };
}

export default function connectToProjects(component) {
    return connect(mapStateToProps, mapDispatchToProps)(component);
}
