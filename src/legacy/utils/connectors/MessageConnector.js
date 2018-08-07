import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as MessageActions from '../../actions/MessageActions';

function mapStateToProps(state) {
    return {Auth: state.Auth, Message: state.Message};
}

function mapDispatchToProps(dispatch) {
    return {
        MessageActions: bindActionCreators(MessageActions, dispatch),
    };
}

export default function connectToMessages(component) {
    return connect(mapStateToProps, mapDispatchToProps)(component);
}
