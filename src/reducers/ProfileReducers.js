import {combineReducers} from 'redux';
import {LOCATION_CHANGE} from 'react-router-redux';
import * as ProfileActions from '../actions/ProfileActions';
import * as SettingsActions from '../actions/SettingsActions';

function countries(state = [], action) {
    switch (action.type) {
        case ProfileActions.GET_COUNTRIES_SUCCESS:
            return action.countries;
        case ProfileActions.GET_COUNTRIES_FAILED:
            return [];
        default:
            return state;
    }
}

const defaultNotifications = {
    profile: {required: [], optional: []},
    projects: [], invoices: [],
    events: [], reports: [],
    activities: []
};

function notifications(state = defaultNotifications, action) {
    switch (action.type) {
        case ProfileActions.GET_NOTIFICATIONS_SUCCESS:
            return {...defaultNotifications, ...action.notifications};
        case ProfileActions.GET_NOTIFICATIONS_FAILED:
            return defaultNotifications;
        default:
            return state;
    }
}

const defaultIsRetrieving = {
    profile: false,
    user: false,
    account: false,
    security: false,
    company: false,
    work: false,
    education: false
};

function isRetrieving(state = defaultIsRetrieving, action) {
    switch (action.type) {
        case ProfileActions.RETRIEVE_PROFILE_START:
            return {...state, profile: true};
        case ProfileActions.RETRIEVE_PROFILE_SUCCESS:
        case ProfileActions.RETRIEVE_PROFILE_FAILED:
            return {...state, profile: false};
        case SettingsActions.RETRIEVE_SETTINGS_START:
            return {...state, settings: true};
        case SettingsActions.RETRIEVE_SETTINGS_SUCCESS:
        case SettingsActions.RETRIEVE_SETTINGS_FAILED:
            return {...state, settings: false};
        case ProfileActions.GET_NOTIFICATIONS_START:
            return {...state, notifications: true};
        case ProfileActions.GET_NOTIFICATIONS_SUCCESS:
        case ProfileActions.GET_NOTIFICATIONS_FAILED:
            return {...state, notifications: false};
        default:
            return state;
    }
}

function isSaving(state = defaultIsRetrieving, action) {
    switch (action.type) {
        case ProfileActions.UPDATE_PROFILE_START:
            return {...state, profile: true};
        case ProfileActions.UPDATE_PROFILE_SUCCESS:
        case ProfileActions.UPDATE_PROFILE_FAILED:
            return {...state, profile: false};
        case ProfileActions.UPDATE_AUTH_USER_START:
            return {...state, user: true};
        case ProfileActions.UPDATE_AUTH_USER_SUCCESS:
        case ProfileActions.UPDATE_AUTH_USER_FAILED:
            return {...state, user: false};
        case ProfileActions.UPDATE_ACCOUNT_INFO_START:
            return {...state, account: true};
        case ProfileActions.UPDATE_ACCOUNT_INFO_SUCCESS:
        case ProfileActions.UPDATE_ACCOUNT_INFO_FAILED:
            return {...state, account: false};
        case ProfileActions.UPDATE_PASSWORD_START:
            return {...state, security: true};
        case ProfileActions.UPDATE_PASSWORD_SUCCESS:
        case ProfileActions.UPDATE_PASSWORD_FAILED:
            return {...state, security: false};
        case ProfileActions.CREATE_WORK_START:
        case ProfileActions.UPDATE_WORK_START:
            return {...state, work: true};
        case ProfileActions.CREATE_WORK_SUCCESS:
        case ProfileActions.CREATE_WORK_FAILED:
        case ProfileActions.UPDATE_WORK_SUCCESS:
        case ProfileActions.UPDATE_WORK_FAILED:
            return {...state, work: false};
        case ProfileActions.CREATE_EDUCATION_START:
        case ProfileActions.UPDATE_EDUCATION_START:
            return {...state, education: true};
        case ProfileActions.CREATE_EDUCATION_SUCCESS:
        case ProfileActions.CREATE_EDUCATION_FAILED:
        case ProfileActions.UPDATE_EDUCATION_SUCCESS:
        case ProfileActions.UPDATE_EDUCATION_FAILED:
            return {...state, education: false};
        case ProfileActions.UPDATE_COMPANY_START:
            return {...state, company: true};
        case ProfileActions.UPDATE_COMPANY_SUCCESS:
        case ProfileActions.UPDATE_COMPANY_FAILED:
            return {...state, company: false};
        case ProfileActions.CREATE_VISITORS_START:
            return {...state, visitors: true};
        case ProfileActions.CREATE_VISITORS_SUCCESS:
        case ProfileActions.CREATE_VISITORS_FAILED:
            return {...state, visitors: false};
        case SettingsActions.UPDATE_SETTINGS_START:
            return {...state, settings: true};
        case SettingsActions.UPDATE_SETTINGS_SUCCESS:
        case SettingsActions.UPDATE_SETTINGS_FAILED:
            return {...state, settings: false};
        default:
            return state;
    }
}

function isSaved(state = defaultIsRetrieving, action) {
    switch (action.type) {
        case ProfileActions.UPDATE_PROFILE_SUCCESS:
            return {...state, profile: true};
        case ProfileActions.UPDATE_PROFILE_START:
        case ProfileActions.UPDATE_PROFILE_FAILED:
            return {...state, profile: false};
        case ProfileActions.UPDATE_AUTH_USER_SUCCESS:
            return {...state, user: true};
        case ProfileActions.UPDATE_AUTH_USER_START:
        case ProfileActions.UPDATE_AUTH_USER_FAILED:
            return {...state, user: false};
        case ProfileActions.UPDATE_ACCOUNT_INFO_SUCCESS:
            return {...state, account: true};
        case ProfileActions.UPDATE_ACCOUNT_INFO_START:
        case ProfileActions.UPDATE_ACCOUNT_INFO_FAILED:
            return {...state, account: false};
        case ProfileActions.UPDATE_PASSWORD_SUCCESS:
            return {...state, security: true};
        case ProfileActions.UPDATE_PASSWORD_START:
        case ProfileActions.UPDATE_PASSWORD_FAILED:
            return {...state, security: false};
        case ProfileActions.CREATE_WORK_SUCCESS:
        case ProfileActions.UPDATE_WORK_SUCCESS:
            return {...state, work: true};
        case ProfileActions.CREATE_WORK_START:
        case ProfileActions.CREATE_WORK_FAILED:
        case ProfileActions.UPDATE_WORK_START:
        case ProfileActions.UPDATE_WORK_FAILED:
            return {...state, work: false};
        case ProfileActions.CREATE_EDUCATION_SUCCESS:
        case ProfileActions.UPDATE_EDUCATION_SUCCESS:
            return {...state, education: true};
        case ProfileActions.CREATE_EDUCATION_START:
        case ProfileActions.CREATE_EDUCATION_FAILED:
        case ProfileActions.UPDATE_EDUCATION_START:
        case ProfileActions.UPDATE_EDUCATION_FAILED:
            return {...state, education: false};
        case ProfileActions.UPDATE_COMPANY_SUCCESS:
            return {...state, company: true};
        case ProfileActions.UPDATE_COMPANY_START:
        case ProfileActions.UPDATE_COMPANY_FAILED:
            return {...state, company: false};
        case ProfileActions.CREATE_VISITORS_SUCCESS:
            return {...state, visitors: action.data};
        case ProfileActions.CREATE_VISITORS_START:
        case ProfileActions.CREATE_VISITORS_SUCCESS:
            return {...state, visitors: false};
        case SettingsActions.UPDATE_SETTINGS_SUCCESS:
            return {...state, settings: true};
        case SettingsActions.UPDATE_SETTINGS_START:
        case SettingsActions.UPDATE_SETTINGS_FAILED:
            return {...state, settings: false};
        case LOCATION_CHANGE:
            return defaultIsRetrieving;
        default:
            return state;
    }
}

function errors(state = {}, action) {
    switch (action.type) {
        case ProfileActions.UPDATE_PROFILE_FAILED:
            var error = action.error;
            return {...state, profile: error};
        case ProfileActions.UPDATE_PROFILE_START:
        case ProfileActions.UPDATE_PROFILE_SUCCESS:
            return {...state, profile: null};
        case ProfileActions.UPDATE_AUTH_USER_FAILED:
            return {...state, user: action.error};
        case ProfileActions.UPDATE_AUTH_USER_START:
        case ProfileActions.UPDATE_AUTH_USER_SUCCESS:
            return {...state, user: null};
        case ProfileActions.UPDATE_ACCOUNT_INFO_FAILED:
            return {...state, account: action.error};
        case ProfileActions.UPDATE_ACCOUNT_INFO_START:
        case ProfileActions.UPDATE_ACCOUNT_INFO_SUCCESS:
            return {...state, account: null};
        case ProfileActions.UPDATE_PASSWORD_FAILED:
            return {...state, security: action.error};
        case ProfileActions.UPDATE_PASSWORD_START:
        case ProfileActions.UPDATE_PASSWORD_SUCCESS:
            return {...state, security: null};
        case ProfileActions.CREATE_WORK_FAILED:
        case ProfileActions.UPDATE_WORK_FAILED:
            return {...state, work: action.error};
        case ProfileActions.CREATE_WORK_START:
        case ProfileActions.CREATE_WORK_SUCCESS:
        case ProfileActions.UPDATE_WORK_START:
        case ProfileActions.UPDATE_WORK_SUCCESS:
            return {...state, work: null};
        case ProfileActions.CREATE_EDUCATION_FAILED:
        case ProfileActions.UPDATE_EDUCATION_FAILED:
            return {...state, education: action.error};
        case ProfileActions.CREATE_EDUCATION_START:
        case ProfileActions.CREATE_EDUCATION_SUCCESS:
        case ProfileActions.UPDATE_EDUCATION_START:
        case ProfileActions.UPDATE_EDUCATION_SUCCESS:
            return {...state, education: null};
        case ProfileActions.UPDATE_COMPANY_FAILED:
            return {...state, company: error};
        case ProfileActions.UPDATE_COMPANY_START:
        case ProfileActions.UPDATE_COMPANY_SUCCESS:
            return {...state, company: null};
        case SettingsActions.UPDATE_SETTINGS_FAILED:
            return {...state, settings: error};
        case SettingsActions.UPDATE_SETTINGS_START:
        case SettingsActions.UPDATE_SETTINGS_SUCCESS:
            return {...state, settings: null};
        default:
            return state;
    }
}

const Profile = combineReducers({
    isRetrieving,
    isSaving,
    isSaved,
    errors,
    countries,
    notifications
});

export default Profile;
