import {combineReducers} from 'redux';
import * as MilestoneActions from '../actions/MilestoneActions';
import * as ProgressReportActions from '../actions/ProgressReportActions';
import {PATH_CHANGE} from '../actions/NavActions';

function milestone(state = {}, action) {
    switch (action.type) {
        case MilestoneActions.CREATE_MILESTONE_SUCCESS:
        case MilestoneActions.RETRIEVE_MILESTONE_SUCCESS:
            return action.milestone;
        case MilestoneActions.UPDATE_MILESTONE_SUCCESS:
            return {...state, ...action.milestone};
        case MilestoneActions.DELETE_MILESTONE_SUCCESS:
        case MilestoneActions.CREATE_MILESTONE_START:
        case MilestoneActions.CREATE_MILESTONE_FAILED:
        case MilestoneActions.RETRIEVE_MILESTONE_START:
        case MilestoneActions.RETRIEVE_MILESTONE_FAILED:
            return {};
        case ProgressReportActions.CREATE_PROGRESS_REPORT_SUCCESS:
        case ProgressReportActions.UPDATE_PROGRESS_REPORT_SUCCESS:
            if (state.id == action.progress_report.event) {
                return {
                    ...state,
                    report: {
                        ...state.report,
                        ...action.progress_report,
                        user: action.progress_report.details.user,
                    },
                };
            }
            return state;
        default:
            return state;
    }
}

function milestones(state = {}, action) {
    switch (action.type) {
        case MilestoneActions.LIST_MILESTONES_SUCCESS:
        case MilestoneActions.LIST_MORE_MILESTONES_SUCCESS:
            var all_milestones = {};
            action.items.forEach(milestone => {
                all_milestones[milestone.id] = milestone;
            });
            return {...state, ...all_milestones};
        case MilestoneActions.LIST_MILESTONES_START:
        case MilestoneActions.LIST_MILESTONES_FAILED:
            return {};
        default:
            return state;
    }
}

function ids(state = [], action) {
    switch (action.type) {
        case MilestoneActions.LIST_MILESTONES_SUCCESS:
            return action.items.map(milestone => {
                return milestone.id;
            });
        case MilestoneActions.LIST_MORE_MILESTONES_SUCCESS:
            var new_milestones = action.items.map(milestone => {
                return milestone.id;
            });
            return [...state, ...new_milestones];
        case MilestoneActions.LIST_MILESTONES_START:
        case MilestoneActions.LIST_MILESTONES_FAILED:
            return [];
        default:
            return state;
    }
}

function next(state = null, action) {
    switch (action.type) {
        case MilestoneActions.LIST_MILESTONES_SUCCESS:
        case MilestoneActions.LIST_MORE_MILESTONES_SUCCESS:
            return action.next;
        default:
            return state;
    }
}

function previous(state = null, action) {
    switch (action.type) {
        case MilestoneActions.LIST_MILESTONES_SUCCESS:
        case MilestoneActions.LIST_MORE_MILESTONES_SUCCESS:
            return action.previous;
        default:
            return state;
    }
}

function isSaving(state = false, action) {
    switch (action.type) {
        case MilestoneActions.CREATE_MILESTONE_START:
        case MilestoneActions.UPDATE_MILESTONE_START:
            return true;
        case MilestoneActions.CREATE_MILESTONE_SUCCESS:
        case MilestoneActions.CREATE_MILESTONE_FAILED:
        case MilestoneActions.UPDATE_MILESTONE_SUCCESS:
        case MilestoneActions.UPDATE_MILESTONE_FAILED:
        case MilestoneActions.RETRIEVE_MILESTONE_START:
            return false;
        default:
            return state;
    }
}

function isSaved(state = false, action) {
    switch (action.type) {
        case MilestoneActions.CREATE_MILESTONE_SUCCESS:
        case MilestoneActions.UPDATE_MILESTONE_SUCCESS:
            return true;
        case MilestoneActions.CREATE_MILESTONE_START:
        case MilestoneActions.CREATE_MILESTONE_FAILED:
        case MilestoneActions.UPDATE_MILESTONE_START:
        case MilestoneActions.UPDATE_MILESTONE_FAILED:
        case PATH_CHANGE:
            return false;
        default:
            return state;
    }
}

function isFetching(state = false, action) {
    switch (action.type) {
        case MilestoneActions.LIST_MILESTONES_START:
            return true;
        case MilestoneActions.LIST_MILESTONES_SUCCESS:
        case MilestoneActions.LIST_MILESTONES_FAILED:
            return false;
        default:
            return state;
    }
}

function isFetchingMore(state = false, action) {
    switch (action.type) {
        case MilestoneActions.LIST_MORE_MILESTONES_START:
            return true;
        case MilestoneActions.LIST_MORE_MILESTONES_SUCCESS:
        case MilestoneActions.LIST_MORE_MILESTONES_FAILED:
            return false;
        default:
            return state;
    }
}

function isRetrieving(state = false, action) {
    switch (action.type) {
        case MilestoneActions.RETRIEVE_MILESTONE_START:
            return true;
        case MilestoneActions.RETRIEVE_MILESTONE_SUCCESS:
        case MilestoneActions.RETRIEVE_MILESTONE_FAILED:
            return false;
        default:
            return state;
    }
}

function isDeleting(state = false, action) {
    switch (action.type) {
        case MilestoneActions.DELETE_MILESTONE_START:
            return true;
        case MilestoneActions.DELETE_MILESTONE_SUCCESS:
        case MilestoneActions.DELETE_MILESTONE_FAILED:
            return false;
        default:
            return false;
    }
}

function error(state = {}, action) {
    switch (action.type) {
        case MilestoneActions.CREATE_MILESTONE_FAILED:
            return {...state, create: action.error};
        case MilestoneActions.CREATE_MILESTONE_START:
        case MilestoneActions.CREATE_MILESTONE_SUCCESS:
            return {...state, create: null};
        case MilestoneActions.UPDATE_MILESTONE_FAILED:
            return {...state, update: action.error};
        case MilestoneActions.UPDATE_MILESTONE_START:
        case MilestoneActions.UPDATE_MILESTONE_SUCCESS:
            return {...state, update: null};
        default:
            return state;
    }
}

const detail = combineReducers({
    milestone,
    isRetrieving,
    isSaving,
    isSaved,
    isDeleting,
    error,
});

const list = combineReducers({
    milestones,
    ids,
    isFetching,
    isFetchingMore,
    next,
    previous,
});

const Milestone = combineReducers({
    detail,
    list,
});

export default Milestone;
