import PropTypes from 'prop-types';
import React from 'react';
import randomstring from "randomstring";
import moment from "moment/moment";

import connect from "../../connectors/ActivityConnector";

import ActivityList from "./ActivityList";
import MessageWidget from "../core/MessageWidget";
import IconButton from "../core/IconButton";
import Button from "../core/Button";
import Icon from "../core/Icon";
import GuestEmailForm from "./GuestEmailForm";

import {isAuthenticated} from "../utils/auth";
import {getLastChatAutoOpenAt} from "../utils/chat";
import {CHANNEL_TYPES} from "../../actions/utils/api";
import {openCalendlyWidget} from "../utils/calendly";

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
            hasFetched: false,
            showEmailForm: false,
            showOfflineActions: false,
            lastActivityChannel: null,
            lastActivityCount: 0,
            lastActivityAt: null,
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

        if (!isAuthenticated()) {
            if(this.state.open && !prevState.open && !this.state.channel) {
                const {ActivityActions} = this.props;
                ActivityActions.createChannel();
            }

            let selectionKey = this.state.selectionKey;

            if (
                !isAuthenticated() &&
                !_.isEqual(
                    this.props.Activity.ids[selectionKey],
                    prevProps.Activity.ids[selectionKey],
                )
            ) {
                this.evaluateOfflineOptions();
            }
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

    evaluateOfflineOptions() {
        const {Activity, ActivityActions} = this.props,
            selectionKey = this.state.selectionKey,
            {channel} = this.state;
        let activities = (Activity.ids[selectionKey] || []).map(id => {
            return Activity.activities[id];
        });

        if (activities.length && channel) {
            let hasSentEmail = channel.object_id;
            let lastActivity = activities[activities.length - 1];
            if (
                !hasSentEmail &&
                lastActivity.activity &&
                lastActivity.activity.sender &&
                lastActivity.activity.sender.inquirer
            ) {
                let lastActivityAt = lastActivity.activity.created_at;
                let minutesAgo =
                    (moment.utc() -
                        moment.utc(lastActivity.activity.created_at)) /
                    (60 * 1000);
                let offlineDelay = 5;
                if (minutesAgo > offlineDelay) {
                    this.setState({
                        showOfflineActions: true,
                        lastActivityCount: activities.length,
                        lastActivityAt,
                    });
                } else {
                    let cb = this;
                    setTimeout(function() {
                        cb.evaluateOfflineOptions();
                    }, 60 * 1000);
                }
            } else {
                this.setState({
                    showEmailForm: hasSentEmail,
                    showOfflineActions: hasSentEmail,
                    lastActivityCount: this.state.lastActivityCount || 1,
                });
            }
        }
    }

    getEmailForm() {
        const {Activity: {errors}, ActivityActions} = this.props,
            {channel} = this.state;

        const emailForm = {
            action: 'send',
            activity_type: 'message',
            activity: {
                sender: {
                    id: 'tunga',
                    username: null,
                    short_name: 'Tunga',
                    display_name: 'Tunga',
                    avatar_url: 'https://tunga.io/icons/Tunga_squarex150.png',
                    hide: true,
                },
                isForm: true,
                body: (
                    <div>
                        {channel && channel.object_id ? (
                            <div className="text-center got-it">
                                <div>We got it! Thanks</div>
                                <Icon name="check" className="icon"/>
                            </div>
                        ) : (
                            <div>
                                <div>Where can we reach you to follow up?</div>
                                <GuestEmailForm channel={channel} errors={errors.channel || null} ActivityActions={ActivityActions}/>
                            </div>
                        )}
                    </div>
                ),
            },
        };

        return emailForm;
    }

    getInitMessage() {
        return {
            action: 'send',
            activity_type: 'message',
            activity: {
                sender: {
                    id: 'tunga',
                    username: null,
                    short_name: 'Elijah',
                    display_name: 'Elijah',
                    avatar_url: require('../../assets/images/chat/elijah.jpg'),
                },
                body: 'Hi, feel free to ask me anything.',
            },
        };
    }

    getOfflineActionsActivity() {
        return {
            action: 'send',
            activity_type: 'message',
            activity: {
                sender: {
                    id: 'tunga',
                    username: null,
                    short_name: 'Tunga',
                    display_name: 'Tunga',
                    avatar_url: require('../../assets/images/logo_round.png'),
                },
                isForm: true,
                body: (
                    <div>
                        <p>Uh-oh, we are currently not online.</p>
                        <p>We will reach out to you ASAP!</p>
                        <div className="btn-group bubble-action" role="group">
                            <Button
                                type="button"
                                onClick={() => {
                                    openCalendlyWidget();
                                    window.tungaCanOpenOverlay = false;
                                }}
                                className="float-left">
                                Schedule call{' '}
                            </Button>
                            <Button
                                type="button"
                                onClick={() =>
                                    this.setState({showEmailForm: true})
                                }
                                className="float-right">
                                Contact me via email
                            </Button>
                        </div>
                    </div>
                ),
            },
        };
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

        activities = activities.reverse();

        if (channel && channel.type === CHANNEL_TYPES.support) {
            activities = [this.getInitMessage(), ...activities];
            if (
                this.state.showOfflineActions &&
                activities.length >= 2 &&
                !isAuthenticated()
            ) {
                let offlineActionInsertIdx = this.state.lastActivityCount + 1;
                activities = [
                    ...activities.slice(0, offlineActionInsertIdx),
                    this.state.showEmailForm
                        ? this.getEmailForm()
                        : this.getOfflineActionsActivity(),
                    ...activities.slice(offlineActionInsertIdx),
                ];
            }
        }

        return (
            <div className="chat-widget">
                {this.state.open?(
                    <div className="message-box">
                        <div className="chat-header">
                            <IconButton name="close" size="sm" className="chat-close" onClick={this.closeChat}/>

                            <div className="heading">Hi there, we are Tunga. How can we help?</div>
                        </div>

                        <ActivityList activities={activities}
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
