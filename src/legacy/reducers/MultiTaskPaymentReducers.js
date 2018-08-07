import {combineReducers} from 'redux';
import * as MultiTaskPaymentActions from '../actions/MultiTaskPaymentActions';
import {PATH_CHANGE} from '../actions/NavActions';
import {LOGOUT_SUCCESS} from '../actions/AuthActions';
import {CLEAR_VALIDATIONS} from '../actions/UtilityActions';
import {getIds} from '../utils/reducers';

function multi_task_payment(state = {}, action) {
    switch (action.type) {
        case MultiTaskPaymentActions.CREATE_MULTI_TASK_PAYMENT_SUCCESS:
        case MultiTaskPaymentActions.RETRIEVE_MULTI_TASK_PAYMENT_SUCCESS:
        case MultiTaskPaymentActions.MAKE_PAYMENT_SUCCESS:
            return action.multi_task_payment;
        case MultiTaskPaymentActions.UPDATE_MULTI_TASK_PAYMENT_SUCCESS:
            return {...state, ...action.multi_task_payment};
        case MultiTaskPaymentActions.DELETE_MULTI_TASK_PAYMENT_SUCCESS:
        case MultiTaskPaymentActions.RETRIEVE_MULTI_TASK_PAYMENT_START:
        case MultiTaskPaymentActions.RETRIEVE_MULTI_TASK_PAYMENT_FAILED:
            return {};
        default:
            return state;
    }
}

function multi_task_payments(state = {}, action) {
    switch (action.type) {
        case MultiTaskPaymentActions.LIST_MULTI_TASK_PAYMENTS_SUCCESS:
        case MultiTaskPaymentActions.LIST_MORE_MULTI_TASK_PAYMENTS_SUCCESS:
            var all_multi_task_payments = {};
            action.items.forEach(multi_task_payment => {
                all_multi_task_payments[
                    multi_task_payment.id
                ] = multi_task_payment;
            });
            return {...state, ...all_multi_task_payments};
        //case MultiTaskPaymentActions.LIST_MULTI_TASK_PAYMENTS_START:
        case MultiTaskPaymentActions.LIST_MULTI_TASK_PAYMENTS_FAILED:
            return {};
        case MultiTaskPaymentActions.UPDATE_MULTI_TASK_PAYMENT_SUCCESS:
            var new_multi_task_payment = {};
            new_multi_task_payment[action.multi_task_payment.id] =
                action.multi_task_payment;
            return {...state, ...new_multi_task_payment};
        default:
            return state;
    }
}

function ids(state = {}, action) {
    var selection_key = action.selection || 'default';
    var new_state = {};
    switch (action.type) {
        case MultiTaskPaymentActions.LIST_MULTI_TASK_PAYMENTS_SUCCESS:
            new_state[selection_key] = getIds(action.items);
            return {...state, ...new_state};
        case MultiTaskPaymentActions.LIST_MORE_MULTI_TASK_PAYMENTS_SUCCESS:
            new_state[selection_key] = [
                ...state[selection_key],
                ...getIds(action.items),
            ];
            return {...state, ...new_state};
        case MultiTaskPaymentActions.LIST_MULTI_TASK_PAYMENTS_START:
            if (action.prev_selection && state[action.prev_selection]) {
                new_state[selection_key] = state[action.prev_selection];
                return {...state, ...new_state};
            }
            return state;
        case MultiTaskPaymentActions.LIST_MULTI_TASK_PAYMENTS_FAILED:
            return state;
        default:
            return state;
    }
}

function next(state = null, action) {
    switch (action.type) {
        case MultiTaskPaymentActions.LIST_MULTI_TASK_PAYMENTS_SUCCESS:
        case MultiTaskPaymentActions.LIST_MORE_MULTI_TASK_PAYMENTS_SUCCESS:
            return action.next;
        default:
            return state;
    }
}

function previous(state = null, action) {
    switch (action.type) {
        case MultiTaskPaymentActions.LIST_MULTI_TASK_PAYMENTS_SUCCESS:
        case MultiTaskPaymentActions.LIST_MORE_MULTI_TASK_PAYMENTS_SUCCESS:
            return action.previous;
        default:
            return state;
    }
}

function count(state = null, action) {
    switch (action.type) {
        case MultiTaskPaymentActions.LIST_MULTI_TASK_PAYMENTS_SUCCESS:
            return action.count;
        case MultiTaskPaymentActions.LIST_MORE_MULTI_TASK_PAYMENTS_START:
        case MultiTaskPaymentActions.LIST_MULTI_TASK_PAYMENTS_FAILED:
            return 0;
        default:
            return state;
    }
}

function filter(state = null, action) {
    switch (action.type) {
        case MultiTaskPaymentActions.LIST_MULTI_TASK_PAYMENTS_SUCCESS:
            return action.filter;
        case MultiTaskPaymentActions.LIST_MULTI_TASK_PAYMENTS_START:
        case MultiTaskPaymentActions.LIST_MULTI_TASK_PAYMENTS_FAILED:
            return null;
        default:
            return state;
    }
}

function isSaving(state = false, action) {
    switch (action.type) {
        case MultiTaskPaymentActions.CREATE_MULTI_TASK_PAYMENT_START:
        case MultiTaskPaymentActions.UPDATE_MULTI_TASK_PAYMENT_START:
            return true;
        case MultiTaskPaymentActions.CREATE_MULTI_TASK_PAYMENT_SUCCESS:
        case MultiTaskPaymentActions.CREATE_MULTI_TASK_PAYMENT_FAILED:
        case MultiTaskPaymentActions.UPDATE_MULTI_TASK_PAYMENT_SUCCESS:
        case MultiTaskPaymentActions.UPDATE_MULTI_TASK_PAYMENT_FAILED:
        case MultiTaskPaymentActions.RETRIEVE_MULTI_TASK_PAYMENT_START:
        case CLEAR_VALIDATIONS:
            return false;
        default:
            return state;
    }
}

function isSaved(state = false, action) {
    switch (action.type) {
        case MultiTaskPaymentActions.CREATE_MULTI_TASK_PAYMENT_SUCCESS:
        case MultiTaskPaymentActions.UPDATE_MULTI_TASK_PAYMENT_SUCCESS:
            return true;
        case MultiTaskPaymentActions.CREATE_MULTI_TASK_PAYMENT_START:
        case MultiTaskPaymentActions.CREATE_MULTI_TASK_PAYMENT_FAILED:
        case MultiTaskPaymentActions.UPDATE_MULTI_TASK_PAYMENT_START:
        case MultiTaskPaymentActions.UPDATE_MULTI_TASK_PAYMENT_FAILED:
        case PATH_CHANGE:
        case CLEAR_VALIDATIONS:
            return false;
        default:
            return state;
    }
}

function isFetching(state = false, action) {
    switch (action.type) {
        case MultiTaskPaymentActions.LIST_MULTI_TASK_PAYMENTS_START:
            return true;
        case MultiTaskPaymentActions.LIST_MULTI_TASK_PAYMENTS_SUCCESS:
        case MultiTaskPaymentActions.LIST_MULTI_TASK_PAYMENTS_FAILED:
            return false;
        default:
            return state;
    }
}

function isFetchingMore(state = false, action) {
    switch (action.type) {
        case MultiTaskPaymentActions.LIST_MORE_MULTI_TASK_PAYMENTS_START:
            return true;
        case MultiTaskPaymentActions.LIST_MORE_MULTI_TASK_PAYMENTS_SUCCESS:
        case MultiTaskPaymentActions.LIST_MORE_MULTI_TASK_PAYMENTS_FAILED:
            return false;
        default:
            return state;
    }
}

function isRetrieving(state = false, action) {
    switch (action.type) {
        case MultiTaskPaymentActions.RETRIEVE_MULTI_TASK_PAYMENT_START:
            return true;
        case MultiTaskPaymentActions.RETRIEVE_MULTI_TASK_PAYMENT_SUCCESS:
        case MultiTaskPaymentActions.RETRIEVE_MULTI_TASK_PAYMENT_FAILED:
        case CLEAR_VALIDATIONS:
            return false;
        default:
            return state;
    }
}

function isDeleting(state = false, action) {
    switch (action.type) {
        case MultiTaskPaymentActions.DELETE_MULTI_TASK_PAYMENT_START:
            return true;
        case MultiTaskPaymentActions.DELETE_MULTI_TASK_PAYMENT_SUCCESS:
        case MultiTaskPaymentActions.DELETE_MULTI_TASK_PAYMENT_FAILED:
        case CLEAR_VALIDATIONS:
            return false;
        default:
            return false;
    }
}

function error(state = {}, action) {
    switch (action.type) {
        case MultiTaskPaymentActions.CREATE_MULTI_TASK_PAYMENT_FAILED:
            return {...state, create: action.error};
        case MultiTaskPaymentActions.CREATE_MULTI_TASK_PAYMENT_START:
        case MultiTaskPaymentActions.CREATE_MULTI_TASK_PAYMENT_SUCCESS:
            return {...state, create: null};
        case MultiTaskPaymentActions.UPDATE_MULTI_TASK_PAYMENT_FAILED:
            return {...state, update: action.error};
        case MultiTaskPaymentActions.UPDATE_MULTI_TASK_PAYMENT_START:
        case MultiTaskPaymentActions.UPDATE_MULTI_TASK_PAYMENT_SUCCESS:
            return {...state, update: null};
        case MultiTaskPaymentActions.MAKE_PAYMENT_FAILED:
            return {...state, pay: action.error};
        case MultiTaskPaymentActions.MAKE_PAYMENT_START:
        case MultiTaskPaymentActions.MAKE_PAYMENT_SUCCESS:
            return {...state, pay: null};
        case CLEAR_VALIDATIONS:
            return {};
        default:
            return state;
    }
}

export function running(state = [], action) {
    switch (action.type) {
        case MultiTaskPaymentActions.CREATE_MULTI_TASK_PAYMENT_SUCCESS:
            return [action.multi_task_payment, ...state];
        case LOGOUT_SUCCESS:
            return [];
        default:
            return state;
    }
}

function isPaying(state = false, action) {
    switch (action.type) {
        case MultiTaskPaymentActions.MAKE_PAYMENT_START:
            return true;
        case MultiTaskPaymentActions.MAKE_PAYMENT_SUCCESS:
        case MultiTaskPaymentActions.MAKE_PAYMENT_FAILED:
        case CLEAR_VALIDATIONS:
            return false;
        default:
            return state;
    }
}

const detail = combineReducers({
    multi_task_payment,
    isRetrieving,
    isSaving,
    isSaved,
    isDeleting,
    isPaying,
    error,
});

const list = combineReducers({
    multi_task_payments,
    ids,
    isFetching,
    isFetchingMore,
    next,
    previous,
    count,
    filter,
});

const MultiTaskPayment = combineReducers({
    detail,
    list,
});

export default MultiTaskPayment;
