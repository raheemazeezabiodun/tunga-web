import axios from 'axios';
import {ENDPOINT_SKILL_PAGES} from './utils/api';

export const RETRIEVE_SKILL_PAGE_START = 'RETRIEVE_SKILL_PAGE_START';
export const RETRIEVE_SKILL_PAGE_SUCCESS = 'RETRIEVE_SKILL_PAGE_SUCCESS';
export const RETRIEVE_SKILL_PAGE_FAILED = 'RETRIEVE_SKILL_PAGE_FAILED';

export function retrieveSkillPage(id) {
    return dispatch => {
        dispatch(retrieveSkillPageStart(id));
        axios
            .get(ENDPOINT_SKILL_PAGES + id + '/')
            .then(function(response) {
                dispatch(retrieveSkillPageSuccess(response.data, id));
            })
            .catch(function(error) {
                dispatch(
                    retrieveSkillPageFailed(
                        error.response ? error.response.data : null, id
                    ),
                );
            });
    };
}

export function retrieveSkillPageStart(id) {
    return {
        type: RETRIEVE_SKILL_PAGE_START,
        id,
    };
}

export function retrieveSkillPageSuccess(skill_page, id) {
    return {
        type: RETRIEVE_SKILL_PAGE_SUCCESS,
        skill_page,
        id
    };
}

export function retrieveSkillPageFailed(error, id) {
    return {
        type: RETRIEVE_SKILL_PAGE_FAILED,
        error,
        id
    };
}
