import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as UserActions from '../../actions/UserActions';
import * as ConnectionActions from '../../actions/ConnectionActions';

function mapStateToProps(state) {
    return {Auth: state.Auth, User: state.User};
}

function mapDispatchToProps(dispatch) {
    return {
        UserActions: {
            ...bindActionCreators(UserActions, dispatch),
            ...bindActionCreators(ConnectionActions, dispatch),
        },
    };
}

export default function connectToUsers(component) {
    return connect(mapStateToProps, mapDispatchToProps)(component);
}
