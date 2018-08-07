import {combineReducers} from 'redux';
import * as ChannelActions from '../actions/ChannelActions';
import * as MessageActions from '../actions/MessageActions';
import {PATH_CHANGE} from '../actions/NavActions';
import {GET_NOTIFICATIONS_SUCCESS} from '../actions/NotificationActions';
import {
    LOGIN_SUCCESS,
    LOGOUT_SUCCESS,
    VERIFY_SUCCESS,
} from '../actions/AuthActions';

import Activity from './ActivityReducers';

function channel(state = {}, action) {
    switch (action.type) {
        case ChannelActions.CREATE_CHANNEL_SUCCESS:
        case ChannelActions.RETRIEVE_CHANNEL_SUCCESS:
        case ChannelActions.UPDATE_CHANNEL_SUCCESS:
        case ChannelActions.RETRIEVE_DIRECT_CHANNEL_SUCCESS:
        case ChannelActions.CREATE_SUPPORT_CHANNEL_SUCCESS:
        case ChannelActions.CREATE_DEVELOPER_CHANNEL_SUCCESS:
        case ChannelActions.CREATE_TASK_CHANNEL_SUCCESS:
        case ChannelActions.UPDATE_CHANNEL_READ_SUCCESS:
            return action.channel;
        case ChannelActions.DELETE_CHANNEL_SUCCESS:
        case ChannelActions.CREATE_CHANNEL_START:
        case ChannelActions.CREATE_CHANNEL_FAILED:
        case ChannelActions.RETRIEVE_CHANNEL_START:
        case ChannelActions.RETRIEVE_CHANNEL_FAILED:
        case ChannelActions.CREATE_SUPPORT_CHANNEL_START:
        case ChannelActions.CREATE_SUPPORT_CHANNEL_FAILED:
        case ChannelActions.CREATE_DEVELOPER_CHANNEL_START:
        case ChannelActions.CREATE_DEVELOPER_CHANNEL_FAILED:
        case ChannelActions.CREATE_TASK_CHANNEL_START:
        case ChannelActions.CREATE_TASK_CHANNEL_FAILED:
        case LOGIN_SUCCESS:
        case LOGOUT_SUCCESS:
        case VERIFY_SUCCESS:
            return {};
        case MessageActions.LIST_MESSAGES_SUCCESS:
            if (action.filter && action.filter.channel == state.id) {
                return {...state, new: 0};
            }
            return state;
        default:
            return state;
    }
}

function channels(state = {}, action) {
    switch (action.type) {
        case ChannelActions.LIST_CHANNELS_SUCCESS:
        case ChannelActions.LIST_MORE_CHANNELS_SUCCESS:
            var all_channels = {};
            action.items.forEach(channel => {
                all_channels[channel.id] = channel;
            });
            return {...state, ...all_channels};
        case ChannelActions.LIST_CHANNELS_START:
        case ChannelActions.LIST_CHANNELS_FAILED:
            return {};
        case ChannelActions.CREATE_CHANNEL_SUCCESS:
        case ChannelActions.RETRIEVE_CHANNEL_SUCCESS:
        case ChannelActions.UPDATE_CHANNEL_READ_SUCCESS:
        case ChannelActions.RETRIEVE_DIRECT_CHANNEL_SUCCESS:
        case ChannelActions.CREATE_SUPPORT_CHANNEL_SUCCESS:
        case ChannelActions.CREATE_DEVELOPER_CHANNEL_SUCCESS:
        case ChannelActions.CREATE_TASK_CHANNEL_SUCCESS:
            var new_channel = {};
            var channel_id = action.channel.id;
            new_channel[action.channel.id] = {
                ...action.channel,
                previous_last_read:
                    action.type == ChannelActions.UPDATE_CHANNEL_READ_SUCCESS
                        ? state[channel_id].last_read
                        : action.channel.last_read,
            };
            return {...state, ...new_channel};
        case ChannelActions.DELETE_CHANNEL_SUCCESS:
            var new_state = {...state};
            delete new_state[action.id];
            return new_state;
        case MessageActions.CREATE_MESSAGE_SUCCESS:
            new_state = {...state};
            channel_id = action.message.channel;
            if (state[channel_id]) {
                new_state[channel_id] = {
                    ...new_state[channel_id],
                    attachments: [
                        ...action.message.attachments,
                        ...state[channel_id].attachments,
                    ],
                    previous_last_read: state[channel_id].last_read,
                };
                new_state = {...state};
                return new_state;
            }
            return state;
        case GET_NOTIFICATIONS_SUCCESS:
            if (action.notifications && action.notifications.channels) {
                all_channels = {};
                action.notifications.channels.forEach(channel => {
                    all_channels[channel.id] = {
                        ...state[channel.id],
                        new: channel.new,
                    };
                });
                return {...state, ...all_channels};
            }
            return state;
        default:
            return state;
    }
}

function ids(state = [], action) {
    switch (action.type) {
        case ChannelActions.LIST_CHANNELS_SUCCESS:
            return action.items.map(channel => {
                return channel.id;
            });
        case ChannelActions.LIST_MORE_CHANNELS_SUCCESS:
            var new_channels = action.items.map(channel => {
                return channel.id;
            });
            return [...state, ...new_channels];
        case ChannelActions.LIST_CHANNELS_START:
        case ChannelActions.LIST_CHANNELS_FAILED:
            return [];
        case ChannelActions.CREATE_CHANNEL_SUCCESS:
        case ChannelActions.CREATE_SUPPORT_CHANNEL_SUCCESS:
        case ChannelActions.CREATE_DEVELOPER_CHANNEL_SUCCESS:
        case ChannelActions.CREATE_TASK_CHANNEL_SUCCESS:
            if (state.indexOf(action.channel.id) == -1) {
                return [action.channel.id, ...state];
            }
            return state;
        default:
            return state;
    }
}

function next(state = null, action) {
    switch (action.type) {
        case ChannelActions.LIST_CHANNELS_SUCCESS:
        case ChannelActions.LIST_MORE_CHANNELS_SUCCESS:
            return action.next;
        default:
            return state;
    }
}

function previous(state = null, action) {
    switch (action.type) {
        case ChannelActions.LIST_CHANNELS_SUCCESS:
        case ChannelActions.LIST_MORE_CHANNELS_SUCCESS:
            return action.previous;
        default:
            return state;
    }
}

function count(state = null, action) {
    switch (action.type) {
        case ChannelActions.LIST_CHANNELS_SUCCESS:
            return action.count;
        case ChannelActions.LIST_CHANNELS_START:
        case ChannelActions.LIST_CHANNELS_FAILED:
            return 0;
        default:
            return state;
    }
}

function isSaving(state = false, action) {
    switch (action.type) {
        case ChannelActions.CREATE_CHANNEL_START:
        case ChannelActions.UPDATE_CHANNEL_START:
        case ChannelActions.CREATE_SUPPORT_CHANNEL_START:
        case ChannelActions.CREATE_DEVELOPER_CHANNEL_START:
        case ChannelActions.CREATE_TASK_CHANNEL_START:
            return true;
        case ChannelActions.CREATE_CHANNEL_SUCCESS:
        case ChannelActions.CREATE_CHANNEL_FAILED:
        case ChannelActions.UPDATE_CHANNEL_SUCCESS:
        case ChannelActions.UPDATE_CHANNEL_FAILED:
        case ChannelActions.CREATE_SUPPORT_CHANNEL_SUCCESS:
        case ChannelActions.CREATE_SUPPORT_CHANNEL_FAILED:
        case ChannelActions.CREATE_DEVELOPER_CHANNEL_SUCCESS:
        case ChannelActions.CREATE_DEVELOPER_CHANNEL_FAILED:
        case ChannelActions.CREATE_TASK_CHANNEL_SUCCESS:
        case ChannelActions.CREATE_TASK_CHANNEL_FAILED:
            return false;
        default:
            return state;
    }
}

function isSaved(state = false, action) {
    switch (action.type) {
        case ChannelActions.CREATE_CHANNEL_SUCCESS:
        case ChannelActions.UPDATE_CHANNEL_SUCCESS:
        case ChannelActions.CREATE_SUPPORT_CHANNEL_SUCCESS:
        case ChannelActions.CREATE_DEVELOPER_CHANNEL_SUCCESS:
        case ChannelActions.CREATE_TASK_CHANNEL_SUCCESS:
            return true;
        case ChannelActions.CREATE_CHANNEL_START:
        case ChannelActions.CREATE_CHANNEL_FAILED:
        case ChannelActions.UPDATE_CHANNEL_START:
        case ChannelActions.UPDATE_CHANNEL_FAILED:
        case ChannelActions.CREATE_SUPPORT_CHANNEL_START:
        case ChannelActions.CREATE_SUPPORT_CHANNEL_FAILED:
        case ChannelActions.CREATE_DEVELOPER_CHANNEL_START:
        case ChannelActions.CREATE_DEVELOPER_CHANNEL_FAILED:
        case ChannelActions.CREATE_TASK_CHANNEL_START:
        case ChannelActions.CREATE_TASK_CHANNEL_FAILED:
        case PATH_CHANGE:
            return false;
        default:
            return state;
    }
}

function isFetching(state = false, action) {
    switch (action.type) {
        case ChannelActions.LIST_CHANNELS_START:
            return true;
        case ChannelActions.LIST_CHANNELS_SUCCESS:
        case ChannelActions.LIST_CHANNELS_FAILED:
            return false;
        default:
            return state;
    }
}

function isFetchingMore(state = false, action) {
    switch (action.type) {
        case ChannelActions.LIST_MORE_CHANNELS_START:
            return true;
        case ChannelActions.LIST_MORE_CHANNELS_SUCCESS:
        case ChannelActions.LIST_MORE_CHANNELS_FAILED:
            return false;
        default:
            return state;
    }
}

function isRetrieving(state = false, action) {
    switch (action.type) {
        case ChannelActions.RETRIEVE_CHANNEL_START:
        case ChannelActions.RETRIEVE_DIRECT_CHANNEL_START:
            return true;
        case ChannelActions.RETRIEVE_CHANNEL_SUCCESS:
        case ChannelActions.RETRIEVE_CHANNEL_FAILED:
        case ChannelActions.RETRIEVE_DIRECT_CHANNEL_SUCCESS:
        case ChannelActions.RETRIEVE_DIRECT_CHANNEL_FAILED:
            return false;
        default:
            return state;
    }
}

function isDeleting(state = false, action) {
    switch (action.type) {
        case ChannelActions.DELETE_CHANNEL_START:
            return true;
        case ChannelActions.DELETE_CHANNEL_SUCCESS:
        case ChannelActions.DELETE_CHANNEL_FAILED:
            return false;
        default:
            return false;
    }
}

function error(state = {}, action) {
    switch (action.type) {
        case ChannelActions.CREATE_CHANNEL_FAILED:
        case ChannelActions.CREATE_SUPPORT_CHANNEL_FAILED:
        case ChannelActions.CREATE_DEVELOPER_CHANNEL_FAILED:
        case ChannelActions.CREATE_TASK_CHANNEL_FAILED:
            return {...state, create: action.error};
        case ChannelActions.CREATE_CHANNEL_START:
        case ChannelActions.CREATE_CHANNEL_SUCCESS:
        case ChannelActions.CREATE_SUPPORT_CHANNEL_START:
        case ChannelActions.CREATE_SUPPORT_CHANNEL_SUCCESS:
        case ChannelActions.CREATE_DEVELOPER_CHANNEL_START:
        case ChannelActions.CREATE_DEVELOPER_CHANNEL_SUCCESS:
        case ChannelActions.CREATE_TASK_CHANNEL_START:
        case ChannelActions.CREATE_TASK_CHANNEL_SUCCESS:
            return {...state, create: null};
        default:
            return state;
    }
}

function support(state = {new: 0}, action) {
    switch (action.type) {
        case ChannelActions.LIST_NEW_CHANNEL_ACTIVITY_SUCCESS:
            if (action.update_new) {
                return {...state, new: action.count};
            }
            return state;
        default:
            return state;
    }
}

function hasAutoOpenedChat(state = false, action) {
    switch (action.type) {
        case ChannelActions.AUTO_OPEN_CHAT_SUCCESS:
            return true;
        case VERIFY_SUCCESS:
        case LOGIN_SUCCESS:
        case LOGOUT_SUCCESS:
            return false;
        default:
            return state;
    }
}

function chatStarted(state = false, action) {
    switch (action.type) {
        case ChannelActions.CHAT_START:
            return true;
        case VERIFY_SUCCESS:
        case LOGIN_SUCCESS:
        case LOGOUT_SUCCESS:
            return false;
        default:
            return state;
    }
}

const detail = combineReducers({
    channel,
    isRetrieving,
    isSaving,
    isSaved,
    isDeleting,
    activity: Activity,
    error,
    support,
});

const list = combineReducers({
    ids,
    channels,
    isFetching,
    isFetchingMore,
    next,
    previous,
    count,
});

const Channel = combineReducers({
    detail,
    list,
    hasAutoOpenedChat,
    chatStarted,
});

export default Channel;
