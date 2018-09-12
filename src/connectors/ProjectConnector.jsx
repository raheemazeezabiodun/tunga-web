import {bindActionCreators} from "redux";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";

import * as ProjectActions from "../actions/ProjectActions";
import * as ParticipationActions from "../actions/ParticipationActions";
import * as DocumentActions from "../actions/DocumentActions";
import * as ProgressEventActions from "../actions/ProgressEventActions";
import * as InterestActions from '../actions/InterestPollActions';

function mapStateToProps(state) {
    return {
        Project: state.Project
    };
}

function mapDispatchToProps(dispatch) {
    return {
        ProjectActions: {
            ...bindActionCreators(ProjectActions, dispatch),
            ...bindActionCreators(ParticipationActions, dispatch),
            ...bindActionCreators(DocumentActions, dispatch),
            ...bindActionCreators(ProgressEventActions, dispatch),
            ...bindActionCreators(InterestActions, dispatch)
        },
    };
}

export default function connectToStore(component) {
    return withRouter(connect(mapStateToProps, mapDispatchToProps)(component))
};
