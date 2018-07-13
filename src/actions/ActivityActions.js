import axios from 'axios';
import {ENDPOINT_ACTIVITIES} from './utils/api';

export const LIST_ACTIVITIES_START = 'LIST_ACTIVITIES_START';
export const LIST_ACTIVITIES_SUCCESS = 'LIST_ACTIVITIES_SUCCESS';
export const LIST_ACTIVITIES_FAILED = 'LIST_ACTIVITIES_FAILED';
export const LIST_MORE_ACTIVITIES_START = 'LIST_MORE_ACTIVITIES_START';
export const LIST_MORE_ACTIVITIES_SUCCESS = 'LIST_MORE_ACTIVITIES_SUCCESS';
export const LIST_MORE_ACTIVITIES_FAILED = 'LIST_MORE_ACTIVITIES_FAILED';
export const RETRIEVE_ACTIVITY_START = 'RETRIEVE_ACTIVITY_START';
export const RETRIEVE_ACTIVITY_SUCCESS = 'RETRIEVE_ACTIVITY_SUCCESS';
export const RETRIEVE_ACTIVITY_FAILED = 'RETRIEVE_ACTIVITY_FAILED';

export function listActivities(filter, selection, prev_selection) {
    return dispatch => {
        dispatch(listActivitiesStart(filter, selection, prev_selection));
        axios
            .get(ENDPOINT_ACTIVITIES, {params: filter})
            .then(function(response) {
                dispatch(listActivitiesSuccess(response.data, filter, selection));
            })
            .catch(function(error) {
                dispatch(
                    listActivitiesFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function listActivitiesStart(filter, selection, prev_selection) {
    return {
        type: LIST_ACTIVITIES_START,
        filter,
        selection,
        prev_selection,
    };
}

export function listActivitiesSuccess(response, filter, selection) {
    return {
        type: LIST_ACTIVITIES_SUCCESS,
        items: response.results,
        previous: response.previous,
        next: response.next,
        count: response.count,
        filter,
        selection,
    };
}

export function listActivitiesFailed(error, selection) {
    return {
        type: LIST_ACTIVITIES_FAILED,
        error,
        selection,
    };
}

export function retrieveActivity(id) {
    return dispatch => {
        dispatch(retrieveActivityStart(id));
        axios
            .get(ENDPOINT_ACTIVITIES + id + '/')
            .then(function(response) {
                dispatch(retrieveActivitySuccess(response.data));
            })
            .catch(function(error) {
                dispatch(
                    retrieveActivityFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function retrieveActivityStart(id) {
    return {
        type: RETRIEVE_ACTIVITY_START,
        id,
    };
}

export function retrieveActivitySuccess(activity) {
    return {
        type: RETRIEVE_ACTIVITY_SUCCESS,
        activity,
    };
}

export function retrieveActivityFailed(error) {
    return {
        type: RETRIEVE_ACTIVITY_FAILED,
        error,
    };
}

export function listMoreActivities(url, selection) {
    return dispatch => {
        dispatch(listMoreActivitiesStart(url, selection));
        axios
            .get(url)
            .then(function(response) {
                dispatch(listMoreActivitiesSuccess(response.data, selection));
            })
            .catch(function(error) {
                dispatch(
                    listMoreActivitiesFailed(
                        error.response ? error.response.data : null,
                        selection,
                    ),
                );
            });
    };
}

export function listMoreActivitiesStart(url, selection) {
    return {
        type: LIST_MORE_ACTIVITIES_START,
        url,
        selection,
    };
}

export function listMoreActivitiesSuccess(response, selection) {
    return {
        type: LIST_MORE_ACTIVITIES_SUCCESS,
        items: response.results,
        previous: response.previous,
        next: response.next,
        count: response.count,
        selection,
    };
}

export function listMoreActivitiesFailed(error) {
    return {
        type: LIST_MORE_ACTIVITIES_FAILED,
        error,
    };
}
