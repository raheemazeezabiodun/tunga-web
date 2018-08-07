import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as ChannelActions from '../../actions/ChannelActions';
import * as MessageActions from '../../actions/MessageActions';

function mapStateToProps(state) {
    return {Auth: state.Auth, Channel: state.Channel, Message: state.Message};
}

function mapDispatchToProps(dispatch) {
    return {
        ChannelActions: bindActionCreators(ChannelActions, dispatch),
        MessageActions: bindActionCreators(MessageActions, dispatch),
    };
}

export default function connectToChannels(component) {
    return connect(mapStateToProps, mapDispatchToProps)(component);
}
