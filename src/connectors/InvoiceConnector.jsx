import {bindActionCreators} from "redux";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";

import * as ProgressEventActions from "../actions/ProgressEventActions";
import * as ProgressReportActions from "../actions/ProgressReportActions";

function mapStateToProps(state) {
    return {
        ProgressEvent: state.ProgressEvent
    };
}

function mapDispatchToProps(dispatch) {
    return {
        ProgressEventActions: {
            ...bindActionCreators(ProgressEventActions, dispatch),
            ...bindActionCreators(ProgressReportActions, dispatch),
        }
    };
}

export default function connectToStore(component) {
    return withRouter(connect(mapStateToProps, mapDispatchToProps)(component))
};
