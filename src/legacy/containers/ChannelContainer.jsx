import React from 'react';
import ChannelView from '../components/Channel';

export default class ChannelContainer extends React.Component {
    render() {
        const {Channel, Message, ChannelActions, MessageActions} = this.props;
        const {channelId, channelView} = this.props.params;

        return (
            <ChannelView
                channelId={channelId}
                channelView={channelView}
                Channel={Channel}
                Message={Message}
                ChannelActions={ChannelActions}
                MessageActions={MessageActions}>
                {this.props.children}
            </ChannelView>
        );
    }
}
