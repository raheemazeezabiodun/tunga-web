import axios from 'axios';
import {composeFormData, ENDPOINT_CHANNELS} from './utils/api';

export const CREATE_CHANNEL_START = 'CREATE_CHANNEL_START';
export const CREATE_CHANNEL_SUCCESS = 'CREATE_CHANNEL_SUCCESS';
export const CREATE_CHANNEL_FAILED = 'CREATE_CHANNEL_FAILED';
export const RETRIEVE_CHANNEL_START = 'RETRIEVE_CHANNEL_START';
export const RETRIEVE_CHANNEL_SUCCESS = 'RETRIEVE_CHANNEL_SUCCESS';
export const RETRIEVE_CHANNEL_FAILED = 'RETRIEVE_CHANNEL_FAILED';
export const UPDATE_CHANNEL_START = 'UPDATE_CHANNEL_START';
export const UPDATE_CHANNEL_SUCCESS = 'UPDATE_CHANNEL_SUCCESS';
export const UPDATE_CHANNEL_FAILED = 'UPDATE_CHANNEL_FAILED';

export function createChannel(data) {
    return dispatch => {
        dispatch(createChannelStart());

        let headers = {};

        axios
            .post(`${ENDPOINT_CHANNELS}support/`, data, {headers})
            .then(function(response) {
                dispatch(createChannelSuccess(response.data));
            })
            .catch(function(error) {
                dispatch(
                    createChannelFailed(
                        (error.response ? error.response.data : null)
                    ),
                );
            });
    };
}

export function createChannelStart() {
    return {
        type: CREATE_CHANNEL_START,
    };
}

export function createChannelSuccess(channel) {
    return {
        type: CREATE_CHANNEL_SUCCESS,
        channel
    };
}

export function createChannelFailed(error) {
    return {
        type: CREATE_CHANNEL_FAILED,
        error,
    };
}

export function retrieveChannel(id) {
    return dispatch => {
        dispatch(retrieveChannelStart(id));
        axios
            .get(ENDPOINT_CHANNELS + id + '/')
            .then(function(response) {
                dispatch(retrieveChannelSuccess(response.data, id));
            })
            .catch(function(error) {
                dispatch(
                    retrieveChannelFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function retrieveChannelStart(id) {
    return {
        type: RETRIEVE_CHANNEL_START,
        id,
    };
}

export function retrieveChannelSuccess(channel, id) {
    return {
        type: RETRIEVE_CHANNEL_SUCCESS,
        channel,
        id
    };
}

export function retrieveChannelFailed(error, id) {
    return {
        type: RETRIEVE_CHANNEL_FAILED,
        error,
        id
    };
}

export function updateChannel(id, channel) {
    return dispatch => {
        dispatch(updateChannelStart(id, channel, id));

        let headers = {};

        axios
            .patch(ENDPOINT_CHANNELS + id + '/', channel, {
                headers: {...headers},
            })
            .then(function(response) {
                dispatch(updateChannelSuccess(response.data, id));
            })
            .catch(function(error) {
                dispatch(
                    updateChannelFailed(
                        (error.response ? error.response.data : null), channel, id
                    ),
                );
            });
    };
}

export function updateChannelStart(id, channel, target) {
    return {
        type: UPDATE_CHANNEL_START,
        id,
        channel,
        target
    };
}

export function updateChannelSuccess(channel, target) {
    return {
        type: UPDATE_CHANNEL_SUCCESS,
        channel,
        target
    };
}

export function updateChannelFailed(error, channel, target) {
    return {
        type: UPDATE_CHANNEL_FAILED,
        error,
        channel,
        target
    };
}
