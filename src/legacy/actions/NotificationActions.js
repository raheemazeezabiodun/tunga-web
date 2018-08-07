import axios from 'axios';
import {ENDPOINT_NOTIFICATION} from '../constants/Api';

export const GET_NOTIFICATIONS_START = 'GET_NOTIFICATIONS_START';
export const GET_NOTIFICATIONS_SUCCESS = 'GET_NOTIFICATIONS_SUCCESS';
export const GET_NOTIFICATIONS_FAILED = 'GET_NOTIFICATIONS_FAILED';

export function getNotifications() {
    return dispatch => {
        return;
        dispatch(getNotificationsStart());
        axios
            .get(ENDPOINT_NOTIFICATION)
            .then(function(response) {
                dispatch(getNotificationsSuccess(response.data));
            })
            .catch(function(error) {
                dispatch(
                    getNotificationsFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function getNotificationsStart() {
    return {
        type: GET_NOTIFICATIONS_START,
    };
}

export function getNotificationsSuccess(notifications) {
    return {
        type: GET_NOTIFICATIONS_SUCCESS,
        notifications,
    };
}

export function getNotificationsFailed(error) {
    return {
        type: GET_NOTIFICATIONS_FAILED,
        error,
    };
}
