import axios from 'axios';
import {ENDPOINT_INVOICES} from './utils/api';

export const CREATE_INVOICE_START = 'CREATE_INVOICE_START';
export const CREATE_INVOICE_SUCCESS = 'CREATE_INVOICE_SUCCESS';
export const CREATE_INVOICE_FAILED = 'CREATE_INVOICE_FAILED';
export const CREATE_INVOICE_BATCH_START = 'CREATE_INVOICE_BATCH_START';
export const CREATE_INVOICE_BATCH_SUCCESS = 'CREATE_INVOICE_BATCH_SUCCESS';
export const CREATE_INVOICE_BATCH_FAILED = 'CREATE_INVOICE_BATCH_FAILED';
export const LIST_INVOICES_START = 'LIST_INVOICES_START';
export const LIST_INVOICES_SUCCESS = 'LIST_INVOICES_SUCCESS';
export const LIST_INVOICES_FAILED = 'LIST_INVOICES_FAILED';
export const RETRIEVE_INVOICE_START = 'RETRIEVE_INVOICE_START';
export const RETRIEVE_INVOICE_SUCCESS = 'RETRIEVE_INVOICE_SUCCESS';
export const RETRIEVE_INVOICE_FAILED = 'RETRIEVE_INVOICE_FAILED';
export const UPDATE_INVOICE_START = 'UPDATE_INVOICE_START';
export const UPDATE_INVOICE_SUCCESS = 'UPDATE_INVOICE_SUCCESS';
export const UPDATE_INVOICE_FAILED = 'UPDATE_INVOICE_FAILED';
export const LIST_MORE_INVOICES_START = 'LIST_MORE_INVOICES_START';
export const LIST_MORE_INVOICES_SUCCESS = 'LIST_MORE_INVOICES_SUCCESS';
export const LIST_MORE_INVOICES_FAILED = 'LIST_MORE_INVOICES_FAILED';
export const DELETE_INVOICE_START = 'DELETE_INVOICE_START';
export const DELETE_INVOICE_SUCCESS = 'DELETE_INVOICE_SUCCESS';
export const DELETE_INVOICE_FAILED = 'DELETE_INVOICE_FAILED';
export const PAY_INVOICE_START = 'PAY_INVOICE_START';
export const PAY_INVOICE_SUCCESS = 'PAY_INVOICE_SUCCESS';
export const PAY_INVOICE_FAILED = 'PAY_INVOICE_FAILED';
export const ARCHIVE_INVOICE_SUCCESS = 'ARCHIVE_INVOICE_SUCCESS';
export const ARCHIVE_INVOICE_START = 'ARCHIVE_INVOICE_START';
export const ARCHIVE_INVOICE_FAILED = 'ARCHIVE_INVOICE_FAILED';

export function createInvoice(invoice, target) {
    return dispatch => {
        dispatch(createInvoiceStart(invoice, target));

        let headers = {};

        axios
            .post(ENDPOINT_INVOICES, invoice, {headers})
            .then(function (response) {
                dispatch(createInvoiceSuccess(response.data, target));
            })
            .catch(function (error) {
                dispatch(
                    createInvoiceFailed(
                        (error.response ? error.response.data : null), invoice, target
                    ),
                );
            });
    };
}

export function createInvoiceStart(invoice, target) {
    return {
        type: CREATE_INVOICE_START,
        invoice,
        target
    };
}

export function createInvoiceSuccess(invoice, target) {
    return {
        type: CREATE_INVOICE_SUCCESS,
        invoice,
        target
    };
}

export function createInvoiceFailed(error, invoice, target) {
    return {
        type: CREATE_INVOICE_FAILED,
        error,
        invoice,
        target
    };
}

export function createInvoiceBatch(invoices, target) {
    return dispatch => {
        dispatch(createInvoiceBatchStart(invoices, target));

        let headers = {};

        axios
            .post(`${ENDPOINT_INVOICES}bulk/`, invoices, {headers})
            .then(function (response) {
                dispatch(createInvoiceBatchSuccess(response.data, target));
            })
            .catch(function (error) {
                dispatch(
                    createInvoiceBatchFailed(
                        (error.response ? error.response.data : null), invoices, target
                    ),
                );
            });
    };
}

export function createInvoiceBatchStart(invoices, target) {
    return {
        type: CREATE_INVOICE_BATCH_START,
        invoices,
        target
    };
}

export function createInvoiceBatchSuccess(invoices, target) {
    return {
        type: CREATE_INVOICE_BATCH_SUCCESS,
        invoices,
        target
    };
}

export function createInvoiceBatchFailed(error, invoices, target) {
    return {
        type: CREATE_INVOICE_BATCH_FAILED,
        error,
        invoices,
        target
    };
}

export function listInvoices(filter, selection, prev_selection) {
    return dispatch => {
        dispatch(listInvoicesStart(filter, selection, prev_selection));
        axios
            .get(ENDPOINT_INVOICES, {params: filter})
            .then(function (response) {
                dispatch(listInvoicesSuccess(response.data, filter, selection));
            })
            .catch(function (error) {
                dispatch(
                    listInvoicesFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function listInvoicesStart(filter, selection, prev_selection) {
    return {
        type: LIST_INVOICES_START,
        filter,
        selection,
        prev_selection,
    };
}

export function listInvoicesSuccess(response, filter, selection) {
    return {
        type: LIST_INVOICES_SUCCESS,
        items: response.results,
        previous: response.previous,
        next: response.next,
        count: response.count,
        filter,
        selection,
    };
}

export function listInvoicesFailed(error, selection) {
    return {
        type: LIST_INVOICES_FAILED,
        error,
        selection,
    };
}

export function retrieveInvoice(id) {
    return dispatch => {
        dispatch(retrieveInvoiceStart(id));
        axios
            .get(ENDPOINT_INVOICES + id + '/')
            .then(function (response) {
                dispatch(retrieveInvoiceSuccess(response.data, id));
            })
            .catch(function (error) {
                dispatch(
                    retrieveInvoiceFailed(
                        error.response ? error.response.data : null, id
                    ),
                );
            });
    };
}

export function retrieveInvoiceStart(id) {
    return {
        type: RETRIEVE_INVOICE_START,
        id,
    };
}

export function retrieveInvoiceSuccess(invoice, id) {
    return {
        type: RETRIEVE_INVOICE_SUCCESS,
        invoice,
        id
    };
}

export function retrieveInvoiceFailed(error, id) {
    return {
        type: RETRIEVE_INVOICE_FAILED,
        error,
        id
    };
}

export function updateInvoice(id, invoice, target) {
    return dispatch => {
        dispatch(updateInvoiceStart(id, invoice, target));

        let headers = {};

        axios
            .patch(ENDPOINT_INVOICES + id + '/', invoice, {
                headers: {...headers},
            })
            .then(function (response) {
                dispatch(updateInvoiceSuccess(response.data, id, target));
            })
            .catch(function (error) {
                dispatch(
                    updateInvoiceFailed(
                        (error.response ? error.response.data : null), id, invoice, target
                    ),
                );
            });
    };
}

export function updateInvoiceStart(id, invoice, target) {
    return {
        type: UPDATE_INVOICE_START,
        id,
        invoice,
        target
    };
}

export function updateInvoiceSuccess(invoice, id, target) {
    return {
        type: UPDATE_INVOICE_SUCCESS,
        invoice,
        id,
        target
    };
}

export function updateInvoiceFailed(error, id, invoice, target) {
    return {
        type: UPDATE_INVOICE_FAILED,
        error,
        invoice,
        id,
        target
    };
}

export function listMoreInvoices(url, selection) {
    return dispatch => {
        dispatch(listMoreInvoicesStart(url, selection));
        axios
            .get(url)
            .then(function (response) {
                dispatch(listMoreInvoicesSuccess(response.data, selection));
            })
            .catch(function (error) {
                dispatch(
                    listMoreInvoicesFailed(
                        error.response ? error.response.data : null,
                        selection,
                    ),
                );
            });
    };
}

export function listMoreInvoicesStart(url, selection) {
    return {
        type: LIST_MORE_INVOICES_START,
        url,
        selection,
    };
}

export function listMoreInvoicesSuccess(response, selection) {
    return {
        type: LIST_MORE_INVOICES_SUCCESS,
        items: response.results,
        previous: response.previous,
        next: response.next,
        count: response.count,
        selection,
    };
}

export function listMoreInvoicesFailed(error) {
    return {
        type: LIST_MORE_INVOICES_FAILED,
        error,
    };
}

export function deleteInvoice(id, target) {
    return dispatch => {
        dispatch(deleteInvoiceStart(id));
        axios.delete(ENDPOINT_INVOICES + id + '/')
            .then(function () {
                dispatch(deleteInvoiceSuccess(id, target));
            }).catch(function (response) {
            dispatch(deleteInvoiceFailed(response.data, id, target));
        });
    };
}

export function deleteInvoiceStart(id, target) {
    return {
        type: DELETE_INVOICE_START,
        id,
        target
    };
}

export function deleteInvoiceSuccess(id, target) {
    return {
        type: DELETE_INVOICE_SUCCESS,
        id,
        target
    };
}

export function deleteInvoiceFailed(error, id, target) {
    return {
        type: DELETE_INVOICE_FAILED,
        error,
        id,
        target
    };
}

export function archiveInvoice(id, target) {
    return dispatch => {
        dispatch(archiveInvoiceStart(id));

        axios.post(`${ENDPOINT_INVOICES}${id}/archive/`,)
            .then(function () {
                dispatch(archiveInvoiceSuccess(id, target));
            }).catch(function (response) {
            dispatch(archiveInvoiceFailed(response.data, id, target));
        });
    };
}

export function archiveInvoiceStart(id, target) {
    return {
        type: ARCHIVE_INVOICE_START,
        id,
        target
    };
}

export function archiveInvoiceSuccess(id, target) {
    return {
        type: ARCHIVE_INVOICE_SUCCESS,
        id,
        target
    };
}

export function archiveInvoiceFailed(error, id, target) {
    return {
        type: ARCHIVE_INVOICE_FAILED,
        error,
        id,
        target
    };
}

export function payInvoice(id, payment, target) {
    return dispatch => {
        dispatch(payInvoiceStart(id, payment, target));

        let headers = {};

        axios
            .post(`${ENDPOINT_INVOICES}${id}/pay/`, payment, {headers})
            .then(function (response) {
                dispatch(payInvoiceSuccess(response.data, id, payment, target));
            })
            .catch(function (error) {
                dispatch(
                    payInvoiceFailed(
                        (error.response ? error.response.data : null), id, payment, target
                    ),
                );
            });
    };
}

export function payInvoiceStart(id, payment, target) {
    return {
        type: PAY_INVOICE_START,
        id,
        payment,
        target
    };
}

export function payInvoiceSuccess(invoice, id, payment, target) {
    return {
        type: PAY_INVOICE_SUCCESS,
        invoice,
        payment,
        id,
        target
    };
}

export function payInvoiceFailed(error, id, payment, target) {
    return {
        type: PAY_INVOICE_FAILED,
        error,
        id,
        payment,
        target
    };
}
