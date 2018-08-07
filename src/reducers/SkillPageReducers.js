import {combineReducers} from 'redux';

import * as SkillPageActions from "../actions/SkillPageActions";

function skill_page(state = null, action) {
    switch (action.type) {
        case SkillPageActions.RETRIEVE_SKILL_PAGE_SUCCESS:
            return action.skill_page;
        default:
            return state;
    }
}

function isRetrieving(state = {}, action) {
    let targetKey = action.target || action.id || 'default';
    let newState = {};
    switch (action.type) {
        case SkillPageActions.RETRIEVE_SKILL_PAGE_START:
            newState[targetKey] = true;
            return {...state, ...newState};
        case SkillPageActions.RETRIEVE_SKILL_PAGE_SUCCESS:
        case SkillPageActions.RETRIEVE_SKILL_PAGE_FAILED:
            newState[targetKey] = false;
            return {...state, ...newState};
        default:
            return state;
    }
}

const SkillPage = combineReducers({
    skill_page,
    isRetrieving
});

export default SkillPage;
