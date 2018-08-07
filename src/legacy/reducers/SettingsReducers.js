import {combineReducers} from 'redux';
import * as SettingsActions from '../actions/SettingsActions';
import {PATH_CHANGE} from '../actions/NavActions';

function settings(state = {switches: {}, visibility: {}}, action) {
    switch (action.type) {
        case SettingsActions.RETRIEVE_SETTINGS_SUCCESS:
        case SettingsActions.UPDATE_SETTINGS_SUCCESS:
            return action.settings;
        default:
            return state;
    }
}

function isSaving(state = false, action) {
    switch (action.type) {
        case SettingsActions.UPDATE_SETTINGS_START:
            return true;
        case SettingsActions.UPDATE_SETTINGS_SUCCESS:
        case SettingsActions.UPDATE_SETTINGS_FAILED:
            return false;
        default:
            return state;
    }
}

function isSaved(state = false, action) {
    switch (action.type) {
        case SettingsActions.UPDATE_SETTINGS_SUCCESS:
            return true;
        case SettingsActions.UPDATE_SETTINGS_START:
        case SettingsActions.UPDATE_SETTINGS_FAILED:
        case PATH_CHANGE:
            return false;
        default:
            return state;
    }
}

function isRetrieving(state = false, action) {
    switch (action.type) {
        case SettingsActions.RETRIEVE_SETTINGS_START:
            return true;
        case SettingsActions.RETRIEVE_SETTINGS_SUCCESS:
        case SettingsActions.RETRIEVE_SETTINGS_FAILED:
            return false;
        default:
            return state;
    }
}

function error(state = {}, action) {
    switch (action.type) {
        case SettingsActions.RETRIEVE_SETTINGS_FAILED:
            return {...state, retrieve: action.error};
        case SettingsActions.RETRIEVE_SETTINGS_START:
        case SettingsActions.RETRIEVE_SETTINGS_SUCCESS:
            return {...state, retrieve: null};
        case SettingsActions.UPDATE_SETTINGS_FAILED:
            return {...state, update: action.error};
        case SettingsActions.UPDATE_SETTINGS_START:
        case SettingsActions.UPDATE_SETTINGS_SUCCESS:
            return {...state, update: null};
        default:
            return state;
    }
}

const Settings = combineReducers({
    settings,
    isRetrieving,
    isSaving,
    isSaved,
    error,
});

export default Settings;
