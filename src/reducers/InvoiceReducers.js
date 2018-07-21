import {combineReducers} from 'redux';
import {LOCATION_CHANGE} from "react-router-redux";

import {getIds} from './utils';
import * as InvoiceActions from "../actions/InvoiceActions";
import * as ProgressReportActions from "../actions/ProgressReportActions";

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
            if(state[targetKey]) {
                let currentList = [...state[targetKey]];
                let idx = currentList.indexOf(action.id);
                if(idx > -1) {
                    newState[targetKey] = [...currentList.slice(0, idx), ...currentList.slice(idx+1)];
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
        case ProgressReportActions.CREATE_PROGRESS_REPORT_SUCCESS:
        case ProgressReportActions.UPDATE_PROGRESS_REPORT_SUCCESS:
            let progressReport = action.progress_report;

            if(progressReport && progressReport.event && progressReport.event.id) {
                let progressEventId = progressReport.event.id,
                    reportInvoice = state[progressEventId] || {};
                delete progressReport.event;

                let currentProgressReports = [...(reportInvoice.progress_reports || [])];
                let currentProgressReportIdx = currentProgressReports.map(item => {
                    return item.id;
                }).indexOf(progressReport.id);

                if(currentProgressReportIdx === -1) {
                    currentProgressReports.push(progressReport);
                } else {
                    currentProgressReports[currentProgressReportIdx] = progressReport;
                }

                let newState = {};
                newState[progressEventId] = {...reportInvoice, progress_reports: currentProgressReports};
                return {...state, ...newState};
            }
            return state;
        case ProgressReportActions.DELETE_PROGRESS_REPORT_SUCCESS:
            let newState = {};
            Object.keys(state).forEach(id => {
                let progressEvent = state[id],
                    newProgressReports = [];

                progressEvent.progress_reports.forEach(progressEvent => {
                    if(progressEvent.id !== action.id) {
                        newProgressReports.push(progressEvent);
                    }
                });
                newState[progressEvent.id] = {...progressEvent, progress_reports: newProgressReports};
            });
            return newState;
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
            if(action.id) {
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
            if(action.id) {
                newState[action.id] = false;
            }
            return {...state, ...newState};
        case ProgressReportActions.CREATE_PROGRESS_REPORT_START:
        case ProgressReportActions.UPDATE_PROGRESS_REPORT_START:
            newState['report'] = true;
            return {...state, ...newState};
        case ProgressReportActions.CREATE_PROGRESS_REPORT_SUCCESS:
        case ProgressReportActions.CREATE_PROGRESS_REPORT_FAILED:
        case ProgressReportActions.UPDATE_PROGRESS_REPORT_SUCCESS:
        case ProgressReportActions.UPDATE_PROGRESS_REPORT_FAILED:
            newState['report'] = false;
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
            if(action.id) {
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
            if(action.id) {
                newState[action.id] = false;
            }
            return {...state, ...newState};
        case ProgressReportActions.CREATE_PROGRESS_REPORT_SUCCESS:
        case ProgressReportActions.UPDATE_PROGRESS_REPORT_SUCCESS:
            newState['report'] = true;
            return {...state, ...newState};
        case ProgressReportActions.CREATE_PROGRESS_REPORT_START:
        case ProgressReportActions.CREATE_PROGRESS_REPORT_FAILED:
        case ProgressReportActions.UPDATE_PROGRESS_REPORT_START:
        case ProgressReportActions.UPDATE_PROGRESS_REPORT_FAILED:
            newState['report'] = false;
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
        case ProgressReportActions.CREATE_PROGRESS_REPORT_FAILED:
        case ProgressReportActions.UPDATE_PROGRESS_REPORT_FAILED:
            return {...state, report: action.error};
        case ProgressReportActions.CREATE_PROGRESS_REPORT_START:
        case ProgressReportActions.CREATE_PROGRESS_REPORT_SUCCESS:
        case ProgressReportActions.UPDATE_PROGRESS_REPORT_START:
        case ProgressReportActions.UPDATE_PROGRESS_REPORT_SUCCESS:
            return {...state, report: null};
        default:
            return state;
    }
}

const Invoice = combineReducers({
    created,
    deleted,
    ids,
    invoices,
    isSaving,
    isSaved,
    isRetrieving,
    isDeleting,
    isFetching,
    isFetchingMore,
    next,
    previous,
    count,
    errors,
});

export default Invoice;
