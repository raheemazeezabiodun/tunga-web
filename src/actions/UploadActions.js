import axios from 'axios';
import {composeFormData, ENDPOINT_UPLOADS} from './utils/api';

export const CREATE_UPLOAD_START = 'CREATE_UPLOAD_START';
export const CREATE_UPLOAD_SUCCESS = 'CREATE_UPLOAD_SUCCESS';
export const CREATE_UPLOAD_FAILED = 'CREATE_UPLOAD_FAILED';
export const LIST_UPLOADS_START = 'LIST_UPLOADS_START';
export const LIST_UPLOADS_SUCCESS = 'LIST_UPLOADS_SUCCESS';
export const LIST_UPLOADS_FAILED = 'LIST_UPLOADS_FAILED';
export const RETRIEVE_UPLOAD_START = 'RETRIEVE_UPLOAD_START';
export const RETRIEVE_UPLOAD_SUCCESS = 'RETRIEVE_UPLOAD_SUCCESS';
export const RETRIEVE_UPLOAD_FAILED = 'RETRIEVE_UPLOAD_FAILED';
export const UPDATE_UPLOAD_START = 'UPDATE_UPLOAD_START';
export const UPDATE_UPLOAD_SUCCESS = 'UPDATE_UPLOAD_SUCCESS';
export const UPDATE_UPLOAD_FAILED = 'UPDATE_UPLOAD_FAILED';
export const LIST_MORE_UPLOADS_START = 'LIST_MORE_UPLOADS_START';
export const LIST_MORE_UPLOADS_SUCCESS = 'LIST_MORE_UPLOADS_SUCCESS';
export const LIST_MORE_UPLOADS_FAILED = 'LIST_MORE_UPLOADS_FAILED';
export const DELETE_UPLOAD_START = 'DELETE_UPLOAD_START';
export const DELETE_UPLOAD_SUCCESS = 'DELETE_UPLOAD_SUCCESS';
export const DELETE_UPLOAD_FAILED = 'DELETE_UPLOAD_FAILED';

export function createUpload(upload, target) {
    return dispatch => {
        dispatch(createUploadStart(upload, target));

        let headers = {},
            data = upload;

        if (upload.file) {
            headers['Content-Type'] = 'multipart/form-data';
            data = composeFormData(upload);
        }

        axios
            .post(ENDPOINT_UPLOADS, data, {headers})
            .then(function(response) {
                dispatch(createUploadSuccess(response.data, target));
            })
            .catch(function(error) {
                dispatch(
                    createUploadFailed(
                        (error.response ? error.response.data : null), upload, target
                    ),
                );
            });
    };
}

export function createUploadStart(upload, target) {
    return {
        type: CREATE_UPLOAD_START,
        upload,
        target
    };
}

export function createUploadSuccess(upload, target) {
    return {
        type: CREATE_UPLOAD_SUCCESS,
        upload,
        target
    };
}

export function createUploadFailed(error, upload, target) {
    return {
        type: CREATE_UPLOAD_FAILED,
        error,
        upload,
        target
    };
}

export function listUploads(filter, selection, prev_selection) {
    return dispatch => {
        dispatch(listUploadsStart(filter, selection, prev_selection));
        axios
            .get(ENDPOINT_UPLOADS, {params: filter})
            .then(function(response) {
                dispatch(listUploadsSuccess(response.data, filter, selection));
            })
            .catch(function(error) {
                dispatch(
                    listUploadsFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function listUploadsStart(filter, selection, prev_selection) {
    return {
        type: LIST_UPLOADS_START,
        filter,
        selection,
        prev_selection,
    };
}

export function listUploadsSuccess(response, filter, selection) {
    return {
        type: LIST_UPLOADS_SUCCESS,
        items: response.results,
        previous: response.previous,
        next: response.next,
        count: response.count,
        filter,
        selection,
    };
}

export function listUploadsFailed(error, selection) {
    return {
        type: LIST_UPLOADS_FAILED,
        error,
        selection,
    };
}

export function retrieveUpload(id) {
    return dispatch => {
        dispatch(retrieveUploadStart(id));
        axios
            .get(ENDPOINT_UPLOADS + id + '/')
            .then(function(response) {
                dispatch(retrieveUploadSuccess(response.data));
            })
            .catch(function(error) {
                dispatch(
                    retrieveUploadFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function retrieveUploadStart(id) {
    return {
        type: RETRIEVE_UPLOAD_START,
        id,
    };
}

export function retrieveUploadSuccess(upload) {
    return {
        type: RETRIEVE_UPLOAD_SUCCESS,
        upload,
    };
}

export function retrieveUploadFailed(error) {
    return {
        type: RETRIEVE_UPLOAD_FAILED,
        error,
    };
}

export function updateUpload(id, upload) {
    return dispatch => {
        dispatch(updateUploadStart(id, upload, id));

        let headers = {},
            data = upload;
        if (upload.file) {
            headers['Content-Type'] = 'multipart/form-data';
            data = composeFormData(upload);
        }

        axios
            .patch(ENDPOINT_UPLOADS + id + '/', data, {
                headers: {...headers},
            })
            .then(function(response) {
                dispatch(updateUploadSuccess(response.data, id));
            })
            .catch(function(error) {
                dispatch(
                    updateUploadFailed(
                        (error.response ? error.response.data : null), upload, id
                    ),
                );
            });
    };
}

export function updateUploadStart(id, upload, target) {
    return {
        type: UPDATE_UPLOAD_START,
        id,
        upload,
        target
    };
}

export function updateUploadSuccess(upload, target) {
    return {
        type: UPDATE_UPLOAD_SUCCESS,
        upload,
        target
    };
}

export function updateUploadFailed(error, upload, target) {
    return {
        type: UPDATE_UPLOAD_FAILED,
        error,
        upload,
        target
    };
}

export function listMoreUploads(url, selection) {
    return dispatch => {
        dispatch(listMoreUploadsStart(url, selection));
        axios
            .get(url)
            .then(function(response) {
                dispatch(listMoreUploadsSuccess(response.data, selection));
            })
            .catch(function(error) {
                dispatch(
                    listMoreUploadsFailed(
                        error.response ? error.response.data : null,
                        selection,
                    ),
                );
            });
    };
}

export function listMoreUploadsStart(url, selection) {
    return {
        type: LIST_MORE_UPLOADS_START,
        url,
        selection,
    };
}

export function listMoreUploadsSuccess(response, selection) {
    return {
        type: LIST_MORE_UPLOADS_SUCCESS,
        items: response.results,
        previous: response.previous,
        next: response.next,
        count: response.count,
        selection,
    };
}

export function listMoreUploadsFailed(error) {
    return {
        type: LIST_MORE_UPLOADS_FAILED,
        error,
    };
}

export function deleteUpload(id) {
    return dispatch => {
        dispatch(deleteUploadStart(id));
        axios.delete(ENDPOINT_UPLOADS + id + '/')
            .then(function () {
                dispatch(deleteUploadSuccess(id));
            }).catch(function (response) {
            dispatch(deleteUploadFailed(response.data, id));
        });
    }
}

export function deleteUploadStart(id) {
    return {
        type: DELETE_UPLOAD_START,
        id
    }
}

export function deleteUploadSuccess(id) {
    return {
        type: DELETE_UPLOAD_SUCCESS,
        id
    }
}

export function deleteUploadFailed(error, id) {
    return {
        type: DELETE_UPLOAD_FAILED,
        error,
        id
    }
}
