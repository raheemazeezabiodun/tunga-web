import {combineReducers} from 'redux';
import * as UserActions from '../actions/UserActions';
import * as ConnectionActions from '../actions/ConnectionActions';
import {getIds} from '../utils/reducers';

import {STATUS_INITIAL} from '../constants/Api';

function user(state = {}, action) {
    switch (action.type) {
        case UserActions.RETRIEVE_USER_SUCCESS:
        case UserActions.UPDATE_USER_SUCCESS:
            return action.user;
        case UserActions.RETRIEVE_USER_START:
        case UserActions.RETRIEVE_USER_FAILED:
            return {};
        case ConnectionActions.CREATE_CONNECTION_SUCCESS:
            if (action.connection.to_user == state.id) {
                return {...state, can_connect: false};
            }
            return state;
        case ConnectionActions.UPDATE_CONNECTION_SUCCESS:
            if (action.connection.from_user == state.id) {
                var new_user = {...state};
                new_user.can_connect = false;
                new_user.connection = action.connection;
                if (action.connection.status != STATUS_INITIAL) {
                    new_user.request = null;
                }
                return new_user;
            }
            return state;
        case ConnectionActions.DELETE_CONNECTION_SUCCESS:
            if (action.user && action.user.id == state.id) {
                new_user = {...state};
                new_user.can_connect = true;
                new_user.request = null;
                new_user.connection = null;
                return new_user;
            }
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
        case ConnectionActions.CREATE_CONNECTION_SUCCESS:
            var user = state[action.connection.to_user];
            if (user) {
                user.can_connect = false;
                user.connection = action.connection;
                var new_ref = {};
                new_ref[user.id] = user;
                return {...state, ...new_ref};
            }
            return state;
        case ConnectionActions.UPDATE_CONNECTION_SUCCESS:
            user = state[action.connection.from_user];
            if (user) {
                user.can_connect = false;
                user.connection = action.connection;
                if (action.connection.status != STATUS_INITIAL) {
                    user.request = null;
                }
                new_ref = {};
                new_ref[user.id] = user;
                return {...state, ...new_ref};
            }
            return state;
        case ConnectionActions.DELETE_CONNECTION_SUCCESS:
            if (action.user) {
                user = state[action.user.id];
                if (user) {
                    user.can_connect = true;
                    user.request = null;
                    user.connection = null;
                    new_ref = {};
                    new_ref[user.id] = user;
                    return {...state, ...new_ref};
                }
            }
            return state;
        default:
            return state;
    }
}

function ids(state = {}, action) {
    var selection_key = action.selection || 'default';
    var new_state = {};
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
        case ConnectionActions.DELETE_CONNECTION_SUCCESS:
            if (action.user && action.hide) {
                var idx = state.indexOf(action.user.id);
                if (idx > -1) {
                    return [...state.slice(0, idx), ...state.slice(idx + 1)];
                }
            }
            return state;
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

const detail = combineReducers({
    user,
    isRetrieving,
});

const list = combineReducers({
    users,
    ids,
    isFetching,
    isFetchingMore,
    next,
    previous,
    count,
});

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

const User = combineReducers({
    detail,
    list,
    ids,
    users,
    usernameToId
});

export default User;
