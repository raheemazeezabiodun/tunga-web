import {combineReducers} from 'redux';
import * as SkillSelectionActions from '../actions/SkillSelectionActions';
import {CREATE_TASK_SUCCESS} from '../actions/TaskActions';

function selected(state = [], action) {
    switch (action.type) {
        case SkillSelectionActions.ADD_SKILL_SELECTION:
            if (state.indexOf(action.skill) == -1) {
                return [...state, action.skill];
            }
            return state;
        case SkillSelectionActions.REMOVE_SKILL_SELECTION:
            var idx = state.indexOf(action.skill);
            if (idx > -1) {
                return [...state.slice(0, idx), ...state.slice(idx + 1)];
            }
            return state;
        case SkillSelectionActions.CLEAR_SKILL_SELECTIONS:
        case CREATE_TASK_SUCCESS:
            return [];
        default:
            return state;
    }
}

function suggestions(state = {}, action) {
    var selection_key = action.selection || 'default';
    var new_state = {};
    switch (action.type) {
        case SkillSelectionActions.GET_SKILL_SUGGESTIONS_SUCCESS:
            new_state[selection_key] = action.items;
            return {...state, ...new_state};
        case SkillSelectionActions.INVALIDATE_SKILL_SUGGESTIONS:
            new_state[selection_key] = [];
            return {...state, ...new_state};
        default:
            return state;
    }
}

function isFetching(state = false, action) {
    switch (action.type) {
        case SkillSelectionActions.GET_SKILL_SUGGESTIONS_START:
            return true;
        case SkillSelectionActions.GET_SKILL_SUGGESTIONS_SUCCESS:
        case SkillSelectionActions.GET_SKILL_SUGGESTIONS_FAILED:
            return false;
        default:
            return state;
    }
}

function isValid(state = true, action) {
    switch (action.type) {
        case SkillSelectionActions.GET_SKILL_SUGGESTIONS_START:
            return true;
        case SkillSelectionActions.INVALIDATE_SKILL_SUGGESTIONS:
            return false;
        default:
            return state;
    }
}

const SkillSelection = combineReducers({
    selected,
    suggestions,
    isFetching,
    isValid,
});

export default SkillSelection;
