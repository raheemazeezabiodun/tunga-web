import axios from 'axios';
import {composeFormData, ENDPOINT_COMMENTS} from './utils/api';

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
export const LIST_MORE_COMMENTS_START = 'LIST_MORE_COMMENTS_START';
export const LIST_MORE_COMMENTS_SUCCESS = 'LIST_MORE_COMMENTS_SUCCESS';
export const LIST_MORE_COMMENTS_FAILED = 'LIST_MORE_COMMENTS_FAILED';
export const DELETE_COMMENT_START = 'DELETE_COMMENT_START';
export const DELETE_COMMENT_SUCCESS = 'DELETE_COMMENT_SUCCESS';
export const DELETE_COMMENT_FAILED = 'DELETE_COMMENT_FAILED';

export function createComment(comment, target) {
    return dispatch => {
        dispatch(createCommentStart(comment, target));

        let headers = {},
            data = comment;

        if (comment.uploads && comment.uploads.length) {
            headers['Content-Type'] = 'multipart/form-data';
            data = composeFormData(comment);
        }

        axios
            .post(ENDPOINT_COMMENTS, data, {headers})
            .then(function(response) {
                dispatch(createCommentSuccess(response.data, target));
            })
            .catch(function(error) {
                dispatch(
                    createCommentFailed(
                        (error.response ? error.response.data : null), comment, target
                    ),
                );
            });
    };
}

export function createCommentStart(comment, target) {
    return {
        type: CREATE_COMMENT_START,
        comment,
        target
    };
}

export function createCommentSuccess(comment, target) {
    return {
        type: CREATE_COMMENT_SUCCESS,
        comment,
        target
    };
}

export function createCommentFailed(error, comment, target) {
    return {
        type: CREATE_COMMENT_FAILED,
        error,
        comment,
        target
    };
}

export function listComments(filter, selection, prev_selection) {
    return dispatch => {
        dispatch(listCommentsStart(filter, selection, prev_selection));
        axios
            .get(ENDPOINT_COMMENTS, {params: filter})
            .then(function(response) {
                dispatch(listCommentsSuccess(response.data, filter, selection));
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

export function listCommentsStart(filter, selection, prev_selection) {
    return {
        type: LIST_COMMENTS_START,
        filter,
        selection,
        prev_selection,
    };
}

export function listCommentsSuccess(response, filter, selection) {
    return {
        type: LIST_COMMENTS_SUCCESS,
        items: response.results,
        previous: response.previous,
        next: response.next,
        count: response.count,
        filter,
        selection,
    };
}

export function listCommentsFailed(error, selection) {
    return {
        type: LIST_COMMENTS_FAILED,
        error,
        selection,
    };
}

export function retrieveComment(id) {
    return dispatch => {
        dispatch(retrieveCommentStart(id));
        axios
            .get(ENDPOINT_COMMENTS + id + '/')
            .then(function(response) {
                dispatch(retrieveCommentSuccess(response.data, id));
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

export function retrieveCommentSuccess(comment, id) {
    return {
        type: RETRIEVE_COMMENT_SUCCESS,
        comment,
        id
    };
}

export function retrieveCommentFailed(error, id) {
    return {
        type: RETRIEVE_COMMENT_FAILED,
        error,
        id
    };
}

export function updateComment(id, comment) {
    return dispatch => {
        dispatch(updateCommentStart(id, comment, id));

        let headers = {},
            data = comment;
        if (comment.uploads && comment.uploads.length) {
            headers['Content-Type'] = 'multipart/form-data';
            data = composeFormData(comment);
        }

        axios
            .patch(ENDPOINT_COMMENTS + id + '/', data, {
                headers: {...headers},
            })
            .then(function(response) {
                dispatch(updateCommentSuccess(response.data, id));
            })
            .catch(function(error) {
                dispatch(
                    updateCommentFailed(
                        (error.response ? error.response.data : null), comment, id
                    ),
                );
            });
    };
}

export function updateCommentStart(id, comment, target) {
    return {
        type: UPDATE_COMMENT_START,
        id,
        comment,
        target
    };
}

export function updateCommentSuccess(comment, target) {
    return {
        type: UPDATE_COMMENT_SUCCESS,
        comment,
        target
    };
}

export function updateCommentFailed(error, comment, target) {
    return {
        type: UPDATE_COMMENT_FAILED,
        error,
        comment,
        target
    };
}

export function listMoreComments(url, selection) {
    return dispatch => {
        dispatch(listMoreCommentsStart(url, selection));
        axios
            .get(url)
            .then(function(response) {
                dispatch(listMoreCommentsSuccess(response.data, selection));
            })
            .catch(function(error) {
                dispatch(
                    listMoreCommentsFailed(
                        error.response ? error.response.data : null,
                        selection,
                    ),
                );
            });
    };
}

export function listMoreCommentsStart(url, selection) {
    return {
        type: LIST_MORE_COMMENTS_START,
        url,
        selection,
    };
}

export function listMoreCommentsSuccess(response, selection) {
    return {
        type: LIST_MORE_COMMENTS_SUCCESS,
        items: response.results,
        previous: response.previous,
        next: response.next,
        count: response.count,
        selection,
    };
}

export function listMoreCommentsFailed(error) {
    return {
        type: LIST_MORE_COMMENTS_FAILED,
        error,
    };
}

export function deleteComment(id) {
    return dispatch => {
        dispatch(deleteCommentStart(id));
        axios.delete(ENDPOINT_COMMENTS + id + '/')
            .then(function () {
                dispatch(deleteCommentSuccess(id));
            }).catch(function (response) {
            dispatch(deleteCommentFailed(response.data, id));
        });
    }
}

export function deleteCommentStart(id) {
    return {
        type: DELETE_COMMENT_START,
        id
    }
}

export function deleteCommentSuccess(id) {
    return {
        type: DELETE_COMMENT_SUCCESS,
        id
    }
}

export function deleteCommentFailed(error, id) {
    return {
        type: DELETE_COMMENT_FAILED,
        error,
        id
    }
}
