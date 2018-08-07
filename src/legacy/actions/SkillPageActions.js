import axios from 'axios';
import {ENDPOINT_SKILL_PAGE} from '../constants/Api';
import {
    sendGAEvent,
    GA_EVENT_CATEGORIES,
    GA_EVENT_ACTIONS,
    getGAUserType,
} from '../utils/tracking';
import {getUser} from '../utils/auth';
import {setEditToken} from '../utils/tasks';

export const CREATE_SKILL_PAGE_START = 'CREATE_SKILL_PAGE_START';
export const CREATE_SKILL_PAGE_SUCCESS = 'CREATE_SKILL_PAGE_SUCCESS';
export const CREATE_SKILL_PAGE_FAILED = 'CREATE_SKILL_PAGE_FAILED';
export const LIST_SKILL_PAGES_START = 'LIST_SKILL_PAGES_START';
export const LIST_SKILL_PAGES_SUCCESS = 'LIST_SKILL_PAGES_SUCCESS';
export const LIST_SKILL_PAGES_FAILED = 'LIST_SKILL_PAGES_FAILED';
export const LIST_MORE_SKILL_PAGES_START = 'LIST_MORE_SKILL_PAGES_START';
export const LIST_MORE_SKILL_PAGES_SUCCESS = 'LIST_MORE_SKILL_PAGES_SUCCESS';
export const LIST_MORE_SKILL_PAGES_FAILED = 'LIST_MORE_SKILL_PAGES_FAILED';
export const RETRIEVE_SKILL_PAGE_START = 'RETRIEVE_SKILL_PAGE_START';
export const RETRIEVE_SKILL_PAGE_SUCCESS = 'RETRIEVE_SKILL_PAGE_SUCCESS';
export const RETRIEVE_SKILL_PAGE_FAILED = 'RETRIEVE_SKILL_PAGE_FAILED';
export const UPDATE_SKILL_PAGE_START = 'UPDATE_SKILL_PAGE_START';
export const UPDATE_SKILL_PAGE_SUCCESS = 'UPDATE_SKILL_PAGE_SUCCESS';
export const UPDATE_SKILL_PAGE_FAILED = 'UPDATE_SKILL_PAGE_FAILED';
export const DELETE_SKILL_PAGE_START = 'DELETE_SKILL_PAGE_START';
export const DELETE_SKILL_PAGE_SUCCESS = 'DELETE_SKILL_PAGE_SUCCESS';
export const DELETE_SKILL_PAGE_FAILED = 'DELETE_SKILL_PAGE_FAILED';
export const MAKE_PAYMENT_START = 'MAKE_PAYMENT_START';
export const MAKE_PAYMENT_SUCCESS = 'MAKE_PAYMENT_SUCCESS';
export const MAKE_PAYMENT_FAILED = 'MAKE_PAYMENT_FAILED';

export function createSkillPage(skill_page, attachments) {
    return dispatch => {
        dispatch(createSkillPageStart(skill_page));

        axios
            .post(ENDPOINT_SKILL_PAGE, skill_page)
            .then(function(response) {
                dispatch(createSkillPageSuccess(response.data));
            })
            .catch(function(error) {
                dispatch(
                    createSkillPageFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function createSkillPageStart(skill_page) {
    return {
        type: CREATE_SKILL_PAGE_START,
        skill_page,
    };
}

export function createSkillPageSuccess(skill_page) {
    sendGAEvent(
        GA_EVENT_CATEGORIES.SKILL_PAGE,
        GA_EVENT_ACTIONS.CREATE,
        getGAUserType(getUser()),
    );

    setEditToken(skill_page.edit_token);

    return {
        type: CREATE_SKILL_PAGE_SUCCESS,
        skill_page,
    };
}

export function createSkillPageFailed(error) {
    return {
        type: CREATE_SKILL_PAGE_FAILED,
        error,
    };
}

export function listSkillPages(filter, selection, prev_selection) {
    return dispatch => {
        dispatch(listSkillPagesStart(filter, selection, prev_selection));
        axios
            .get(ENDPOINT_SKILL_PAGE, {params: filter})
            .then(function(response) {
                dispatch(
                    listSkillPagesSuccess(response.data, filter, selection),
                );
            })
            .catch(function(error) {
                dispatch(
                    listSkillPagesFailed(
                        error.response ? error.response.data : null,
                        selection,
                    ),
                );
            });
    };
}

export function listSkillPagesStart(filter, selection, prev_selection) {
    return {
        type: LIST_SKILL_PAGES_START,
        filter,
        selection,
        prev_selection,
    };
}

export function listSkillPagesSuccess(response, filter, selection) {
    return {
        type: LIST_SKILL_PAGES_SUCCESS,
        items: response.results,
        previous: response.previous,
        next: response.next,
        count: response.count,
        filter,
        selection,
    };
}

export function listSkillPagesFailed(error, selection) {
    return {
        type: LIST_SKILL_PAGES_FAILED,
        error,
        selection,
    };
}

export function listMoreSkillPages(url, selection) {
    return dispatch => {
        dispatch(listMoreSkillPagesStart(url, selection));
        axios
            .get(url)
            .then(function(response) {
                dispatch(listMoreSkillPagesSuccess(response.data, selection));
            })
            .catch(function(error) {
                dispatch(
                    listMoreSkillPagesFailed(
                        error.response ? error.response.data : null,
                        selection,
                    ),
                );
            });
    };
}

export function listMoreSkillPagesStart(url, selection) {
    return {
        type: LIST_MORE_SKILL_PAGES_START,
        url,
        selection,
    };
}

export function listMoreSkillPagesSuccess(response, selection) {
    return {
        type: LIST_MORE_SKILL_PAGES_SUCCESS,
        items: response.results,
        previous: response.previous,
        next: response.next,
        count: response.count,
        selection,
    };
}

export function listMoreSkillPagesFailed(error, selection) {
    return {
        type: LIST_MORE_SKILL_PAGES_FAILED,
        error,
        selection,
    };
}

export function retrieveSkillPage(id, editToken) {
    return dispatch => {
        dispatch(retrieveSkillPageStart(id));
        axios
            .get(ENDPOINT_SKILL_PAGE + id + '/', {
                headers: {'X-EDIT-TOKEN': editToken},
            })
            .then(function(response) {
                dispatch(retrieveSkillPageSuccess(response.data));
            })
            .catch(function(error) {
                dispatch(
                    retrieveSkillPageFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function retrieveSkillPageStart(id) {
    return {
        type: RETRIEVE_SKILL_PAGE_START,
        id,
    };
}

export function retrieveSkillPageSuccess(skill_page) {
    return {
        type: RETRIEVE_SKILL_PAGE_SUCCESS,
        skill_page,
    };
}

export function retrieveSkillPageFailed(error) {
    return {
        type: RETRIEVE_SKILL_PAGE_FAILED,
        error,
    };
}

export function updateSkillPage(id, data, uploads, editToken) {
    return dispatch => {
        dispatch(updateSkillPageStart(id));

        axios
            .patch(ENDPOINT_SKILL_PAGE + id + '/', data)
            .then(function(response) {
                dispatch(updateSkillPageSuccess(response.data, data));
            })
            .catch(function(error) {
                dispatch(
                    updateSkillPageFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function updateSkillPageStart(id) {
    return {
        type: UPDATE_SKILL_PAGE_START,
        id,
    };
}

export function updateSkillPageSuccess(skill_page, data) {
    sendGAEvent(
        GA_EVENT_CATEGORIES.SKILL_PAGE,
        GA_EVENT_ACTIONS.UPDATE,
        getGAUserType(getUser()),
    );
    if (data && data.ratings) {
        sendGAEvent(
            GA_EVENT_CATEGORIES.SKILL_PAGE,
            GA_EVENT_ACTIONS.RATE,
            getGAUserType(getUser()),
        );
    }

    return {
        type: UPDATE_SKILL_PAGE_SUCCESS,
        skill_page,
    };
}

export function updateSkillPageFailed(error) {
    return {
        type: UPDATE_SKILL_PAGE_FAILED,
        error,
    };
}

export function deleteSkillPage(id) {
    return dispatch => {
        dispatch(deleteSkillPageStart(id));
        axios
            .delete(ENDPOINT_SKILL_PAGE + id + '/')
            .then(function() {
                dispatch(deleteSkillPageSuccess(id));
            })
            .catch(function(error) {
                dispatch(
                    deleteSkillPageFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function deleteSkillPageStart(id) {
    return {
        type: DELETE_SKILL_PAGE_START,
        id,
    };
}

export function deleteSkillPageSuccess(id) {
    return {
        type: DELETE_SKILL_PAGE_SUCCESS,
        id,
    };
}

export function deleteSkillPageFailed(error) {
    return {
        type: DELETE_SKILL_PAGE_FAILED,
        error,
    };
}

export function makePayment(id, provider, data) {
    return dispatch => {
        dispatch(makePaymentStart(id));
        axios
            .post(ENDPOINT_SKILL_PAGE + id + '/pay/' + provider + '/', data)
            .then(function(response) {
                dispatch(makePaymentSuccess(response.data, provider));
            })
            .catch(function(error) {
                dispatch(
                    makePaymentFailed(
                        error.response ? error.response.data : null,
                        provider,
                    ),
                );
            });
    };
}

export function makePaymentStart(id, provider) {
    return {
        type: MAKE_PAYMENT_START,
        id,
        provider,
    };
}

export function makePaymentSuccess(response, provider) {
    sendGAEvent(GA_EVENT_CATEGORIES.BATCH_PAY, GA_EVENT_ACTIONS.PAY, provider);

    return {
        type: MAKE_PAYMENT_SUCCESS,
        skill_page: response.skill_page,
        payment: response.payment,
        provider,
        integration: response,
    };
}

export function makePaymentFailed(error, provider) {
    return {
        type: MAKE_PAYMENT_FAILED,
        error,
        provider,
    };
}
