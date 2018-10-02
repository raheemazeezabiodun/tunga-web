import {combineReducers} from 'redux';
import {LOCATION_CHANGE} from "react-router-redux";

import {getIds} from './utils';
import * as InvoiceActions from "../actions/InvoiceActions";

function created(state = {}, action) {
    let targetKey = action.target || 'new';
    let newState = {};
    switch (action.type) {
        case InvoiceActions.CREATE_INVOICE_SUCCESS:
            newState[targetKey] = action.invoice.id;
            return {...state, ...newState};
        default:
            return state;
    }
}

function deleted(state = {}, action) {
    let targetKey = action.target || action.id || 'default';
    let newState = {};
    switch (action.type) {
        case InvoiceActions.DELETE_INVOICE_SUCCESS:
            newState[targetKey] = action.id;
            return {...state, ...newState};
        default:
            return state;
    }
}

function archived(state = {}, action) {
    let targetKey = action.target || action.id || 'default';
    let newState = {};
    switch (action.type) {
        case InvoiceActions.ARCHIVE_INVOICE_SUCCESS:
            newState[targetKey] = false;
            return {...state, ...newState};
        default:
            return state;
    }
}

function ids(state = {}, action) {
    let selectionKey = action.selection || 'default';
    let targetKey = action.target || action.id || 'default';
    let newState = {};
    switch (action.type) {
        case InvoiceActions.LIST_INVOICES_SUCCESS:
            newState[selectionKey] = getIds(action.items);
            return {...state, ...newState};
        case InvoiceActions.LIST_MORE_INVOICES_SUCCESS:
            newState[selectionKey] = [
                ...state[selectionKey],
                ...getIds(action.items),
            ];
            return {...state, ...newState};
        case InvoiceActions.LIST_INVOICES_START:
            if (action.prev_selection && state[action.prev_selection]) {
                newState[selectionKey] = state[action.prev_selection];
                return {...state, ...newState};
            }
            return state;
        case InvoiceActions.LIST_INVOICES_FAILED:
            return state;
        case InvoiceActions.CREATE_INVOICE_SUCCESS:
            newState[targetKey] = [action.invoice.id, ...(state[targetKey] || [])];
            return {...state, ...newState};
        case InvoiceActions.CREATE_INVOICE_BATCH_SUCCESS:
            newState[targetKey] = [
                ...state[targetKey],
                ...getIds(action.invoices),
            ];
            return {...state, ...newState};
        case InvoiceActions.DELETE_INVOICE_SUCCESS:
            if (state[targetKey]) {
                let currentList = [...state[targetKey]];
                let idx = currentList.indexOf(action.id);
                if (idx > -1) {
                    newState[targetKey] = [...currentList.slice(0, idx), ...currentList.slice(idx + 1)];
                    return {...state, ...newState};
                }
            }
            return state;
        case InvoiceActions.ARCHIVE_INVOICE_SUCCESS:
            if (state[targetKey]) {
                let currentList = [...state[targetKey]];
                let idx = currentList.indexOf(action.id);
                if (idx > -1) {
                    newState[targetKey] = [...currentList.slice(0, idx), ...currentList.slice(idx + 1)];
                    return {...state, ...newState};
                }
            }
            return state;
        default:
            return state;
    }
}

function invoices(state = {}, action) {
    let all_invoices = {};
    switch (action.type) {
        case InvoiceActions.LIST_INVOICES_SUCCESS:
        case InvoiceActions.LIST_MORE_INVOICES_SUCCESS:
            action.items.forEach(invoice => {
                all_invoices[invoice.id] = invoice;
            });
            return {...state, ...all_invoices};
        case InvoiceActions.CREATE_INVOICE_SUCCESS:
        case InvoiceActions.RETRIEVE_INVOICE_SUCCESS:
        case InvoiceActions.UPDATE_INVOICE_SUCCESS:
        case InvoiceActions.PAY_INVOICE_SUCCESS:
            let new_invoice = {};
            new_invoice[action.invoice.id] = action.invoice;
            return {...state, ...new_invoice};
        case InvoiceActions.CREATE_INVOICE_BATCH_SUCCESS:
            action.invoices.forEach(invoice => {
                all_invoices[invoice.id] = invoice;
            });
            return {...state, ...all_invoices};
        default:
            return state;
    }
}

function isSaving(state = {}, action) {
    let targetKey = action.target || action.id || 'default';
    let newState = {};
    switch (action.type) {
        case InvoiceActions.CREATE_INVOICE_START:
        case InvoiceActions.UPDATE_INVOICE_START:
        case InvoiceActions.PAY_INVOICE_START:
            newState[targetKey] = true;
            if (action.id) {
                newState[action.id] = true;
            }
            return {...state, ...newState};
        case InvoiceActions.CREATE_INVOICE_SUCCESS:
        case InvoiceActions.CREATE_INVOICE_FAILED:
        case InvoiceActions.UPDATE_INVOICE_SUCCESS:
        case InvoiceActions.UPDATE_INVOICE_FAILED:
        case InvoiceActions.PAY_INVOICE_SUCCESS:
        case InvoiceActions.PAY_INVOICE_FAILED:
            newState[targetKey] = false;
            if (action.id) {
                newState[action.id] = false;
            }
            return {...state, ...newState};
        default:
            return state;
    }
}

function isSaved(state = {}, action) {
    let targetKey = action.target || action.id || 'default';
    let newState = {};
    switch (action.type) {
        case InvoiceActions.CREATE_INVOICE_SUCCESS:
        case InvoiceActions.UPDATE_INVOICE_SUCCESS:
        case InvoiceActions.PAY_INVOICE_SUCCESS:
            newState[targetKey] = true;
            if (action.id) {
                newState[action.id] = true;
            }
            return {...state, ...newState};
        case InvoiceActions.CREATE_INVOICE_START:
        case InvoiceActions.CREATE_INVOICE_FAILED:
        case InvoiceActions.UPDATE_INVOICE_START:
        case InvoiceActions.UPDATE_INVOICE_FAILED:
        case InvoiceActions.PAY_INVOICE_START:
        case InvoiceActions.PAY_INVOICE_FAILED:
            newState[targetKey] = false;
            if (action.id) {
                newState[action.id] = false;
            }
            return {...state, ...newState};
        case LOCATION_CHANGE:
            return {};
        default:
            return state;
    }
}

function isRetrieving(state = {}, action) {
    let targetKey = action.target || action.id || 'default';
    let newState = {};
    switch (action.type) {
        case InvoiceActions.RETRIEVE_INVOICE_START:
            newState[targetKey] = true;
            return {...state, ...newState};
        case InvoiceActions.RETRIEVE_INVOICE_SUCCESS:
        case InvoiceActions.RETRIEVE_INVOICE_FAILED:
            newState[targetKey] = false;
            return {...state, ...newState};
        default:
            return state;
    }
}

function isDeleting(state = {}, action) {
    let targetKey = action.target || action.id || 'default';
    let newState = {};
    switch (action.type) {
        case InvoiceActions.DELETE_INVOICE_START:
            newState[targetKey] = true;
            return {...state, ...newState};
        case InvoiceActions.DELETE_INVOICE_SUCCESS:
        case InvoiceActions.DELETE_INVOICE_FAILED:
            newState[targetKey] = false;
            return {...state, ...newState};
        default:
            return state;
    }
}

function isarchiving(state = {}, action) {
    let targetKey = action.target || action.id || 'default';
    let newState = {};
    switch (action.type) {
        case InvoiceActions.ARCHIVE_INVOICE_START:
            newState[targetKey] = true;
            return {...state, ...newState};
        case InvoiceActions.ARCHIVE_INVOICE_SUCCESS:
        case InvoiceActions.ARCHIVE_INVOICE_FAILED:
            newState[targetKey] = false;
            return {...state, ...newState};
        default:
            return state;
    }
}

function isFetching(state = {}, action) {
    let selectionKey = action.selection || 'default';
    let newState = {};
    switch (action.type) {
        case InvoiceActions.LIST_INVOICES_START:
            newState[selectionKey] = true;
            return {...state, ...newState};
        case InvoiceActions.LIST_INVOICES_SUCCESS:
        case InvoiceActions.LIST_INVOICES_FAILED:
            newState[selectionKey] = false;
            return {...state, ...newState};
        default:
            return state;
    }
}

function isFetchingMore(state = {}, action) {
    let selectionKey = action.selection || 'default';
    let newState = {};
    switch (action.type) {
        case InvoiceActions.LIST_MORE_INVOICES_START:
            newState[selectionKey] = true;
            return {...state, ...newState};
        case InvoiceActions.LIST_MORE_INVOICES_SUCCESS:
        case InvoiceActions.LIST_MORE_INVOICES_FAILED:
            newState[selectionKey] = false;
            return {...state, ...newState};
        default:
            return state;
    }
}

function next(state = {}, action) {
    let selectionKey = action.selection || 'default';
    let newState = {};
    switch (action.type) {
        case InvoiceActions.LIST_INVOICES_SUCCESS:
        case InvoiceActions.LIST_MORE_INVOICES_SUCCESS:
            newState[selectionKey] = action.next;
            return {...state, ...newState};
        default:
            return state;
    }
}

function previous(state = {}, action) {
    let selectionKey = action.selection || 'default';
    let newState = {};
    switch (action.type) {
        case InvoiceActions.LIST_INVOICES_SUCCESS:
        case InvoiceActions.LIST_MORE_INVOICES_SUCCESS:
            newState[selectionKey] = action.previous;
            return {...state, ...newState};
        default:
            return state;
    }
}

function count(state = {}, action) {
    let selectionKey = action.selection || 'default';
    let newState = {};
    switch (action.type) {
        case InvoiceActions.LIST_INVOICES_SUCCESS:
            newState[selectionKey] = action.count;
            return {...state, ...newState};
        case InvoiceActions.LIST_INVOICES_START:
        case InvoiceActions.LIST_INVOICES_FAILED:
            newState[selectionKey] = 0;
            return {...state, ...newState};
        default:
            return state;
    }
}

function errors(state = {}, action) {
    switch (action.type) {
        case InvoiceActions.CREATE_INVOICE_FAILED:
            return {...state, create: action.error};
        case InvoiceActions.CREATE_INVOICE_START:
        case InvoiceActions.CREATE_INVOICE_SUCCESS:
            return {...state, create: null};
        case InvoiceActions.UPDATE_INVOICE_FAILED:
            return {...state, update: action.error};
        case InvoiceActions.UPDATE_INVOICE_START:
        case InvoiceActions.UPDATE_INVOICE_SUCCESS:
            return {...state, update: null};
        case InvoiceActions.RETRIEVE_INVOICE_FAILED:
            return {...state, retrieve: action.error};
        case InvoiceActions.RETRIEVE_INVOICE_START:
        case InvoiceActions.RETRIEVE_INVOICE_SUCCESS:
            return {...state, retrieve: null};
        case InvoiceActions.DELETE_INVOICE_FAILED:
            return {...state, delete: action.error};
        case InvoiceActions.DELETE_INVOICE_START:
        case InvoiceActions.DELETE_INVOICE_SUCCESS:
            return {...state, delete: null};
        case InvoiceActions.LIST_INVOICES_FAILED:
            return {...state, list: action.error};
        case InvoiceActions.LIST_INVOICES_START:
        case InvoiceActions.LIST_INVOICES_SUCCESS:
            return {...state, list: null};
        case InvoiceActions.LIST_MORE_INVOICES_FAILED:
            return {...state, list: action.error};
        case InvoiceActions.LIST_MORE_INVOICES_START:
        case InvoiceActions.LIST_MORE_INVOICES_SUCCESS:
            return {...state, list: null};
        default:
            return state;
    }
}

const Invoice = combineReducers({
    created,
    deleted,
    archived,
    ids,
    invoices,
    isSaving,
    isSaved,
    isRetrieving,
    isDeleting,
    isarchiving,
    isFetching,
    isFetchingMore,
    next,
    previous,
    count,
    errors,
});

export default Invoice;
