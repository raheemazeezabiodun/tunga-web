import {combineReducers} from 'redux';
import * as UtilityActions from '../actions/UtilityActions';
import {PATH_CHANGE} from '../actions/NavActions';

function posts(state = [], action) {
    switch (action.type) {
        case UtilityActions.GET_MEDIUM_POSTS_SUCCESS:
            return action.posts;
        case UtilityActions.GET_MEDIUM_POSTS_START:
        case UtilityActions.GET_MEDIUM_POSTS_FAILED:
            return [];
        default:
            return state;
    }
}

function isSending(state = false, action) {
    switch (action.type) {
        case UtilityActions.SEND_CONTACT_REQUEST_START:
            return true;
        case UtilityActions.SEND_CONTACT_REQUEST_SUCCESS:
        case UtilityActions.SEND_CONTACT_REQUEST_FAILED:
            return false;
        default:
            return state;
    }
}

function isSent(state = false, action) {
    switch (action.type) {
        case UtilityActions.SEND_CONTACT_REQUEST_SUCCESS:
            return true;
        case UtilityActions.SEND_CONTACT_REQUEST_START:
        case UtilityActions.SEND_CONTACT_REQUEST_FAILED:
        case PATH_CHANGE:
            return false;
        default:
            return state;
    }
}

function error(state = null, action) {
    switch (action.type) {
        case UtilityActions.SEND_CONTACT_REQUEST_FAILED:
            return action.error;
        case UtilityActions.SEND_CONTACT_REQUEST_START:
        case UtilityActions.SEND_CONTACT_REQUEST_SUCCESS:
            return null;
        default:
            return state;
    }
}

const contact = combineReducers({
    isSending,
    isSent,
    error,
});

const Utility = combineReducers({
    posts,
    contact,
});

export default Utility;
