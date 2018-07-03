import {combineReducers} from 'redux';

import * as UserActions from '../actions/UserActions';
import {getIds} from './utils';

function ids(state = {}, action) {
    let selection_key = action.selection || 'default';
    let new_state = {};
    switch (action.type) {
        case UserActions.LIST_USERS_SUCCESS:
            new_state[selection_key] = getIds(action.items);
            return {...state, ...new_state};
        case UserActions.LIST_MORE_USERS_SUCCESS:
            new_state[selection_key] = [
                ...state[selection_key],
                ...getIds(action.items),
            ];
            return {...state, ...new_state};
        case UserActions.LIST_USERS_START:
            if (action.prev_selection && state[action.prev_selection]) {
                new_state[selection_key] = state[action.prev_selection];
                return {...state, ...new_state};
            }
            return state;
        case UserActions.LIST_USERS_FAILED:
            return state;
        default:
            return state;
    }
}

function users(state = {}, action) {
    switch (action.type) {
        case UserActions.LIST_USERS_SUCCESS:
        case UserActions.LIST_MORE_USERS_SUCCESS:
            let all_users = {};
            action.items.forEach(user => {
                all_users[user.id] = user;
            });
            return {...state, ...all_users};
        case UserActions.RETRIEVE_USER_SUCCESS:
        case UserActions.UPDATE_USER_SUCCESS:
            let new_user = {};
            new_user[action.user.id] = action.user;
            return {...state, ...new_user};
        default:
            return state;
    }
}

function usernameToId(state = {}, action) {
    switch (action.type) {
        case UserActions.LIST_USERS_SUCCESS:
        case UserActions.LIST_MORE_USERS_SUCCESS:
            let all_users = {};
            action.items.forEach(user => {
                all_users[user.username] = user.id;
            });
            return {...state, ...all_users};
        case UserActions.RETRIEVE_USER_SUCCESS:
        case UserActions.UPDATE_USER_SUCCESS:
            let new_user = {};
            new_user[action.user.username] = action.user.id;
            return {...state, ...new_user};
        default:
            return state;
    }
}

function next(state = null, action) {
    switch (action.type) {
        case UserActions.LIST_USERS_SUCCESS:
        case UserActions.LIST_MORE_USERS_SUCCESS:
            return action.next;
        default:
            return state;
    }
}

function previous(state = null, action) {
    switch (action.type) {
        case UserActions.LIST_USERS_SUCCESS:
        case UserActions.LIST_MORE_USERS_SUCCESS:
            return action.previous;
        default:
            return state;
    }
}

function count(state = null, action) {
    switch (action.type) {
        case UserActions.LIST_USERS_SUCCESS:
            return action.count;
        case UserActions.LIST_USERS_START:
        case UserActions.LIST_USERS_FAILED:
            return 0;
        default:
            return state;
    }
}

function isFetching(state = false, action) {
    switch (action.type) {
        case UserActions.LIST_USERS_START:
            return true;
        case UserActions.LIST_USERS_SUCCESS:
        case UserActions.LIST_USERS_FAILED:
            return false;
        default:
            return state;
    }
}

function isFetchingMore(state = false, action) {
    switch (action.type) {
        case UserActions.LIST_MORE_USERS_START:
            return true;
        case UserActions.LIST_MORE_USERS_SUCCESS:
        case UserActions.LIST_MORE_USERS_FAILED:
            return false;
        default:
            return state;
    }
}

function isRetrieving(state = false, action) {
    switch (action.type) {
        case UserActions.RETRIEVE_USER_START:
            return true;
        case UserActions.RETRIEVE_USER_SUCCESS:
        case UserActions.RETRIEVE_USER_FAILED:
            return false;
        default:
            return state;
    }
}

const User = combineReducers({
    ids,
    users,
    usernameToId,
    isRetrieving,
    isFetching,
    isFetchingMore,
    next,
    previous,
    count,
});

export default User;
