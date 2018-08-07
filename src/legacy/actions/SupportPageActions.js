import axios from 'axios';
import {ENDPOINT_SUPPORT_PAGE} from '../constants/Api';

export const CREATE_SUPPORT_PAGE_START = 'CREATE_SUPPORT_PAGE_START';
export const CREATE_SUPPORT_PAGE_SUCCESS = 'CREATE_SUPPORT_PAGE_SUCCESS';
export const CREATE_SUPPORT_PAGE_FAILED = 'CREATE_SUPPORT_PAGE_FAILED';
export const LIST_SUPPORT_PAGES_START = 'LIST_SUPPORT_PAGES_START';
export const LIST_SUPPORT_PAGES_SUCCESS = 'LIST_SUPPORT_PAGES_SUCCESS';
export const LIST_SUPPORT_PAGES_FAILED = 'LIST_SUPPORT_PAGES_FAILED';
export const RETRIEVE_SUPPORT_PAGE_START = 'RETRIEVE_SUPPORT_PAGE_START';
export const RETRIEVE_SUPPORT_PAGE_SUCCESS = 'RETRIEVE_SUPPORT_PAGE_SUCCESS';
export const RETRIEVE_SUPPORT_PAGE_FAILED = 'RETRIEVE_SUPPORT_PAGE_FAILED';
export const UPDATE_SUPPORT_PAGE_START = 'UPDATE_SUPPORT_PAGE_START';
export const UPDATE_SUPPORT_PAGE_SUCCESS = 'UPDATE_SUPPORT_PAGE_SUCCESS';
export const UPDATE_SUPPORT_PAGE_FAILED = 'UPDATE_SUPPORT_PAGE_FAILED';
export const DELETE_SUPPORT_PAGE_START = 'DELETE_SUPPORT_PAGE_START';
export const DELETE_SUPPORT_PAGE_SUCCESS = 'DELETE_SUPPORT_PAGE_SUCCESS';
export const DELETE_SUPPORT_PAGE_FAILED = 'DELETE_SUPPORT_PAGE_FAILED';
export const LIST_MORE_SUPPORT_PAGES_START = 'LIST_MORE_SUPPORT_PAGES_START';
export const LIST_MORE_SUPPORT_PAGES_SUCCESS =
    'LIST_MORE_SUPPORT_PAGES_SUCCESS';
export const LIST_MORE_SUPPORT_PAGES_FAILED = 'LIST_MORE_SUPPORT_PAGES_FAILED';

export function createSupportPage(page, attachments) {
    return dispatch => {
        dispatch(createSupportPageStart(page));

        axios
            .post(ENDPOINT_SUPPORT_PAGE, page)
            .then(function(response) {
                dispatch(createSupportPageSuccess(response.data));
            })
            .catch(function(error) {
                dispatch(
                    createSupportPageFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function createSupportPageStart(page) {
    return {
        type: CREATE_SUPPORT_PAGE_START,
        page,
    };
}

export function createSupportPageSuccess(page) {
    return {
        type: CREATE_SUPPORT_PAGE_SUCCESS,
        page,
    };
}

export function createSupportPageFailed(error) {
    return {
        type: CREATE_SUPPORT_PAGE_FAILED,
        error,
    };
}

export function listSupportPages(filter) {
    return dispatch => {
        dispatch(listSupportPagesStart(filter));
        axios
            .get(ENDPOINT_SUPPORT_PAGE, {params: filter})
            .then(function(response) {
                dispatch(listSupportPagesSuccess(response.data));
            })
            .catch(function(error) {
                dispatch(
                    listSupportPagesFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function listSupportPagesStart(filter) {
    return {
        type: LIST_SUPPORT_PAGES_START,
        filter,
    };
}

export function listSupportPagesSuccess(response) {
    return {
        type: LIST_SUPPORT_PAGES_SUCCESS,
        items: response.results,
        previous: response.previous,
        next: response.next,
        count: response.count,
    };
}

export function listSupportPagesFailed(error) {
    return {
        type: LIST_SUPPORT_PAGES_FAILED,
        error,
    };
}

export function retrieveSupportPage(id) {
    return dispatch => {
        dispatch(retrieveSupportPageStart(id));
        axios
            .get(ENDPOINT_SUPPORT_PAGE + id + '/')
            .then(function(response) {
                dispatch(retrieveSupportPageSuccess(response.data));
            })
            .catch(function(error) {
                dispatch(
                    retrieveSupportPageFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function retrieveSupportPageStart(id) {
    return {
        type: RETRIEVE_SUPPORT_PAGE_START,
        id,
    };
}

export function retrieveSupportPageSuccess(page) {
    return {
        type: RETRIEVE_SUPPORT_PAGE_SUCCESS,
        page,
    };
}

export function retrieveSupportPageFailed(error) {
    return {
        type: RETRIEVE_SUPPORT_PAGE_FAILED,
        error,
    };
}

export function updateSupportPage(id, page) {
    return dispatch => {
        dispatch(updateSupportPageStart(id));
        axios
            .patch(ENDPOINT_SUPPORT_PAGE + id + '/', page)
            .then(function(response) {
                dispatch(updateSupportPageSuccess(response.data));
            })
            .catch(function(error) {
                dispatch(
                    updateSupportPageFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function updateSupportPageStart(id) {
    return {
        type: UPDATE_SUPPORT_PAGE_START,
        id,
    };
}

export function updateSupportPageSuccess(page) {
    return {
        type: UPDATE_SUPPORT_PAGE_SUCCESS,
        page,
    };
}

export function updateSupportPageFailed(error) {
    return {
        type: UPDATE_SUPPORT_PAGE_FAILED,
        error,
    };
}

export function deleteSupportPage(id) {
    return dispatch => {
        dispatch(deleteSupportPageStart(id));
        axios
            .delete(ENDPOINT_SUPPORT_PAGE + id + '/', {})
            .then(function() {
                dispatch(deleteSupportPageSuccess(id));
            })
            .catch(function(error) {
                dispatch(
                    deleteSupportPageFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function deleteSupportPageStart(id) {
    return {
        type: DELETE_SUPPORT_PAGE_START,
        id,
    };
}

export function deleteSupportPageSuccess(id) {
    return {
        type: DELETE_SUPPORT_PAGE_SUCCESS,
        id,
    };
}

export function deleteSupportPageFailed(error) {
    return {
        type: DELETE_SUPPORT_PAGE_FAILED,
        error,
    };
}

export function listMoreSupportPages(url) {
    return dispatch => {
        dispatch(listMoreSupportPagesStart(url));
        axios
            .get(url)
            .then(function(response) {
                dispatch(listMoreSupportPagesSuccess(response.data));
            })
            .catch(function(error) {
                dispatch(
                    listMoreSupportPagesFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function listMoreSupportPagesStart(url) {
    return {
        type: LIST_MORE_SUPPORT_PAGES_START,
        url,
    };
}

export function listMoreSupportPagesSuccess(response) {
    return {
        type: LIST_MORE_SUPPORT_PAGES_SUCCESS,
        items: response.results,
        previous: response.previous,
        next: response.next,
        count: response.count,
    };
}

export function listMoreSupportPagesFailed(error) {
    return {
        type: LIST_MORE_SUPPORT_PAGES_FAILED,
        error,
    };
}
