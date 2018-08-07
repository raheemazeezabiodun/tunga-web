import {combineReducers} from 'redux';
import * as TaskActions from '../actions/TaskActions';
import {PATH_CHANGE} from '../actions/NavActions';

function integration(state = {}, action) {
    switch (action.type) {
        case TaskActions.CREATE_TASK_INTEGRATION_SUCCESS:
        case TaskActions.RETRIEVE_TASK_INTEGRATION_SUCCESS:
            return action.integration;
        case TaskActions.CREATE_TASK_INTEGRATION_START:
        case TaskActions.RETRIEVE_TASK_INTEGRATION_START:
        case TaskActions.RETRIEVE_TASK_INTEGRATION_FAILED:
            return {};
        default:
            return state;
    }
}

function isSaving(state = false, action) {
    switch (action.type) {
        case TaskActions.CREATE_TASK_INTEGRATION_START:
            return true;
        case TaskActions.CREATE_TASK_INTEGRATION_SUCCESS:
        case TaskActions.CREATE_TASK_INTEGRATION_FAILED:
            return false;
        default:
            return state;
    }
}

function isSaved(state = false, action) {
    switch (action.type) {
        case TaskActions.CREATE_TASK_INTEGRATION_SUCCESS:
            return true;
        case TaskActions.CREATE_TASK_INTEGRATION_START:
        case TaskActions.CREATE_TASK_INTEGRATION_FAILED:
        case PATH_CHANGE:
            return false;
        default:
            return state;
    }
}

function isRetrieving(state = false, action) {
    switch (action.type) {
        case TaskActions.RETRIEVE_TASK_INTEGRATION_START:
            return true;
        case TaskActions.RETRIEVE_TASK_INTEGRATION_SUCCESS:
        case TaskActions.RETRIEVE_TASK_INTEGRATION_FAILED:
            return false;
        default:
            return state;
    }
}

function error(state = {}, action) {
    switch (action.type) {
        case TaskActions.CREATE_TASK_INTEGRATION_FAILED:
            return {...state, create: action.error};
        case TaskActions.CREATE_TASK_INTEGRATION_START:
        case TaskActions.CREATE_TASK_INTEGRATION_SUCCESS:
            return {...state, create: null};
        case PATH_CHANGE:
            return {};
        default:
            return state;
    }
}

const Integration = combineReducers({
    integration,
    isRetrieving,
    isSaving,
    isSaved,
    error,
});

export default Integration;
