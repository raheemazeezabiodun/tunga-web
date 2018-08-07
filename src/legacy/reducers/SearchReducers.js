import {combineReducers} from 'redux';
import * as SearchActions from '../actions/SearchActions';
import * as UserActions from '../actions/UserActions';
import * as TaskActions from '../actions/TaskActions';
import * as MessageActions from '../actions/MessageActions';
import * as SupportPageActions from '../actions/SupportPageActions';

function query(state = null, action) {
    switch (action.type) {
        case SearchActions.SEARCH_START:
            return action.query;
        default:
            return state;
    }
}

function count(state = {}, action) {
    var selection_key = action.selection || 'default';
    var new_state = {};
    switch (action.type) {
        case UserActions.LIST_USERS_SUCCESS:
        case TaskActions.LIST_TASKS_SUCCESS:
        case MessageActions.LIST_MESSAGES_SUCCESS:
        case SupportPageActions.LIST_SUPPORT_PAGES_SUCCESS:
            new_state[selection_key] = action.count;
            return {...state, ...new_state};
        case UserActions.LIST_USERS_START:
        case UserActions.LIST_USERS_FAILED:
        case TaskActions.LIST_TASKS_START:
        case TaskActions.LIST_TASKS_FAILED:
        case MessageActions.LIST_MESSAGES_START:
        case MessageActions.LIST_MESSAGES_FAILED:
        case SupportPageActions.LIST_SUPPORT_PAGES_START:
        case SupportPageActions.LIST_SUPPORT_PAGES_FAILED:
            new_state[selection_key] = 0;
            return {...state, ...new_state};
        default:
            return state;
    }
}

const Search = combineReducers({
    query,
    count,
});

export default Search;
