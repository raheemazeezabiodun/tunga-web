import {combineReducers} from 'redux';
import * as SupportSectionActions from '../actions/SupportSectionActions';
import {PATH_CHANGE} from '../actions/NavActions';

function section(state = {}, action) {
    switch (action.type) {
        case SupportSectionActions.CREATE_SUPPORT_SECTION_SUCCESS:
        case SupportSectionActions.RETRIEVE_SUPPORT_SECTION_SUCCESS:
        case SupportSectionActions.UPDATE_SUPPORT_SECTION_SUCCESS:
            return action.section;
        case SupportSectionActions.DELETE_SUPPORT_SECTION_SUCCESS:
        case SupportSectionActions.CREATE_SUPPORT_SECTION_START:
        case SupportSectionActions.CREATE_SUPPORT_SECTION_FAILED:
        case SupportSectionActions.RETRIEVE_SUPPORT_SECTION_START:
        case SupportSectionActions.RETRIEVE_SUPPORT_SECTION_FAILED:
            return {};
        default:
            return state;
    }
}

function sections(state = [], action) {
    switch (action.type) {
        case SupportSectionActions.LIST_SUPPORT_SECTIONS_SUCCESS:
            return action.items;
        case SupportSectionActions.LIST_MORE_SUPPORT_SECTIONS_SUCCESS:
            return [...action.items, ...state];
        case SupportSectionActions.CREATE_SUPPORT_SECTION_SUCCESS:
            return [...state, action.section];
        case SupportSectionActions.LIST_SUPPORT_SECTIONS_START:
        case SupportSectionActions.LIST_SUPPORT_SECTIONS_FAILED:
            return [];
        default:
            return state;
    }
}

function next(state = null, action) {
    switch (action.type) {
        case SupportSectionActions.LIST_SUPPORT_SECTIONS_SUCCESS:
        case SupportSectionActions.LIST_MORE_SUPPORT_SECTIONS_SUCCESS:
            return action.next;
        default:
            return state;
    }
}

function previous(state = null, action) {
    switch (action.type) {
        case SupportSectionActions.LIST_SUPPORT_SECTIONS_SUCCESS:
        case SupportSectionActions.LIST_MORE_SUPPORT_SECTIONS_SUCCESS:
            return action.previous;
        default:
            return state;
    }
}

function isSaving(state = false, action) {
    switch (action.type) {
        case SupportSectionActions.CREATE_SUPPORT_SECTION_START:
            return true;
        case SupportSectionActions.CREATE_SUPPORT_SECTION_SUCCESS:
        case SupportSectionActions.CREATE_SUPPORT_SECTION_FAILED:
            return false;
        default:
            return state;
    }
}

function isSaved(state = false, action) {
    switch (action.type) {
        case SupportSectionActions.CREATE_SUPPORT_SECTION_SUCCESS:
            return true;
        case SupportSectionActions.CREATE_SUPPORT_SECTION_START:
        case SupportSectionActions.CREATE_SUPPORT_SECTION_FAILED:
        case PATH_CHANGE:
            return false;
        default:
            return state;
    }
}

function isFetching(state = false, action) {
    switch (action.type) {
        case SupportSectionActions.LIST_SUPPORT_SECTIONS_START:
            return true;
        case SupportSectionActions.LIST_SUPPORT_SECTIONS_SUCCESS:
        case SupportSectionActions.LIST_SUPPORT_SECTIONS_FAILED:
            return false;
        default:
            return state;
    }
}

function isFetchingMore(state = false, action) {
    switch (action.type) {
        case SupportSectionActions.LIST_MORE_SUPPORT_SECTIONS_START:
            return true;
        case SupportSectionActions.LIST_MORE_SUPPORT_SECTIONS_SUCCESS:
        case SupportSectionActions.LIST_MORE_SUPPORT_SECTIONS_FAILED:
            return false;
        default:
            return state;
    }
}

function isRetrieving(state = false, action) {
    switch (action.type) {
        case SupportSectionActions.RETRIEVE_SUPPORT_SECTION_START:
            return true;
        case SupportSectionActions.RETRIEVE_SUPPORT_SECTION_SUCCESS:
        case SupportSectionActions.RETRIEVE_SUPPORT_SECTION_FAILED:
            return false;
        default:
            return state;
    }
}

function isDeleting(state = false, action) {
    switch (action.type) {
        case SupportSectionActions.DELETE_SUPPORT_SECTION_START:
            return true;
        case SupportSectionActions.DELETE_SUPPORT_SECTION_SUCCESS:
        case SupportSectionActions.DELETE_SUPPORT_SECTION_FAILED:
            return false;
        default:
            return state;
    }
}

function error(state = {}, action) {
    switch (action.type) {
        case SupportSectionActions.CREATE_SUPPORT_SECTION_FAILED:
            return {...state, create: action.error};
        case SupportSectionActions.CREATE_SUPPORT_SECTION_START:
        case SupportSectionActions.CREATE_SUPPORT_SECTION_SUCCESS:
            return {...state, create: null};
        default:
            return state;
    }
}

const detail = combineReducers({
    section,
    isRetrieving,
    isSaving,
    isSaved,
    isDeleting,
    error,
});

const list = combineReducers({
    sections,
    isFetching,
    isFetchingMore,
    next,
    previous,
});

const SupportSection = combineReducers({
    detail,
    list,
});

export default SupportSection;
