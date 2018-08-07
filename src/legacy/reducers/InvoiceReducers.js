import {combineReducers} from 'redux';
import * as TaskActions from '../actions/TaskActions';
import {PATH_CHANGE} from '../actions/NavActions';

function invoice(state = {}, action) {
    switch (action.type) {
        case TaskActions.CREATE_TASK_INVOICE_SUCCESS:
        case TaskActions.RETRIEVE_TASK_INVOICE_SUCCESS:
            return action.invoice;
        case TaskActions.CREATE_TASK_INVOICE_START:
        case TaskActions.RETRIEVE_TASK_INVOICE_START:
        case TaskActions.RETRIEVE_TASK_INVOICE_FAILED:
            return {};
        default:
            return state;
    }
}

function isSaving(state = false, action) {
    switch (action.type) {
        case TaskActions.CREATE_TASK_INVOICE_START:
            return true;
        case TaskActions.CREATE_TASK_INVOICE_SUCCESS:
        case TaskActions.CREATE_TASK_INVOICE_FAILED:
            return false;
        default:
            return state;
    }
}

function isSaved(state = false, action) {
    switch (action.type) {
        case TaskActions.CREATE_TASK_INVOICE_SUCCESS:
            return true;
        case TaskActions.CREATE_TASK_INVOICE_START:
        case TaskActions.CREATE_TASK_INVOICE_FAILED:
        case PATH_CHANGE:
            return false;
        default:
            return state;
    }
}

function isRetrieving(state = false, action) {
    switch (action.type) {
        case TaskActions.RETRIEVE_TASK_INVOICE_START:
            return true;
        case TaskActions.RETRIEVE_TASK_INVOICE_SUCCESS:
        case TaskActions.RETRIEVE_TASK_INVOICE_FAILED:
            return false;
        default:
            return state;
    }
}

function error(state = {}, action) {
    switch (action.type) {
        case TaskActions.CREATE_TASK_INVOICE_FAILED:
            return {...state, create: action.error};
        case TaskActions.CREATE_TASK_INVOICE_START:
        case TaskActions.CREATE_TASK_INVOICE_SUCCESS:
            return {...state, create: null};
        case PATH_CHANGE:
            return {};
        default:
            return state;
    }
}

const Invoice = combineReducers({
    invoice,
    isRetrieving,
    isSaving,
    isSaved,
    error,
});

export default Invoice;
