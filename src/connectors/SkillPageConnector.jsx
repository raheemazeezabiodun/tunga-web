import {bindActionCreators} from "redux";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";

import * as SkillPageActions from "../actions/SkillPageActions";

function mapStateToProps(state) {
    return {
        SkillPage: state.SkillPage
    };
}

function mapDispatchToProps(dispatch) {
    return {
        SkillPageActions: bindActionCreators(SkillPageActions, dispatch),
    };
}

export default function connectToStore(component) {
    return withRouter(connect(mapStateToProps, mapDispatchToProps)(component))
};
