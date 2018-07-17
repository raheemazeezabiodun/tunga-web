import axios from 'axios';
import {ENDPOINT_PARTICIPATION} from './utils/api';

export const CREATE_PARTICIPATION_START = 'CREATE_PARTICIPATION_START';
export const CREATE_PARTICIPATION_SUCCESS = 'CREATE_PARTICIPATION_SUCCESS';
export const CREATE_PARTICIPATION_FAILED = 'CREATE_PARTICIPATION_FAILED';
export const LIST_PARTICIPATION_START = 'LIST_PARTICIPATION_START';
export const LIST_PARTICIPATION_SUCCESS = 'LIST_PARTICIPATION_SUCCESS';
export const LIST_PARTICIPATION_FAILED = 'LIST_PARTICIPATION_FAILED';
export const RETRIEVE_PARTICIPATION_START = 'RETRIEVE_PARTICIPATION_START';
export const RETRIEVE_PARTICIPATION_SUCCESS = 'RETRIEVE_PARTICIPATION_SUCCESS';
export const RETRIEVE_PARTICIPATION_FAILED = 'RETRIEVE_PARTICIPATION_FAILED';
export const UPDATE_PARTICIPATION_START = 'UPDATE_PARTICIPATION_START';
export const UPDATE_PARTICIPATION_SUCCESS = 'UPDATE_PARTICIPATION_SUCCESS';
export const UPDATE_PARTICIPATION_FAILED = 'UPDATE_PARTICIPATION_FAILED';
export const LIST_MORE_PARTICIPATION_START = 'LIST_MORE_PARTICIPATION_START';
export const LIST_MORE_PARTICIPATION_SUCCESS = 'LIST_MORE_PARTICIPATION_SUCCESS';
export const LIST_MORE_PARTICIPATION_FAILED = 'LIST_MORE_PARTICIPATION_FAILED';
export const DELETE_PARTICIPATION_START = 'DELETE_PARTICIPATION_START';
export const DELETE_PARTICIPATION_SUCCESS = 'DELETE_PARTICIPATION_SUCCESS';
export const DELETE_PARTICIPATION_FAILED = 'DELETE_PARTICIPATION_FAILED';

export function createParticipation(participation, target) {
    return dispatch => {
        dispatch(createParticipationStart(participation, target));

        let headers = {};

        axios
            .post(ENDPOINT_PARTICIPATION, participation, {headers})
            .then(function(response) {
                dispatch(createParticipationSuccess(response.data, target));
            })
            .catch(function(error) {
                dispatch(
                    createParticipationFailed(
                        (error.response ? error.response.data : null), participation, target
                    ),
                );
            });
    };
}

export function createParticipationStart(participation, target) {
    return {
        type: CREATE_PARTICIPATION_START,
        participation,
        target
    };
}

export function createParticipationSuccess(participation, target) {
    return {
        type: CREATE_PARTICIPATION_SUCCESS,
        participation,
        target
    };
}

export function createParticipationFailed(error, participation, target) {
    return {
        type: CREATE_PARTICIPATION_FAILED,
        error,
        participation,
        target
    };
}

export function listParticipation(filter, selection, prev_selection) {
    return dispatch => {
        dispatch(listParticipationStart(filter, selection, prev_selection));
        axios
            .get(ENDPOINT_PARTICIPATION, {params: filter})
            .then(function(response) {
                dispatch(listParticipationSuccess(response.data, filter, selection));
            })
            .catch(function(error) {
                dispatch(
                    listParticipationFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function listParticipationStart(filter, selection, prev_selection) {
    return {
        type: LIST_PARTICIPATION_START,
        filter,
        selection,
        prev_selection,
    };
}

export function listParticipationSuccess(response, filter, selection) {
    return {
        type: LIST_PARTICIPATION_SUCCESS,
        items: response.results,
        previous: response.previous,
        next: response.next,
        count: response.count,
        filter,
        selection,
    };
}

export function listParticipationFailed(error, selection) {
    return {
        type: LIST_PARTICIPATION_FAILED,
        error,
        selection,
    };
}

export function retrieveParticipation(id) {
    return dispatch => {
        dispatch(retrieveParticipationStart(id));
        axios
            .get(ENDPOINT_PARTICIPATION + id + '/')
            .then(function(response) {
                dispatch(retrieveParticipationSuccess(response.data, id));
            })
            .catch(function(error) {
                dispatch(
                    retrieveParticipationFailed(
                        error.response ? error.response.data : null, id
                    ),
                );
            });
    };
}

export function retrieveParticipationStart(id) {
    return {
        type: RETRIEVE_PARTICIPATION_START,
        id,
    };
}

export function retrieveParticipationSuccess(participation, id) {
    return {
        type: RETRIEVE_PARTICIPATION_SUCCESS,
        participation,
        id
    };
}

export function retrieveParticipationFailed(error, id) {
    return {
        type: RETRIEVE_PARTICIPATION_FAILED,
        error,
        id
    };
}

export function updateParticipation(id, participation) {
    return dispatch => {
        dispatch(updateParticipationStart(id, participation, id));

        let headers = {};

        axios
            .patch(ENDPOINT_PARTICIPATION + id + '/', participation, {
                headers: {...headers},
            })
            .then(function(response) {
                dispatch(updateParticipationSuccess(response.data, id));
            })
            .catch(function(error) {
                dispatch(
                    updateParticipationFailed(
                        (error.response ? error.response.data : null), participation, id
                    ),
                );
            });
    };
}

export function updateParticipationStart(id, participation, target) {
    return {
        type: UPDATE_PARTICIPATION_START,
        id,
        participation,
        target
    };
}

export function updateParticipationSuccess(participation, target) {
    return {
        type: UPDATE_PARTICIPATION_SUCCESS,
        participation,
        target
    };
}

export function updateParticipationFailed(error, participation, target) {
    return {
        type: UPDATE_PARTICIPATION_FAILED,
        error,
        participation,
        target
    };
}

export function listMoreParticipation(url, selection) {
    return dispatch => {
        dispatch(listMoreParticipationStart(url, selection));
        axios
            .get(url)
            .then(function(response) {
                dispatch(listMoreParticipationSuccess(response.data, selection));
            })
            .catch(function(error) {
                dispatch(
                    listMoreParticipationFailed(
                        error.response ? error.response.data : null,
                        selection,
                    ),
                );
            });
    };
}

export function listMoreParticipationStart(url, selection) {
    return {
        type: LIST_MORE_PARTICIPATION_START,
        url,
        selection,
    };
}

export function listMoreParticipationSuccess(response, selection) {
    return {
        type: LIST_MORE_PARTICIPATION_SUCCESS,
        items: response.results,
        previous: response.previous,
        next: response.next,
        count: response.count,
        selection,
    };
}

export function listMoreParticipationFailed(error) {
    return {
        type: LIST_MORE_PARTICIPATION_FAILED,
        error,
    };
}

export function deleteParticipation(id) {
    return dispatch => {
        dispatch(deleteParticipationStart(id));
        axios.delete(ENDPOINT_PARTICIPATION + id + '/')
            .then(function () {
                dispatch(deleteParticipationSuccess(id));
            }).catch(function (response) {
            dispatch(deleteParticipationFailed(response.data, id));
        });
    }
}

export function deleteParticipationStart(id) {
    return {
        type: DELETE_PARTICIPATION_START,
        id
    }
}

export function deleteParticipationSuccess(id) {
    return {
        type: DELETE_PARTICIPATION_SUCCESS,
        id
    }
}

export function deleteParticipationFailed(error, id) {
    return {
        type: DELETE_PARTICIPATION_FAILED,
        error,
        id
    }
}
