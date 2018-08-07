import {combineReducers} from 'redux';
import * as NotificationActions from '../actions/NotificationActions';

function notifications(state = {}, action) {
    switch (action.type) {
        case NotificationActions.GET_NOTIFICATIONS_SUCCESS:
            return action.notifications;
        case NotificationActions.GET_NOTIFICATIONS_FAILED:
            return {};
        default:
            return state;
    }
}

function isRetrieving(state = false, action) {
    switch (action.type) {
        case NotificationActions.GET_NOTIFICATIONS_START:
            return true;
        case NotificationActions.GET_NOTIFICATIONS_SUCCESS:
        case NotificationActions.GET_NOTIFICATIONS_FAILED:
            return false;
        default:
            return state;
    }
}

const Notification = combineReducers({
    notifications,
    isRetrieving,
});

export default Notification;
