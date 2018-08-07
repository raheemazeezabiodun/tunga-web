import {combineReducers} from 'redux';
import * as CommentActions from '../actions/CommentActions';
import {PATH_CHANGE} from '../actions/NavActions';

function comment(state = {}, action) {
    switch (action.type) {
        case CommentActions.CREATE_COMMENT_SUCCESS:
        case CommentActions.RETRIEVE_COMMENT_SUCCESS:
        case CommentActions.UPDATE_COMMENT_SUCCESS:
            return action.comment;
        case CommentActions.DELETE_COMMENT_SUCCESS:
        case CommentActions.CREATE_COMMENT_START:
        case CommentActions.CREATE_COMMENT_FAILED:
        case CommentActions.RETRIEVE_COMMENT_START:
        case CommentActions.RETRIEVE_COMMENT_FAILED:
            return {};
        default:
            return state;
    }
}

function comments(state = [], action) {
    switch (action.type) {
        case CommentActions.LIST_COMMENTS_SUCCESS:
            return [...action.items].reverse();
        case CommentActions.LIST_MORE_COMMENTS_SUCCESS:
            var old_comments = [...action.items].reverse();
            return [...old_comments, ...state];
        case CommentActions.CREATE_COMMENT_SUCCESS:
            return [...state, action.comment];
        case CommentActions.LIST_COMMENTS_START:
        case CommentActions.LIST_COMMENTS_FAILED:
            return [];
        default:
            return state;
    }
}

function next(state = null, action) {
    switch (action.type) {
        case CommentActions.LIST_COMMENTS_SUCCESS:
        case CommentActions.LIST_MORE_COMMENTS_SUCCESS:
            return action.next;
        default:
            return state;
    }
}

function previous(state = null, action) {
    switch (action.type) {
        case CommentActions.LIST_COMMENTS_SUCCESS:
        case CommentActions.LIST_MORE_COMMENTS_SUCCESS:
            return action.previous;
        default:
            return state;
    }
}

function isSaving(state = false, action) {
    switch (action.type) {
        case CommentActions.CREATE_COMMENT_START:
            return true;
        case CommentActions.CREATE_COMMENT_SUCCESS:
        case CommentActions.CREATE_COMMENT_FAILED:
            return false;
        default:
            return state;
    }
}

function isSaved(state = false, action) {
    switch (action.type) {
        case CommentActions.CREATE_COMMENT_SUCCESS:
            return true;
        case CommentActions.CREATE_COMMENT_START:
        case CommentActions.CREATE_COMMENT_FAILED:
        case PATH_CHANGE:
            return false;
        default:
            return state;
    }
}

function isFetching(state = false, action) {
    switch (action.type) {
        case CommentActions.LIST_COMMENTS_START:
            return true;
        case CommentActions.LIST_COMMENTS_SUCCESS:
        case CommentActions.LIST_COMMENTS_FAILED:
            return false;
        default:
            return state;
    }
}

function isFetchingMore(state = false, action) {
    switch (action.type) {
        case CommentActions.LIST_MORE_COMMENTS_START:
            return true;
        case CommentActions.LIST_MORE_COMMENTS_SUCCESS:
        case CommentActions.LIST_MORE_COMMENTS_FAILED:
            return false;
        default:
            return state;
    }
}

function isRetrieving(state = false, action) {
    switch (action.type) {
        case CommentActions.RETRIEVE_COMMENT_START:
            return true;
        case CommentActions.RETRIEVE_COMMENT_SUCCESS:
        case CommentActions.RETRIEVE_COMMENT_FAILED:
            return false;
        default:
            return state;
    }
}

function isDeleting(state = false, action) {
    switch (action.type) {
        case CommentActions.DELETE_COMMENT_START:
            return true;
        case CommentActions.DELETE_COMMENT_SUCCESS:
        case CommentActions.DELETE_COMMENT_FAILED:
            return false;
        default:
            return state;
    }
}

function error(state = {}, action) {
    switch (action.type) {
        case CommentActions.CREATE_COMMENT_FAILED:
            return {...state, create: action.error};
        case CommentActions.CREATE_COMMENT_START:
        case CommentActions.CREATE_COMMENT_SUCCESS:
            return {...state, create: null};
        default:
            return state;
    }
}

const detail = combineReducers({
    comment,
    isRetrieving,
    isSaving,
    isSaved,
    isDeleting,
    error,
});

const list = combineReducers({
    comments,
    isFetching,
    isFetchingMore,
    next,
    previous,
});

const Comment = combineReducers({
    detail,
    list,
});

export default Comment;
