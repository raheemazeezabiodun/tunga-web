import axios from 'axios';
import {ENDPOINT_USER} from '../constants/Api';

export const GET_USER_SUGGESTIONS_START = 'GET_USER_SUGGESTIONS_START';
export const GET_USER_SUGGESTIONS_SUCCESS = 'GET_USER_SUGGESTIONS_SUCCESS';
export const GET_USER_SUGGESTIONS_FAILED = 'GET_USER_SUGGESTIONS_FAILED';
export const INVALIDATE_USER_SUGGESTIONS = 'INVALIDATE_USER_SUGGESTIONS';
export const ADD_USER_SELECTION = 'ADD_USER_SELECTION';
export const REMOVE_USER_SELECTION = 'REMOVE_USER_SELECTION';
export const CLEAR_USER_SELECTIONS = 'CLEAR_USER_SELECTIONS';

export function getUserSuggestions(filter, selection) {
    return dispatch => {
        dispatch(getUserSuggestionsStart(filter, selection));
        axios
            .get(ENDPOINT_USER, {params: filter})
            .then(function(response) {
                dispatch(getUserSuggestionsSuccess(response.data, selection));
            })
            .catch(function(error) {
                dispatch(
                    getUserSuggestionsFailed(
                        error.response ? error.response.data : null,
                        selection,
                    ),
                );
            });
    };
}

export function getUserSuggestionsStart(filter, selection) {
    return {
        type: GET_USER_SUGGESTIONS_START,
        filter,
        selection,
    };
}

export function getUserSuggestionsSuccess(response, selection) {
    return {
        type: GET_USER_SUGGESTIONS_SUCCESS,
        items: response.results,
        previous: response.previous,
        next: response.next,
        count: response.count,
        selection,
    };
}

export function getUserSuggestionsFailed(error, selection) {
    return {
        type: GET_USER_SUGGESTIONS_FAILED,
        error,
        selection,
    };
}

export function invalidateUserSuggestions(selection) {
    return {
        type: INVALIDATE_USER_SUGGESTIONS,
        selection,
    };
}

export function addUserSelection(user, selection) {
    return {
        type: ADD_USER_SELECTION,
        user,
        selection,
    };
}

export function removeUserSelection(id, selection) {
    return {
        type: REMOVE_USER_SELECTION,
        id,
        selection,
    };
}

export function clearUserSelections(selection) {
    return {
        type: CLEAR_USER_SELECTIONS,
        selection,
    };
}
