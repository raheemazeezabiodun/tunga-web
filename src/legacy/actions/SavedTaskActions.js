import axios from 'axios';
import {ENDPOINT_SAVED_TASK} from '../constants/Api';

export const CREATE_SAVED_TASK_START = 'CREATE_SAVED_TASK_START';
export const CREATE_SAVED_TASK_SUCCESS = 'CREATE_SAVED_TASK_SUCCESS';
export const CREATE_SAVED_TASK_FAILED = 'CREATE_SAVED_TASK_FAILED';
export const LIST_SAVED_TASKS_START = 'LIST_SAVED_TASKS_START';
export const LIST_SAVED_TASKS_SUCCESS = 'LIST_SAVED_TASKS_SUCCESS';
export const LIST_SAVED_TASKS_FAILED = 'LIST_SAVED_TASKS_FAILED';
export const RETRIEVE_SAVED_TASK_START = 'RETRIEVE_SAVED_TASK_START';
export const RETRIEVE_SAVED_TASK_SUCCESS = 'RETRIEVE_SAVED_TASK_SUCCESS';
export const RETRIEVE_SAVED_TASK_FAILED = 'RETRIEVE_SAVED_TASK_FAILED';
export const UPDATE_SAVED_TASK_START = 'UPDATE_SAVED_TASK_START';
export const UPDATE_SAVED_TASK_SUCCESS = 'UPDATE_SAVED_TASK_SUCCESS';
export const UPDATE_SAVED_TASK_FAILED = 'UPDATE_SAVED_TASK_FAILED';
export const DELETE_SAVED_TASK_START = 'DELETE_SAVED_TASK_START';
export const DELETE_SAVED_TASK_SUCCESS = 'DELETE_SAVED_TASK_SUCCESS';
export const DELETE_SAVED_TASK_FAILED = 'DELETE_SAVED_TASK_FAILED';

export function createSavedTask(saved_task) {
    return dispatch => {
        dispatch(createSavedTaskStart(saved_task));
        axios
            .post(ENDPOINT_SAVED_TASK, saved_task)
            .then(function(response) {
                dispatch(createSavedTaskSuccess(response.data));
            })
            .catch(function(error) {
                dispatch(
                    createSavedTaskFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function createSavedTaskStart(saved_task) {
    return {
        type: CREATE_SAVED_TASK_START,
        saved_task,
    };
}

export function createSavedTaskSuccess(saved_task) {
    return {
        type: CREATE_SAVED_TASK_SUCCESS,
        saved_task,
    };
}

export function createSavedTaskFailed(error) {
    return {
        type: CREATE_SAVED_TASK_FAILED,
        error,
    };
}

export function listSavedTasks(filter) {
    return dispatch => {
        dispatch(listSavedTasksStart(filter));
        axios
            .get(ENDPOINT_SAVED_TASK, {params: filter})
            .then(function(response) {
                dispatch(listSavedTasksSuccess(response.data));
            })
            .catch(function(error) {
                dispatch(
                    listSavedTasksFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function listSavedTasksStart(filter) {
    return {
        type: LIST_SAVED_TASKS_START,
        filter,
    };
}

export function listSavedTasksSuccess(response) {
    return {
        type: LIST_SAVED_TASKS_SUCCESS,
        items: response.results,
        previous: response.previous,
        next: response.next,
        count: response.count,
    };
}

export function listSavedTasksFailed(error) {
    return {
        type: LIST_SAVED_TASKS_FAILED,
        error,
    };
}

export function retrieveSavedTask(id) {
    return dispatch => {
        dispatch(retrieveSavedTaskStart(id));
        axios
            .get(ENDPOINT_SAVED_TASK + id + '/')
            .then(function(response) {
                dispatch(retrieveSavedTaskSuccess(response.data));
            })
            .catch(function(error) {
                dispatch(
                    retrieveSavedTaskFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function retrieveSavedTaskStart(id) {
    return {
        type: RETRIEVE_SAVED_TASK_START,
        id,
    };
}

export function retrieveSavedTaskSuccess(saved_task) {
    return {
        type: RETRIEVE_SAVED_TASK_SUCCESS,
        saved_task,
    };
}

export function retrieveSavedTaskFailed(error) {
    return {
        type: RETRIEVE_SAVED_TASK_FAILED,
        error,
    };
}

export function updateSavedTask(id, data) {
    return dispatch => {
        dispatch(updateSavedTaskStart(id));
        axios
            .patch(ENDPOINT_SAVED_TASK + id + '/', data)
            .then(function(response) {
                dispatch(updateSavedTaskSuccess(response.data));
            })
            .catch(function(error) {
                dispatch(
                    updateSavedTaskFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function updateSavedTaskStart(id) {
    return {
        type: UPDATE_SAVED_TASK_START,
        id,
    };
}

export function updateSavedTaskSuccess(saved_task) {
    return {
        type: UPDATE_SAVED_TASK_SUCCESS,
        saved_task,
    };
}

export function updateSavedTaskFailed(error) {
    return {
        type: UPDATE_SAVED_TASK_FAILED,
        error,
    };
}

export function deleteSavedTask(id) {
    return dispatch => {
        dispatch(deleteSavedTaskStart(id));
        axios
            .delete(ENDPOINT_SAVED_TASK + id + '/', {})
            .then(function() {
                dispatch(deleteSavedTaskSuccess(id));
            })
            .catch(function(error) {
                dispatch(
                    deleteSavedTaskFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function deleteSavedTaskStart(id) {
    return {
        type: DELETE_SAVED_TASK_START,
        id,
    };
}

export function deleteSavedTaskSuccess(id) {
    return {
        type: DELETE_SAVED_TASK_SUCCESS,
        id,
    };
}

export function deleteSavedTaskFailed(error) {
    return {
        type: DELETE_SAVED_TASK_FAILED,
        error,
    };
}
