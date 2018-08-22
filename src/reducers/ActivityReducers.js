import {combineReducers} from 'redux';

import * as ActivityActions from '../actions/ActivityActions';
import * as CommentActions from '../actions/CommentActions';
import * as UploadActions from '../actions/UploadActions';
import * as ChannelActions from "../actions/ChannelActions";
import * as MessageActions from "../actions/MessageActions";
import {LOGIN_SUCCESS, LOGOUT_SUCCESS, VERIFY_SUCCESS} from "../actions/AuthActions";

import {getIds} from './utils';

function channel(state = {}, action) {
    switch (action.type) {
        case ChannelActions.CREATE_CHANNEL_SUCCESS:
        case ChannelActions.RETRIEVE_CHANNEL_SUCCESS:
        case ChannelActions.UPDATE_CHANNEL_SUCCESS:
            return action.channel;
        case ChannelActions.CREATE_CHANNEL_START:
        case ChannelActions.CREATE_CHANNEL_FAILED:
        case ChannelActions.RETRIEVE_CHANNEL_START:
        case ChannelActions.RETRIEVE_CHANNEL_FAILED:
        case LOGIN_SUCCESS:
        case LOGOUT_SUCCESS:
        case VERIFY_SUCCESS:
            return {};
        case ActivityActions.LIST_ACTIVITIES_SUCCESS:
            if (action.filter && action.filter.since > 0) {
                return {...state, new: action.items.length};
            }
            return state;
        default:
            return state;
    }
}

function ids(state = {}, action) {
    let selectionKey = action.selection || 'default';
    let targetKey = action.target || action.id || 'default';
    let newState = {};
    switch (action.type) {
        case ActivityActions.LIST_ACTIVITIES_SUCCESS:
            let newIds = getIds(action.items);
            if(action.filter && action.filter.since) {
                let cleanedIds = [];
                if(state[selectionKey]) {
                    state[selectionKey].forEach(id => {
                        if(typeof id === 'number') {
                            cleanedIds.push(id);
                        }
                    });
                }
                newState[selectionKey] = [...newIds, ...cleanedIds];
            } else {
                newState[selectionKey] = newIds;
            }
            return {...state, ...newState};
        case ActivityActions.LIST_MORE_ACTIVITIES_SUCCESS:
            newState[selectionKey] = [
                ...state[selectionKey],
                ...getIds(action.items),
            ];
            return {...state, ...newState};
        case ActivityActions.LIST_ACTIVITIES_START:
            if (action.prev_selection && state[action.prev_selection]) {
                newState[selectionKey] = state[action.prev_selection];
                return {...state, ...newState};
            }
            return state;
        case ActivityActions.LIST_ACTIVITIES_FAILED:
            return state;
        case MessageActions.CREATE_MESSAGE_SUCCESS:
            newState[targetKey] = [
                `message_${action.message.id}`,
                ...(state[targetKey] || {}),
            ];
            return {...state, ...newState};
        case CommentActions.CREATE_COMMENT_SUCCESS:
            newState[targetKey] = [
                `comment_${action.comment.id}`,
                ...(state[targetKey] || {}),
            ];
            return {...state, ...newState};
        case UploadActions.CREATE_UPLOAD_SUCCESS:
            newState[targetKey] = [
                `upload_${action.upload.id}`,
                ...(state[targetKey] || {}),
            ];
            return {...state, ...newState};
        default:
            return state;
    }
}

function activities(state = {}, action) {
    let newActivity = {};
    switch (action.type) {
        case ActivityActions.LIST_ACTIVITIES_SUCCESS:
        case ActivityActions.LIST_MORE_ACTIVITIES_SUCCESS:
            let all_activities = {};
            action.items.forEach(activity => {
                all_activities[activity.id] = activity;
            });
            return {...state, ...all_activities};
        case ActivityActions.RETRIEVE_ACTIVITY_SUCCESS:
            let new_activity = {};
            new_activity[action.activity.id] = action.activity;
            return {...state, ...new_activity};
        case MessageActions.CREATE_MESSAGE_SUCCESS:
            let activityId = `message_${action.message.id}`;
            newActivity[activityId] = {
                id: activityId, action: 'send', activity_type: 'message', activity: action.message
            };
            return {...state, ...newActivity};
        case CommentActions.CREATE_COMMENT_SUCCESS:
            activityId = `comment_${action.comment.id}`;
            newActivity[activityId] = {
                id: activityId, action: 'create', activity_type: 'comment', activity: action.comment
            };
            return {...state, ...newActivity};
        case UploadActions.CREATE_UPLOAD_SUCCESS:
            activityId = `upload_${action.upload.id}`;
            newActivity[activityId] = {
                id: activityId, action: 'upload', activity_type: 'upload', activity: action.upload
            };
            return {...state, ...newActivity};
        default:
            return state;
    }
}

function isRetrieving(state = {}, action) {
    let targetKey = action.id || 'default';
    let newState = {};
    switch (action.type) {
        case ActivityActions.RETRIEVE_ACTIVITY_START:
            newState[targetKey] = true;
            return {...state, ...newState};
        case ActivityActions.RETRIEVE_ACTIVITY_SUCCESS:
        case ActivityActions.RETRIEVE_ACTIVITY_FAILED:
            newState[targetKey] = false;
            return {...state, ...newState};
        default:
            return state;
    }
}

function isFetching(state = {}, action) {
    let selectionKey = action.selection || 'default';
    let newState = {};
    switch (action.type) {
        case ActivityActions.LIST_ACTIVITIES_START:
            newState[selectionKey] = !action.filter.since;
            return {...state, ...newState};
        case ActivityActions.LIST_ACTIVITIES_SUCCESS:
        case ActivityActions.LIST_ACTIVITIES_FAILED:
            newState[selectionKey] = false;
            return {...state, ...newState};
        default:
            return state;
    }
}

function isFetchingMore(state = {}, action) {
    let selectionKey = action.selection || 'default';
    let newState = {};
    switch (action.type) {
        case ActivityActions.LIST_MORE_ACTIVITIES_START:
            newState[selectionKey] = true;
            return {...state, ...newState};
        case ActivityActions.LIST_MORE_ACTIVITIES_SUCCESS:
        case ActivityActions.LIST_MORE_ACTIVITIES_FAILED:
            newState[selectionKey] = false;
            return {...state, ...newState};
        default:
            return state;
    }
}

function next(state = {}, action) {
    let selectionKey = action.selection || 'default';
    let newState = {};
    switch (action.type) {
        case ActivityActions.LIST_ACTIVITIES_SUCCESS:
            if(action.filter && action.filter.since) {
                return state;
            }
            newState[selectionKey] = action.next;
            return {...state, ...newState};
        case ActivityActions.LIST_MORE_ACTIVITIES_SUCCESS:
            newState[selectionKey] = action.next;
            return {...state, ...newState};
        default:
            return state;
    }
}

function previous(state = {}, action) {
    let selectionKey = action.selection || 'default';
    let newState = {};
    switch (action.type) {
        case ActivityActions.LIST_ACTIVITIES_SUCCESS:
        case ActivityActions.LIST_MORE_ACTIVITIES_SUCCESS:
            newState[selectionKey] = action.previous;
            return {...state, ...newState};
        default:
            return state;
    }
}

function count(state = {}, action) {
    let selectionKey = action.selection || 'default';
    let newState = {};
    switch (action.type) {
        case ActivityActions.LIST_ACTIVITIES_SUCCESS:
            newState[selectionKey] = action.count;
            return {...state, ...newState};
        case ActivityActions.LIST_ACTIVITIES_START:
        case ActivityActions.LIST_ACTIVITIES_FAILED:
            newState[selectionKey] = 0;
            return {...state, ...newState};
        default:
            return state;
    }
}

function errors(state = {}, action) {
    switch (action.type) {
        case ChannelActions.CREATE_CHANNEL_FAILED:
            return {...state, channel: action.error};
        case ChannelActions.CREATE_CHANNEL_START:
        case ChannelActions.CREATE_CHANNEL_SUCCESS:
            return {...state, channel: null};
        default:
            return state;
    }
}

const Activity = combineReducers({
    channel,
    ids,
    activities,
    isRetrieving,
    isFetching,
    isFetchingMore,
    next,
    previous,
    count,
    errors
});

export default Activity;
