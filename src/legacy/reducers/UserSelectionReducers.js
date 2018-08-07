import {combineReducers} from 'redux';
import * as UserSelectionActions from '../actions/UserSelectionActions';
import {CREATE_MESSAGE_SUCCESS} from '../actions/MessageActions';

function users(state = {default: {}}, action) {
    var selection_key = action.selection || 'default';
    switch (action.type) {
        case UserSelectionActions.ADD_USER_SELECTION:
            var user_id = action.user.id;
            var new_user = {};
            new_user[user_id] = action.user;
            var current_selection = state[selection_key] || {};
            var new_selection = {...current_selection, ...new_user};
            var new_state = {...state};
            new_state[selection_key] = new_selection;
            return new_state;
        case UserSelectionActions.CLEAR_USER_SELECTIONS:
            new_state = {...state};
            new_state[selection_key] = {};
            return new_state;
        default:
            return state;
    }
}

function ids(state = {}, action) {
    var selection_key = action.selection || 'default';
    switch (action.type) {
        case UserSelectionActions.ADD_USER_SELECTION:
            var current_selection = state[selection_key] || [];
            if (current_selection.indexOf(action.user.id) == -1) {
                var new_selection = [...current_selection, action.user.id];
                var new_state = {...state};
                new_state[selection_key] = new_selection;
                return new_state;
            }
            return state;
        case UserSelectionActions.REMOVE_USER_SELECTION:
            current_selection = state[selection_key] || [];
            var idx = current_selection.indexOf(action.id);
            if (idx > -1) {
                new_selection = [
                    ...current_selection.slice(0, idx),
                    ...current_selection.slice(idx + 1),
                ];
                new_state = {...state};
                new_state[selection_key] = new_selection;
                return new_state;
            }
            return state;
        case UserSelectionActions.CLEAR_USER_SELECTIONS:
            new_state = {...state};
            new_state[selection_key] = [];
            return new_state;
        case CREATE_MESSAGE_SUCCESS:
            return {};
        default:
            return state;
    }
}

function suggestions(state = {default: []}, action) {
    var selection_key = action.selection || 'default';
    switch (action.type) {
        case UserSelectionActions.GET_USER_SUGGESTIONS_SUCCESS:
            var new_state = {...state};
            new_state[selection_key] = action.items;
            return new_state;
        case UserSelectionActions.INVALIDATE_USER_SUGGESTIONS:
            new_state = {...state};
            new_state[selection_key] = [];
            return new_state;
        default:
            return state;
    }
}

function isFetching(state = false, action) {
    switch (action.type) {
        case UserSelectionActions.GET_USER_SUGGESTIONS_START:
            return true;
        case UserSelectionActions.GET_USER_SUGGESTIONS_SUCCESS:
        case UserSelectionActions.GET_USER_SUGGESTIONS_FAILED:
            return false;
        default:
            return state;
    }
}

function isValid(state = true, action) {
    switch (action.type) {
        case UserSelectionActions.GET_USER_SUGGESTIONS_START:
            return true;
        case UserSelectionActions.INVALIDATE_USER_SUGGESTIONS:
            return false;
        default:
            return state;
    }
}

const selected = combineReducers({
    users,
    ids,
});

const UserSelection = combineReducers({
    selected,
    suggestions,
    isFetching,
    isValid,
});

export default UserSelection;
