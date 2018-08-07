import axios from 'axios';
import moment from 'moment';

import {ENDPOINT_CHANNEL, ENDPOINT_DIRECT_CHANNEL} from '../constants/Api';

import {
    sendGAEvent,
    GA_EVENT_CATEGORIES,
    GA_EVENT_ACTIONS,
    getGAUserType,
} from '../utils/tracking';
import {getUser} from '../utils/auth';
import { setLastChatAutoOpenAt } from '../utils/helpers';

export const CREATE_CHANNEL_START = 'CREATE_CHANNEL_START';
export const CREATE_CHANNEL_SUCCESS = 'CREATE_CHANNEL_SUCCESS';
export const CREATE_CHANNEL_FAILED = 'CREATE_CHANNEL_FAILED';
export const LIST_CHANNELS_START = 'LIST_CHANNELS_START';
export const LIST_CHANNELS_SUCCESS = 'LIST_CHANNELS_SUCCESS';
export const LIST_CHANNELS_FAILED = 'LIST_CHANNELS_FAILED';
export const LIST_MORE_CHANNELS_START = 'LIST_MORE_CHANNELS_START';
export const LIST_MORE_CHANNELS_SUCCESS = 'LIST_MORE_CHANNELS_SUCCESS';
export const LIST_MORE_CHANNELS_FAILED = 'LIST_MORE_CHANNELS_FAILED';
export const RETRIEVE_CHANNEL_START = 'RETRIEVE_CHANNEL_START';
export const RETRIEVE_CHANNEL_SUCCESS = 'RETRIEVE_CHANNEL_SUCCESS';
export const RETRIEVE_CHANNEL_FAILED = 'RETRIEVE_CHANNEL_FAILED';
export const RETRIEVE_DIRECT_CHANNEL_START = 'RETRIEVE_DIRECT_CHANNEL_START';
export const RETRIEVE_DIRECT_CHANNEL_SUCCESS =
    'RETRIEVE_DIRECT_CHANNEL_SUCCESS';
export const RETRIEVE_DIRECT_CHANNEL_FAILED = 'RETRIEVE_DIRECT_CHANNEL_FAILED';
export const UPDATE_CHANNEL_START = 'UPDATE_CHANNEL_START';
export const UPDATE_CHANNEL_SUCCESS = 'UPDATE_CHANNEL_SUCCESS';
export const UPDATE_CHANNEL_FAILED = 'UPDATE_CHANNEL_FAILED';
export const DELETE_CHANNEL_START = 'DELETE_CHANNEL_START';
export const DELETE_CHANNEL_SUCCESS = 'DELETE_CHANNEL_SUCCESS';
export const DELETE_CHANNEL_FAILED = 'DELETE_CHANNEL_FAILED';
export const LIST_CHANNEL_ACTIVITY_START = 'LIST_CHANNEL_ACTIVITY_START';
export const LIST_CHANNEL_ACTIVITY_SUCCESS = 'LIST_CHANNEL_ACTIVITY_SUCCESS';
export const LIST_CHANNEL_ACTIVITY_FAILED = 'LIST_CHANNEL_ACTIVITY_FAILED';
export const LIST_MORE_CHANNEL_ACTIVITY_START =
    'LIST_MORE_CHANNEL_ACTIVITY_START';
export const LIST_MORE_CHANNEL_ACTIVITY_SUCCESS =
    'LIST_MORE_CHANNEL_ACTIVITY_SUCCESS';
export const LIST_MORE_CHANNEL_ACTIVITY_FAILED =
    'LIST_MORE_CHANNEL_ACTIVITY_FAILED';
export const LIST_NEW_CHANNEL_ACTIVITY_START =
    'LIST_NEW_CHANNEL_ACTIVITY_START';
export const LIST_NEW_CHANNEL_ACTIVITY_SUCCESS =
    'LIST_NEW_CHANNEL_ACTIVITY_SUCCESS';
export const LIST_NEW_CHANNEL_ACTIVITY_FAILED =
    'LIST_NEW_CHANNEL_ACTIVITY_FAILED';
export const SHARE_CHANNEL_UPLOAD_SUCCESS = 'SHARE_CHANNEL_UPLOAD_SUCCESS';
export const UPDATE_CHANNEL_READ_START = 'UPDATE_CHANNEL_READ_START';
export const UPDATE_CHANNEL_READ_SUCCESS = 'UPDATE_CHANNEL_READ_SUCCESS';
export const UPDATE_CHANNEL_READ_FAILED = 'UPDATE_CHANNEL_READ_FAILED';
export const CREATE_SUPPORT_CHANNEL_START = 'CREATE_SUPPORT_CHANNEL_START';
export const CREATE_SUPPORT_CHANNEL_SUCCESS = 'CREATE_SUPPORT_CHANNEL_SUCCESS';
export const CREATE_SUPPORT_CHANNEL_FAILED = 'CREATE_SUPPORT_CHANNEL_FAILED';
export const CREATE_DEVELOPER_CHANNEL_START = 'CREATE_DEVELOPER_CHANNEL_START';
export const CREATE_DEVELOPER_CHANNEL_SUCCESS =
    'CREATE_DEVELOPER_CHANNEL_SUCCESS';
export const CREATE_DEVELOPER_CHANNEL_FAILED =
    'CREATE_DEVELOPER_CHANNEL_FAILED';
export const CREATE_TASK_CHANNEL_START = 'CREATE_TASK_CHANNEL_START';
export const CREATE_TASK_CHANNEL_SUCCESS = 'CREATE_TASK_CHANNEL_SUCCESS';
export const CREATE_TASK_CHANNEL_FAILED = 'CREATE_TASK_CHANNEL_FAILED';
export const AUTO_OPEN_CHAT_SUCCESS = 'AUTO_OPEN_CHAT_SUCCESS';
export const CHAT_START = 'CHAT_START';

export function createChannel(channel) {
    return dispatch => {
        dispatch(createChannelStart(channel));
        axios
            .post(ENDPOINT_CHANNEL, channel)
            .then(function(response) {
                dispatch(createChannelSuccess(response.data));
            })
            .catch(function(error) {
                dispatch(
                    createChannelFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function createChannelStart(channel) {
    return {
        type: CREATE_CHANNEL_START,
        channel,
    };
}

export function createChannelSuccess(channel) {
    return {
        type: CREATE_CHANNEL_SUCCESS,
        channel,
    };
}

export function createChannelFailed(error) {
    return {
        type: CREATE_CHANNEL_FAILED,
        error,
    };
}

export function listChannels(filter) {
    return dispatch => {
        dispatch(listChannelsStart(filter));
        axios
            .get(ENDPOINT_CHANNEL, {params: filter})
            .then(function(response) {
                dispatch(listChannelsSuccess(response.data));
            })
            .catch(function(error) {
                dispatch(
                    listChannelsFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function listChannelsStart(filter) {
    return {
        type: LIST_CHANNELS_START,
        filter,
    };
}

export function listChannelsSuccess(response) {
    return {
        type: LIST_CHANNELS_SUCCESS,
        items: response.results,
        previous: response.previous,
        next: response.next,
        count: response.count,
    };
}

export function listChannelsFailed(error) {
    return {
        type: LIST_CHANNELS_FAILED,
        error,
    };
}

export function retrieveChannel(id) {
    return dispatch => {
        dispatch(retrieveChannelStart(id));
        axios
            .get(ENDPOINT_CHANNEL + id + '/')
            .then(function(response) {
                dispatch(retrieveChannelSuccess(response.data));
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

export function retrieveChannelSuccess(channel) {
    return {
        type: RETRIEVE_CHANNEL_SUCCESS,
        channel,
    };
}

export function retrieveChannelFailed(error) {
    return {
        type: RETRIEVE_CHANNEL_FAILED,
        error,
    };
}

export function retrieveDirectChannel(user_id) {
    return dispatch => {
        dispatch(retrieveDirectChannelStart(user_id));
        axios
            .get(ENDPOINT_DIRECT_CHANNEL)
            .then(function(response) {
                dispatch(retrieveDirectChannelSuccess(response.data));
            })
            .catch(function(error) {
                dispatch(
                    retrieveDirectChannelFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function retrieveDirectChannelStart(id) {
    return {
        type: RETRIEVE_DIRECT_CHANNEL_START,
        id,
    };
}

export function retrieveDirectChannelSuccess(channel) {
    return {
        type: RETRIEVE_DIRECT_CHANNEL_SUCCESS,
        channel,
    };
}

export function retrieveDirectChannelFailed(error) {
    return {
        type: RETRIEVE_DIRECT_CHANNEL_FAILED,
        error,
    };
}

export function updateChannel(id, channel_data, uploads) {
    return dispatch => {
        dispatch(updateChannelStart(id));

        var headers = {},
            data = channel_data;

        if (uploads && uploads.length) {
            headers['Content-Type'] = 'multipart/form-data';

            data = new FormData();
            if (channel_data) {
                Object.keys(channel_data).map(key => {
                    if (
                        (Array.isArray(channel_data[key]) &&
                            channel_data[key].length) ||
                        (!Array.isArray(channel_data[key]) &&
                            channel_data[key] != null)
                    ) {
                        data.append(key, channel_data[key]);
                    }
                });
            }

            uploads.map((file, idx) => {
                data.append('file' + idx, file);
            });
        }

        axios
            .patch(ENDPOINT_CHANNEL + id + '/', data, {headers})
            .then(function(response) {
                dispatch(updateChannelSuccess(response.data));
            })
            .catch(function(error) {
                dispatch(
                    updateChannelFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function updateChannelStart(id) {
    return {
        type: UPDATE_CHANNEL_START,
        id,
    };
}

export function updateChannelSuccess(channel) {
    return {
        type: UPDATE_CHANNEL_SUCCESS,
        channel,
    };
}

export function updateChannelFailed(error) {
    return {
        type: UPDATE_CHANNEL_FAILED,
        error,
    };
}

export function shareChannelUploadSuccess(channel, number) {
    let uploads = channel.attachments.slice(0, number);
    return {
        type: SHARE_CHANNEL_UPLOAD_SUCCESS,
        channel,
        uploads,
    };
}

export function deleteChannel(id) {
    return dispatch => {
        dispatch(deleteChannelStart(id));
        axios
            .delete(ENDPOINT_CHANNEL + id + '/')
            .then(function() {
                dispatch(deleteChannelSuccess(id));
            })
            .catch(function(error) {
                dispatch(
                    deleteChannelFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function deleteChannelStart(id) {
    return {
        type: DELETE_CHANNEL_START,
        id,
    };
}

export function deleteChannelSuccess(id) {
    return {
        type: DELETE_CHANNEL_SUCCESS,
        id,
    };
}

export function deleteChannelFailed(error) {
    return {
        type: DELETE_CHANNEL_FAILED,
        error,
    };
}

export function createSupportChannel(data) {
    return dispatch => {
        dispatch(createSupportChannelStart());
        axios
            .post(ENDPOINT_CHANNEL + 'support/', data)
            .then(function(response) {
                dispatch(createSupportChannelSuccess(response.data));
            })
            .catch(function(error) {
                dispatch(
                    createSupportChannelFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function createSupportChannelStart() {
    return {
        type: CREATE_SUPPORT_CHANNEL_START,
    };
}

export function createSupportChannelSuccess(channel) {
    return {
        type: CREATE_SUPPORT_CHANNEL_SUCCESS,
        channel,
    };
}

export function createSupportChannelFailed(error) {
    return {
        type: CREATE_SUPPORT_CHANNEL_FAILED,
        error,
    };
}

export function createDeveloperChannel(data) {
    return dispatch => {
        dispatch(createDeveloperChannelStart());
        axios
            .post(ENDPOINT_CHANNEL + 'developer/', data)
            .then(function(response) {
                dispatch(createDeveloperChannelSuccess(response.data));
            })
            .catch(function(error) {
                dispatch(
                    createDeveloperChannelFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function createDeveloperChannelStart() {
    return {
        type: CREATE_DEVELOPER_CHANNEL_START,
    };
}

export function createDeveloperChannelSuccess(channel) {
    return {
        type: CREATE_DEVELOPER_CHANNEL_SUCCESS,
        channel,
    };
}

export function createDeveloperChannelFailed(error) {
    return {
        type: CREATE_DEVELOPER_CHANNEL_FAILED,
        error,
    };
}

export function createTaskChannel(task) {
    return dispatch => {
        dispatch(createTaskChannelStart());
        axios
            .post(ENDPOINT_CHANNEL + `task/${task}/`)
            .then(function(response) {
                dispatch(createTaskChannelSuccess(response.data));
            })
            .catch(function(error) {
                dispatch(
                    createTaskChannelFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function createTaskChannelStart() {
    return {
        type: CREATE_TASK_CHANNEL_START,
    };
}

export function createTaskChannelSuccess(channel) {
    return {
        type: CREATE_TASK_CHANNEL_SUCCESS,
        channel,
    };
}

export function createTaskChannelFailed(error) {
    return {
        type: CREATE_TASK_CHANNEL_FAILED,
        error,
    };
}

export function updateChannelRead(id, data) {
    return dispatch => {
        dispatch(updateChannelReadStart(id));
        axios
            .post(ENDPOINT_CHANNEL + id + '/read/', data)
            .then(function(response) {
                dispatch(updateChannelReadSuccess(response.data));
            })
            .catch(function(error) {
                dispatch(
                    updateChannelReadFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function updateChannelReadStart(id) {
    return {
        type: UPDATE_CHANNEL_READ_START,
        id,
    };
}

export function updateChannelReadSuccess(response) {
    return {
        type: UPDATE_CHANNEL_READ_SUCCESS,
        channel: response,
    };
}

export function updateChannelReadFailed(error) {
    return {
        type: UPDATE_CHANNEL_READ_FAILED,
        error,
    };
}

export function listMoreChannels(url) {
    return dispatch => {
        dispatch(listMoreChannelsStart(url));
        axios
            .get(url)
            .then(function(response) {
                dispatch(listMoreChannelsSuccess(response.data));
            })
            .catch(function(error) {
                dispatch(
                    listMoreChannelsFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function listMoreChannelsStart(url) {
    return {
        type: LIST_MORE_CHANNELS_START,
        url,
    };
}

export function listMoreChannelsSuccess(response) {
    return {
        type: LIST_MORE_CHANNELS_SUCCESS,
        items: response.results,
        previous: response.previous,
        next: response.next,
        count: response.count,
    };
}

export function listMoreChannelsFailed(error) {
    return {
        type: LIST_MORE_CHANNELS_FAILED,
        error,
    };
}

export function listChannelActivity(id, filter, update_read = true) {
    return dispatch => {
        let get_new = filter && filter.since > -1;
        dispatch(listChannelActivityStart(id, filter, get_new));
        axios
            .get(ENDPOINT_CHANNEL + id + '/activity/', {params: filter})
            .then(function(response) {
                if (
                    update_read &&
                    response.data.results &&
                    response.data.results.length
                ) {
                    dispatch(
                        updateChannelRead(id, {
                            last_read: response.data.results[0].id,
                        }),
                    );
                }
                dispatch(
                    listChannelActivitySuccess(
                        response.data,
                        id,
                        filter,
                        get_new,
                        !update_read,
                    ),
                );
            })
            .catch(function(error) {
                dispatch(
                    listChannelActivityFailed(
                        error.response ? error.response.data : null,
                        id,
                        get_new,
                    ),
                );
            });
    };
}

export function listChannelActivityStart(id, filter, new_only = false) {
    return {
        type: new_only
            ? LIST_NEW_CHANNEL_ACTIVITY_START
            : LIST_CHANNEL_ACTIVITY_START,
        id,
        filter,
    };
}

export function listChannelActivitySuccess(
    response,
    id,
    filter,
    new_only = false,
    update_new = false,
) {
    return {
        type: new_only
            ? LIST_NEW_CHANNEL_ACTIVITY_SUCCESS
            : LIST_CHANNEL_ACTIVITY_SUCCESS,
        items: response.results,
        previous: response.previous,
        next: response.next,
        count: response.count,
        id,
        filter,
        update_new: new_only && update_new,
    };
}

export function listChannelActivityFailed(error, id, new_only = false) {
    return {
        type: new_only
            ? LIST_NEW_CHANNEL_ACTIVITY_FAILED
            : LIST_CHANNEL_ACTIVITY_FAILED,
        error,
        id,
    };
}

export function listMoreChannelActivity(url) {
    var matches = url.match(/.*\/(\d+)\/activity/);
    var id = matches[1];

    return dispatch => {
        dispatch(listMoreChannelActivityStart(url, id));
        axios
            .get(url)
            .then(function(response) {
                dispatch(listMoreChannelActivitySuccess(response.data, id));
            })
            .catch(function(error) {
                dispatch(
                    listMoreChannelActivityFailed(
                        error.response ? error.response.data : null,
                        id,
                    ),
                );
            });
    };
}

export function listMoreChannelActivityStart(url, id) {
    return {
        type: LIST_MORE_CHANNEL_ACTIVITY_START,
        url,
        id,
    };
}

export function listMoreChannelActivitySuccess(response, id) {
    return {
        type: LIST_MORE_CHANNEL_ACTIVITY_SUCCESS,
        items: response.results,
        previous: response.previous,
        next: response.next,
        count: response.count,
        id,
    };
}

export function listMoreChannelActivityFailed(error, id) {
    return {
        type: LIST_MORE_CHANNEL_ACTIVITY_FAILED,
        error,
        id,
    };
}

export function recordAutoOpenChatSuccess() {

    setLastChatAutoOpenAt(moment.utc().format());

    return {
        type: AUTO_OPEN_CHAT_SUCCESS,
    };
}

export function recordChatStart() {
    sendGAEvent(
        GA_EVENT_CATEGORIES.CHAT,
        GA_EVENT_ACTIONS.START,
        getGAUserType(getUser()),
    );
    return {
        type: CHAT_START,
    };
}
