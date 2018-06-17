import {combineReducers} from 'redux';
import * as ProfileActions from '../actions/ProfileActions';
import {PATH_CHANGE} from '../actions/NavActions';

function profile(state = {}, action) {
    switch (action.type) {
        case ProfileActions.RETRIEVE_PROFILE_SUCCESS:
            return action.profile;
        case ProfileActions.UPDATE_PROFILE_SUCCESS:
            var profile = action.profile;
            profile.skills = profile.details.skills;
            profile.btc_wallet = profile.details.btc_wallet;
            return profile;
        case ProfileActions.RETRIEVE_PROFILE_FAILED:
            return {};
        default:
            return state;
    }
}

function workItems(state = {}, action) {
    switch (action.type) {
        case ProfileActions.RETRIEVE_PROFILE_SUCCESS:
            var all_work = {};
            action.work.forEach(work => {
                all_work[work.id] = work;
            });
            return {...state, ...all_work};
        case ProfileActions.RETRIEVE_PROFILE_FAILED:
            return {};
        case ProfileActions.CREATE_WORK_SUCCESS:
        case ProfileActions.UPDATE_WORK_SUCCESS:
            var new_work = {};
            new_work[action.work.id] = action.work;
            return {...state, ...new_work};
        default:
            return state;
    }
}

function workIds(state = [], action) {
    switch (action.type) {
        case ProfileActions.RETRIEVE_PROFILE_SUCCESS:
            return action.work.map(work => {
                return work.id;
            });
        case ProfileActions.RETRIEVE_PROFILE_FAILED:
            return [];
        case ProfileActions.CREATE_WORK_SUCCESS:
            return [...state, action.work.id];
        default:
            return state;
    }
}

function educationItems(state = {}, action) {
    switch (action.type) {
        case ProfileActions.RETRIEVE_PROFILE_SUCCESS:
            var all_education = {};
            action.education.forEach(education => {
                all_education[education.id] = education;
            });
            return {...state, ...all_education};
        case ProfileActions.RETRIEVE_PROFILE_FAILED:
            return {};
        case ProfileActions.CREATE_EDUCATION_SUCCESS:
        case ProfileActions.UPDATE_EDUCATION_SUCCESS:
            var new_education = {};
            new_education[action.education.id] = action.education;
            return {...state, ...new_education};
        default:
            return state;
    }
}

function educationIds(state = [], action) {
    switch (action.type) {
        case ProfileActions.RETRIEVE_PROFILE_SUCCESS:
            return action.education.map(education => {
                return education.id;
            });
        case ProfileActions.RETRIEVE_PROFILE_FAILED:
            return [];
        case ProfileActions.CREATE_EDUCATION_SUCCESS:
            return [...state, action.education.id];
        default:
            return state;
    }
}

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

function isRetrieving(state = false, action) {
    switch (action.type) {
        case ProfileActions.RETRIEVE_PROFILE_START:
            return true;
        case ProfileActions.RETRIEVE_PROFILE_SUCCESS:
        case ProfileActions.RETRIEVE_PROFILE_FAILED:
            return false;
        default:
            return state;
    }
}

const defaultStatuses = {
    profile: false,
    user: false,
    account: false,
    security: false,
};

function isSaving(state = defaultStatuses, action) {
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
        default:
            return state;
    }
}

function isSaved(state = defaultStatuses, action) {
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
        case ProfileActions.RETRIEVE_PROFILE_START:
        case PATH_CHANGE:
            return defaultStatuses;
        default:
            return state;
    }
}

function error(state = {}, action) {
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
        default:
            return state;
    }
}

const work = combineReducers({
    ids: workIds,
    items: workItems,
});

const education = combineReducers({
    ids: educationIds,
    items: educationItems,
});

const Profile = combineReducers({
    profile,
    work,
    education,
    isRetrieving,
    isSaving,
    isSaved,
    error,
    countries,
});

export default Profile;
