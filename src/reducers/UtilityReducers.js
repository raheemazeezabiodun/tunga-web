import {combineReducers} from 'redux';
import {LOCATION_CHANGE} from "react-router-redux";

import * as UtilityActions from '../actions/UtilityActions';
import {getMapKey} from "../utils/migration";

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
        case LOCATION_CHANGE:
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

function replacements(state = {}, action) {
    let newState = {};
    switch (action.type) {
        case UtilityActions.FIND_REPLACEMENT_SUCCESS:
            newState[getMapKey(action.model, action.id)] = action.replacement;
            return {...state, ...newState};
        default:
            return state;
    }
}

function isRetrieving(state = {}, action) {
    let newState = {};
    switch (action.type) {
        case UtilityActions.FIND_REPLACEMENT_START:
            newState[getMapKey(action.model, action.id)] = true;
            return {...state, ...newState};
        case UtilityActions.FIND_REPLACEMENT_SUCCESS:
        case UtilityActions.FIND_REPLACEMENT_FAILED:
            newState[getMapKey(action.model, action.id)] = false;
            return {...state, ...newState};
        default:
            return state;
    }
}

const contact = combineReducers({
    isSending,
    isSent,
    error,
});

const migrate = combineReducers({
    items: replacements,
    isRetrieving,
    error,
});

const Utility = combineReducers({
    posts,
    contact,
    migrate,
});

export default Utility;
