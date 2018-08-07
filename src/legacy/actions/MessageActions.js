import axios from 'axios';
import {ENDPOINT_MESSAGE} from '../constants/Api';
import {updateChannelRead} from './ChannelActions';

import {
    sendGAEvent,
    GA_EVENT_CATEGORIES,
    GA_EVENT_ACTIONS,
    getGAUserType,
} from '../utils/tracking';
import {getUser} from '../utils/auth';

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
export const DELETE_MESSAGE_START = 'DELETE_MESSAGE_START';
export const DELETE_MESSAGE_SUCCESS = 'DELETE_MESSAGE_SUCCESS';
export const DELETE_MESSAGE_FAILED = 'DELETE_MESSAGE_FAILED';
export const UPDATE_MESSAGE_READ_START = 'UPDATE_MESSAGE_READ_START';
export const UPDATE_MESSAGE_READ_SUCCESS = 'UPDATE_MESSAGE_READ_SUCCESS';
export const UPDATE_MESSAGE_READ_FAILED = 'UPDATE_MESSAGE_READ_FAILED';
export const LIST_MORE_MESSAGES_START = 'LIST_MORE_MESSAGES_START';
export const LIST_MORE_MESSAGES_SUCCESS = 'LIST_MORE_MESSAGES_SUCCESS';
export const LIST_MORE_MESSAGES_FAILED = 'LIST_MORE_MESSAGES_FAILED';
export const LIST_NEW_MESSAGES_START = 'LIST_NEW_MESSAGES_START';
export const LIST_NEW_MESSAGES_SUCCESS = 'LIST_NEW_MESSAGES_SUCCESS';
export const LIST_NEW_MESSAGES_FAILED = 'LIST_NEW_MESSAGES_FAILED';

export function createMessage(message, attachments) {
    return dispatch => {
        dispatch(createMessageStart(message));

        var headers = {},
            data = message;
        if (attachments && attachments.length) {
            headers['Content-Type'] = 'multipart/form-data';

            data = new FormData();
            Object.keys(message).map((key, idx) => {
                if (!Array.isArray(message[key]) || message[key].length) {
                    data.append(key, message[key]);
                }
            });

            attachments.map((file, idx) => {
                data.append('file' + idx, file);
            });
        }

        axios
            .post(ENDPOINT_MESSAGE, data, {headers})
            .then(function(response) {
                dispatch(createMessageSuccess(response.data));
            })
            .catch(function(error) {
                dispatch(
                    createMessageFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function createMessageStart(message) {
    return {
        type: CREATE_MESSAGE_START,
        message,
    };
}

export function createMessageSuccess(message) {
    sendGAEvent(
        GA_EVENT_CATEGORIES.MESSAGE,
        GA_EVENT_ACTIONS.SEND,
        getGAUserType(getUser()),
    );

    return {
        type: CREATE_MESSAGE_SUCCESS,
        message,
    };
}

export function createMessageFailed(error) {
    return {
        type: CREATE_MESSAGE_FAILED,
        error,
    };
}

export function listMessages(filter) {
    return dispatch => {
        let get_new = filter && filter.since > -1;
        dispatch(listMessagesStart(filter, get_new));
        axios
            .get(ENDPOINT_MESSAGE, {params: filter})
            .then(function(response) {
                if (
                    filter &&
                    filter.channel &&
                    response.data.results &&
                    response.data.results.length
                ) {
                    dispatch(
                        updateChannelRead(filter.channel, {
                            last_read: response.data.results[0].id,
                        }),
                    );
                }
                dispatch(listMessagesSuccess(response.data, filter, get_new));
            })
            .catch(function(error) {
                dispatch(
                    listMessagesFailed(
                        error.response ? error.response.data : null,
                        filter,
                        get_new,
                    ),
                );
            });
    };
}

export function listMessagesStart(filter, new_only = false) {
    return {
        type: new_only ? LIST_NEW_MESSAGES_START : LIST_MESSAGES_START,
        filter,
    };
}

export function listMessagesSuccess(response, filter, new_only = false) {
    return {
        type: new_only ? LIST_NEW_MESSAGES_SUCCESS : LIST_MESSAGES_SUCCESS,
        items: response.results,
        previous: response.previous,
        next: response.next,
        count: response.count,
        filter,
    };
}

export function listMessagesFailed(error, filter, new_only = false) {
    return {
        type: new_only ? LIST_NEW_MESSAGES_FAILED : LIST_MESSAGES_FAILED,
        error,
        filter,
    };
}

export function retrieveMessage(id) {
    return dispatch => {
        dispatch(retrieveMessageStart(id));
        axios
            .get(ENDPOINT_MESSAGE + id + '/')
            .then(function(response) {
                dispatch(retrieveMessageSuccess(response.data));
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

export function retrieveMessageSuccess(message) {
    return {
        type: RETRIEVE_MESSAGE_SUCCESS,
        message,
    };
}

export function retrieveMessageFailed(error) {
    return {
        type: RETRIEVE_MESSAGE_FAILED,
        error,
    };
}

export function updateMessage(id, data) {
    return dispatch => {
        dispatch(updateMessageStart(id));
        axios
            .patch(ENDPOINT_MESSAGE + id + '/', data)
            .then(function(response) {
                dispatch(updateMessageSuccess(response.data));
            })
            .catch(function(error) {
                dispatch(
                    updateMessageFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function updateMessageStart(id) {
    return {
        type: UPDATE_MESSAGE_START,
        id,
    };
}

export function updateMessageSuccess(message) {
    return {
        type: UPDATE_MESSAGE_SUCCESS,
        message,
    };
}

export function updateMessageFailed(error) {
    return {
        type: UPDATE_MESSAGE_FAILED,
        error,
    };
}

export function deleteMessage(id) {
    return dispatch => {
        dispatch(deleteMessageStart(id));
        axios
            .delete(ENDPOINT_MESSAGE + id + '/')
            .then(function() {
                dispatch(deleteMessageSuccess(id));
            })
            .catch(function(error) {
                dispatch(
                    deleteMessageFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function deleteMessageStart(id) {
    return {
        type: DELETE_MESSAGE_START,
        id,
    };
}

export function deleteMessageSuccess(id) {
    return {
        type: DELETE_MESSAGE_SUCCESS,
        id,
    };
}

export function deleteMessageFailed(error) {
    return {
        type: DELETE_MESSAGE_FAILED,
        error,
    };
}

export function updateMessageRead(id) {
    return dispatch => {
        dispatch(updateMessageReadStart(id));
        axios
            .post(ENDPOINT_MESSAGE + id + '/read/')
            .then(function(response) {
                dispatch(updateMessageReadSuccess(response.data));
            })
            .catch(function(error) {
                dispatch(
                    updateMessageReadFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function updateMessageReadStart(id) {
    return {
        type: UPDATE_MESSAGE_READ_START,
        id,
    };
}

export function updateMessageReadSuccess(response) {
    return {
        type: UPDATE_MESSAGE_READ_SUCCESS,
        message: response.message,
    };
}

export function updateMessageReadFailed(error) {
    return {
        type: UPDATE_MESSAGE_READ_FAILED,
        error,
    };
}

export function listMoreMessages(url) {
    return dispatch => {
        dispatch(listMoreMessagesStart(url));
        axios
            .get(url)
            .then(function(response) {
                dispatch(listMoreMessagesSuccess(response.data));
            })
            .catch(function(error) {
                dispatch(
                    listMoreMessagesFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function listMoreMessagesStart(url) {
    return {
        type: LIST_MORE_MESSAGES_START,
        url,
    };
}

export function listMoreMessagesSuccess(response) {
    return {
        type: LIST_MORE_MESSAGES_SUCCESS,
        items: response.results,
        previous: response.previous,
        next: response.next,
        count: response.count,
    };
}

export function listMoreMessagesFailed(error) {
    return {
        type: LIST_MORE_MESSAGES_FAILED,
        error,
    };
}
