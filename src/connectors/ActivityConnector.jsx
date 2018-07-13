import {bindActionCreators} from "redux";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";

import * as ActivityActions from "../actions/ActivityActions";

function mapStateToProps(state) {
    return {
        Activity: state.Activity
    };
}

function mapDispatchToProps(dispatch) {
    return {
        ActivityActions: bindActionCreators(ActivityActions, dispatch),
    };
}

export default function connectToStore(component) {
    return withRouter(connect(mapStateToProps, mapDispatchToProps)(component))
};
