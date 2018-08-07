import {combineReducers} from 'redux';
import * as TaskActions from '../actions/TaskActions';
import {CREATE_COMMENT_SUCCESS} from '../actions/CommentActions';
import * as ApplicationActions from '../actions/ApplicationActions';
import * as SavedTaskActions from '../actions/SavedTaskActions';
import {PATH_CHANGE} from '../actions/NavActions';
import {
    LOGOUT_SUCCESS,
    LIST_RUNNING_TASKS_SUCCESS,
} from '../actions/AuthActions';
import {CLEAR_VALIDATIONS} from '../actions/UtilityActions';
import * as EstimateActions from '../actions/EstimateActions';
import * as QuoteActions from '../actions/QuoteActions';
import {getIds} from '../utils/reducers';

import Application from './ApplicationReducers';
import Integration from './IntegrationReducers';
import Activity from './ActivityReducers';
import Invoice from './InvoiceReducers';
import MultiTaskPayment from './MultiTaskPaymentReducers';

import {STATUS_ACCEPTED} from '../constants/Api';

function task(state = {}, action) {
    switch (action.type) {
        case TaskActions.CREATE_TASK_SUCCESS:
        case TaskActions.RETRIEVE_TASK_SUCCESS:
        case TaskActions.UPDATE_TASK_CLAIM_SUCCESS:
        case TaskActions.UPDATE_TASK_RETURN_SUCCESS:
            return action.task;
        case TaskActions.UPDATE_TASK_SUCCESS:
            return {...state, ...action.task};
        case EstimateActions.CREATE_ESTIMATE_SUCCESS:
        case EstimateActions.UPDATE_ESTIMATE_SUCCESS:
        case EstimateActions.RETRIEVE_ESTIMATE_SUCCESS:
            if (action.estimate.task == state.id) {
                return {...state, estimate: action.estimate};
            }
            return state;
        case QuoteActions.CREATE_QUOTE_SUCCESS:
            if (action.quote.task == state.id) {
                return {
                    ...state,
                    sprints: [...state.sprints, action.quote],
                };
            }
            return state;
        case QuoteActions.UPDATE_QUOTE_SUCCESS:
        case QuoteActions.RETRIEVE_QUOTE_SUCCESS:
            if (action.quote.task == state.id) {
                return {
                    ...state,
                    sprints: state.sprints.map(sprint => {
                        return action.quote.id == sprint.id
                            ? action.quote
                            : sprint;
                    }),
                };
            }
            return state;
        case TaskActions.DELETE_TASK_SUCCESS:
        case TaskActions.RETRIEVE_TASK_START:
        case TaskActions.RETRIEVE_TASK_FAILED:
            return {};
        case ApplicationActions.CREATE_APPLICATION_SUCCESS:
            if (state.id == action.application.task) {
                return {...state, can_apply: false};
            }
            return state;
        case SavedTaskActions.CREATE_SAVED_TASK_SUCCESS:
            if (state.id == action.saved_task.task) {
                return {...state, can_save: false};
            }
            return state;
        case TaskActions.CREATE_TASK_INVOICE_SUCCESS:
        case TaskActions.RETRIEVE_TASK_INVOICE_SUCCESS:
            if (state.id == action.invoice.task) {
                let invoice = action.invoice;
                var fee =
                    action.type == TaskActions.CREATE_TASK_INVOICE_SUCCESS
                        ? invoice.fee
                        : state.fee;
                return {
                    ...state,
                    pay: invoice.fee,
                    fee,
                    payment_method: invoice.payment_method,
                    btc_address: invoice.btc_address,
                    withhold_tunga_fee: invoice.withhold_tunga_fee,
                    tax_rate: invoice.tax_rate,
                    tax_ratio: invoice.tax_ratio,
                };
            }
            return state;
        case TaskActions.MAKE_TASK_PAYMENT_SUCCESS:
            if (state.id == action.task.id) {
                return {...state, ...action.task, paid: true};
            }
            return state;
        case TaskActions.CREATE_TASK_DOCUMENT_SUCCESS:
            if (state.id == action.document.task) {
                return {
                    ...state,
                    documents: [...state.documents, action.document],
                };
            }
            return state;
        default:
            return state;
    }
}

function uploads(state = [], action) {
    switch (action.type) {
        case TaskActions.CREATE_TASK_SUCCESS:
        case TaskActions.RETRIEVE_TASK_SUCCESS:
        case TaskActions.UPDATE_TASK_SUCCESS:
            return action.task.all_uploads;
        case CREATE_COMMENT_SUCCESS:
            return [...action.comment.uploads, ...state];
        case TaskActions.DELETE_TASK_SUCCESS:
        case TaskActions.CREATE_TASK_START:
        case TaskActions.CREATE_TASK_FAILED:
        case TaskActions.RETRIEVE_TASK_START:
        case TaskActions.RETRIEVE_TASK_FAILED:
            return [];
        default:
            return state;
    }
}

function tasks(state = {}, action) {
    switch (action.type) {
        case TaskActions.LIST_TASKS_SUCCESS:
        case TaskActions.LIST_MORE_TASKS_SUCCESS:
            var all_tasks = {};
            action.items.forEach(task => {
                all_tasks[task.id] = task;
            });
            return {...state, ...all_tasks};
        //case TaskActions.LIST_TASKS_START:
        case TaskActions.LIST_TASKS_FAILED:
            return {};
        case TaskActions.UPDATE_TASK_SUCCESS:
        case TaskActions.UPDATE_TASK_CLAIM_SUCCESS:
        case TaskActions.UPDATE_TASK_RETURN_SUCCESS:
            var new_task = {};
            new_task[action.task.id] = action.task;
            return {...state, ...new_task};
        case ApplicationActions.CREATE_APPLICATION_SUCCESS:
            var task = state[action.application.task];
            if (task) {
                task.can_apply = false;
                var new_ref = {};
                new_ref[task.id] = task;
                return {...state, ...new_ref};
            }
            return state;
        case SavedTaskActions.CREATE_SAVED_TASK_SUCCESS:
            task = state[action.saved_task.task];
            if (task) {
                task.can_save = false;
                new_ref = {};
                new_ref[task.id] = task;
                return {...state, ...new_ref};
            }
            return state;
        default:
            return state;
    }
}

function ids(state = {}, action) {
    var selection_key = action.selection || 'default';
    var new_state = {};
    switch (action.type) {
        case TaskActions.LIST_TASKS_SUCCESS:
            new_state[selection_key] = getIds(action.items);
            return {...state, ...new_state};
        case TaskActions.LIST_MORE_TASKS_SUCCESS:
            new_state[selection_key] = [
                ...state[selection_key],
                ...getIds(action.items),
            ];
            return {...state, ...new_state};
        case TaskActions.LIST_TASKS_START:
            if (action.prev_selection && state[action.prev_selection]) {
                new_state[selection_key] = state[action.prev_selection];
                return {...state, ...new_state};
            }
            return state;
        case TaskActions.LIST_TASKS_FAILED:
            return state;
        default:
            return state;
    }
}

function next(state = null, action) {
    switch (action.type) {
        case TaskActions.LIST_TASKS_SUCCESS:
        case TaskActions.LIST_MORE_TASKS_SUCCESS:
            return action.next;
        default:
            return state;
    }
}

function previous(state = null, action) {
    switch (action.type) {
        case TaskActions.LIST_TASKS_SUCCESS:
        case TaskActions.LIST_MORE_TASKS_SUCCESS:
            return action.previous;
        default:
            return state;
    }
}

function count(state = null, action) {
    switch (action.type) {
        case TaskActions.LIST_TASKS_SUCCESS:
            return action.count;
        case TaskActions.LIST_MORE_TASKS_START:
        case TaskActions.LIST_TASKS_FAILED:
            return 0;
        default:
            return state;
    }
}

function filter(state = null, action) {
    switch (action.type) {
        case TaskActions.LIST_TASKS_SUCCESS:
            return action.filter;
        case TaskActions.LIST_TASKS_START:
        case TaskActions.LIST_TASKS_FAILED:
            return null;
        default:
            return state;
    }
}

function isSaving(state = false, action) {
    switch (action.type) {
        case TaskActions.CREATE_TASK_START:
        case TaskActions.UPDATE_TASK_START:
        case TaskActions.CREATE_TASK_DOCUMENT_START:
            return true;
        case TaskActions.CREATE_TASK_SUCCESS:
        case TaskActions.CREATE_TASK_FAILED:
        case TaskActions.UPDATE_TASK_SUCCESS:
        case TaskActions.UPDATE_TASK_FAILED:
        case TaskActions.RETRIEVE_TASK_START:
        case TaskActions.CREATE_TASK_DOCUMENT_SUCCESS:
        case TaskActions.CREATE_TASK_DOCUMENT_FAILED:
        case CLEAR_VALIDATIONS:
            return false;
        default:
            return state;
    }
}

function isSaved(state = false, action) {
    switch (action.type) {
        case TaskActions.CREATE_TASK_SUCCESS:
        case TaskActions.UPDATE_TASK_SUCCESS:
        case TaskActions.CREATE_TASK_DOCUMENT_SUCCESS:
            return true;
        case TaskActions.CREATE_TASK_START:
        case TaskActions.CREATE_TASK_FAILED:
        case TaskActions.UPDATE_TASK_START:
        case TaskActions.UPDATE_TASK_FAILED:
        case TaskActions.CREATE_TASK_DOCUMENT_START:
        case TaskActions.CREATE_TASK_DOCUMENT_FAILED:
        case PATH_CHANGE:
        case CLEAR_VALIDATIONS:
            return false;
        default:
            return state;
    }
}

function isFetching(state = false, action) {
    switch (action.type) {
        case TaskActions.LIST_TASKS_START:
            return true;
        case TaskActions.LIST_TASKS_SUCCESS:
        case TaskActions.LIST_TASKS_FAILED:
            return false;
        default:
            return state;
    }
}

function isFetchingMore(state = false, action) {
    switch (action.type) {
        case TaskActions.LIST_MORE_TASKS_START:
            return true;
        case TaskActions.LIST_MORE_TASKS_SUCCESS:
        case TaskActions.LIST_MORE_TASKS_FAILED:
            return false;
        default:
            return state;
    }
}

function isRetrieving(state = false, action) {
    switch (action.type) {
        case TaskActions.RETRIEVE_TASK_START:
            return true;
        case TaskActions.RETRIEVE_TASK_SUCCESS:
        case TaskActions.RETRIEVE_TASK_FAILED:
        case CLEAR_VALIDATIONS:
            return false;
        default:
            return state;
    }
}

function isDeleting(state = false, action) {
    switch (action.type) {
        case TaskActions.DELETE_TASK_START:
            return true;
        case TaskActions.DELETE_TASK_SUCCESS:
        case TaskActions.DELETE_TASK_FAILED:
        case CLEAR_VALIDATIONS:
            return false;
        default:
            return false;
    }
}

function error(state = {}, action) {
    switch (action.type) {
        case TaskActions.CREATE_TASK_FAILED:
            return {...state, create: action.error};
        case TaskActions.CREATE_TASK_START:
        case TaskActions.CREATE_TASK_SUCCESS:
            return {...state, create: null};
        case TaskActions.UPDATE_TASK_FAILED:
            return {...state, update: action.error};
        case TaskActions.UPDATE_TASK_START:
        case TaskActions.UPDATE_TASK_SUCCESS:
            return {...state, update: null};
        case TaskActions.MAKE_TASK_PAYMENT_FAILED:
            return {...state, pay: action.error};
        case TaskActions.MAKE_TASK_PAYMENT_START:
        case TaskActions.MAKE_TASK_PAYMENT_SUCCESS:
            return {...state, pay: null};
        case TaskActions.CREATE_TASK_DOCUMENT_FAILED:
            console.log('CREATE_TASK_DOCUMENT_FAILED:', action);
            return {...state, document: action.error};
        case TaskActions.CREATE_TASK_DOCUMENT_START:
        case TaskActions.CREATE_TASK_DOCUMENT_SUCCESS:
            return {...state, document: null};
        case CLEAR_VALIDATIONS:
            return {};
        default:
            return state;
    }
}

export function running(state = [], action) {
    switch (action.type) {
        case LIST_RUNNING_TASKS_SUCCESS:
            return action.items;
        case TaskActions.CREATE_TASK_SUCCESS:
            return [action.task, ...state];
        case LOGOUT_SUCCESS:
            return [];
        default:
            return state;
    }
}

function isPaying(state = false, action) {
    switch (action.type) {
        case TaskActions.MAKE_TASK_PAYMENT_START:
            return true;
        case TaskActions.MAKE_TASK_PAYMENT_SUCCESS:
        case TaskActions.MAKE_TASK_PAYMENT_FAILED:
        case CLEAR_VALIDATIONS:
            return false;
        default:
            return state;
    }
}

const detail = combineReducers({
    task,
    isRetrieving,
    isSaving,
    isSaved,
    isDeleting,
    uploads,
    applications: Application,
    activity: Activity,
    integrations: Integration,
    Invoice: Invoice,
    isPaying,
    error,
});

const list = combineReducers({
    tasks,
    ids,
    isFetching,
    isFetchingMore,
    next,
    previous,
    count,
    filter,
});

const Task = combineReducers({
    detail,
    list,
    running,
    MultiTaskPayment,
});

export default Task;
