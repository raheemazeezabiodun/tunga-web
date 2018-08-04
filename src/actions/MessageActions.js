import axios from 'axios';
import {composeFormData, ENDPOINT_MESSAGES} from './utils/api';

export const CREATE_MESSAGE_START = 'CREATE_MESSAGE_START';
export const CREATE_MESSAGE_SUCCESS = 'CREATE_MESSAGE_SUCCESS';
export const CREATE_MESSAGE_FAILED = 'CREATE_MESSAGE_FAILED';
export const LIST_MESSAGES_START = 'LIST_MESSAGES_START';
export const LIST_MESSAGES_SUCCESS = 'LIST_MESSAGES_SUCCESS';
export const LIST_MESSAGES_FAILED = 'LIST_MESSAGES_FAILED';
export const RETRIEVE_MESSAGE_START = 'RETRIEVE_MESSAGE_START';
export const RETRIEVE_MESSAGE_SUCCESS = 'RETRIEVE_MESSAGE_SUCCESS';
export const RETRIEVE_MESSAGE_FAILED = 'RETRIEVE_MESSAGE_FAILED';
export const UPDATE_MESSAGE_START = 'UPDATE_MESSAGE_START';
export const UPDATE_MESSAGE_SUCCESS = 'UPDATE_MESSAGE_SUCCESS';
export const UPDATE_MESSAGE_FAILED = 'UPDATE_MESSAGE_FAILED';
export const LIST_MORE_MESSAGES_START = 'LIST_MORE_MESSAGES_START';
export const LIST_MORE_MESSAGES_SUCCESS = 'LIST_MORE_MESSAGES_SUCCESS';
export const LIST_MORE_MESSAGES_FAILED = 'LIST_MORE_MESSAGES_FAILED';
export const DELETE_MESSAGE_START = 'DELETE_MESSAGE_START';
export const DELETE_MESSAGE_SUCCESS = 'DELETE_MESSAGE_SUCCESS';
export const DELETE_MESSAGE_FAILED = 'DELETE_MESSAGE_FAILED';

export function createMessage(message, target) {
    return dispatch => {
        dispatch(createMessageStart(message, target));

        let headers = {},
            data = message;

        if (message.uploads && message.uploads.length) {
            headers['Content-Type'] = 'multipart/form-data';
            data = composeFormData(message);
        }

        axios
            .post(ENDPOINT_MESSAGES, data, {headers})
            .then(function(response) {
                dispatch(createMessageSuccess(response.data, target));
            })
            .catch(function(error) {
                dispatch(
                    createMessageFailed(
                        (error.response ? error.response.data : null), message, target
                    ),
                );
            });
    };
}

export function createMessageStart(message, target) {
    return {
        type: CREATE_MESSAGE_START,
        message,
        target
    };
}

export function createMessageSuccess(message, target) {
    return {
        type: CREATE_MESSAGE_SUCCESS,
        message,
        target
    };
}

export function createMessageFailed(error, message, target) {
    return {
        type: CREATE_MESSAGE_FAILED,
        error,
        message,
        target
    };
}

export function listMessages(filter, selection, prev_selection) {
    return dispatch => {
        dispatch(listMessagesStart(filter, selection, prev_selection));
        axios
            .get(ENDPOINT_MESSAGES, {params: filter})
            .then(function(response) {
                dispatch(listMessagesSuccess(response.data, filter, selection));
            })
            .catch(function(error) {
                dispatch(
                    listMessagesFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function listMessagesStart(filter, selection, prev_selection) {
    return {
        type: LIST_MESSAGES_START,
        filter,
        selection,
        prev_selection,
    };
}

export function listMessagesSuccess(response, filter, selection) {
    return {
        type: LIST_MESSAGES_SUCCESS,
        items: response.results,
        previous: response.previous,
        next: response.next,
        count: response.count,
        filter,
        selection,
    };
}

export function listMessagesFailed(error, selection) {
    return {
        type: LIST_MESSAGES_FAILED,
        error,
        selection,
    };
}

export function retrieveMessage(id) {
    return dispatch => {
        dispatch(retrieveMessageStart(id));
        axios
            .get(ENDPOINT_MESSAGES + id + '/')
            .then(function(response) {
                dispatch(retrieveMessageSuccess(response.data, id));
            })
            .catch(function(error) {
                dispatch(
                    retrieveMessageFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function retrieveMessageStart(id) {
    return {
        type: RETRIEVE_MESSAGE_START,
        id,
    };
}

export function retrieveMessageSuccess(message, id) {
    return {
        type: RETRIEVE_MESSAGE_SUCCESS,
        message,
        id
    };
}

export function retrieveMessageFailed(error, id) {
    return {
        type: RETRIEVE_MESSAGE_FAILED,
        error,
        id
    };
}

export function updateMessage(id, message) {
    return dispatch => {
        dispatch(updateMessageStart(id, message, id));

        let headers = {},
            data = message;
        if (message.uploads && message.uploads.length) {
            headers['Content-Type'] = 'multipart/form-data';
            data = composeFormData(message);
        }

        axios
            .patch(ENDPOINT_MESSAGES + id + '/', data, {
                headers: {...headers},
            })
            .then(function(response) {
                dispatch(updateMessageSuccess(response.data, id));
            })
            .catch(function(error) {
                dispatch(
                    updateMessageFailed(
                        (error.response ? error.response.data : null), message, id
                    ),
                );
            });
    };
}

export function updateMessageStart(id, message, target) {
    return {
        type: UPDATE_MESSAGE_START,
        id,
        message,
        target
    };
}

export function updateMessageSuccess(message, target) {
    return {
        type: UPDATE_MESSAGE_SUCCESS,
        message,
        target
    };
}

export function updateMessageFailed(error, message, target) {
    return {
        type: UPDATE_MESSAGE_FAILED,
        error,
        message,
        target
    };
}

export function listMoreMessages(url, selection) {
    return dispatch => {
        dispatch(listMoreMessagesStart(url, selection));
        axios
            .get(url)
            .then(function(response) {
                dispatch(listMoreMessagesSuccess(response.data, selection));
            })
            .catch(function(error) {
                dispatch(
                    listMoreMessagesFailed(
                        error.response ? error.response.data : null,
                        selection,
                    ),
                );
            });
    };
}

export function listMoreMessagesStart(url, selection) {
    return {
        type: LIST_MORE_MESSAGES_START,
        url,
        selection,
    };
}

export function listMoreMessagesSuccess(response, selection) {
    return {
        type: LIST_MORE_MESSAGES_SUCCESS,
        items: response.results,
        previous: response.previous,
        next: response.next,
        count: response.count,
        selection,
    };
}

export function listMoreMessagesFailed(error) {
    return {
        type: LIST_MORE_MESSAGES_FAILED,
        error,
    };
}

export function deleteMessage(id) {
    return dispatch => {
        dispatch(deleteMessageStart(id));
        axios.delete(ENDPOINT_MESSAGES + id + '/')
            .then(function () {
                dispatch(deleteMessageSuccess(id));
            }).catch(function (response) {
            dispatch(deleteMessageFailed(response.data, id));
        });
    }
}

export function deleteMessageStart(id) {
    return {
        type: DELETE_MESSAGE_START,
        id
    }
}

export function deleteMessageSuccess(id) {
    return {
        type: DELETE_MESSAGE_SUCCESS,
        id
    }
}

export function deleteMessageFailed(error, id) {
    return {
        type: DELETE_MESSAGE_FAILED,
        error,
        id
    }
}
