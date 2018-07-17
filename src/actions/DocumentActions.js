import axios from 'axios';
import {composeFormData, ENDPOINT_DOCUMENTS} from './utils/api';

export const CREATE_DOCUMENT_START = 'CREATE_DOCUMENT_START';
export const CREATE_DOCUMENT_SUCCESS = 'CREATE_DOCUMENT_SUCCESS';
export const CREATE_DOCUMENT_FAILED = 'CREATE_DOCUMENT_FAILED';
export const LIST_DOCUMENTS_START = 'LIST_DOCUMENTS_START';
export const LIST_DOCUMENTS_SUCCESS = 'LIST_DOCUMENTS_SUCCESS';
export const LIST_DOCUMENTS_FAILED = 'LIST_DOCUMENTS_FAILED';
export const RETRIEVE_DOCUMENT_START = 'RETRIEVE_DOCUMENT_START';
export const RETRIEVE_DOCUMENT_SUCCESS = 'RETRIEVE_DOCUMENT_SUCCESS';
export const RETRIEVE_DOCUMENT_FAILED = 'RETRIEVE_DOCUMENT_FAILED';
export const UPDATE_DOCUMENT_START = 'UPDATE_DOCUMENT_START';
export const UPDATE_DOCUMENT_SUCCESS = 'UPDATE_DOCUMENT_SUCCESS';
export const UPDATE_DOCUMENT_FAILED = 'UPDATE_DOCUMENT_FAILED';
export const LIST_MORE_DOCUMENTS_START = 'LIST_MORE_DOCUMENTS_START';
export const LIST_MORE_DOCUMENTS_SUCCESS = 'LIST_MORE_DOCUMENTS_SUCCESS';
export const LIST_MORE_DOCUMENTS_FAILED = 'LIST_MORE_DOCUMENTS_FAILED';
export const DELETE_DOCUMENT_START = 'DELETE_DOCUMENT_START';
export const DELETE_DOCUMENT_SUCCESS = 'DELETE_DOCUMENT_SUCCESS';
export const DELETE_DOCUMENT_FAILED = 'DELETE_DOCUMENT_FAILED';

export function createDocument(document, target) {
    return dispatch => {
        dispatch(createDocumentStart(document, target));

        let headers = {},
            data = document;

        if (document.file) {
            headers['Content-Type'] = 'multipart/form-data';
            data = composeFormData(document);
        }

        axios
            .post(ENDPOINT_DOCUMENTS, data, {headers})
            .then(function(response) {
                dispatch(createDocumentSuccess(response.data, target));
            })
            .catch(function(error) {
                dispatch(
                    createDocumentFailed(
                        (error.response ? error.response.data : null), document, target
                    ),
                );
            });
    };
}

export function createDocumentStart(document, target) {
    return {
        type: CREATE_DOCUMENT_START,
        document,
        target
    };
}

export function createDocumentSuccess(document, target) {
    return {
        type: CREATE_DOCUMENT_SUCCESS,
        document,
        target
    };
}

export function createDocumentFailed(error, document, target) {
    return {
        type: CREATE_DOCUMENT_FAILED,
        error,
        document,
        target
    };
}

export function listDocuments(filter, selection, prev_selection) {
    return dispatch => {
        dispatch(listDocumentsStart(filter, selection, prev_selection));
        axios
            .get(ENDPOINT_DOCUMENTS, {params: filter})
            .then(function(response) {
                dispatch(listDocumentsSuccess(response.data, filter, selection));
            })
            .catch(function(error) {
                dispatch(
                    listDocumentsFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function listDocumentsStart(filter, selection, prev_selection) {
    return {
        type: LIST_DOCUMENTS_START,
        filter,
        selection,
        prev_selection,
    };
}

export function listDocumentsSuccess(response, filter, selection) {
    return {
        type: LIST_DOCUMENTS_SUCCESS,
        items: response.results,
        previous: response.previous,
        next: response.next,
        count: response.count,
        filter,
        selection,
    };
}

export function listDocumentsFailed(error, selection) {
    return {
        type: LIST_DOCUMENTS_FAILED,
        error,
        selection,
    };
}

export function retrieveDocument(id) {
    return dispatch => {
        dispatch(retrieveDocumentStart(id));
        axios
            .get(ENDPOINT_DOCUMENTS + id + '/')
            .then(function(response) {
                dispatch(retrieveDocumentSuccess(response.data, id));
            })
            .catch(function(error) {
                dispatch(
                    retrieveDocumentFailed(
                        error.response ? error.response.data : null, id
                    ),
                );
            });
    };
}

export function retrieveDocumentStart(id) {
    return {
        type: RETRIEVE_DOCUMENT_START,
        id,
    };
}

export function retrieveDocumentSuccess(document, id) {
    return {
        type: RETRIEVE_DOCUMENT_SUCCESS,
        document,
        id
    };
}

export function retrieveDocumentFailed(error, id) {
    return {
        type: RETRIEVE_DOCUMENT_FAILED,
        error,
        id
    };
}

export function updateDocument(id, document) {
    return dispatch => {
        dispatch(updateDocumentStart(id, document, id));

        let headers = {},
            data = document;
        if (document.file) {
            headers['Content-Type'] = 'multipart/form-data';
            data = composeFormData(document);
        }

        axios
            .patch(ENDPOINT_DOCUMENTS + id + '/', data, {
                headers: {...headers},
            })
            .then(function(response) {
                dispatch(updateDocumentSuccess(response.data, id));
            })
            .catch(function(error) {
                dispatch(
                    updateDocumentFailed(
                        (error.response ? error.response.data : null), document, id
                    ),
                );
            });
    };
}

export function updateDocumentStart(id, document, target) {
    return {
        type: UPDATE_DOCUMENT_START,
        id,
        document,
        target
    };
}

export function updateDocumentSuccess(document, target) {
    return {
        type: UPDATE_DOCUMENT_SUCCESS,
        document,
        target
    };
}

export function updateDocumentFailed(error, document, target) {
    return {
        type: UPDATE_DOCUMENT_FAILED,
        error,
        document,
        target
    };
}

export function listMoreDocuments(url, selection) {
    return dispatch => {
        dispatch(listMoreDocumentsStart(url, selection));
        axios
            .get(url)
            .then(function(response) {
                dispatch(listMoreDocumentsSuccess(response.data, selection));
            })
            .catch(function(error) {
                dispatch(
                    listMoreDocumentsFailed(
                        error.response ? error.response.data : null,
                        selection,
                    ),
                );
            });
    };
}

export function listMoreDocumentsStart(url, selection) {
    return {
        type: LIST_MORE_DOCUMENTS_START,
        url,
        selection,
    };
}

export function listMoreDocumentsSuccess(response, selection) {
    return {
        type: LIST_MORE_DOCUMENTS_SUCCESS,
        items: response.results,
        previous: response.previous,
        next: response.next,
        count: response.count,
        selection,
    };
}

export function listMoreDocumentsFailed(error) {
    return {
        type: LIST_MORE_DOCUMENTS_FAILED,
        error,
    };
}

export function deleteDocument(id) {
    return dispatch => {
        dispatch(deleteDocumentStart(id));
        axios.delete(ENDPOINT_DOCUMENTS + id + '/')
            .then(function () {
                dispatch(deleteDocumentSuccess(id));
            }).catch(function (response) {
            dispatch(deleteDocumentFailed(response.data, id));
        });
    }
}

export function deleteDocumentStart(id) {
    return {
        type: DELETE_DOCUMENT_START,
        id
    }
}

export function deleteDocumentSuccess(id) {
    return {
        type: DELETE_DOCUMENT_SUCCESS,
        id
    }
}

export function deleteDocumentFailed(error, id) {
    return {
        type: DELETE_DOCUMENT_FAILED,
        error,
        id
    }
}
