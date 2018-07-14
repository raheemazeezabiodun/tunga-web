import {bindActionCreators} from "redux";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";

import * as ActivityActions from "../actions/ActivityActions";
import * as CommentActions from "../actions/CommentActions";

function mapStateToProps(state) {
    return {
        Activity: state.Activity
    };
}

function mapDispatchToProps(dispatch) {
    return {
        ActivityActions: {
            ...bindActionCreators(ActivityActions, dispatch),
            ...bindActionCreators(CommentActions, dispatch),
        }
    };
}

export default function connectToStore(component) {
    return withRouter(connect(mapStateToProps, mapDispatchToProps)(component))
};
