import {combineReducers} from 'redux';
import * as ProgressReportActions from '../actions/ProgressReportActions';
import {LOGOUT_SUCCESS} from '../actions/AuthActions';
import {PATH_CHANGE} from '../actions/NavActions';

function progress_report(state = {}, action) {
    switch (action.type) {
        case ProgressReportActions.CREATE_PROGRESS_REPORT_SUCCESS:
        case ProgressReportActions.RETRIEVE_PROGRESS_REPORT_SUCCESS:
            return action.progress_report;
        case ProgressReportActions.UPDATE_PROGRESS_REPORT_SUCCESS:
            return {...state, ...action.progress_report};
        case ProgressReportActions.DELETE_PROGRESS_REPORT_SUCCESS:
        case ProgressReportActions.CREATE_PROGRESS_REPORT_START:
        case ProgressReportActions.CREATE_PROGRESS_REPORT_FAILED:
        case ProgressReportActions.RETRIEVE_PROGRESS_REPORT_START:
        case ProgressReportActions.RETRIEVE_PROGRESS_REPORT_FAILED:
            return {};
        default:
            return state;
    }
}

function progress_reports(state = {}, action) {
    switch (action.type) {
        case ProgressReportActions.LIST_PROGRESS_REPORTS_SUCCESS:
        case ProgressReportActions.LIST_MORE_PROGRESS_REPORTS_SUCCESS:
            var all_progress_reports = {};
            action.items.forEach(progress_report => {
                all_progress_reports[progress_report.id] = progress_report;
            });
            return {...state, ...all_progress_reports};
        case ProgressReportActions.LIST_PROGRESS_REPORTS_START:
        case ProgressReportActions.LIST_PROGRESS_REPORTS_FAILED:
            return {};
        default:
            return state;
    }
}

function ids(state = [], action) {
    switch (action.type) {
        case ProgressReportActions.LIST_PROGRESS_REPORTS_SUCCESS:
        case ProgressReportActions.LIST_MORE_PROGRESS_REPORTS_SUCCESS:
            var new_progress_reports = action.items.map(progress_report => {
                return progress_report.id;
            });
            return [...state, ...new_progress_reports];
        case ProgressReportActions.LIST_PROGRESS_REPORTS_START:
        case ProgressReportActions.LIST_PROGRESS_REPORTS_FAILED:
            return [];
        default:
            return state;
    }
}

function next(state = null, action) {
    switch (action.type) {
        case ProgressReportActions.LIST_PROGRESS_REPORTS_SUCCESS:
        case ProgressReportActions.LIST_MORE_PROGRESS_REPORTS_SUCCESS:
            return action.next;
        default:
            return state;
    }
}

function previous(state = null, action) {
    switch (action.type) {
        case ProgressReportActions.LIST_PROGRESS_REPORTS_SUCCESS:
        case ProgressReportActions.LIST_MORE_PROGRESS_REPORTS_SUCCESS:
            return action.previous;
        default:
            return state;
    }
}

function isSaving(state = false, action) {
    switch (action.type) {
        case ProgressReportActions.CREATE_PROGRESS_REPORT_START:
        case ProgressReportActions.UPDATE_PROGRESS_REPORT_START:
            return true;
        case ProgressReportActions.CREATE_PROGRESS_REPORT_SUCCESS:
        case ProgressReportActions.CREATE_PROGRESS_REPORT_FAILED:
        case ProgressReportActions.UPDATE_PROGRESS_REPORT_SUCCESS:
        case ProgressReportActions.UPDATE_PROGRESS_REPORT_FAILED:
        case ProgressReportActions.RETRIEVE_PROGRESS_REPORT_START:
            return false;
        default:
            return state;
    }
}

function isSaved(state = false, action) {
    switch (action.type) {
        case ProgressReportActions.CREATE_PROGRESS_REPORT_SUCCESS:
        case ProgressReportActions.UPDATE_PROGRESS_REPORT_SUCCESS:
            return true;
        case ProgressReportActions.CREATE_PROGRESS_REPORT_START:
        case ProgressReportActions.CREATE_PROGRESS_REPORT_FAILED:
        case ProgressReportActions.UPDATE_PROGRESS_REPORT_START:
        case ProgressReportActions.UPDATE_PROGRESS_REPORT_FAILED:
        case PATH_CHANGE:
            return false;
        default:
            return state;
    }
}

function isFetching(state = false, action) {
    switch (action.type) {
        case ProgressReportActions.LIST_PROGRESS_REPORTS_START:
            return true;
        case ProgressReportActions.LIST_PROGRESS_REPORTS_SUCCESS:
        case ProgressReportActions.LIST_PROGRESS_REPORTS_FAILED:
            return false;
        default:
            return state;
    }
}

function isFetchingMore(state = false, action) {
    switch (action.type) {
        case ProgressReportActions.LIST_MORE_PROGRESS_REPORTS_START:
            return true;
        case ProgressReportActions.LIST_MORE_PROGRESS_REPORTS_SUCCESS:
        case ProgressReportActions.LIST_MORE_PROGRESS_REPORTS_FAILED:
            return false;
        default:
            return state;
    }
}

function isRetrieving(state = false, action) {
    switch (action.type) {
        case ProgressReportActions.RETRIEVE_PROGRESS_REPORT_START:
            return true;
        case ProgressReportActions.RETRIEVE_PROGRESS_REPORT_SUCCESS:
        case ProgressReportActions.RETRIEVE_PROGRESS_REPORT_FAILED:
            return false;
        default:
            return state;
    }
}

function isDeleting(state = false, action) {
    switch (action.type) {
        case ProgressReportActions.DELETE_PROGRESS_REPORT_START:
            return true;
        case ProgressReportActions.DELETE_PROGRESS_REPORT_SUCCESS:
        case ProgressReportActions.DELETE_PROGRESS_REPORT_FAILED:
            return false;
        default:
            return false;
    }
}

function error(state = {}, action) {
    switch (action.type) {
        case ProgressReportActions.CREATE_PROGRESS_REPORT_FAILED:
            return {...state, create: action.error};
        case ProgressReportActions.CREATE_PROGRESS_REPORT_START:
        case ProgressReportActions.CREATE_PROGRESS_REPORT_SUCCESS:
            return {...state, create: null};
        case ProgressReportActions.UPDATE_PROGRESS_REPORT_FAILED:
            return {...state, update: action.error};
        case ProgressReportActions.UPDATE_PROGRESS_REPORT_START:
        case ProgressReportActions.UPDATE_PROGRESS_REPORT_SUCCESS:
            return {...state, update: null};
        default:
            return state;
    }
}

const detail = combineReducers({
    progress_report,
    isRetrieving,
    isSaving,
    isSaved,
    isDeleting,
    error,
});

const list = combineReducers({
    progress_reports,
    ids,
    isFetching,
    isFetchingMore,
    next,
    previous,
});

const ProgressReport = combineReducers({
    detail,
    list,
});

export default ProgressReport;
