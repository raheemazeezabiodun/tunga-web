import {combineReducers} from 'redux';
import * as EstimateActions from '../actions/EstimateActions';
import {PATH_CHANGE} from '../actions/NavActions';

import {getIds} from '../utils/reducers';

function estimate(state = {}, action) {
    switch (action.type) {
        case EstimateActions.CREATE_ESTIMATE_SUCCESS:
        case EstimateActions.RETRIEVE_ESTIMATE_SUCCESS:
            return action.estimate;
        case EstimateActions.UPDATE_ESTIMATE_SUCCESS:
            return {...state, ...action.estimate};
        case EstimateActions.DELETE_ESTIMATE_SUCCESS:
        case EstimateActions.CREATE_ESTIMATE_START:
        case EstimateActions.CREATE_ESTIMATE_FAILED:
        case EstimateActions.RETRIEVE_ESTIMATE_START:
        case EstimateActions.RETRIEVE_ESTIMATE_FAILED:
            return {};
        default:
            return state;
    }
}

function estimates(state = {}, action) {
    switch (action.type) {
        case EstimateActions.LIST_ESTIMATES_SUCCESS:
        case EstimateActions.LIST_MORE_ESTIMATES_SUCCESS:
            var all_estimates = {};
            action.items.forEach(estimate => {
                all_estimates[estimate.id] = estimate;
            });
            return {...state, ...all_estimates};
        case EstimateActions.LIST_ESTIMATES_START:
        case EstimateActions.LIST_ESTIMATES_FAILED:
            return {};
        default:
            return state;
    }
}

function ids(state = {}, action) {
    var selection_key = action.selection || 'default';
    var new_state = {};
    switch (action.type) {
        case EstimateActions.LIST_ESTIMATES_SUCCESS:
            new_state[selection_key] = getIds(action.items);
            return {...state, ...new_state};
        case EstimateActions.LIST_MORE_ESTIMATES_SUCCESS:
            new_state[selection_key] = [
                ...state[selection_key],
                ...getIds(action.items),
            ];
            return {...state, ...new_state};
        case EstimateActions.LIST_ESTIMATES_START:
            if (action.prev_selection && state[action.prev_selection]) {
                new_state[selection_key] = state[action.prev_selection];
                return {...state, ...new_state};
            }
            return state;
        case EstimateActions.LIST_ESTIMATES_FAILED:
            return [];
        default:
            return state;
    }
}

function next(state = null, action) {
    switch (action.type) {
        case EstimateActions.LIST_ESTIMATES_SUCCESS:
        case EstimateActions.LIST_MORE_ESTIMATES_SUCCESS:
            return action.next;
        default:
            return state;
    }
}

function previous(state = null, action) {
    switch (action.type) {
        case EstimateActions.LIST_ESTIMATES_SUCCESS:
        case EstimateActions.LIST_MORE_ESTIMATES_SUCCESS:
            return action.previous;
        default:
            return state;
    }
}

function isSaving(state = false, action) {
    switch (action.type) {
        case EstimateActions.CREATE_ESTIMATE_START:
        case EstimateActions.UPDATE_ESTIMATE_START:
            return true;
        case EstimateActions.CREATE_ESTIMATE_SUCCESS:
        case EstimateActions.CREATE_ESTIMATE_FAILED:
        case EstimateActions.UPDATE_ESTIMATE_SUCCESS:
        case EstimateActions.UPDATE_ESTIMATE_FAILED:
        case EstimateActions.RETRIEVE_ESTIMATE_START:
            return false;
        default:
            return state;
    }
}

function isSaved(state = false, action) {
    switch (action.type) {
        case EstimateActions.CREATE_ESTIMATE_SUCCESS:
        case EstimateActions.UPDATE_ESTIMATE_SUCCESS:
            return true;
        case EstimateActions.CREATE_ESTIMATE_START:
        case EstimateActions.CREATE_ESTIMATE_FAILED:
        case EstimateActions.UPDATE_ESTIMATE_START:
        case EstimateActions.UPDATE_ESTIMATE_FAILED:
        case PATH_CHANGE:
            return false;
        default:
            return state;
    }
}

function isFetching(state = false, action) {
    switch (action.type) {
        case EstimateActions.LIST_ESTIMATES_START:
            return true;
        case EstimateActions.LIST_ESTIMATES_SUCCESS:
        case EstimateActions.LIST_ESTIMATES_FAILED:
            return false;
        default:
            return state;
    }
}

function isFetchingMore(state = false, action) {
    switch (action.type) {
        case EstimateActions.LIST_MORE_ESTIMATES_START:
            return true;
        case EstimateActions.LIST_MORE_ESTIMATES_SUCCESS:
        case EstimateActions.LIST_MORE_ESTIMATES_FAILED:
            return false;
        default:
            return state;
    }
}

function isRetrieving(state = false, action) {
    switch (action.type) {
        case EstimateActions.RETRIEVE_ESTIMATE_START:
            return true;
        case EstimateActions.RETRIEVE_ESTIMATE_SUCCESS:
        case EstimateActions.RETRIEVE_ESTIMATE_FAILED:
            return false;
        default:
            return state;
    }
}

function isDeleting(state = false, action) {
    switch (action.type) {
        case EstimateActions.DELETE_ESTIMATE_START:
            return true;
        case EstimateActions.DELETE_ESTIMATE_SUCCESS:
        case EstimateActions.DELETE_ESTIMATE_FAILED:
            return false;
        default:
            return false;
    }
}

function error(state = {}, action) {
    switch (action.type) {
        case EstimateActions.CREATE_ESTIMATE_FAILED:
            return {...state, create: action.error};
        case EstimateActions.CREATE_ESTIMATE_START:
        case EstimateActions.CREATE_ESTIMATE_SUCCESS:
            return {...state, create: null};
        case EstimateActions.UPDATE_ESTIMATE_FAILED:
            return {...state, update: action.error};
        case EstimateActions.UPDATE_ESTIMATE_START:
        case EstimateActions.UPDATE_ESTIMATE_SUCCESS:
            return {...state, update: null};
        default:
            return state;
    }
}

const detail = combineReducers({
    estimate,
    isRetrieving,
    isSaving,
    isSaved,
    isDeleting,
    error,
});

const list = combineReducers({
    estimates,
    ids,
    isFetching,
    isFetchingMore,
    next,
    previous,
});

const Estimate = combineReducers({
    detail,
    list,
});

export default Estimate;
