import {combineReducers} from 'redux';
import * as SkillPageActions from '../actions/SkillPageActions';
import {PATH_CHANGE} from '../actions/NavActions';
import {LOGOUT_SUCCESS} from '../actions/AuthActions';
import {CLEAR_VALIDATIONS} from '../actions/UtilityActions';
import {getIds} from '../utils/reducers';
import {safeParseJSON} from '../utils/helpers';

function skill_page(state = {}, action) {
    switch (action.type) {
        case SkillPageActions.CREATE_SKILL_PAGE_SUCCESS:
        case SkillPageActions.RETRIEVE_SKILL_PAGE_SUCCESS:
            return safeParseJSON(action.skill_page);
        case SkillPageActions.UPDATE_SKILL_PAGE_SUCCESS:
            return {...state, ...safeParseJSON(action.skill_page)};
        case SkillPageActions.DELETE_SKILL_PAGE_SUCCESS:
        case SkillPageActions.RETRIEVE_SKILL_PAGE_START:
        case SkillPageActions.RETRIEVE_SKILL_PAGE_FAILED:
            return {};
        default:
            return state;
    }
}

function skill_pages(state = {}, action) {
    switch (action.type) {
        case SkillPageActions.LIST_SKILL_PAGES_SUCCESS:
        case SkillPageActions.LIST_MORE_SKILL_PAGES_SUCCESS:
            var all_skill_pages = {};
            action.items.forEach(skill_page => {
                all_skill_pages[skill_page.id] = skill_page;
            });
            return {...state, ...all_skill_pages};
        //case SkillPageActions.LIST_SKILL_PAGES_START:
        case SkillPageActions.LIST_SKILL_PAGES_FAILED:
            return {};
        case SkillPageActions.UPDATE_SKILL_PAGE_SUCCESS:
            var new_skill_page = {};
            new_skill_page[action.skill_page.id] = action.skill_page;
            return {...state, ...new_skill_page};
        default:
            return state;
    }
}

function ids(state = {}, action) {
    var selection_key = action.selection || 'default';
    var new_state = {};
    switch (action.type) {
        case SkillPageActions.LIST_SKILL_PAGES_SUCCESS:
            new_state[selection_key] = getIds(action.items);
            return {...state, ...new_state};
        case SkillPageActions.LIST_MORE_SKILL_PAGES_SUCCESS:
            new_state[selection_key] = [
                ...state[selection_key],
                ...getIds(action.items),
            ];
            return {...state, ...new_state};
        case SkillPageActions.LIST_SKILL_PAGES_START:
            if (action.prev_selection && state[action.prev_selection]) {
                new_state[selection_key] = state[action.prev_selection];
                return {...state, ...new_state};
            }
            return state;
        case SkillPageActions.LIST_SKILL_PAGES_FAILED:
            return state;
        default:
            return state;
    }
}

function next(state = null, action) {
    switch (action.type) {
        case SkillPageActions.LIST_SKILL_PAGES_SUCCESS:
        case SkillPageActions.LIST_MORE_SKILL_PAGES_SUCCESS:
            return action.next;
        default:
            return state;
    }
}

function previous(state = null, action) {
    switch (action.type) {
        case SkillPageActions.LIST_SKILL_PAGES_SUCCESS:
        case SkillPageActions.LIST_MORE_SKILL_PAGES_SUCCESS:
            return action.previous;
        default:
            return state;
    }
}

function count(state = null, action) {
    switch (action.type) {
        case SkillPageActions.LIST_SKILL_PAGES_SUCCESS:
            return action.count;
        case SkillPageActions.LIST_MORE_SKILL_PAGES_START:
        case SkillPageActions.LIST_SKILL_PAGES_FAILED:
            return 0;
        default:
            return state;
    }
}

function filter(state = null, action) {
    switch (action.type) {
        case SkillPageActions.LIST_SKILL_PAGES_SUCCESS:
            return action.filter;
        case SkillPageActions.LIST_SKILL_PAGES_START:
        case SkillPageActions.LIST_SKILL_PAGES_FAILED:
            return null;
        default:
            return state;
    }
}

function isSaving(state = false, action) {
    switch (action.type) {
        case SkillPageActions.CREATE_SKILL_PAGE_START:
        case SkillPageActions.UPDATE_SKILL_PAGE_START:
            return true;
        case SkillPageActions.CREATE_SKILL_PAGE_SUCCESS:
        case SkillPageActions.CREATE_SKILL_PAGE_FAILED:
        case SkillPageActions.UPDATE_SKILL_PAGE_SUCCESS:
        case SkillPageActions.UPDATE_SKILL_PAGE_FAILED:
        case SkillPageActions.RETRIEVE_SKILL_PAGE_START:
        case CLEAR_VALIDATIONS:
            return false;
        default:
            return state;
    }
}

function isSaved(state = false, action) {
    switch (action.type) {
        case SkillPageActions.CREATE_SKILL_PAGE_SUCCESS:
        case SkillPageActions.UPDATE_SKILL_PAGE_SUCCESS:
            return true;
        case SkillPageActions.CREATE_SKILL_PAGE_START:
        case SkillPageActions.CREATE_SKILL_PAGE_FAILED:
        case SkillPageActions.UPDATE_SKILL_PAGE_START:
        case SkillPageActions.UPDATE_SKILL_PAGE_FAILED:
        case PATH_CHANGE:
        case CLEAR_VALIDATIONS:
            return false;
        default:
            return state;
    }
}

function isFetching(state = false, action) {
    switch (action.type) {
        case SkillPageActions.LIST_SKILL_PAGES_START:
            return true;
        case SkillPageActions.LIST_SKILL_PAGES_SUCCESS:
        case SkillPageActions.LIST_SKILL_PAGES_FAILED:
            return false;
        default:
            return state;
    }
}

function isFetchingMore(state = false, action) {
    switch (action.type) {
        case SkillPageActions.LIST_MORE_SKILL_PAGES_START:
            return true;
        case SkillPageActions.LIST_MORE_SKILL_PAGES_SUCCESS:
        case SkillPageActions.LIST_MORE_SKILL_PAGES_FAILED:
            return false;
        default:
            return state;
    }
}

function isRetrieving(state = false, action) {
    switch (action.type) {
        case SkillPageActions.RETRIEVE_SKILL_PAGE_START:
            return true;
        case SkillPageActions.RETRIEVE_SKILL_PAGE_SUCCESS:
        case SkillPageActions.RETRIEVE_SKILL_PAGE_FAILED:
        case CLEAR_VALIDATIONS:
            return false;
        default:
            return state;
    }
}

function isDeleting(state = false, action) {
    switch (action.type) {
        case SkillPageActions.DELETE_SKILL_PAGE_START:
            return true;
        case SkillPageActions.DELETE_SKILL_PAGE_SUCCESS:
        case SkillPageActions.DELETE_SKILL_PAGE_FAILED:
        case CLEAR_VALIDATIONS:
            return false;
        default:
            return false;
    }
}

function error(state = {}, action) {
    switch (action.type) {
        case SkillPageActions.CREATE_SKILL_PAGE_FAILED:
            return {...state, create: action.error};
        case SkillPageActions.CREATE_SKILL_PAGE_START:
        case SkillPageActions.CREATE_SKILL_PAGE_SUCCESS:
            return {...state, create: null};
        case SkillPageActions.UPDATE_SKILL_PAGE_FAILED:
            return {...state, update: action.error};
        case SkillPageActions.UPDATE_SKILL_PAGE_START:
        case SkillPageActions.UPDATE_SKILL_PAGE_SUCCESS:
            return {...state, update: null};
        case SkillPageActions.RETRIEVE_SKILL_PAGE_FAILED:
            return {...state, retrieve: action.error};
        case SkillPageActions.RETRIEVE_SKILL_PAGE_START:
        case SkillPageActions.RETRIEVE_SKILL_PAGE_SUCCESS:
            return {...state, retrieve: null};
        case CLEAR_VALIDATIONS:
            return {};
        default:
            return state;
    }
}

export function running(state = [], action) {
    switch (action.type) {
        case SkillPageActions.CREATE_SKILL_PAGE_SUCCESS:
            return [action.skill_page, ...state];
        case LOGOUT_SUCCESS:
            return [];
        default:
            return state;
    }
}

function isPaying(state = false, action) {
    switch (action.type) {
        case SkillPageActions.MAKE_PAYMENT_START:
            return true;
        case SkillPageActions.MAKE_PAYMENT_SUCCESS:
        case SkillPageActions.MAKE_PAYMENT_FAILED:
        case CLEAR_VALIDATIONS:
            return false;
        default:
            return state;
    }
}

const detail = combineReducers({
    skill_page,
    isRetrieving,
    isSaving,
    isSaved,
    isDeleting,
    isPaying,
    error,
});

const list = combineReducers({
    skill_pages,
    ids,
    isFetching,
    isFetchingMore,
    next,
    previous,
    count,
    filter,
});

const SkillPage = combineReducers({
    detail,
    list,
});

export default SkillPage;
