import axios from 'axios';
import {ENDPOINT_PROJECT} from '../constants/Api';

export const CREATE_PROJECT_START = 'CREATE_PROJECT_START';
export const CREATE_PROJECT_SUCCESS = 'CREATE_PROJECT_SUCCESS';
export const CREATE_PROJECT_FAILED = 'CREATE_PROJECT_FAILED';
export const LIST_PROJECTS_START = 'LIST_PROJECTS_START';
export const LIST_PROJECTS_SUCCESS = 'LIST_PROJECTS_SUCCESS';
export const LIST_PROJECTS_FAILED = 'LIST_PROJECTS_FAILED';
export const RETRIEVE_PROJECT_START = 'RETRIEVE_PROJECT_START';
export const RETRIEVE_PROJECT_SUCCESS = 'RETRIEVE_PROJECT_SUCCESS';
export const RETRIEVE_PROJECT_FAILED = 'RETRIEVE_PROJECT_FAILED';
export const UPDATE_PROJECT_START = 'UPDATE_PROJECT_START';
export const UPDATE_PROJECT_SUCCESS = 'UPDATE_PROJECT_SUCCESS';
export const UPDATE_PROJECT_FAILED = 'UPDATE_PROJECT_FAILED';
export const DELETE_PROJECT_START = 'DELETE_PROJECT_START';
export const DELETE_PROJECT_SUCCESS = 'DELETE_PROJECT_SUCCESS';
export const DELETE_PROJECT_FAILED = 'DELETE_PROJECT_FAILED';
export const LIST_RUNNING_PROJECTS_START = 'LIST_RUNNING_PROJECTS_START';
export const LIST_RUNNING_PROJECTS_SUCCESS = 'LIST_RUNNING_PROJECTS_SUCCESS';
export const LIST_RUNNING_PROJECTS_FAILED = 'LIST_RUNNING_PROJECTS_FAILED';
export const LIST_MORE_PROJECTS_START = 'LIST_MORE_PROJECTS_START';
export const LIST_MORE_PROJECTS_SUCCESS = 'LIST_MORE_PROJECTS_SUCCESS';
export const LIST_MORE_PROJECTS_FAILED = 'LIST_MORE_PROJECTS_FAILED';

export function createProject(project, attachments) {
    return dispatch => {
        dispatch(createProjectStart(project));

        axios
            .post(ENDPOINT_PROJECT, project)
            .then(function(response) {
                dispatch(createProjectSuccess(response.data));
            })
            .catch(function(error) {
                dispatch(
                    createProjectFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function createProjectStart(project) {
    return {
        type: CREATE_PROJECT_START,
        project,
    };
}

export function createProjectSuccess(project) {
    return {
        type: CREATE_PROJECT_SUCCESS,
        project,
    };
}

export function createProjectFailed(error) {
    return {
        type: CREATE_PROJECT_FAILED,
        error,
    };
}

export function listProjects(filter) {
    return dispatch => {
        dispatch(listProjectsStart(filter));
        axios
            .get(ENDPOINT_PROJECT, {params: filter})
            .then(function(response) {
                dispatch(listProjectsSuccess(response.data));
            })
            .catch(function(error) {
                dispatch(
                    listProjectsFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function listProjectsStart(filter) {
    return {
        type: LIST_PROJECTS_START,
        filter,
    };
}

export function listProjectsSuccess(response) {
    return {
        type: LIST_PROJECTS_SUCCESS,
        items: response.results,
        previous: response.previous,
        next: response.next,
        count: response.count,
    };
}

export function listProjectsFailed(error) {
    return {
        type: LIST_PROJECTS_FAILED,
        error,
    };
}

export function retrieveProject(id) {
    return dispatch => {
        dispatch(retrieveProjectStart(id));
        axios
            .get(ENDPOINT_PROJECT + id + '/')
            .then(function(response) {
                dispatch(retrieveProjectSuccess(response.data));
            })
            .catch(function(error) {
                dispatch(
                    retrieveProjectFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function retrieveProjectStart(id) {
    return {
        type: RETRIEVE_PROJECT_START,
        id,
    };
}

export function retrieveProjectSuccess(project) {
    return {
        type: RETRIEVE_PROJECT_SUCCESS,
        project,
    };
}

export function retrieveProjectFailed(error) {
    return {
        type: RETRIEVE_PROJECT_FAILED,
        error,
    };
}

export function updateProject(id, data) {
    return dispatch => {
        dispatch(updateProjectStart(id));
        axios
            .patch(ENDPOINT_PROJECT + id + '/', data)
            .then(function(response) {
                dispatch(updateProjectSuccess(response.data));
            })
            .catch(function(error) {
                dispatch(
                    updateProjectFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function updateProjectStart(id) {
    return {
        type: UPDATE_PROJECT_START,
        id,
    };
}

export function updateProjectSuccess(project) {
    return {
        type: UPDATE_PROJECT_SUCCESS,
        project,
    };
}

export function updateProjectFailed(error) {
    return {
        type: UPDATE_PROJECT_FAILED,
        error,
    };
}

export function deleteProject(id) {
    return dispatch => {
        dispatch(deleteProjectStart(id));
        axios
            .delete(ENDPOINT_PROJECT + id + '/')
            .then(function() {
                dispatch(deleteProjectSuccess(id));
            })
            .catch(function(error) {
                dispatch(
                    deleteProjectFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function deleteProjectStart(id) {
    return {
        type: DELETE_PROJECT_START,
        id,
    };
}

export function deleteProjectSuccess(id) {
    return {
        type: DELETE_PROJECT_SUCCESS,
        id,
    };
}

export function deleteProjectFailed(error) {
    return {
        type: DELETE_PROJECT_FAILED,
        error,
    };
}

export function listRunningProjects() {
    return dispatch => {
        var filter = {filter: 'running'};
        dispatch(listRunningProjectsStart(filter));
        axios
            .get(ENDPOINT_PROJECT, {params: filter})
            .then(function(response) {
                dispatch(listRunningProjectsSuccess(response.data));
            })
            .catch(function(error) {
                dispatch(
                    listRunningProjectsFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function listRunningProjectsStart(filter) {
    return {
        type: LIST_RUNNING_PROJECTS_START,
        filter,
    };
}

export function listRunningProjectsSuccess(response) {
    return {
        type: LIST_RUNNING_PROJECTS_SUCCESS,
        items: response.results,
        previous: response.previous,
        next: response.next,
        count: response.count,
    };
}

export function listRunningProjectsFailed(error) {
    return {
        type: LIST_RUNNING_PROJECTS_FAILED,
        error,
    };
}

export function listMoreProjects(url) {
    return dispatch => {
        dispatch(listMoreProjectsStart(url));
        axios
            .get(url)
            .then(function(response) {
                dispatch(listMoreProjectsSuccess(response.data));
            })
            .catch(function(error) {
                dispatch(
                    listMoreProjectsFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function listMoreProjectsStart(url) {
    return {
        type: LIST_MORE_PROJECTS_START,
        url,
    };
}

export function listMoreProjectsSuccess(response) {
    return {
        type: LIST_MORE_PROJECTS_SUCCESS,
        items: response.results,
        previous: response.previous,
        next: response.next,
        count: response.count,
    };
}

export function listMoreProjectsFailed(error) {
    return {
        type: LIST_MORE_PROJECTS_FAILED,
        error,
    };
}
