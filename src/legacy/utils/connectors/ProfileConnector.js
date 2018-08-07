import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as ProfileActions from '../../actions/ProfileActions';

function mapStateToProps(state) {
    return {
        Auth: state.Auth,
        Profile: state.Profile,
        SkillSelection: state.SkillSelection,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        ProfileActions: bindActionCreators(ProfileActions, dispatch),
    };
}

export default function connectToAuth(component) {
    return connect(mapStateToProps, mapDispatchToProps)(component);
}
