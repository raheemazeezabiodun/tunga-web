import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as SkillPageActions from '../../actions/SkillPageActions';

function mapStateToProps(state) {
    return {Auth: state.Auth, SkillPage: state.SkillPage};
}

function mapDispatchToProps(dispatch) {
    return {
        SkillPageActions: bindActionCreators(SkillPageActions, dispatch),
    };
}

export default function connectToSkillPages(component) {
    return connect(mapStateToProps, mapDispatchToProps)(component);
}
