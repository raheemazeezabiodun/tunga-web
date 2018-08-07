import {combineReducers} from 'redux';
import * as SkillActions from '../actions/SkillActions';

function skills(state = {}, action) {
    let selection_key = action.selection || 'default';
    let new_state = {};
    switch (action.type) {
        case SkillActions.GET_SKILLS_SUCCESS:
            new_state[selection_key] = action.items;
            return {...state, ...new_state};
        case SkillActions.INVALIDATE_SKILLS:
            new_state[selection_key] = [];
            return {...state, ...new_state};
        default:
            return state;
    }
}

function isFetching(state = {}, action) {
    let selection_key = action.selection || 'default';
    let new_state = {};
    switch (action.type) {
        case SkillActions.GET_SKILLS_START:
            new_state[selection_key] = true;
            return {...state, ...new_state};
        case SkillActions.GET_SKILLS_SUCCESS:
        case SkillActions.GET_SKILLS_FAILED:
            new_state[selection_key] = false;
            return {...state, ...new_state};
        default:
            return state;
    }
}

const Skill = combineReducers({
    skills,
    isFetching
});

export default Skill;
