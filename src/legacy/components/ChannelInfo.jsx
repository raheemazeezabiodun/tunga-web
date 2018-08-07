import React from 'react';
import {Link} from 'react-router';

import {CHANNEL_TYPES} from '../constants/Api';

export default class ChannelInfo extends React.Component {
    render() {
        const {channel} = this.props;

        return (
            <div>
                {channel.user &&
                [CHANNEL_TYPES.direct, CHANNEL_TYPES.topic].indexOf(
                    channel.type,
                ) > -1 ? (
                    <div>
                        <div className="title">{channel.user.display_name}</div>
                        <div>{channel.subject || channel.alt_subject} </div>
                    </div>
                ) : (
                    <div>
                        <div className="title">
                            {channel.subject || channel.alt_subject}{' '}
                        </div>
                    </div>
                )}
                {channel.type == CHANNEL_TYPES.topic && !channel.user ? (
                    <div>{`${channel.participants.length} people`}</div>
                ) : null}
            </div>
        );
    }
}
