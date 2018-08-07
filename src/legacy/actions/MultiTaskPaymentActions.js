import axios from 'axios';
import {ENDPOINT_MULTI_TASK_PAYMENT} from '../constants/Api';
import {
    sendGAEvent,
    GA_EVENT_CATEGORIES,
    GA_EVENT_ACTIONS,
    getGAUserType,
} from '../utils/tracking';
import {getUser} from '../utils/auth';
import {setEditToken} from '../utils/tasks';

export const CREATE_MULTI_TASK_PAYMENT_START =
    'CREATE_MULTI_TASK_PAYMENT_START';
export const CREATE_MULTI_TASK_PAYMENT_SUCCESS =
    'CREATE_MULTI_TASK_PAYMENT_SUCCESS';
export const CREATE_MULTI_TASK_PAYMENT_FAILED =
    'CREATE_MULTI_TASK_PAYMENT_FAILED';
export const LIST_MULTI_TASK_PAYMENTS_START = 'LIST_MULTI_TASK_PAYMENTS_START';
export const LIST_MULTI_TASK_PAYMENTS_SUCCESS =
    'LIST_MULTI_TASK_PAYMENTS_SUCCESS';
export const LIST_MULTI_TASK_PAYMENTS_FAILED =
    'LIST_MULTI_TASK_PAYMENTS_FAILED';
export const LIST_MORE_MULTI_TASK_PAYMENTS_START =
    'LIST_MORE_MULTI_TASK_PAYMENTS_START';
export const LIST_MORE_MULTI_TASK_PAYMENTS_SUCCESS =
    'LIST_MORE_MULTI_TASK_PAYMENTS_SUCCESS';
export const LIST_MORE_MULTI_TASK_PAYMENTS_FAILED =
    'LIST_MORE_MULTI_TASK_PAYMENTS_FAILED';
export const RETRIEVE_MULTI_TASK_PAYMENT_START =
    'RETRIEVE_MULTI_TASK_PAYMENT_START';
export const RETRIEVE_MULTI_TASK_PAYMENT_SUCCESS =
    'RETRIEVE_MULTI_TASK_PAYMENT_SUCCESS';
export const RETRIEVE_MULTI_TASK_PAYMENT_FAILED =
    'RETRIEVE_MULTI_TASK_PAYMENT_FAILED';
export const UPDATE_MULTI_TASK_PAYMENT_START =
    'UPDATE_MULTI_TASK_PAYMENT_START';
export const UPDATE_MULTI_TASK_PAYMENT_SUCCESS =
    'UPDATE_MULTI_TASK_PAYMENT_SUCCESS';
export const UPDATE_MULTI_TASK_PAYMENT_FAILED =
    'UPDATE_MULTI_TASK_PAYMENT_FAILED';
export const DELETE_MULTI_TASK_PAYMENT_START =
    'DELETE_MULTI_TASK_PAYMENT_START';
export const DELETE_MULTI_TASK_PAYMENT_SUCCESS =
    'DELETE_MULTI_TASK_PAYMENT_SUCCESS';
export const DELETE_MULTI_TASK_PAYMENT_FAILED =
    'DELETE_MULTI_TASK_PAYMENT_FAILED';
export const MAKE_PAYMENT_START = 'MAKE_PAYMENT_START';
export const MAKE_PAYMENT_SUCCESS = 'MAKE_PAYMENT_SUCCESS';
export const MAKE_PAYMENT_FAILED = 'MAKE_PAYMENT_FAILED';

export function createMultiTaskPayment(multi_task_payment, attachments) {
    return dispatch => {
        dispatch(createMultiTaskPaymentStart(multi_task_payment));

        axios
            .post(ENDPOINT_MULTI_TASK_PAYMENT, multi_task_payment)
            .then(function(response) {
                dispatch(createMultiTaskPaymentSuccess(response.data));
            })
            .catch(function(error) {
                dispatch(
                    createMultiTaskPaymentFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function createMultiTaskPaymentStart(multi_task_payment) {
    return {
        type: CREATE_MULTI_TASK_PAYMENT_START,
        multi_task_payment,
    };
}

export function createMultiTaskPaymentSuccess(multi_task_payment) {
    sendGAEvent(
        GA_EVENT_CATEGORIES.MULTI_TASK_PAYMENT,
        GA_EVENT_ACTIONS.CREATE,
        getGAUserType(getUser()),
    );

    setEditToken(multi_task_payment.edit_token);

    return {
        type: CREATE_MULTI_TASK_PAYMENT_SUCCESS,
        multi_task_payment,
    };
}

export function createMultiTaskPaymentFailed(error) {
    return {
        type: CREATE_MULTI_TASK_PAYMENT_FAILED,
        error,
    };
}

export function listMultiTaskPayments(filter, selection, prev_selection) {
    return dispatch => {
        dispatch(listMultiTaskPaymentsStart(filter, selection, prev_selection));
        axios
            .get(ENDPOINT_MULTI_TASK_PAYMENT, {params: filter})
            .then(function(response) {
                dispatch(
                    listMultiTaskPaymentsSuccess(
                        response.data,
                        filter,
                        selection,
                    ),
                );
            })
            .catch(function(error) {
                dispatch(
                    listMultiTaskPaymentsFailed(
                        error.response ? error.response.data : null,
                        selection,
                    ),
                );
            });
    };
}

export function listMultiTaskPaymentsStart(filter, selection, prev_selection) {
    return {
        type: LIST_MULTI_TASK_PAYMENTS_START,
        filter,
        selection,
        prev_selection,
    };
}

export function listMultiTaskPaymentsSuccess(response, filter, selection) {
    return {
        type: LIST_MULTI_TASK_PAYMENTS_SUCCESS,
        items: response.results,
        previous: response.previous,
        next: response.next,
        count: response.count,
        filter,
        selection,
    };
}

export function listMultiTaskPaymentsFailed(error, selection) {
    return {
        type: LIST_MULTI_TASK_PAYMENTS_FAILED,
        error,
        selection,
    };
}

export function listMoreMultiTaskPayments(url, selection) {
    return dispatch => {
        dispatch(listMoreMultiTaskPaymentsStart(url, selection));
        axios
            .get(url)
            .then(function(response) {
                dispatch(
                    listMoreMultiTaskPaymentsSuccess(response.data, selection),
                );
            })
            .catch(function(error) {
                dispatch(
                    listMoreMultiTaskPaymentsFailed(
                        error.response ? error.response.data : null,
                        selection,
                    ),
                );
            });
    };
}

export function listMoreMultiTaskPaymentsStart(url, selection) {
    return {
        type: LIST_MORE_MULTI_TASK_PAYMENTS_START,
        url,
        selection,
    };
}

export function listMoreMultiTaskPaymentsSuccess(response, selection) {
    return {
        type: LIST_MORE_MULTI_TASK_PAYMENTS_SUCCESS,
        items: response.results,
        previous: response.previous,
        next: response.next,
        count: response.count,
        selection,
    };
}

export function listMoreMultiTaskPaymentsFailed(error, selection) {
    return {
        type: LIST_MORE_MULTI_TASK_PAYMENTS_FAILED,
        error,
        selection,
    };
}

export function retrieveMultiTaskPayment(id, editToken) {
    return dispatch => {
        dispatch(retrieveMultiTaskPaymentStart(id));
        axios
            .get(ENDPOINT_MULTI_TASK_PAYMENT + id + '/', {
                headers: {'X-EDIT-TOKEN': editToken},
            })
            .then(function(response) {
                dispatch(retrieveMultiTaskPaymentSuccess(response.data));
            })
            .catch(function(error) {
                dispatch(
                    retrieveMultiTaskPaymentFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function retrieveMultiTaskPaymentStart(id) {
    return {
        type: RETRIEVE_MULTI_TASK_PAYMENT_START,
        id,
    };
}

export function retrieveMultiTaskPaymentSuccess(multi_task_payment) {
    return {
        type: RETRIEVE_MULTI_TASK_PAYMENT_SUCCESS,
        multi_task_payment,
    };
}

export function retrieveMultiTaskPaymentFailed(error) {
    return {
        type: RETRIEVE_MULTI_TASK_PAYMENT_FAILED,
        error,
    };
}

export function updateMultiTaskPayment(id, data, uploads) {
    return dispatch => {
        dispatch(updateMultiTaskPaymentStart(id));

        axios
            .patch(ENDPOINT_MULTI_TASK_PAYMENT + id + '/', data)
            .then(function(response) {
                dispatch(updateMultiTaskPaymentSuccess(response.data, data));
            })
            .catch(function(error) {
                dispatch(
                    updateMultiTaskPaymentFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function updateMultiTaskPaymentStart(id) {
    return {
        type: UPDATE_MULTI_TASK_PAYMENT_START,
        id,
    };
}

export function updateMultiTaskPaymentSuccess(multi_task_payment, data) {
    sendGAEvent(
        GA_EVENT_CATEGORIES.MULTI_TASK_PAYMENT,
        GA_EVENT_ACTIONS.UPDATE,
        getGAUserType(getUser()),
    );
    if (data && data.ratings) {
        sendGAEvent(
            GA_EVENT_CATEGORIES.MULTI_TASK_PAYMENT,
            GA_EVENT_ACTIONS.RATE,
            getGAUserType(getUser()),
        );
    }

    return {
        type: UPDATE_MULTI_TASK_PAYMENT_SUCCESS,
        multi_task_payment,
    };
}

export function updateMultiTaskPaymentFailed(error) {
    return {
        type: UPDATE_MULTI_TASK_PAYMENT_FAILED,
        error,
    };
}

export function deleteMultiTaskPayment(id) {
    return dispatch => {
        dispatch(deleteMultiTaskPaymentStart(id));
        axios
            .delete(ENDPOINT_MULTI_TASK_PAYMENT + id + '/')
            .then(function() {
                dispatch(deleteMultiTaskPaymentSuccess(id));
            })
            .catch(function(error) {
                dispatch(
                    deleteMultiTaskPaymentFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function deleteMultiTaskPaymentStart(id) {
    return {
        type: DELETE_MULTI_TASK_PAYMENT_START,
        id,
    };
}

export function deleteMultiTaskPaymentSuccess(id) {
    return {
        type: DELETE_MULTI_TASK_PAYMENT_SUCCESS,
        id,
    };
}

export function deleteMultiTaskPaymentFailed(error) {
    return {
        type: DELETE_MULTI_TASK_PAYMENT_FAILED,
        error,
    };
}

export function makePayment(id, provider, data) {
    return dispatch => {
        dispatch(makePaymentStart(id));
        axios
            .post(
                ENDPOINT_MULTI_TASK_PAYMENT + id + '/pay/' + provider + '/',
                data,
            )
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
        multi_task_payment: response.multi_task_payment,
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
