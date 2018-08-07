import {combineReducers} from 'redux';
import * as ProjectActions from '../actions/ProjectActions';
import {LOGOUT_SUCCESS} from '../actions/AuthActions';
import {PATH_CHANGE} from '../actions/NavActions';

function project(state = {}, action) {
    switch (action.type) {
        case ProjectActions.CREATE_PROJECT_SUCCESS:
        case ProjectActions.RETRIEVE_PROJECT_SUCCESS:
            return action.project;
        case ProjectActions.UPDATE_PROJECT_SUCCESS:
            return {...state, ...action.project};
        case ProjectActions.DELETE_PROJECT_SUCCESS:
        case ProjectActions.CREATE_PROJECT_START:
        case ProjectActions.CREATE_PROJECT_FAILED:
        case ProjectActions.RETRIEVE_PROJECT_START:
        case ProjectActions.RETRIEVE_PROJECT_FAILED:
            return {};
        default:
            return state;
    }
}

function projects(state = {}, action) {
    switch (action.type) {
        case ProjectActions.LIST_PROJECTS_SUCCESS:
        case ProjectActions.LIST_MORE_PROJECTS_SUCCESS:
            var all_projects = {};
            action.items.forEach(project => {
                all_projects[project.id] = project;
            });
            return {...state, ...all_projects};
        case ProjectActions.LIST_PROJECTS_START:
        case ProjectActions.LIST_PROJECTS_FAILED:
            return {};
        default:
            return state;
    }
}

function ids(state = [], action) {
    switch (action.type) {
        case ProjectActions.LIST_PROJECTS_SUCCESS:
        case ProjectActions.LIST_MORE_PROJECTS_SUCCESS:
            var new_projects = action.items.map(project => {
                return project.id;
            });
            return [...state, ...new_projects];
        case ProjectActions.LIST_PROJECTS_START:
        case ProjectActions.LIST_PROJECTS_FAILED:
            return [];
        default:
            return state;
    }
}

function next(state = null, action) {
    switch (action.type) {
        case ProjectActions.LIST_PROJECTS_SUCCESS:
        case ProjectActions.LIST_MORE_PROJECTS_SUCCESS:
            return action.next;
        default:
            return state;
    }
}

function previous(state = null, action) {
    switch (action.type) {
        case ProjectActions.LIST_PROJECTS_SUCCESS:
        case ProjectActions.LIST_MORE_PROJECTS_SUCCESS:
            return action.previous;
        default:
            return state;
    }
}

function isSaving(state = false, action) {
    switch (action.type) {
        case ProjectActions.CREATE_PROJECT_START:
        case ProjectActions.UPDATE_PROJECT_START:
            return true;
        case ProjectActions.CREATE_PROJECT_SUCCESS:
        case ProjectActions.CREATE_PROJECT_FAILED:
        case ProjectActions.UPDATE_PROJECT_SUCCESS:
        case ProjectActions.UPDATE_PROJECT_FAILED:
        case ProjectActions.RETRIEVE_PROJECT_START:
            return false;
        default:
            return state;
    }
}

function isSaved(state = false, action) {
    switch (action.type) {
        case ProjectActions.CREATE_PROJECT_SUCCESS:
        case ProjectActions.UPDATE_PROJECT_SUCCESS:
            return true;
        case ProjectActions.CREATE_PROJECT_START:
        case ProjectActions.CREATE_PROJECT_FAILED:
        case ProjectActions.UPDATE_PROJECT_START:
        case ProjectActions.UPDATE_PROJECT_FAILED:
        case PATH_CHANGE:
            return false;
        default:
            return state;
    }
}

function isFetching(state = false, action) {
    switch (action.type) {
        case ProjectActions.LIST_PROJECTS_START:
            return true;
        case ProjectActions.LIST_PROJECTS_SUCCESS:
        case ProjectActions.LIST_PROJECTS_FAILED:
            return false;
        default:
            return state;
    }
}

function isFetchingMore(state = false, action) {
    switch (action.type) {
        case ProjectActions.LIST_MORE_PROJECTS_START:
            return true;
        case ProjectActions.LIST_MORE_PROJECTS_SUCCESS:
        case ProjectActions.LIST_MORE_PROJECTS_FAILED:
            return false;
        default:
            return state;
    }
}

function isRetrieving(state = false, action) {
    switch (action.type) {
        case ProjectActions.RETRIEVE_PROJECT_START:
            return true;
        case ProjectActions.RETRIEVE_PROJECT_SUCCESS:
        case ProjectActions.RETRIEVE_PROJECT_FAILED:
            return false;
        default:
            return state;
    }
}

function isDeleting(state = false, action) {
    switch (action.type) {
        case ProjectActions.DELETE_PROJECT_START:
            return true;
        case ProjectActions.DELETE_PROJECT_SUCCESS:
        case ProjectActions.DELETE_PROJECT_FAILED:
            return false;
        default:
            return false;
    }
}

function error(state = {}, action) {
    switch (action.type) {
        case ProjectActions.CREATE_PROJECT_FAILED:
            return {...state, create: action.error};
        case ProjectActions.CREATE_PROJECT_START:
        case ProjectActions.CREATE_PROJECT_SUCCESS:
            return {...state, create: null};
        case ProjectActions.UPDATE_PROJECT_FAILED:
            return {...state, update: action.error};
        case ProjectActions.UPDATE_PROJECT_START:
        case ProjectActions.UPDATE_PROJECT_SUCCESS:
            return {...state, update: null};
        default:
            return state;
    }
}

export function running(state = [], action) {
    switch (action.type) {
        case ProjectActions.LIST_RUNNING_PROJECTS_SUCCESS:
            return action.items;
        case ProjectActions.CREATE_PROJECT_SUCCESS:
            return [action.project, ...state];
        case LOGOUT_SUCCESS:
            return [];
        default:
            return state;
    }
}

const detail = combineReducers({
    project,
    isRetrieving,
    isSaving,
    isSaved,
    isDeleting,
    error,
});

const list = combineReducers({
    projects,
    ids,
    isFetching,
    isFetchingMore,
    next,
    previous,
});

const Project = combineReducers({
    detail,
    list,
    running,
});

export default Project;
