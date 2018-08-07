import axios from 'axios';
import {ENDPOINT_SUPPORT_SECTION} from '../constants/Api';

export const CREATE_SUPPORT_SECTION_START = 'CREATE_SUPPORT_SECTION_START';
export const CREATE_SUPPORT_SECTION_SUCCESS = 'CREATE_SUPPORT_SECTION_SUCCESS';
export const CREATE_SUPPORT_SECTION_FAILED = 'CREATE_SUPPORT_SECTION_FAILED';
export const LIST_SUPPORT_SECTIONS_START = 'LIST_SUPPORT_SECTIONS_START';
export const LIST_SUPPORT_SECTIONS_SUCCESS = 'LIST_SUPPORT_SECTIONS_SUCCESS';
export const LIST_SUPPORT_SECTIONS_FAILED = 'LIST_SUPPORT_SECTIONS_FAILED';
export const RETRIEVE_SUPPORT_SECTION_START = 'RETRIEVE_SUPPORT_SECTION_START';
export const RETRIEVE_SUPPORT_SECTION_SUCCESS =
    'RETRIEVE_SUPPORT_SECTION_SUCCESS';
export const RETRIEVE_SUPPORT_SECTION_FAILED =
    'RETRIEVE_SUPPORT_SECTION_FAILED';
export const UPDATE_SUPPORT_SECTION_START = 'UPDATE_SUPPORT_SECTION_START';
export const UPDATE_SUPPORT_SECTION_SUCCESS = 'UPDATE_SUPPORT_SECTION_SUCCESS';
export const UPDATE_SUPPORT_SECTION_FAILED = 'UPDATE_SUPPORT_SECTION_FAILED';
export const DELETE_SUPPORT_SECTION_START = 'DELETE_SUPPORT_SECTION_START';
export const DELETE_SUPPORT_SECTION_SUCCESS = 'DELETE_SUPPORT_SECTION_SUCCESS';
export const DELETE_SUPPORT_SECTION_FAILED = 'DELETE_SUPPORT_SECTION_FAILED';
export const LIST_MORE_SUPPORT_SECTIONS_START =
    'LIST_MORE_SUPPORT_SECTIONS_START';
export const LIST_MORE_SUPPORT_SECTIONS_SUCCESS =
    'LIST_MORE_SUPPORT_SECTIONS_SUCCESS';
export const LIST_MORE_SUPPORT_SECTIONS_FAILED =
    'LIST_MORE_SUPPORT_SECTIONS_FAILED';

export function createSupportSection(section, attachments) {
    return dispatch => {
        dispatch(createSupportSectionStart(section));

        axios
            .post(ENDPOINT_SUPPORT_SECTION, section)
            .then(function(response) {
                dispatch(createSupportSectionSuccess(response.data));
            })
            .catch(function(error) {
                dispatch(
                    createSupportSectionFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function createSupportSectionStart(section) {
    return {
        type: CREATE_SUPPORT_SECTION_START,
        section,
    };
}

export function createSupportSectionSuccess(section) {
    return {
        type: CREATE_SUPPORT_SECTION_SUCCESS,
        section,
    };
}

export function createSupportSectionFailed(error) {
    return {
        type: CREATE_SUPPORT_SECTION_FAILED,
        error,
    };
}

export function listSupportSections(filter) {
    return dispatch => {
        dispatch(listSupportSectionsStart(filter));
        axios
            .get(ENDPOINT_SUPPORT_SECTION, {params: filter})
            .then(function(response) {
                dispatch(listSupportSectionsSuccess(response.data));
            })
            .catch(function(error) {
                dispatch(
                    listSupportSectionsFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function listSupportSectionsStart(filter) {
    return {
        type: LIST_SUPPORT_SECTIONS_START,
        filter,
    };
}

export function listSupportSectionsSuccess(response) {
    return {
        type: LIST_SUPPORT_SECTIONS_SUCCESS,
        items: response.results,
        previous: response.previous,
        next: response.next,
        count: response.count,
    };
}

export function listSupportSectionsFailed(error) {
    return {
        type: LIST_SUPPORT_SECTIONS_FAILED,
        error,
    };
}

export function retrieveSupportSection(id) {
    return dispatch => {
        dispatch(retrieveSupportSectionStart(id));
        axios
            .get(ENDPOINT_SUPPORT_SECTION + id + '/')
            .then(function(response) {
                dispatch(retrieveSupportSectionSuccess(response.data));
            })
            .catch(function(error) {
                dispatch(
                    retrieveSupportSectionFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function retrieveSupportSectionStart(id) {
    return {
        type: RETRIEVE_SUPPORT_SECTION_START,
        id,
    };
}

export function retrieveSupportSectionSuccess(section) {
    return {
        type: RETRIEVE_SUPPORT_SECTION_SUCCESS,
        section,
    };
}

export function retrieveSupportSectionFailed(error) {
    return {
        type: RETRIEVE_SUPPORT_SECTION_FAILED,
        error,
    };
}

export function updateSupportSection(id, section) {
    return dispatch => {
        dispatch(updateSupportSectionStart(id));
        axios
            .patch(ENDPOINT_SUPPORT_SECTION + id + '/', section)
            .then(function(response) {
                dispatch(updateSupportSectionSuccess(response.data));
            })
            .catch(function(error) {
                dispatch(
                    updateSupportSectionFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function updateSupportSectionStart(id) {
    return {
        type: UPDATE_SUPPORT_SECTION_START,
        id,
    };
}

export function updateSupportSectionSuccess(section) {
    return {
        type: UPDATE_SUPPORT_SECTION_SUCCESS,
        section,
    };
}

export function updateSupportSectionFailed(error) {
    return {
        type: UPDATE_SUPPORT_SECTION_FAILED,
        error,
    };
}

export function deleteSupportSection(id) {
    return dispatch => {
        dispatch(deleteSupportSectionStart(id));
        axios
            .delete(ENDPOINT_SUPPORT_SECTION + id + '/', {})
            .then(function() {
                dispatch(deleteSupportSectionSuccess(id));
            })
            .catch(function(error) {
                dispatch(
                    deleteSupportSectionFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function deleteSupportSectionStart(id) {
    return {
        type: DELETE_SUPPORT_SECTION_START,
        id,
    };
}

export function deleteSupportSectionSuccess(id) {
    return {
        type: DELETE_SUPPORT_SECTION_SUCCESS,
        id,
    };
}

export function deleteSupportSectionFailed(error) {
    return {
        type: DELETE_SUPPORT_SECTION_FAILED,
        error,
    };
}

export function listMoreSupportSections(url) {
    return dispatch => {
        dispatch(listMoreSupportSectionsStart(url));
        axios
            .get(url)
            .then(function(response) {
                dispatch(listMoreSupportSectionsSuccess(response.data));
            })
            .catch(function(error) {
                dispatch(
                    listMoreSupportSectionsFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function listMoreSupportSectionsStart(url) {
    return {
        type: LIST_MORE_SUPPORT_SECTIONS_START,
        url,
    };
}

export function listMoreSupportSectionsSuccess(response) {
    return {
        type: LIST_MORE_SUPPORT_SECTIONS_SUCCESS,
        items: response.results,
        previous: response.previous,
        next: response.next,
        count: response.count,
    };
}

export function listMoreSupportSectionsFailed(error) {
    return {
        type: LIST_MORE_SUPPORT_SECTIONS_FAILED,
        error,
    };
}
