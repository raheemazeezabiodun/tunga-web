import {bindActionCreators} from "redux";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";

import * as UtilityActions from "../actions/UtilityActions";

function mapStateToProps(state) {
    return {
        Utility: state.Utility
    };
}

function mapDispatchToProps(dispatch) {
    return {
        UtilityActions: bindActionCreators(UtilityActions, dispatch),
    };
}

export default function connectToStore(component) {
    return withRouter(connect(mapStateToProps, mapDispatchToProps)(component))
};
