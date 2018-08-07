import {combineReducers} from 'redux';
import * as SupportPageActions from '../actions/SupportPageActions';
import {PATH_CHANGE} from '../actions/NavActions';

function page(state = {}, action) {
    switch (action.type) {
        case SupportPageActions.CREATE_SUPPORT_PAGE_SUCCESS:
        case SupportPageActions.RETRIEVE_SUPPORT_PAGE_SUCCESS:
        case SupportPageActions.UPDATE_SUPPORT_PAGE_SUCCESS:
            return action.page;
        case SupportPageActions.DELETE_SUPPORT_PAGE_SUCCESS:
        case SupportPageActions.CREATE_SUPPORT_PAGE_START:
        case SupportPageActions.CREATE_SUPPORT_PAGE_FAILED:
        case SupportPageActions.RETRIEVE_SUPPORT_PAGE_START:
        case SupportPageActions.RETRIEVE_SUPPORT_PAGE_FAILED:
            return {};
        default:
            return state;
    }
}

function pages(state = [], action) {
    switch (action.type) {
        case SupportPageActions.LIST_SUPPORT_PAGES_SUCCESS:
            return action.items;
        case SupportPageActions.LIST_MORE_SUPPORT_PAGES_SUCCESS:
            return [...action.items, ...state];
        case SupportPageActions.CREATE_SUPPORT_PAGE_SUCCESS:
            return [...state, action.page];
        case SupportPageActions.LIST_SUPPORT_PAGES_START:
        case SupportPageActions.LIST_SUPPORT_PAGES_FAILED:
            return [];
        default:
            return state;
    }
}

function next(state = null, action) {
    switch (action.type) {
        case SupportPageActions.LIST_SUPPORT_PAGES_SUCCESS:
        case SupportPageActions.LIST_MORE_SUPPORT_PAGES_SUCCESS:
            return action.next;
        default:
            return state;
    }
}

function previous(state = null, action) {
    switch (action.type) {
        case SupportPageActions.LIST_SUPPORT_PAGES_SUCCESS:
        case SupportPageActions.LIST_MORE_SUPPORT_PAGES_SUCCESS:
            return action.previous;
        default:
            return state;
    }
}

function isSaving(state = false, action) {
    switch (action.type) {
        case SupportPageActions.CREATE_SUPPORT_PAGE_START:
            return true;
        case SupportPageActions.CREATE_SUPPORT_PAGE_SUCCESS:
        case SupportPageActions.CREATE_SUPPORT_PAGE_FAILED:
            return false;
        default:
            return state;
    }
}

function isSaved(state = false, action) {
    switch (action.type) {
        case SupportPageActions.CREATE_SUPPORT_PAGE_SUCCESS:
            return true;
        case SupportPageActions.CREATE_SUPPORT_PAGE_START:
        case SupportPageActions.CREATE_SUPPORT_PAGE_FAILED:
        case PATH_CHANGE:
            return false;
        default:
            return state;
    }
}

function isFetching(state = false, action) {
    switch (action.type) {
        case SupportPageActions.LIST_SUPPORT_PAGES_START:
            return true;
        case SupportPageActions.LIST_SUPPORT_PAGES_SUCCESS:
        case SupportPageActions.LIST_SUPPORT_PAGES_FAILED:
            return false;
        default:
            return state;
    }
}

function isFetchingMore(state = false, action) {
    switch (action.type) {
        case SupportPageActions.LIST_MORE_SUPPORT_PAGES_START:
            return true;
        case SupportPageActions.LIST_MORE_SUPPORT_PAGES_SUCCESS:
        case SupportPageActions.LIST_MORE_SUPPORT_PAGES_FAILED:
            return false;
        default:
            return state;
    }
}

function isRetrieving(state = false, action) {
    switch (action.type) {
        case SupportPageActions.RETRIEVE_SUPPORT_PAGE_START:
            return true;
        case SupportPageActions.RETRIEVE_SUPPORT_PAGE_SUCCESS:
        case SupportPageActions.RETRIEVE_SUPPORT_PAGE_FAILED:
            return false;
        default:
            return state;
    }
}

function isDeleting(state = false, action) {
    switch (action.type) {
        case SupportPageActions.DELETE_SUPPORT_PAGE_START:
            return true;
        case SupportPageActions.DELETE_SUPPORT_PAGE_SUCCESS:
        case SupportPageActions.DELETE_SUPPORT_PAGE_FAILED:
            return false;
        default:
            return state;
    }
}

function error(state = {}, action) {
    switch (action.type) {
        case SupportPageActions.CREATE_SUPPORT_PAGE_FAILED:
            return {...state, create: action.error};
        case SupportPageActions.CREATE_SUPPORT_PAGE_START:
        case SupportPageActions.CREATE_SUPPORT_PAGE_SUCCESS:
            return {...state, create: null};
        default:
            return state;
    }
}

const detail = combineReducers({
    page,
    isRetrieving,
    isSaving,
    isSaved,
    isDeleting,
    error,
});

const list = combineReducers({
    pages,
    isFetching,
    isFetchingMore,
    next,
    previous,
});

const SupportPage = combineReducers({
    detail,
    list,
});

export default SupportPage;
