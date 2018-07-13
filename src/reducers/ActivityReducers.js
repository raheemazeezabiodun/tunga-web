import {combineReducers} from 'redux';

import * as ActivityActions from '../actions/ActivityActions';
import {getIds} from './utils';

function ids(state = {}, action) {
    let selection_key = action.selection || 'default';
    let new_state = {};
    switch (action.type) {
        case ActivityActions.LIST_ACTIVITIES_SUCCESS:
            new_state[selection_key] = getIds(action.items);
            return {...state, ...new_state};
        case ActivityActions.LIST_MORE_ACTIVITIES_SUCCESS:
            new_state[selection_key] = [
                ...state[selection_key],
                ...getIds(action.items),
            ];
            return {...state, ...new_state};
        case ActivityActions.LIST_ACTIVITIES_START:
            if (action.prev_selection && state[action.prev_selection]) {
                new_state[selection_key] = state[action.prev_selection];
                return {...state, ...new_state};
            }
            return state;
        case ActivityActions.LIST_ACTIVITIES_FAILED:
            return state;
        default:
            return state;
    }
}

function activities(state = {}, action) {
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
            newState[selectionKey] = true;
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

const Activity = combineReducers({
    ids,
    activities,
    isRetrieving,
    isFetching,
    isFetchingMore,
    next,
    previous,
    count,
});

export default Activity;
