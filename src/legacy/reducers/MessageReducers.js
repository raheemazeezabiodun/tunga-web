import {combineReducers} from 'redux';
import * as MessageActions from '../actions/MessageActions';
import * as ChannelActions from '../actions/ChannelActions';
import {PATH_CHANGE} from '../actions/NavActions';

function message(state = {}, action) {
    switch (action.type) {
        case MessageActions.CREATE_MESSAGE_SUCCESS:
        case MessageActions.RETRIEVE_MESSAGE_SUCCESS:
        case MessageActions.UPDATE_MESSAGE_SUCCESS:
            return action.message;
        case MessageActions.DELETE_MESSAGE_SUCCESS:
        case MessageActions.CREATE_MESSAGE_START:
        case MessageActions.CREATE_MESSAGE_FAILED:
        case MessageActions.RETRIEVE_MESSAGE_START:
        case MessageActions.RETRIEVE_MESSAGE_FAILED:
            return {};
        default:
            return state;
    }
}

function messages(state = [], action) {
    switch (action.type) {
        case MessageActions.LIST_MESSAGES_SUCCESS:
            return action.items;
        case MessageActions.LIST_MORE_MESSAGES_SUCCESS:
            return [...state, ...action.items];
        case MessageActions.LIST_NEW_MESSAGES_SUCCESS:
            return [...action.items, ...state];
        case MessageActions.CREATE_MESSAGE_SUCCESS:
            return [action.message, ...state];
        case MessageActions.LIST_MESSAGES_START:
        case MessageActions.LIST_MESSAGES_FAILED:
            return [];
        default:
            return state;
    }
}

function last_read(state = 0, action) {
    switch (action.type) {
        case ChannelActions.CREATE_CHANNEL_SUCCESS:
        case ChannelActions.RETRIEVE_CHANNEL_SUCCESS:
        case ChannelActions.UPDATE_CHANNEL_SUCCESS:
        case ChannelActions.RETRIEVE_DIRECT_CHANNEL_SUCCESS:
            return action.channel.last_read;
        case ChannelActions.DELETE_CHANNEL_SUCCESS:
            return 0;
        default:
            return state;
    }
}

function next(state = null, action) {
    switch (action.type) {
        case MessageActions.LIST_MESSAGES_SUCCESS:
        case MessageActions.LIST_MORE_MESSAGES_SUCCESS:
            return action.next;
        default:
            return state;
    }
}

function previous(state = null, action) {
    switch (action.type) {
        case MessageActions.LIST_MESSAGES_SUCCESS:
        case MessageActions.LIST_MORE_MESSAGES_SUCCESS:
            return action.previous;
        default:
            return state;
    }
}

function count(state = null, action) {
    switch (action.type) {
        case MessageActions.LIST_MESSAGES_SUCCESS:
            return action.count;
        case MessageActions.LIST_MESSAGES_START:
        case MessageActions.LIST_MESSAGES_FAILED:
            return 0;
        default:
            return state;
    }
}

function isSaving(state = false, action) {
    switch (action.type) {
        case MessageActions.CREATE_MESSAGE_START:
            return true;
        case MessageActions.CREATE_MESSAGE_SUCCESS:
        case MessageActions.CREATE_MESSAGE_FAILED:
            return false;
        default:
            return state;
    }
}

function isSaved(state = false, action) {
    switch (action.type) {
        case MessageActions.CREATE_MESSAGE_SUCCESS:
            return true;
        case MessageActions.CREATE_MESSAGE_START:
        case MessageActions.CREATE_MESSAGE_FAILED:
        case PATH_CHANGE:
            return false;
        default:
            return state;
    }
}

function isFetching(state = false, action) {
    switch (action.type) {
        case MessageActions.LIST_MESSAGES_START:
            return true;
        case MessageActions.LIST_MESSAGES_SUCCESS:
        case MessageActions.LIST_MESSAGES_FAILED:
            return false;
        default:
            return state;
    }
}

function isFetchingMore(state = false, action) {
    switch (action.type) {
        case MessageActions.LIST_MORE_MESSAGES_START:
            return true;
        case MessageActions.LIST_MORE_MESSAGES_SUCCESS:
        case MessageActions.LIST_MORE_MESSAGES_FAILED:
            return false;
        default:
            return state;
    }
}

function isRetrieving(state = false, action) {
    switch (action.type) {
        case MessageActions.RETRIEVE_MESSAGE_START:
            return true;
        case MessageActions.RETRIEVE_MESSAGE_SUCCESS:
        case MessageActions.RETRIEVE_MESSAGE_FAILED:
            return false;
        default:
            return state;
    }
}

function isDeleting(state = false, action) {
    switch (action.type) {
        case MessageActions.DELETE_MESSAGE_START:
            return true;
        case MessageActions.DELETE_MESSAGE_SUCCESS:
        case MessageActions.DELETE_MESSAGE_FAILED:
            return false;
        default:
            return false;
    }
}

function error(state = {}, action) {
    switch (action.type) {
        case MessageActions.CREATE_MESSAGE_FAILED:
            return {...state, create: action.error};
        case MessageActions.CREATE_MESSAGE_START:
        case MessageActions.CREATE_MESSAGE_SUCCESS:
            return {...state, create: null};
        default:
            return state;
    }
}

const detail = combineReducers({
    message,
    isRetrieving,
    isSaving,
    isSaved,
    isDeleting,
    error,
});

const list = combineReducers({
    messages,
    last_read,
    isFetching,
    isFetchingMore,
    next,
    previous,
    count,
});

const Message = combineReducers({
    detail,
    list,
});

export default Message;
