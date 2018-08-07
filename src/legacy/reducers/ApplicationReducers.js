import {combineReducers} from 'redux';
import * as ApplicationActions from '../actions/ApplicationActions';
import {PATH_CHANGE} from '../actions/NavActions';

import {STATUS_REJECTED} from '../constants/Api';

function applications(state = {}, action) {
    switch (action.type) {
        case ApplicationActions.LIST_APPLICATIONS_SUCCESS:
            var all_applications = {};
            action.items.forEach(application => {
                all_applications[application.id] = application;
            });
            return all_applications;
        case ApplicationActions.LIST_APPLICATIONS_START:
        case ApplicationActions.LIST_APPLICATIONS_FAILED:
            return {};
        case ApplicationActions.UPDATE_APPLICATION_SUCCESS:
            var application = state[action.application.id];
            var new_ref = action.application;
            new_ref[application.id] = action.application;
            return {...state, ...new_ref};
        default:
            return state;
    }
}

function ids(state = [], action) {
    switch (action.type) {
        case ApplicationActions.LIST_APPLICATIONS_SUCCESS:
            return action.items.map(application => {
                return application.id;
            });
        case ApplicationActions.UPDATE_APPLICATION_SUCCESS:
            if (action.application.status == STATUS_REJECTED) {
                var idx = state.indexOf(action.application.id);
                if (idx > -1) {
                    return [
                        ...state.slice(0, idx),
                        ...state.slice(idx + 1),
                        action.application.id,
                    ];
                }
                var application = state[action.application.id];
                var new_ref = action.application;
                new_ref[application.id] = action.application;
            }
            return state;
        case ApplicationActions.LIST_APPLICATIONS_START:
        case ApplicationActions.LIST_APPLICATIONS_FAILED:
            return [];
        default:
            return state;
    }
}

function isRetrieving(state = false, action) {
    switch (action.type) {
        case ApplicationActions.LIST_APPLICATIONS_START:
            return true;
        case ApplicationActions.LIST_APPLICATIONS_SUCCESS:
        case ApplicationActions.LIST_APPLICATIONS_FAILED:
            return false;
        default:
            return state;
    }
}

function isSaving(state = false, action) {
    switch (action.type) {
        case ApplicationActions.CREATE_APPLICATION_START:
        case ApplicationActions.UPDATE_APPLICATION_START:
            return true;
        case ApplicationActions.CREATE_APPLICATION_SUCCESS:
        case ApplicationActions.CREATE_APPLICATION_FAILED:
        case ApplicationActions.UPDATE_APPLICATION_SUCCESS:
        case ApplicationActions.UPDATE_APPLICATION_FAILED:
        case ApplicationActions.RETRIEVE_APPLICATION_START:
            return false;
        default:
            return state;
    }
}

function isSaved(state = false, action) {
    switch (action.type) {
        case ApplicationActions.CREATE_APPLICATION_SUCCESS:
        case ApplicationActions.UPDATE_APPLICATION_SUCCESS:
            return true;
        case ApplicationActions.CREATE_APPLICATION_START:
        case ApplicationActions.CREATE_APPLICATION_FAILED:
        case ApplicationActions.UPDATE_APPLICATION_START:
        case ApplicationActions.UPDATE_APPLICATION_FAILED:
        case PATH_CHANGE:
            return false;
        default:
            return state;
    }
}

function error(state = {}, action) {
    switch (action.type) {
        case ApplicationActions.CREATE_APPLICATION_FAILED:
            return {...state, create: action.error};
        case ApplicationActions.CREATE_APPLICATION_START:
        case ApplicationActions.CREATE_APPLICATION_SUCCESS:
            return {...state, create: null};
        case ApplicationActions.UPDATE_APPLICATION_FAILED:
            return {...state, update: action.error};
        case ApplicationActions.UPDATE_APPLICATION_START:
        case ApplicationActions.UPDATE_APPLICATION_SUCCESS:
            return {...state, update: null};
        default:
            return state;
    }
}

const Application = combineReducers({
    items: applications,
    ids,
    isRetrieving,
    isSaving,
    isSaved,
    error,
});

export default Application;
