import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as AuthActions from '../../actions/AuthActions';

function mapStateToProps(state) {
    return {Auth: state.Auth};
}

function mapDispatchToProps(dispatch) {
    return {
        AuthActions: bindActionCreators(AuthActions, dispatch),
    };
}

export default function connectToAuth(component) {
    return connect(mapStateToProps, mapDispatchToProps)(component);
}
