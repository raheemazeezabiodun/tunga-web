import axios from 'axios';
import {ENDPOINT_BLOG} from '../constants/Api';

import {
    sendGAEvent,
    GA_EVENT_CATEGORIES,
    GA_EVENT_ACTIONS,
    getGAUserType,
} from '../utils/tracking';
import {getUser} from '../utils/auth';

export const CREATE_BLOG_START = 'CREATE_BLOG_START';
export const CREATE_BLOG_SUCCESS = 'CREATE_BLOG_SUCCESS';
export const CREATE_BLOG_FAILED = 'CREATE_BLOG_FAILED';
export const LIST_BLOGS_START = 'LIST_BLOGS_START';
export const LIST_BLOGS_SUCCESS = 'LIST_BLOGS_SUCCESS';
export const LIST_BLOGS_FAILED = 'LIST_BLOGS_FAILED';
export const LIST_MORE_BLOGS_START = 'LIST_MORE_BLOGS_START';
export const LIST_MORE_BLOGS_SUCCESS = 'LIST_MORE_BLOGS_SUCCESS';
export const LIST_MORE_BLOGS_FAILED = 'LIST_MORE_BLOGS_FAILED';
export const RETRIEVE_BLOG_START = 'RETRIEVE_BLOG_START';
export const RETRIEVE_BLOG_SUCCESS = 'RETRIEVE_BLOG_SUCCESS';
export const RETRIEVE_BLOG_FAILED = 'RETRIEVE_BLOG_FAILED';
export const UPDATE_BLOG_START = 'UPDATE_BLOG_START';
export const UPDATE_BLOG_SUCCESS = 'UPDATE_BLOG_SUCCESS';
export const UPDATE_BLOG_FAILED = 'UPDATE_BLOG_FAILED';
export const DELETE_BLOG_START = 'DELETE_BLOG_START';
export const DELETE_BLOG_SUCCESS = 'DELETE_BLOG_SUCCESS';
export const DELETE_BLOG_FAILED = 'DELETE_BLOG_FAILED';

export function createBlog(blog, errors = null) {
    return dispatch => {
        dispatch(createBlogStart(blog));
        if (errors) {
            return dispatch(createBlogFailed(errors));
        }

        var headers = {},
            data = blog;
        if (blog.image) {
            headers['Content-Type'] = 'multipart/form-data';

            data = new FormData();
            Object.keys(blog).map(key => {
                data.append(key, blog[key]);
            });
        }

        axios
            .post(ENDPOINT_BLOG, data, {headers})
            .then(function(response) {
                dispatch(createBlogSuccess(response.data));
            })
            .catch(function(error) {
                dispatch(
                    createBlogFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function createBlogStart(blog) {
    return {
        type: CREATE_BLOG_START,
        blog,
    };
}

export function createBlogSuccess(blog) {
    sendGAEvent(
        GA_EVENT_CATEGORIES.BLOG,
        GA_EVENT_ACTIONS.APPLY,
        getGAUserType(getUser()),
    );
    return {
        type: CREATE_BLOG_SUCCESS,
        blog,
    };
}

export function createBlogFailed(error) {
    return {
        type: CREATE_BLOG_FAILED,
        error,
    };
}

export function listBlogs(filter, selection, prev_selection) {
    return dispatch => {
        dispatch(listBlogsStart(filter, selection, prev_selection));
        axios
            .get(ENDPOINT_BLOG, {params: filter})
            .then(function(response) {
                dispatch(listBlogsSuccess(response.data, selection));
            })
            .catch(function(error) {
                dispatch(
                    listBlogsFailed(
                        error.response ? error.response.data : null,
                        selection,
                    ),
                );
            });
    };
}

export function listBlogsStart(filter, selection, prev_selection) {
    return {
        type: LIST_BLOGS_START,
        filter,
        selection,
        prev_selection,
    };
}

export function listBlogsSuccess(response, selection) {
    return {
        type: LIST_BLOGS_SUCCESS,
        items: response.results,
        previous: response.previous,
        next: response.next,
        count: response.count,
        selection,
    };
}

export function listBlogsFailed(error, selection) {
    return {
        type: LIST_BLOGS_FAILED,
        error,
        selection,
    };
}

export function listMoreBlogs(url, selection) {
    return dispatch => {
        dispatch(listMoreBlogsStart(url, selection));
        axios
            .get(url)
            .then(function(response) {
                dispatch(listMoreBlogsSuccess(response.data, selection));
            })
            .catch(function(error) {
                dispatch(
                    listMoreBlogsFailed(
                        error.response ? error.response.data : null,
                        selection,
                    ),
                );
            });
    };
}

export function listMoreBlogsStart(url, selection) {
    return {
        type: LIST_MORE_BLOGS_START,
        url,
        selection,
    };
}

export function listMoreBlogsSuccess(response, selection) {
    return {
        type: LIST_MORE_BLOGS_SUCCESS,
        items: response.results,
        previous: response.previous,
        next: response.next,
        count: response.count,
        selection,
    };
}

export function listMoreBlogsFailed(error, selection) {
    return {
        type: LIST_MORE_BLOGS_FAILED,
        error,
        selection,
    };
}

export function retrieveBlog(id) {
    return dispatch => {
        dispatch(retrieveBlogStart(id));
        axios
            .get(ENDPOINT_BLOG + id + '/')
            .then(function(response) {
                dispatch(retrieveBlogSuccess(response.data));
            })
            .catch(function(error) {
                dispatch(
                    retrieveBlogFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function retrieveBlogStart(id) {
    return {
        type: RETRIEVE_BLOG_START,
        id,
    };
}

export function retrieveBlogSuccess(blog) {
    return {
        type: RETRIEVE_BLOG_SUCCESS,
        blog,
    };
}

export function retrieveBlogFailed(error) {
    return {
        type: RETRIEVE_BLOG_FAILED,
        error,
    };
}

export function updateBlog(id, blog) {
    var headers = {},
        data = blog;
    if (blog.image) {
        headers['Content-Type'] = 'multipart/form-data';

        data = new FormData();
        Object.keys(blog).map(key => {
            data.append(key, blog[key]);
        });
    }

    return dispatch => {
        dispatch(updateBlogStart(id));
        axios
            .patch(ENDPOINT_BLOG + id + '/', data, {headers})
            .then(function(response) {
                dispatch(updateBlogSuccess(response.data));
            })
            .catch(function(error) {
                dispatch(
                    updateBlogFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function updateBlogStart(id) {
    return {
        type: UPDATE_BLOG_START,
        id,
    };
}

export function updateBlogSuccess(blog) {
    return {
        type: UPDATE_BLOG_SUCCESS,
        blog,
    };
}

export function updateBlogFailed(error) {
    return {
        type: UPDATE_BLOG_FAILED,
        error,
    };
}

export function deleteBlog(id) {
    return dispatch => {
        dispatch(deleteBlogStart(id));
        axios
            .delete(ENDPOINT_BLOG + id + '/', {})
            .then(function() {
                dispatch(deleteBlogSuccess(id));
            })
            .catch(function(error) {
                dispatch(
                    deleteBlogFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function deleteBlogStart(id) {
    return {
        type: DELETE_BLOG_START,
        id,
    };
}

export function deleteBlogSuccess(id) {
    return {
        type: DELETE_BLOG_SUCCESS,
        id,
    };
}

export function deleteBlogFailed(error) {
    return {
        type: DELETE_BLOG_FAILED,
        error,
    };
}
