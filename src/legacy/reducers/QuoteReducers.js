import {combineReducers} from 'redux';
import * as QuoteActions from '../actions/QuoteActions';
import {PATH_CHANGE} from '../actions/NavActions';

function quote(state = {}, action) {
    switch (action.type) {
        case QuoteActions.CREATE_QUOTE_SUCCESS:
        case QuoteActions.RETRIEVE_QUOTE_SUCCESS:
            return action.quote;
        case QuoteActions.UPDATE_QUOTE_SUCCESS:
            return {...state, ...action.quote};
        case QuoteActions.DELETE_QUOTE_SUCCESS:
        case QuoteActions.CREATE_QUOTE_START:
        case QuoteActions.CREATE_QUOTE_FAILED:
        case QuoteActions.RETRIEVE_QUOTE_START:
        case QuoteActions.RETRIEVE_QUOTE_FAILED:
            return {};
        default:
            return state;
    }
}

function quotes(state = {}, action) {
    switch (action.type) {
        case QuoteActions.LIST_QUOTES_SUCCESS:
        case QuoteActions.LIST_MORE_QUOTES_SUCCESS:
            var all_quotes = {};
            action.items.forEach(quote => {
                all_quotes[quote.id] = quote;
            });
            return {...state, ...all_quotes};
        case QuoteActions.LIST_QUOTES_START:
        case QuoteActions.LIST_QUOTES_FAILED:
            return {};
        default:
            return state;
    }
}

function ids(state = [], action) {
    switch (action.type) {
        case QuoteActions.LIST_QUOTES_SUCCESS:
            return action.items.map(quote => {
                return quote.id;
            });
        case QuoteActions.LIST_MORE_QUOTES_SUCCESS:
            var new_quotes = action.items.map(quote => {
                return quote.id;
            });
            return [...state, ...new_quotes];
        case QuoteActions.LIST_QUOTES_START:
        case QuoteActions.LIST_QUOTES_FAILED:
            return [];
        default:
            return state;
    }
}

function next(state = null, action) {
    switch (action.type) {
        case QuoteActions.LIST_QUOTES_SUCCESS:
        case QuoteActions.LIST_MORE_QUOTES_SUCCESS:
            return action.next;
        default:
            return state;
    }
}

function previous(state = null, action) {
    switch (action.type) {
        case QuoteActions.LIST_QUOTES_SUCCESS:
        case QuoteActions.LIST_MORE_QUOTES_SUCCESS:
            return action.previous;
        default:
            return state;
    }
}

function isSaving(state = false, action) {
    switch (action.type) {
        case QuoteActions.CREATE_QUOTE_START:
        case QuoteActions.UPDATE_QUOTE_START:
            return true;
        case QuoteActions.CREATE_QUOTE_SUCCESS:
        case QuoteActions.CREATE_QUOTE_FAILED:
        case QuoteActions.UPDATE_QUOTE_SUCCESS:
        case QuoteActions.UPDATE_QUOTE_FAILED:
        case QuoteActions.RETRIEVE_QUOTE_START:
            return false;
        default:
            return state;
    }
}

function isSaved(state = false, action) {
    switch (action.type) {
        case QuoteActions.CREATE_QUOTE_SUCCESS:
        case QuoteActions.UPDATE_QUOTE_SUCCESS:
            return true;
        case QuoteActions.CREATE_QUOTE_START:
        case QuoteActions.CREATE_QUOTE_FAILED:
        case QuoteActions.UPDATE_QUOTE_START:
        case QuoteActions.UPDATE_QUOTE_FAILED:
        case PATH_CHANGE:
            return false;
        default:
            return state;
    }
}

function isFetching(state = false, action) {
    switch (action.type) {
        case QuoteActions.LIST_QUOTES_START:
            return true;
        case QuoteActions.LIST_QUOTES_SUCCESS:
        case QuoteActions.LIST_QUOTES_FAILED:
            return false;
        default:
            return state;
    }
}

function isFetchingMore(state = false, action) {
    switch (action.type) {
        case QuoteActions.LIST_MORE_QUOTES_START:
            return true;
        case QuoteActions.LIST_MORE_QUOTES_SUCCESS:
        case QuoteActions.LIST_MORE_QUOTES_FAILED:
            return false;
        default:
            return state;
    }
}

function isRetrieving(state = false, action) {
    switch (action.type) {
        case QuoteActions.RETRIEVE_QUOTE_START:
            return true;
        case QuoteActions.RETRIEVE_QUOTE_SUCCESS:
        case QuoteActions.RETRIEVE_QUOTE_FAILED:
            return false;
        default:
            return state;
    }
}

function isDeleting(state = false, action) {
    switch (action.type) {
        case QuoteActions.DELETE_QUOTE_START:
            return true;
        case QuoteActions.DELETE_QUOTE_SUCCESS:
        case QuoteActions.DELETE_QUOTE_FAILED:
            return false;
        default:
            return false;
    }
}

function error(state = {}, action) {
    switch (action.type) {
        case QuoteActions.CREATE_QUOTE_FAILED:
            return {...state, create: action.error};
        case QuoteActions.CREATE_QUOTE_START:
        case QuoteActions.CREATE_QUOTE_SUCCESS:
            return {...state, create: null};
        case QuoteActions.UPDATE_QUOTE_FAILED:
            return {...state, update: action.error};
        case QuoteActions.UPDATE_QUOTE_START:
        case QuoteActions.UPDATE_QUOTE_SUCCESS:
            return {...state, update: null};
        default:
            return state;
    }
}

const detail = combineReducers({
    quote,
    isRetrieving,
    isSaving,
    isSaved,
    isDeleting,
    error,
});

const list = combineReducers({
    quotes,
    ids,
    isFetching,
    isFetchingMore,
    next,
    previous,
});

const Quote = combineReducers({
    detail,
    list,
});

export default Quote;
