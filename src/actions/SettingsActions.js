import axios from 'axios';
import {ENDPOINT_ACCOUNT_SETTINGS} from './utils/api';

export const RETRIEVE_SETTINGS_START = 'RETRIEVE_SETTINGS_START';
export const RETRIEVE_SETTINGS_SUCCESS = 'RETRIEVE_SETTINGS_SUCCESS';
export const RETRIEVE_SETTINGS_FAILED = 'RETRIEVE_SETTINGS_FAILED';
export const UPDATE_SETTINGS_START = 'UPDATE_SETTINGS_START';
export const UPDATE_SETTINGS_SUCCESS = 'UPDATE_SETTINGS_SUCCESS';
export const UPDATE_SETTINGS_FAILED = 'UPDATE_SETTINGS_FAILED';

export function retrieveSettings() {
    return dispatch => {
        dispatch(retrieveSettingsStart());
        axios
            .get(ENDPOINT_ACCOUNT_SETTINGS)
            .then(function(response) {
                dispatch(retrieveSettingsSuccess(response.data));
            })
            .catch(function(error) {
                dispatch(
                    retrieveSettingsFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function retrieveSettingsStart() {
    return {
        type: RETRIEVE_SETTINGS_START,
    };
}

export function retrieveSettingsSuccess(settings) {
    return {
        type: RETRIEVE_SETTINGS_SUCCESS,
        settings,
    };
}

export function retrieveSettingsFailed(error) {
    return {
        type: RETRIEVE_SETTINGS_FAILED,
        error,
    };
}

export function updateSettings(settings) {
    return dispatch => {
        dispatch(updateSettingsStart(settings));
        axios
            .patch(ENDPOINT_ACCOUNT_SETTINGS, settings)
            .then(function(response) {
                dispatch(updateSettingsSuccess(response.data));
            })
            .catch(function(error) {
                dispatch(
                    updateSettingsFailed(
                        error.response ? error.response.data : null, settings
                    ),
                );
            });
    };
}

export function updateSettingsStart(settings) {
    return {
        type: UPDATE_SETTINGS_START,
        settings,
    };
}

export function updateSettingsSuccess(settings) {
    return {
        type: UPDATE_SETTINGS_SUCCESS,
        settings,
    };
}

export function updateSettingsFailed(error, settings) {
    return {
        type: UPDATE_SETTINGS_FAILED,
        error,
        settings
    };
}
