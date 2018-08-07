import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as NotificationActions from '../../actions/NotificationActions';

function mapStateToProps(state) {
    return {Auth: state.Auth, Notification: state.Notification};
}

function mapDispatchToProps(dispatch) {
    return {
        NotificationActions: bindActionCreators(NotificationActions, dispatch),
    };
}

export default function connectToNotifications(component) {
    return connect(mapStateToProps, mapDispatchToProps)(component);
}
