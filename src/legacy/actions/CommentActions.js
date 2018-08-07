import axios from 'axios';
import {ENDPOINT_COMMENT} from '../constants/Api';

export const CREATE_COMMENT_START = 'CREATE_COMMENT_START';
export const CREATE_COMMENT_SUCCESS = 'CREATE_COMMENT_SUCCESS';
export const CREATE_COMMENT_FAILED = 'CREATE_COMMENT_FAILED';
export const LIST_COMMENTS_START = 'LIST_COMMENTS_START';
export const LIST_COMMENTS_SUCCESS = 'LIST_COMMENTS_SUCCESS';
export const LIST_COMMENTS_FAILED = 'LIST_COMMENTS_FAILED';
export const RETRIEVE_COMMENT_START = 'RETRIEVE_COMMENT_START';
export const RETRIEVE_COMMENT_SUCCESS = 'RETRIEVE_COMMENT_SUCCESS';
export const RETRIEVE_COMMENT_FAILED = 'RETRIEVE_COMMENT_FAILED';
export const UPDATE_COMMENT_START = 'UPDATE_COMMENT_START';
export const UPDATE_COMMENT_SUCCESS = 'UPDATE_COMMENT_SUCCESS';
export const UPDATE_COMMENT_FAILED = 'UPDATE_COMMENT_FAILED';
export const DELETE_COMMENT_START = 'DELETE_COMMENT_START';
export const DELETE_COMMENT_SUCCESS = 'DELETE_COMMENT_SUCCESS';
export const DELETE_COMMENT_FAILED = 'DELETE_COMMENT_FAILED';
export const LIST_MORE_COMMENTS_START = 'LIST_MORE_COMMENTS_START';
export const LIST_MORE_COMMENTS_SUCCESS = 'LIST_MORE_COMMENTS_SUCCESS';
export const LIST_MORE_COMMENTS_FAILED = 'LIST_MORE_COMMENTS_FAILED';

export function createComment(comment, attachments) {
    return dispatch => {
        dispatch(createCommentStart(comment));

        var headers = {},
            data = comment;
        if (attachments && attachments.length) {
            headers['Content-Type'] = 'multipart/form-data';

            data = new FormData();
            Object.keys(comment).map((key, idx) => {
                if (!Array.isArray(comment[key]) || comment[key].length) {
                    data.append(key, comment[key]);
                }
            });

            attachments.map((file, idx) => {
                data.append('file' + idx, file);
            });
        }

        axios
            .post(ENDPOINT_COMMENT, data, {headers})
            .then(function(response) {
                dispatch(createCommentSuccess(response.data));
            })
            .catch(function(error) {
                dispatch(
                    createCommentFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function createCommentStart(comment) {
    return {
        type: CREATE_COMMENT_START,
        comment,
    };
}

export function createCommentSuccess(comment) {
    return {
        type: CREATE_COMMENT_SUCCESS,
        comment,
    };
}

export function createCommentFailed(error) {
    return {
        type: CREATE_COMMENT_FAILED,
        error,
    };
}

export function listComments(filter) {
    return dispatch => {
        dispatch(listCommentsStart(filter));
        axios
            .get(ENDPOINT_COMMENT, {params: filter})
            .then(function(response) {
                dispatch(listCommentsSuccess(response.data));
            })
            .catch(function(error) {
                dispatch(
                    listCommentsFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function listCommentsStart(filter) {
    return {
        type: LIST_COMMENTS_START,
        filter,
    };
}

export function listCommentsSuccess(response) {
    return {
        type: LIST_COMMENTS_SUCCESS,
        items: response.results,
        previous: response.previous,
        next: response.next,
        count: response.count,
    };
}

export function listCommentsFailed(error) {
    return {
        type: LIST_COMMENTS_FAILED,
        error,
    };
}

export function retrieveComment(id) {
    return dispatch => {
        dispatch(retrieveCommentStart(id));
        axios
            .get(ENDPOINT_COMMENT + id + '/')
            .then(function(response) {
                dispatch(retrieveCommentSuccess(response.data));
            })
            .catch(function(error) {
                dispatch(
                    retrieveCommentFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function retrieveCommentStart(id) {
    return {
        type: RETRIEVE_COMMENT_START,
        id,
    };
}

export function retrieveCommentSuccess(comment) {
    return {
        type: RETRIEVE_COMMENT_SUCCESS,
        comment,
    };
}

export function retrieveCommentFailed(error) {
    return {
        type: RETRIEVE_COMMENT_FAILED,
        error,
    };
}

export function updateComment(id, comment) {
    return dispatch => {
        dispatch(updateCommentStart(id));
        axios
            .patch(ENDPOINT_COMMENT + id + '/', comment)
            .then(function(response) {
                dispatch(updateCommentSuccess(response.data));
            })
            .catch(function(error) {
                dispatch(
                    updateCommentFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function updateCommentStart(id) {
    return {
        type: UPDATE_COMMENT_START,
        id,
    };
}

export function updateCommentSuccess(comment) {
    return {
        type: UPDATE_COMMENT_SUCCESS,
        comment,
    };
}

export function updateCommentFailed(error) {
    return {
        type: UPDATE_COMMENT_FAILED,
        error,
    };
}

export function deleteComment(id) {
    return dispatch => {
        dispatch(deleteCommentStart(id));
        axios
            .delete(ENDPOINT_COMMENT + id + '/', {})
            .then(function() {
                dispatch(deleteCommentSuccess(id));
            })
            .catch(function(error) {
                dispatch(
                    deleteCommentFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function deleteCommentStart(id) {
    return {
        type: DELETE_COMMENT_START,
        id,
    };
}

export function deleteCommentSuccess(id) {
    return {
        type: DELETE_COMMENT_SUCCESS,
        id,
    };
}

export function deleteCommentFailed(error) {
    return {
        type: DELETE_COMMENT_FAILED,
        error,
    };
}

export function listMoreComments(url) {
    return dispatch => {
        dispatch(listMoreCommentsStart(url));
        axios
            .get(url)
            .then(function(response) {
                dispatch(listMoreCommentsSuccess(response.data));
            })
            .catch(function(error) {
                dispatch(
                    listMoreCommentsFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function listMoreCommentsStart(url) {
    return {
        type: LIST_MORE_COMMENTS_START,
        url,
    };
}

export function listMoreCommentsSuccess(response) {
    return {
        type: LIST_MORE_COMMENTS_SUCCESS,
        items: response.results,
        previous: response.previous,
        next: response.next,
        count: response.count,
    };
}

export function listMoreCommentsFailed(error) {
    return {
        type: LIST_MORE_COMMENTS_FAILED,
        error,
    };
}
