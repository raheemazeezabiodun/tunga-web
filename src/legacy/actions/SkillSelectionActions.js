import axios from 'axios';
import {ENDPOINT_SKILL} from '../constants/Api';

export const GET_SKILL_SUGGESTIONS_START = 'GET_SKILL_SUGGESTIONS_START';
export const GET_SKILL_SUGGESTIONS_SUCCESS = 'GET_SKILL_SUGGESTIONS_SUCCESS';
export const GET_SKILL_SUGGESTIONS_FAILED = 'GET_SKILL_SUGGESTIONS_FAILED';
export const INVALIDATE_SKILL_SUGGESTIONS = 'INVALIDATE_SKILL_SUGGESTIONS';
export const ADD_SKILL_SELECTION = 'ADD_SKILL_SELECTION';
export const REMOVE_SKILL_SELECTION = 'REMOVE_SKILL_SELECTION';
export const CLEAR_SKILL_SELECTIONS = 'CLEAR_SKILL_SELECTIONS';

export function getSkillSuggestions(filter, selection, prev_selection) {
    return dispatch => {
        dispatch(getSkillSuggestionsStart(filter, selection));
        axios
            .get(ENDPOINT_SKILL, {params: filter})
            .then(function(response) {
                dispatch(getSkillSuggestionsSuccess(response.data, selection));
            })
            .catch(function(error) {
                dispatch(
                    getSkillSuggestionsFailed(
                        error.response ? error.response.data : null,
                        selection,
                    ),
                );
            });
    };
}

export function getSkillSuggestionsStart(filter, selection) {
    return {
        type: GET_SKILL_SUGGESTIONS_START,
        filter,
        selection,
    };
}

export function getSkillSuggestionsSuccess(response, selection) {
    return {
        type: GET_SKILL_SUGGESTIONS_SUCCESS,
        items: response.results,
        previous: response.previous,
        next: response.next,
        count: response.count,
        selection,
    };
}

export function getSkillSuggestionsFailed(error, selection) {
    return {
        type: GET_SKILL_SUGGESTIONS_FAILED,
        error,
        selection,
    };
}

export function invalidateSkillSuggestions() {
    return {
        type: INVALIDATE_SKILL_SUGGESTIONS,
    };
}

export function addSkillSelection(skill) {
    return {
        type: ADD_SKILL_SELECTION,
        skill,
    };
}

export function removeSkillSelection(skill) {
    return {
        type: REMOVE_SKILL_SELECTION,
        skill,
    };
}

export function clearSkillSelections() {
    return {
        type: CLEAR_SKILL_SELECTIONS,
    };
}
