import React from 'react';
import {Link} from 'react-router';
import Progress from './status/Progress';
import Avatar from './Avatar';
import SearchBox from './SearchBox';
import ChannelInfo from './ChannelInfo';

import {CHANNEL_TYPES} from '../constants/Api';
import {getChannelKey} from '../utils/reducers';

import {isAuthenticated, isAdmin, isDeveloper} from '../utils/auth';

export default class Channel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {filters: null};
    }

    componentDidMount() {
        const {channelId, ChannelActions} = this.props;

        if (channelId) {
            ChannelActions.retrieveChannel(channelId);
            ChannelActions.listChannelActivity(channelId);

            this.setInterval(this.getNewMessages.bind(this), 10000);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (
            this.props.channelId != prevProps.channelId &&
            this.props.channelId
        ) {
            const {ChannelActions} = this.props;
            ChannelActions.retrieveChannel(this.props.channelId);
            ChannelActions.listChannelActivity(this.props.channelId);
        }
    }

    componentWillUnmount() {
        this.intervals.map(clearInterval);
    }

    onSearch(filters) {
        this.setState({filters});
        const {Channel, ChannelActions} = this.props;
        const {channel} = Channel.detail;
        ChannelActions.listChannelActivity(channel.id, filters);
    }

    onSendMessage(body, attachments) {
        const {MessageActions, Channel, ChannelActions} = this.props;
        const {channel} = Channel.detail;
        MessageActions.createMessage({channel: channel.id, body}, attachments);
    }

    onUpload(files) {
        const {Channel, ChannelActions} = this.props;
        const {channel} = Channel.detail;
        ChannelActions.updateChannel(channel.id, null, files);
    }

    getCurrentChannel() {
        const {channelId, Channel} = this.props;
        const {channels} = Channel.list;
        return channels[channelId] || {};
    }

    getNewMessages() {
        const {
            channelId,
            Channel,
            ChannelActions,
            search,
            filters,
        } = this.props;
        let channel_key = getChannelKey(channelId);
        if (channelId && !Channel.detail.activity.isFetching[channel_key]) {
            var since = 0;
            const channel_activity_items =
                Channel.detail.activity.items[channel_key];
            if (channel_activity_items && channel_activity_items.length) {
                since =
                    channel_activity_items[channel_activity_items.length - 1]
                        .id;
                if (since === undefined || since === null) {
                    [...channel_activity_items].reverse().some(item => {
                        if (item.id) {
                            since = item.id;
                        }
                        return item.id;
                    });
                }
            }
            ChannelActions.listChannelActivity(channelId, {
                since,
                ...filters,
                search,
                ...this.state.filters,
            });
        }
    }

    getView() {
        if (this.props.channelView) {
            return this.props.channelView;
        }
        return null;
    }

    setInterval() {
        this.intervals.push(setInterval.apply(null, arguments));
    }

    UNSAFE_componentWillMount() {
        this.intervals = [];
    }

    renderChildren() {
        return React.Children.map(
            this.props.children,
            function(child) {
                return React.cloneElement(child, {
                    Channel: this.props.Channel,
                    Message: this.props.Message,
                    channel: this.getCurrentChannel(),
                    channelView: this.props.channelView,
                    ChannelActions: this.props.ChannelActions,
                    MessageActions: this.props.MessageActions,
                });
            }.bind(this),
        );
    }

    render() {
        const {channelId, Channel} = this.props;
        let channel = this.getCurrentChannel();
        let channel_key = getChannelKey(channelId);

        return Channel.detail.isRetrieving[channel_key] ? (
            <Progress />
        ) : channel.id ? (
            <div className="chatbox">
                <div
                    className={`chatbox-top clearfix ${
                        channel.type == CHANNEL_TYPES.support ? 'support' : ''
                    }`}>
                    {channel.type == CHANNEL_TYPES.support ? (
                        <div>
                            Hi there, we are Tunga. How can we help?
                            <div className="avatars">
                                <Avatar
                                    size="medium"
                                    src={require('../images/chat/bart.jpg')}
                                />
                                <Avatar
                                    size="medium"
                                    src={require('../images/chat/domieck.jpg')}
                                />
                                <Avatar
                                    size="medium"
                                    src={require('../images/chat/elijah.jpg')}
                                />
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div
                                className={`chat-actions ${
                                    !isAuthenticated() ||
                                    (channel.type == CHANNEL_TYPES.support &&
                                        !isAdmin())
                                        ? ''
                                        : 'pull-right'
                                }`}>
                                {channel.type ==
                                CHANNEL_TYPES.support ? null : (
                                    <div
                                        className="btn-group btn-choices select pull-right"
                                        role="group">
                                        {isDeveloper() &&
                                        channel.type ==
                                            CHANNEL_TYPES.developer ? null : (
                                            <div
                                                className="dropdown"
                                                style={{
                                                    display: 'inline-block',
                                                }}>
                                                <button
                                                    className="btn btn-borderless dropdown-toggle"
                                                    type="button"
                                                    id="chat-overflow"
                                                    data-toggle="dropdown"
                                                    aria-haspopup="true"
                                                    aria-expanded="true">
                                                    <i className="fa fa-ellipsis-v" />
                                                </button>
                                                <ul
                                                    className="dropdown-menu dropdown-menu-right"
                                                    aria-labelledby="chat-overflow">
                                                    <li>
                                                        <Link
                                                            id="edit-channel"
                                                            to={`/conversation/${
                                                                channel.id
                                                            }/edit`}>
                                                            <i className="fa fa-pencil-square-o" />{' '}
                                                            Edit
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link
                                                            id="channel-people"
                                                            to={`/conversation/${
                                                                channel.id
                                                            }/people`}>
                                                            <i className="glyphicon glyphicon-user" />{' '}
                                                            People
                                                        </Link>
                                                    </li>
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                )}
                                {['messages', null].indexOf(
                                    this.getView() > -1,
                                ) ? (
                                    <div className="pull-right">
                                        <SearchBox
                                            placeholder="Search messages"
                                            onSearch={this.onSearch.bind(this)}
                                            count={
                                                Channel.detail.activity.count[
                                                    channel_key
                                                ] || 0
                                            }
                                            custom_class="search-box-group-custom"
                                        />
                                    </div>
                                ) : null}
                            </div>
                            {isAuthenticated() &&
                            channel.type != CHANNEL_TYPES.support ? (
                                <div className="media">
                                    <div className="media-left">
                                        {channel.user ? (
                                            <Avatar
                                                src={channel.user.avatar_url}
                                            />
                                        ) : null}
                                    </div>
                                    <div className="media-body">
                                        <ChannelInfo channel={channel} />
                                    </div>
                                </div>
                            ) : null}
                            <div className="clearfix" />
                        </div>
                    )}
                </div>
                {channel.id ? this.renderChildren() : null}
            </div>
        ) : null;
    }
}
