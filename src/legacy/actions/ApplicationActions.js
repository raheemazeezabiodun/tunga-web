import axios from 'axios';
import {ENDPOINT_APPLICATION} from '../constants/Api';

import {
    sendGAEvent,
    GA_EVENT_CATEGORIES,
    GA_EVENT_ACTIONS,
    getGAUserType,
} from '../utils/tracking';
import {getUser} from '../utils/auth';

export const CREATE_APPLICATION_START = 'CREATE_APPLICATION_START';
export const CREATE_APPLICATION_SUCCESS = 'CREATE_APPLICATION_SUCCESS';
export const CREATE_APPLICATION_FAILED = 'CREATE_APPLICATION_FAILED';
export const LIST_APPLICATIONS_START = 'LIST_APPLICATIONS_START';
export const LIST_APPLICATIONS_SUCCESS = 'LIST_APPLICATIONS_SUCCESS';
export const LIST_APPLICATIONS_FAILED = 'LIST_APPLICATIONS_FAILED';
export const RETRIEVE_APPLICATION_START = 'RETRIEVE_APPLICATION_START';
export const RETRIEVE_APPLICATION_SUCCESS = 'RETRIEVE_APPLICATION_SUCCESS';
export const RETRIEVE_APPLICATION_FAILED = 'RETRIEVE_APPLICATION_FAILED';
export const UPDATE_APPLICATION_START = 'UPDATE_APPLICATION_START';
export const UPDATE_APPLICATION_SUCCESS = 'UPDATE_APPLICATION_SUCCESS';
export const UPDATE_APPLICATION_FAILED = 'UPDATE_APPLICATION_FAILED';
export const DELETE_APPLICATION_START = 'DELETE_APPLICATION_START';
export const DELETE_APPLICATION_SUCCESS = 'DELETE_APPLICATION_SUCCESS';
export const DELETE_APPLICATION_FAILED = 'DELETE_APPLICATION_FAILED';

export function createApplication(application, errors = null) {
    return dispatch => {
        dispatch(createApplicationStart(application));
        if (errors) {
            return dispatch(createApplicationFailed(errors));
        }
        axios
            .post(ENDPOINT_APPLICATION, application)
            .then(function(response) {
                dispatch(createApplicationSuccess(response.data));
            })
            .catch(function(error) {
                dispatch(
                    createApplicationFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function createApplicationStart(application) {
    return {
        type: CREATE_APPLICATION_START,
        application,
    };
}

export function createApplicationSuccess(application) {
    sendGAEvent(
        GA_EVENT_CATEGORIES.TASK,
        GA_EVENT_ACTIONS.APPLY,
        getGAUserType(getUser()),
    );
    return {
        type: CREATE_APPLICATION_SUCCESS,
        application,
    };
}

export function createApplicationFailed(error) {
    return {
        type: CREATE_APPLICATION_FAILED,
        error,
    };
}

export function listApplications(filter) {
    return dispatch => {
        dispatch(listApplicationsStart(filter));
        axios
            .get(ENDPOINT_APPLICATION, {params: filter})
            .then(function(response) {
                dispatch(listApplicationsSuccess(response.data));
            })
            .catch(function(error) {
                dispatch(
                    listApplicationsFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function listApplicationsStart(filter) {
    return {
        type: LIST_APPLICATIONS_START,
        filter,
    };
}

export function listApplicationsSuccess(response) {
    return {
        type: LIST_APPLICATIONS_SUCCESS,
        items: response.results,
        previous: response.previous,
        next: response.next,
        count: response.count,
    };
}

export function listApplicationsFailed(error) {
    return {
        type: LIST_APPLICATIONS_FAILED,
        error,
    };
}

export function retrieveApplication(id) {
    return dispatch => {
        dispatch(retrieveApplicationStart(id));
        axios
            .get(ENDPOINT_APPLICATION + id + '/')
            .then(function(response) {
                dispatch(retrieveApplicationSuccess(response.data));
            })
            .catch(function(error) {
                dispatch(
                    retrieveApplicationFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function retrieveApplicationStart(id) {
    return {
        type: RETRIEVE_APPLICATION_START,
        id,
    };
}

export function retrieveApplicationSuccess(application) {
    return {
        type: RETRIEVE_APPLICATION_SUCCESS,
        application,
    };
}

export function retrieveApplicationFailed(error) {
    return {
        type: RETRIEVE_APPLICATION_FAILED,
        error,
    };
}

export function updateApplication(id, data) {
    return dispatch => {
        dispatch(updateApplicationStart(id));
        axios
            .patch(ENDPOINT_APPLICATION + id + '/', data)
            .then(function(response) {
                dispatch(updateApplicationSuccess(response.data));
            })
            .catch(function(error) {
                dispatch(
                    updateApplicationFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function updateApplicationStart(id) {
    return {
        type: UPDATE_APPLICATION_START,
        id,
    };
}

export function updateApplicationSuccess(application) {
    return {
        type: UPDATE_APPLICATION_SUCCESS,
        application,
    };
}

export function updateApplicationFailed(error) {
    return {
        type: UPDATE_APPLICATION_FAILED,
        error,
    };
}

export function deleteApplication(id) {
    return dispatch => {
        dispatch(deleteApplicationStart(id));
        axios
            .delete(ENDPOINT_APPLICATION + id + '/', {})
            .then(function() {
                dispatch(deleteApplicationSuccess(id));
            })
            .catch(function(error) {
                dispatch(
                    deleteApplicationFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function deleteApplicationStart(id) {
    return {
        type: DELETE_APPLICATION_START,
        id,
    };
}

export function deleteApplicationSuccess(id) {
    return {
        type: DELETE_APPLICATION_SUCCESS,
        id,
    };
}

export function deleteApplicationFailed(error) {
    return {
        type: DELETE_APPLICATION_FAILED,
        error,
    };
}
