import PropTypes from 'prop-types';
import React from 'react';
import randomstring from "randomstring";
import moment from "moment/moment";

import connect from "../../connectors/ActivityConnector";

import ActivityList from "./ActivityList";
import MessageWidget from "../core/MessageWidget";
import IconButton from "../core/IconButton";
import {isAuthenticated} from "../utils/auth";
import {getLastChatAutoOpenAt} from "../utils/chat";
import {CHANNEL_TYPES} from "../../actions/utils/api";

class ChatWidget extends React.Component {
    static propTypes = {
        channelId: PropTypes.number,
        Activity: PropTypes.object,
        ProjectActions: PropTypes.object,
        ActivityActions: PropTypes.object,
    };

    updateTimer = null;

    constructor(props) {
        super(props);
        this.state = {
            selectionKey: props.selectionKey || randomstring.generate(),
            prevKey: null,
            open: false,
            channel: null,
            hasAutoOpenedChat: false,
            new: 0,
            hasFetched: false
        };
    }

    UNSAFE_componentWillMount() {
        this.intervals = [];

        let channel = null,
            open = false;

        if (this.props.channelId) {
            channel = {id: this.props.channelId};
            open = true;
        } else if (!isAuthenticated() && typeof Storage !== 'undefined') {
            try {
                channel = JSON.parse(window.localStorage.channel);
            } catch (e) {
                channel = null;
            }
        }

        if (!isAuthenticated()) {
            let lastChatAutoOpenAt = moment.utc(getLastChatAutoOpenAt() || 'invalid'),
                endOfLastMonth = moment.utc().subtract(1, 'month').endOf('month'),
                twoWeeksAgo = moment.utc().subtract(2, 'week');

            let canOpenChat = (!lastChatAutoOpenAt.isValid()) || (lastChatAutoOpenAt.isValid() && lastChatAutoOpenAt < endOfLastMonth && lastChatAutoOpenAt < twoWeeksAgo);

            const {autoOpen} = this.props;
            if (autoOpen && canOpenChat && !this.state.hasAutoOpenedChat) {
                let cw = this;
                setTimeout(function() {
                    cw.setState({open: true, hasAutoOpenedChat: true});
                }, __PRODUCTION__ ? 10 * 1000 : 3 * 1000);
            }
        }
        this.setState({channel, open});
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.Activity.channel.id) {
            let currentChannel = this.getCurrentChannel();
            const {channel} = nextProps.Activity;

            if (
                nextProps.Activity.channel.type === CHANNEL_TYPES.support &&
                (nextProps.Activity.channel.id && (!currentChannel || nextProps.Activity.channel.id === currentChannel.id))
            ) {
                this.setState({channel});
                this.saveChannel(channel);
            }
        }

        if (nextProps.Activity.channel.new !== this.state.new) {
            this.setState({new: nextProps.Activity.channel.new});
        }
    }

    componentDidMount() {
        this.getList();

        this.updateTimer = setInterval(this.getNewActivity.bind(this), 5000);
    }

    componentDidUpdate(prevProps, prevState, snapShot) {
        if(!_.isEqual(prevProps.filters, this.props.filters) || (!_.isEqual(this.state.channel, prevState.channel) && !this.state.hasFetched)) {
            this.getList();
        }

        if (!isAuthenticated() && this.state.open && !prevState.open && !this.state.channel) {
            const {ActivityActions} = this.props;
            ActivityActions.createChannel();
        }

        if (this.props.closeChat && !prevProps.closeChat && this.state.open) {
            this.setState({open: false});
        }

        if (this.state.open && !prevState.open && this.audio) {
            this.audio.play();
        }
    }

    componentWillUnmount() {
        this.saveChannel(this.getCurrentChannel());
        clearInterval(this.updateTimer);
    }

    getCurrentChannel() {
        return typeof this.state.channel === 'object'
            ? this.state.channel
            : null;
    }


    getList(filters={}) {
        const {ActivityActions} = this.props,
            {channel} = this.state;

        if(channel && channel.id) {
            ActivityActions.listActivities(
                {...(this.props.filters || {}), ...(filters || {}), channel: channel.id},
                this.state.selectionKey, this.state.prevKey
            );
            this.setState({hasFetched: true});
        }
    }

    getNewActivity() {
        const {Activity} = this.props,
            selectionKey = this.state.selectionKey;

        if (!Activity.isFetching[selectionKey]) {
            let since = 0,
                activityIds = [];

            (Activity.ids[selectionKey] || []).forEach(id => {
                if(typeof id === 'number') {
                    activityIds.push(id);
                }
            });

            if (activityIds.length) {
                since = activityIds[0];
            }

            if(since) {
                this.getList({since});
            }
        }
    }

    onSendMessage = (message) => {
        const {ActivityActions} = this.props,
            {channel} = this.state;
        if(channel && channel.id) {
            ActivityActions.createMessage({
                channel: channel.id,
                body: message
            }, this.state.selectionKey);
        }
    };

    closeChat = () => {
        this.setState({open: false});
    };

    startChat = () =>{
        const {ActivityActions} = this.props;
        if (isAuthenticated() && !this.state.channel) {
            ActivityActions.createChannel();
        }
        this.setState({open: true});
    };

    saveChannel(channel) {
        if (
            !isAuthenticated() &&
            typeof Storage !== 'undefined' &&
            channel && !channel.created_by
        ) {
            try {
                window.localStorage.channel = JSON.stringify(channel);
            } catch (e) {
                window.localStorage.channel = null;
            }
        }
    }

    render() {
        const {Activity, ActivityActions} = this.props,
            selectionKey = this.state.selectionKey,
            {channel} = this.state;
        let activities = (Activity.ids[selectionKey] || []).map(id => {
            return Activity.activities[id];
        });

        return (
            <div className="chat-widget">
                {this.state.open?(
                    <div className="message-box">
                        <div className="chat-header">
                            <IconButton name="close" size="sm" className="chat-close" onClick={this.closeChat}/>

                            <div className="heading">Hi there, we are Tunga. How can we help?</div>
                        </div>

                        <ActivityList activities={activities.reverse()}
                                      onLoadMore={() => {
                                          ActivityActions.listMoreActivities(Activity.next[selectionKey], selectionKey);
                                      }}
                                      isLoading={Activity.isFetching[selectionKey]}
                                      isLoadingMore={Activity.isFetchingMore[selectionKey]}
                                      hasMore={!!Activity.next[selectionKey]}
                                      contentSelector=".chat-widget"
                                      heightOffset={160}/>

                        {channel && channel.id?(
                            <MessageWidget onSendMessage={this.onSendMessage} canUpload={false}/>
                        ):null}
                    </div>
                ):null}

                <div className="controls text-right">
                    <IconButton name={this.state.open?'close':'chat'}
                                className="chat-btn"
                                onClick={this.state.open?this.closeChat:this.startChat}/>

                    {this.state.new && !this.state.open ? (
                        <span className="badge">
                                        {this.state.new}
                                    </span>
                    ) : null}

                    <audio
                        autoPlay={false}
                        controls={false}
                        ref={audio => {
                            this.audio = audio;
                        }}>
                        <source
                            src={require('../../assets/audio/chat.mp3')}
                            type="audio/mpeg"
                        />
                        <source
                            src={require('../../assets/audio/chat.wav')}
                            type="audio/wav"
                        />
                    </audio>
                </div>
            </div>
        );
    }
}

export default connect(ChatWidget);
