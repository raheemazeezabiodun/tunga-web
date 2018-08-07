import {combineReducers} from 'redux';
import * as TaskActions from '../actions/TaskActions';
import * as ChannelActions from '../actions/ChannelActions';
import {CREATE_COMMENT_SUCCESS} from '../actions/CommentActions';
import {CREATE_MESSAGE_SUCCESS} from '../actions/MessageActions';

import {getTaskKey, getChannelKey} from '../utils/reducers';

const ITEM_TYPE_TASK = 'task';
const ITEM_TYPE_CHANNEL = 'channel';

export function getReversedActivity(items, state) {
    return [...items].reverse();
}

function getNextActivityState(
    state,
    action,
    type,
    old_activity = [],
    new_activity = [],
) {
    var item_key = null;
    switch (type) {
        case ITEM_TYPE_TASK:
            item_key = getTaskKey(action.id);
            break;
        case ITEM_TYPE_CHANNEL:
            item_key = getChannelKey(action.id);
            break;
        default:
            break;
    }
    if (item_key) {
        var item_activity = {};
        item_activity[item_key] = [
            ...(old_activity || []),
            ...getReversedActivity(action.items),
            ...(new_activity || []),
        ];
        return {...state, ...item_activity};
    }
    return state;
}

function getConcreteActivities(state, key) {
    var concrete_acitiviy = [];
    var items = state[key] || [];
    items.forEach(item => {
        if (item.id) {
            concrete_acitiviy.push(item);
        }
    });
    return concrete_acitiviy;
}

function getNextStateOptimistic(state, items, id, type) {
    var item_key = null;
    switch (type) {
        case ITEM_TYPE_TASK:
            item_key = getTaskKey(id);
            break;
        case ITEM_TYPE_CHANNEL:
            item_key = getChannelKey(id);
            break;
        default:
            break;
    }
    if (item_key) {
        var item_activity = {};
        item_activity[item_key] = [...(state[item_key] || []), ...items];
        return {...state, ...item_activity};
    }
    return state;
}

function getOptimisticUploadActivities(uploads) {
    return uploads.map(upload => {
        return {action: 'upload', activity_type: 'upload', activity: upload};
    });
}

function clearItemActivity(state, key) {
    return changeStateKey(state, key, []);
}

function changeStateKey(state, key, value) {
    var new_state = {...state};
    new_state[key] = value;
    return new_state;
}

function activity(state = {}, action) {
    switch (action.type) {
        case TaskActions.LIST_TASK_ACTIVITY_SUCCESS:
            return getNextActivityState(state, action, ITEM_TYPE_TASK);
        case ChannelActions.LIST_CHANNEL_ACTIVITY_SUCCESS:
            return getNextActivityState(state, action, ITEM_TYPE_CHANNEL);
        case TaskActions.LIST_MORE_TASK_ACTIVITY_SUCCESS:
            if (action.items) {
                return getNextActivityState(
                    state,
                    action,
                    ITEM_TYPE_TASK,
                    [],
                    state[getTaskKey(action.id)],
                );
            }
            return state;
        case ChannelActions.LIST_MORE_CHANNEL_ACTIVITY_SUCCESS:
            if (action.items) {
                return getNextActivityState(
                    state,
                    action,
                    ITEM_TYPE_CHANNEL,
                    [],
                    state[getChannelKey(action.id)],
                );
            }
            return state;
        case TaskActions.LIST_NEW_TASK_ACTIVITY_SUCCESS:
            return getNextActivityState(
                state,
                action,
                ITEM_TYPE_TASK,
                getConcreteActivities(state, getTaskKey(action.id)),
            );
        case ChannelActions.LIST_NEW_CHANNEL_ACTIVITY_SUCCESS:
            return getNextActivityState(
                state,
                action,
                ITEM_TYPE_CHANNEL,
                getConcreteActivities(state, getChannelKey(action.id)),
            );
        case CREATE_COMMENT_SUCCESS:
            return getNextStateOptimistic(
                state,
                [
                    {
                        action: 'comment',
                        activity_type: 'comment',
                        activity: action.comment,
                    },
                ],
                action.comment.object_id,
                ITEM_TYPE_TASK,
            );
        case CREATE_MESSAGE_SUCCESS:
            return getNextStateOptimistic(
                state,
                [
                    {
                        action: 'send',
                        activity_type: 'message',
                        activity: action.message,
                    },
                ],
                action.message.channel,
                ITEM_TYPE_CHANNEL,
            );
        case ChannelActions.SHARE_CHANNEL_UPLOAD_SUCCESS:
            return getNextStateOptimistic(
                state,
                getOptimisticUploadActivities(action.uploads),
                action.channel.id,
                ITEM_TYPE_CHANNEL,
            );
        case TaskActions.SHARE_TASK_UPLOAD_SUCCESS:
            return getNextStateOptimistic(
                state,
                getOptimisticUploadActivities(action.uploads),
                action.task.id,
                ITEM_TYPE_TASK,
            );
        case TaskActions.LIST_TASK_ACTIVITY_START:
        case TaskActions.LIST_TASK_ACTIVITY_FAILED:
            return clearItemActivity(state, getTaskKey(action.id));
        case ChannelActions.LIST_CHANNEL_ACTIVITY_START:
        case ChannelActions.LIST_CHANNEL_ACTIVITY_FAILED:
            return clearItemActivity(state, getChannelKey(action.id));
        default:
            return state;
    }
}

function next(state = {}, action) {
    switch (action.type) {
        case TaskActions.LIST_TASK_ACTIVITY_SUCCESS:
        case TaskActions.LIST_MORE_TASK_ACTIVITY_SUCCESS:
            return changeStateKey(state, getTaskKey(action.id), action.next);
        case ChannelActions.LIST_CHANNEL_ACTIVITY_SUCCESS:
        case ChannelActions.LIST_MORE_CHANNEL_ACTIVITY_SUCCESS:
            return changeStateKey(state, getChannelKey(action.id), action.next);
        default:
            return state;
    }
}

function previous(state = {}, action) {
    switch (action.type) {
        case TaskActions.LIST_TASK_ACTIVITY_SUCCESS:
        case TaskActions.LIST_MORE_TASK_ACTIVITY_SUCCESS:
            return changeStateKey(
                state,
                getTaskKey(action.id),
                action.previous,
            );
        case ChannelActions.LIST_CHANNEL_ACTIVITY_SUCCESS:
        case ChannelActions.LIST_MORE_CHANNEL_ACTIVITY_SUCCESS:
            return changeStateKey(
                state,
                getChannelKey(action.id),
                action.previous,
            );
        default:
            return state;
    }
}

function count(state = {}, action) {
    switch (action.type) {
        case TaskActions.LIST_TASK_ACTIVITY_SUCCESS:
        case TaskActions.LIST_MORE_TASK_ACTIVITY_SUCCESS:
            return changeStateKey(state, getTaskKey(action.id), action.count);
        case ChannelActions.LIST_CHANNEL_ACTIVITY_SUCCESS:
        case ChannelActions.LIST_MORE_CHANNEL_ACTIVITY_SUCCESS:
            return changeStateKey(
                state,
                getChannelKey(action.id),
                action.count,
            );
        case TaskActions.LIST_TASK_ACTIVITY_START:
        case TaskActions.LIST_TASK_ACTIVITY_FAILED:
            return changeStateKey(state, getTaskKey(action.id), 0);
        case ChannelActions.LIST_CHANNEL_ACTIVITY_START:
        case ChannelActions.LIST_CHANNEL_ACTIVITY_FAILED:
            return changeStateKey(state, getChannelKey(action.id), 0);
        default:
            return state;
    }
}

function isFetching(state = {}, action) {
    switch (action.type) {
        case TaskActions.LIST_TASK_ACTIVITY_START:
            return changeStateKey(state, getTaskKey(action.id), true);
        case ChannelActions.LIST_CHANNEL_ACTIVITY_START:
            return changeStateKey(state, getChannelKey(action.id), true);
        case TaskActions.LIST_TASK_ACTIVITY_SUCCESS:
        case TaskActions.LIST_TASK_ACTIVITY_FAILED:
            return changeStateKey(state, getTaskKey(action.id), false);
        case ChannelActions.LIST_CHANNEL_ACTIVITY_SUCCESS:
        case ChannelActions.LIST_CHANNEL_ACTIVITY_FAILED:
            return changeStateKey(state, getChannelKey(action.id), false);
        default:
            return state;
    }
}

function isFetchingMore(state = {}, action) {
    switch (action.type) {
        case TaskActions.LIST_MORE_TASK_ACTIVITY_START:
            return changeStateKey(state, getTaskKey(action.id), true);
        case ChannelActions.LIST_MORE_CHANNEL_ACTIVITY_START:
            return changeStateKey(state, getChannelKey(action.id), true);
        case TaskActions.LIST_MORE_TASK_ACTIVITY_SUCCESS:
        case TaskActions.LIST_MORE_TASK_ACTIVITY_FAILED:
            return changeStateKey(state, getTaskKey(action.id), false);
        case ChannelActions.LIST_MORE_CHANNEL_ACTIVITY_SUCCESS:
        case ChannelActions.LIST_MORE_CHANNEL_ACTIVITY_FAILED:
            return changeStateKey(state, getChannelKey(action.id), false);
        default:
            return state;
    }
}

const Activity = combineReducers({
    items: activity,
    isFetching,
    isFetchingMore,
    count,
    next,
    previous,
});

export default Activity;
