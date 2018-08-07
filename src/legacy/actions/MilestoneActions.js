import axios from 'axios';
import {ENDPOINT_MILESTONE} from '../constants/Api';

export const CREATE_MILESTONE_START = 'CREATE_MILESTONE_START';
export const CREATE_MILESTONE_SUCCESS = 'CREATE_MILESTONE_SUCCESS';
export const CREATE_MILESTONE_FAILED = 'CREATE_MILESTONE_FAILED';
export const LIST_MILESTONES_START = 'LIST_MILESTONES_START';
export const LIST_MILESTONES_SUCCESS = 'LIST_MILESTONES_SUCCESS';
export const LIST_MILESTONES_FAILED = 'LIST_MILESTONES_FAILED';
export const RETRIEVE_MILESTONE_START = 'RETRIEVE_MILESTONE_START';
export const RETRIEVE_MILESTONE_SUCCESS = 'RETRIEVE_MILESTONE_SUCCESS';
export const RETRIEVE_MILESTONE_FAILED = 'RETRIEVE_MILESTONE_FAILED';
export const UPDATE_MILESTONE_START = 'UPDATE_MILESTONE_START';
export const UPDATE_MILESTONE_SUCCESS = 'UPDATE_MILESTONE_SUCCESS';
export const UPDATE_MILESTONE_FAILED = 'UPDATE_MILESTONE_FAILED';
export const DELETE_MILESTONE_START = 'DELETE_MILESTONE_START';
export const DELETE_MILESTONE_SUCCESS = 'DELETE_MILESTONE_SUCCESS';
export const DELETE_MILESTONE_FAILED = 'DELETE_MILESTONE_FAILED';
export const LIST_MORE_MILESTONES_START = 'LIST_MORE_MILESTONES_START';
export const LIST_MORE_MILESTONES_SUCCESS = 'LIST_MORE_MILESTONES_SUCCESS';
export const LIST_MORE_MILESTONES_FAILED = 'LIST_MORE_MILESTONES_FAILED';

export function createMilestone(milestone, attachments) {
    return dispatch => {
        dispatch(createMilestoneStart(milestone));

        var headers = {},
            data = milestone;
        if (attachments.length) {
            headers['Content-Type'] = 'multipart/form-data';

            data = new FormData();
            Object.keys(milestone).map((key, idx) => {
                if (
                    (Array.isArray(milestone[key]) && milestone[key].length) ||
                    (!Array.isArray(milestone[key]) && milestone[key] != null)
                ) {
                    data.append(key, milestone[key]);
                }
            });

            attachments.map((file, idx) => {
                data.append('file' + idx, file);
            });
        }

        axios
            .post(ENDPOINT_MILESTONE, data, {headers})
            .then(function(response) {
                dispatch(createMilestoneSuccess(response.data));
            })
            .catch(function(error) {
                dispatch(
                    createMilestoneFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function createMilestoneStart(milestone) {
    return {
        type: CREATE_MILESTONE_START,
        milestone,
    };
}

export function createMilestoneSuccess(milestone) {
    return {
        type: CREATE_MILESTONE_SUCCESS,
        milestone,
    };
}

export function createMilestoneFailed(error) {
    return {
        type: CREATE_MILESTONE_FAILED,
        error,
    };
}

export function listMilestones(filter) {
    return dispatch => {
        dispatch(listMilestonesStart(filter));
        axios
            .get(ENDPOINT_MILESTONE, {params: filter})
            .then(function(response) {
                dispatch(listMilestonesSuccess(response.data));
            })
            .catch(function(error) {
                dispatch(
                    listMilestonesFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function listMilestonesStart(filter) {
    return {
        type: LIST_MILESTONES_START,
        filter,
    };
}

export function listMilestonesSuccess(response) {
    return {
        type: LIST_MILESTONES_SUCCESS,
        items: response.results,
        previous: response.previous,
        next: response.next,
        count: response.count,
    };
}

export function listMilestonesFailed(error) {
    return {
        type: LIST_MILESTONES_FAILED,
        error,
    };
}

export function retrieveMilestone(id) {
    return dispatch => {
        dispatch(retrieveMilestoneStart(id));
        axios
            .get(ENDPOINT_MILESTONE + id + '/')
            .then(function(response) {
                dispatch(retrieveMilestoneSuccess(response.data));
            })
            .catch(function(error) {
                dispatch(
                    retrieveMilestoneFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function retrieveMilestoneStart(id) {
    return {
        type: RETRIEVE_MILESTONE_START,
        id,
    };
}

export function retrieveMilestoneSuccess(milestone) {
    return {
        type: RETRIEVE_MILESTONE_SUCCESS,
        milestone,
    };
}

export function retrieveMilestoneFailed(error) {
    return {
        type: RETRIEVE_MILESTONE_FAILED,
        error,
    };
}

export function updateMilestone(id, data) {
    return dispatch => {
        dispatch(updateMilestoneStart(id));
        axios
            .patch(ENDPOINT_MILESTONE + id + '/', data)
            .then(function(response) {
                dispatch(updateMilestoneSuccess(response.data));
            })
            .catch(function(error) {
                dispatch(
                    updateMilestoneFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function updateMilestoneStart(id) {
    return {
        type: UPDATE_MILESTONE_START,
        id,
    };
}

export function updateMilestoneSuccess(milestone) {
    return {
        type: UPDATE_MILESTONE_SUCCESS,
        milestone,
    };
}

export function updateMilestoneFailed(error) {
    return {
        type: UPDATE_MILESTONE_FAILED,
        error,
    };
}

export function deleteMilestone(id) {
    return dispatch => {
        dispatch(deleteMilestoneStart(id));
        axios
            .delete(ENDPOINT_MILESTONE + id + '/')
            .then(function() {
                dispatch(deleteMilestoneSuccess(id));
            })
            .catch(function(error) {
                dispatch(
                    deleteMilestoneFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function deleteMilestoneStart(id) {
    return {
        type: DELETE_MILESTONE_START,
        id,
    };
}

export function deleteMilestoneSuccess(id) {
    return {
        type: DELETE_MILESTONE_SUCCESS,
        id,
    };
}

export function deleteMilestoneFailed(error) {
    return {
        type: DELETE_MILESTONE_FAILED,
        error,
    };
}

export function listMoreMilestones(url) {
    return dispatch => {
        dispatch(listMoreMilestonesStart(url));
        axios
            .get(url)
            .then(function(response) {
                dispatch(listMoreMilestonesSuccess(response.data));
            })
            .catch(function(error) {
                dispatch(
                    listMoreMilestonesFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function listMoreMilestonesStart(url) {
    return {
        type: LIST_MORE_MILESTONES_START,
        url,
    };
}

export function listMoreMilestonesSuccess(response) {
    return {
        type: LIST_MORE_MILESTONES_SUCCESS,
        items: response.results,
        previous: response.previous,
        next: response.next,
        count: response.count,
    };
}

export function listMoreMilestonesFailed(error) {
    return {
        type: LIST_MORE_MILESTONES_FAILED,
        error,
    };
}
