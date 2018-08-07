import axios from 'axios';
import {ENDPOINT_SKILLS} from './utils/api';

export const GET_SKILLS_START = 'GET_SKILLS_START';
export const GET_SKILLS_SUCCESS = 'GET_SKILLS_SUCCESS';
export const GET_SKILLS_FAILED = 'GET_SKILL_SUGGESTIONS_FAILED';
export const INVALIDATE_SKILLS = 'INVALIDATE_SKILLS';

export function getSkills(filter, selection, prev_selection) {
    return dispatch => {
        dispatch(getSkillsStart(filter, selection, prev_selection));
        axios
            .get(ENDPOINT_SKILLS, {params: filter})
            .then(function(response) {
                dispatch(getSkillsSuccess(response.data, selection, prev_selection));
            })
            .catch(function(error) {
                dispatch(
                    getSkillsFailed(
                        error.response ? error.response.data : null,
                        selection,
                        prev_selection
                    ),
                );
            });
    };
}

export function getSkillsStart(filter, selection, prev_selection) {
    return {
        type: GET_SKILLS_START,
        filter,
        selection,
        prev_selection
    };
}

export function getSkillsSuccess(response, selection, prev_selection) {
    return {
        type: GET_SKILLS_SUCCESS,
        items: response.results,
        previous: response.previous,
        next: response.next,
        count: response.count,
        selection,
        prev_selection
    };
}

export function getSkillsFailed(error, selection, prev_selection) {
    return {
        type: GET_SKILLS_FAILED,
        error,
        selection,
        prev_selection
    };
}

export function invalidateSkills() {
    return {
        type: INVALIDATE_SKILLS,
    };
}
