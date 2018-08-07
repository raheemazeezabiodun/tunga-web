import {combineReducers} from 'redux';
import * as BlogActions from '../actions/BlogActions';
import {PATH_CHANGE} from '../actions/NavActions';

import {getIds} from '../utils/reducers';

function blog(state = {}, action) {
    switch (action.type) {
        case BlogActions.CREATE_BLOG_SUCCESS:
        case BlogActions.RETRIEVE_BLOG_SUCCESS:
            return action.blog;
        case BlogActions.UPDATE_BLOG_SUCCESS:
            return {...state, ...action.blog};
        case BlogActions.DELETE_BLOG_SUCCESS:
        case BlogActions.CREATE_BLOG_START:
        case BlogActions.CREATE_BLOG_FAILED:
        case BlogActions.RETRIEVE_BLOG_START:
        case BlogActions.RETRIEVE_BLOG_FAILED:
            return {};
        default:
            return state;
    }
}

function blogs(state = {}, action) {
    switch (action.type) {
        case BlogActions.LIST_BLOGS_SUCCESS:
        case BlogActions.LIST_MORE_BLOGS_SUCCESS:
            var all_blogs = {};
            action.items.forEach(blog => {
                all_blogs[blog.id] = blog;
            });
            return {...state, ...all_blogs};
        case BlogActions.LIST_BLOGS_START:
        case BlogActions.LIST_BLOGS_FAILED:
            return {};
        default:
            return state;
    }
}

function ids(state = {}, action) {
    var selection_key = action.selection || 'default';
    var new_state = {};
    switch (action.type) {
        case BlogActions.LIST_BLOGS_SUCCESS:
            new_state[selection_key] = getIds(action.items);
            return {...state, ...new_state};
        case BlogActions.LIST_MORE_BLOGS_SUCCESS:
            new_state[selection_key] = [
                ...state[selection_key],
                ...getIds(action.items),
            ];
            return {...state, ...new_state};
        case BlogActions.LIST_BLOGS_START:
            if (action.prev_selection && state[action.prev_selection]) {
                new_state[selection_key] = state[action.prev_selection];
                return {...state, ...new_state};
            }
            return state;
        case BlogActions.LIST_BLOGS_FAILED:
            return [];
        default:
            return state;
    }
}

function next(state = null, action) {
    switch (action.type) {
        case BlogActions.LIST_BLOGS_SUCCESS:
        case BlogActions.LIST_MORE_BLOGS_SUCCESS:
            return action.next;
        default:
            return state;
    }
}

function previous(state = null, action) {
    switch (action.type) {
        case BlogActions.LIST_BLOGS_SUCCESS:
        case BlogActions.LIST_MORE_BLOGS_SUCCESS:
            return action.previous;
        default:
            return state;
    }
}

function isSaving(state = false, action) {
    switch (action.type) {
        case BlogActions.CREATE_BLOG_START:
        case BlogActions.UPDATE_BLOG_START:
            return true;
        case BlogActions.CREATE_BLOG_SUCCESS:
        case BlogActions.CREATE_BLOG_FAILED:
        case BlogActions.UPDATE_BLOG_SUCCESS:
        case BlogActions.UPDATE_BLOG_FAILED:
        case BlogActions.RETRIEVE_BLOG_START:
            return false;
        default:
            return state;
    }
}

function isSaved(state = false, action) {
    switch (action.type) {
        case BlogActions.CREATE_BLOG_SUCCESS:
        case BlogActions.UPDATE_BLOG_SUCCESS:
            return true;
        case BlogActions.CREATE_BLOG_START:
        case BlogActions.CREATE_BLOG_FAILED:
        case BlogActions.UPDATE_BLOG_START:
        case BlogActions.UPDATE_BLOG_FAILED:
        case PATH_CHANGE:
            return false;
        default:
            return state;
    }
}

function isFetching(state = false, action) {
    switch (action.type) {
        case BlogActions.LIST_BLOGS_START:
            return true;
        case BlogActions.LIST_BLOGS_SUCCESS:
        case BlogActions.LIST_BLOGS_FAILED:
            return false;
        default:
            return state;
    }
}

function isFetchingMore(state = false, action) {
    switch (action.type) {
        case BlogActions.LIST_MORE_BLOGS_START:
            return true;
        case BlogActions.LIST_MORE_BLOGS_SUCCESS:
        case BlogActions.LIST_MORE_BLOGS_FAILED:
            return false;
        default:
            return state;
    }
}

function isRetrieving(state = false, action) {
    switch (action.type) {
        case BlogActions.RETRIEVE_BLOG_START:
            return true;
        case BlogActions.RETRIEVE_BLOG_SUCCESS:
        case BlogActions.RETRIEVE_BLOG_FAILED:
            return false;
        default:
            return state;
    }
}

function isDeleting(state = false, action) {
    switch (action.type) {
        case BlogActions.DELETE_BLOG_START:
            return true;
        case BlogActions.DELETE_BLOG_SUCCESS:
        case BlogActions.DELETE_BLOG_FAILED:
            return false;
        default:
            return false;
    }
}

function error(state = {}, action) {
    switch (action.type) {
        case BlogActions.CREATE_BLOG_FAILED:
            return {...state, create: action.error};
        case BlogActions.CREATE_BLOG_START:
        case BlogActions.CREATE_BLOG_SUCCESS:
            return {...state, create: null};
        case BlogActions.UPDATE_BLOG_FAILED:
            return {...state, update: action.error};
        case BlogActions.UPDATE_BLOG_START:
        case BlogActions.UPDATE_BLOG_SUCCESS:
            return {...state, update: null};
        default:
            return state;
    }
}

const detail = combineReducers({
    blog,
    isRetrieving,
    isSaving,
    isSaved,
    isDeleting,
    error,
});

const list = combineReducers({
    blogs,
    ids,
    isFetching,
    isFetchingMore,
    next,
    previous,
});

const Blog = combineReducers({
    detail,
    list,
});

export default Blog;
