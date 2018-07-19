import {combineReducers} from 'redux';
import {LOCATION_CHANGE} from "react-router-redux";

import {getIds} from './utils';
import * as ProgressEventActions from "../actions/ProgressEventActions";
import * as ProgressReportActions from "../actions/ProgressReportActions";

function created(state = {}, action) {
    let targetKey = action.target || 'new';
    let newState = {};
    switch (action.type) {
        case ProgressEventActions.CREATE_PROGRESS_EVENT_SUCCESS:
            newState[targetKey] = action.progress_event.id;
            return {...state, ...newState};
        default:
            return state;
    }
}

function deleted(state = {}, action) {
    let targetKey = action.id || 'default';
    let newState = {};
    switch (action.type) {
        case ProgressEventActions.DELETE_PROGRESS_EVENT_SUCCESS:
            newState[targetKey] = action.id;
            return {...state, ...newState};
        default:
            return state;
    }
}

function ids(state = {}, action) {
    let selectionKey = action.selection || 'default';
    let newState = {};
    switch (action.type) {
        case ProgressEventActions.LIST_PROGRESS_EVENTS_SUCCESS:
            newState[selectionKey] = getIds(action.items);
            return {...state, ...newState};
        case ProgressEventActions.LIST_MORE_PROGRESS_EVENTS_SUCCESS:
            newState[selectionKey] = [
                ...state[selectionKey],
                ...getIds(action.items),
            ];
            return {...state, ...newState};
        case ProgressEventActions.LIST_PROGRESS_EVENTS_START:
            if (action.prev_selection && state[action.prev_selection]) {
                newState[selectionKey] = state[action.prev_selection];
                return {...state, ...newState};
            }
            return state;
        case ProgressEventActions.LIST_PROGRESS_EVENTS_FAILED:
            return state;
        default:
            return state;
    }
}

function progress_events(state = {}, action) {
    switch (action.type) {
        case ProgressEventActions.LIST_PROGRESS_EVENTS_SUCCESS:
        case ProgressEventActions.LIST_MORE_PROGRESS_EVENTS_SUCCESS:
            let all_progress_events = {};
            action.items.forEach(progress_event => {
                all_progress_events[progress_event.id] = progress_event;
            });
            return {...state, ...all_progress_events};
        case ProgressEventActions.RETRIEVE_PROGRESS_EVENT_SUCCESS:
        case ProgressEventActions.UPDATE_PROGRESS_EVENT_SUCCESS:
            let new_progress_event = {};
            new_progress_event[action.progress_event.id] = action.progress_event;
            return {...state, ...new_progress_event};
        case ProgressReportActions.CREATE_PROGRESS_REPORT_SUCCESS:
        case ProgressReportActions.UPDATE_PROGRESS_REPORT_SUCCESS:
            let progressReport = action.progress_report;

            if(progressReport && progressReport.event && progressReport.event.id) {
                let progressEventId = progressReport.event.id,
                    reportProgressEvent = state[progressEventId] || {};
                delete progressReport.event;

                let currentProgressReports = [...(reportProgressEvent.progress_reports || [])];
                let currentProgressReportIdx = currentProgressReports.map(item => {
                    return item.id;
                }).indexOf(progressReport.id);

                if(currentProgressReportIdx === -1) {
                    currentProgressReports.push(progressReport);
                } else {
                    currentProgressReports[currentProgressReportIdx] = progressReport;
                }

                let newState = {};
                newState[progressEventId] = {...reportProgressEvent, progress_reports: currentProgressReports};
                return {...state, ...newState};
            }
            return state;
        case ProgressReportActions.DELETE_PROGRESS_REPORT_SUCCESS:
            let newState = {};
            Object.keys(state).forEach(id => {
                let progressEvent = state[id],
                    newProgressReports = [];

                progressEvent.progress_reports.forEach(progressEvent => {
                    if(progressEvent.id !== action.id) {
                        newProgressReports.push(progressEvent);
                    }
                });
                newState[progressEvent.id] = {...progressEvent, progress_reports: newProgressReports};
            });
            return newState;
        default:
            return state;
    }
}

function isSaving(state = {}, action) {
    let targetKey = action.target || action.id || 'default';
    let newState = {};
    switch (action.type) {
        case ProgressEventActions.CREATE_PROGRESS_EVENT_START:
        case ProgressEventActions.UPDATE_PROGRESS_EVENT_START:
            newState[targetKey] = true;
            return {...state, ...newState};
        case ProgressEventActions.CREATE_PROGRESS_EVENT_SUCCESS:
        case ProgressEventActions.CREATE_PROGRESS_EVENT_FAILED:
        case ProgressEventActions.UPDATE_PROGRESS_EVENT_SUCCESS:
        case ProgressEventActions.UPDATE_PROGRESS_EVENT_FAILED:
            newState[targetKey] = false;
            return {...state, ...newState};
        case ProgressReportActions.CREATE_PROGRESS_REPORT_START:
        case ProgressReportActions.UPDATE_PROGRESS_REPORT_START:
            newState['report'] = true;
            return {...state, ...newState};
        case ProgressReportActions.CREATE_PROGRESS_REPORT_SUCCESS:
        case ProgressReportActions.CREATE_PROGRESS_REPORT_FAILED:
        case ProgressReportActions.UPDATE_PROGRESS_REPORT_SUCCESS:
        case ProgressReportActions.UPDATE_PROGRESS_REPORT_FAILED:
            newState['report'] = false;
            return {...state, ...newState};
        default:
            return state;
    }
}

function isSaved(state = {}, action) {
    let targetKey = action.target || action.id || 'default';
    let newState = {};
    switch (action.type) {
        case ProgressEventActions.CREATE_PROGRESS_EVENT_SUCCESS:
        case ProgressEventActions.UPDATE_PROGRESS_EVENT_SUCCESS:
            newState[targetKey] = true;
            return {...state, ...newState};
        case ProgressEventActions.CREATE_PROGRESS_EVENT_START:
        case ProgressEventActions.CREATE_PROGRESS_EVENT_FAILED:
        case ProgressEventActions.UPDATE_PROGRESS_EVENT_START:
        case ProgressEventActions.UPDATE_PROGRESS_EVENT_FAILED:
            newState[targetKey] = false;
            return {...state, ...newState};
        case ProgressReportActions.CREATE_PROGRESS_REPORT_SUCCESS:
        case ProgressReportActions.UPDATE_PROGRESS_REPORT_SUCCESS:
            newState['report'] = true;
            return {...state, ...newState};
        case ProgressReportActions.CREATE_PROGRESS_REPORT_START:
        case ProgressReportActions.CREATE_PROGRESS_REPORT_FAILED:
        case ProgressReportActions.UPDATE_PROGRESS_REPORT_START:
        case ProgressReportActions.UPDATE_PROGRESS_REPORT_FAILED:
            newState['report'] = false;
            return {...state, ...newState};
        case LOCATION_CHANGE:
            return {};
        default:
            return state;
    }
}

function isRetrieving(state = {}, action) {
    let targetKey = action.id || 'default';
    let newState = {};
    switch (action.type) {
        case ProgressEventActions.RETRIEVE_PROGRESS_EVENT_START:
            newState[targetKey] = true;
            return {...state, ...newState};
        case ProgressEventActions.RETRIEVE_PROGRESS_EVENT_SUCCESS:
        case ProgressEventActions.RETRIEVE_PROGRESS_EVENT_FAILED:
            newState[targetKey] = false;
            return {...state, ...newState};
        default:
            return state;
    }
}

function isDeleting(state = {}, action) {
    let targetKey = action.id || 'default';
    let newState = {};
    switch (action.type) {
        case ProgressEventActions.DELETE_PROGRESS_EVENT_START:
            newState[targetKey] = true;
            return {...state, ...newState};
        case ProgressEventActions.DELETE_PROGRESS_EVENT_SUCCESS:
        case ProgressEventActions.DELETE_PROGRESS_EVENT_FAILED:
            newState[targetKey] = false;
            return {...state, ...newState};
        default:
            return state;
    }
}

function isFetching(state = {}, action) {
    let selectionKey = action.selection || 'default';
    let newState = {};
    switch (action.type) {
        case ProgressEventActions.LIST_PROGRESS_EVENTS_START:
            newState[selectionKey] = true;
            return {...state, ...newState};
        case ProgressEventActions.LIST_PROGRESS_EVENTS_SUCCESS:
        case ProgressEventActions.LIST_PROGRESS_EVENTS_FAILED:
            newState[selectionKey] = false;
            return {...state, ...newState};
        default:
            return state;
    }
}

function isFetchingMore(state = {}, action) {
    let selectionKey = action.selection || 'default';
    let newState = {};
    switch (action.type) {
        case ProgressEventActions.LIST_MORE_PROGRESS_EVENTS_START:
            newState[selectionKey] = true;
            return {...state, ...newState};
        case ProgressEventActions.LIST_MORE_PROGRESS_EVENTS_SUCCESS:
        case ProgressEventActions.LIST_MORE_PROGRESS_EVENTS_FAILED:
            newState[selectionKey] = false;
            return {...state, ...newState};
        default:
            return state;
    }
}

function next(state = {}, action) {
    let selectionKey = action.selection || 'default';
    let newState = {};
    switch (action.type) {
        case ProgressEventActions.LIST_PROGRESS_EVENTS_SUCCESS:
        case ProgressEventActions.LIST_MORE_PROGRESS_EVENTS_SUCCESS:
            newState[selectionKey] = action.next;
            return {...state, ...newState};
        default:
            return state;
    }
}

function previous(state = {}, action) {
    let selectionKey = action.selection || 'default';
    let newState = {};
    switch (action.type) {
        case ProgressEventActions.LIST_PROGRESS_EVENTS_SUCCESS:
        case ProgressEventActions.LIST_MORE_PROGRESS_EVENTS_SUCCESS:
            newState[selectionKey] = action.previous;
            return {...state, ...newState};
        default:
            return state;
    }
}

function count(state = {}, action) {
    let selectionKey = action.selection || 'default';
    let newState = {};
    switch (action.type) {
        case ProgressEventActions.LIST_PROGRESS_EVENTS_SUCCESS:
            newState[selectionKey] = action.count;
            return {...state, ...newState};
        case ProgressEventActions.LIST_PROGRESS_EVENTS_START:
        case ProgressEventActions.LIST_PROGRESS_EVENTS_FAILED:
            newState[selectionKey] = 0;
            return {...state, ...newState};
        default:
            return state;
    }
}

function errors(state = {}, action) {
    switch (action.type) {
        case ProgressEventActions.CREATE_PROGRESS_EVENT_FAILED:
            return {...state, create: action.error};
        case ProgressEventActions.CREATE_PROGRESS_EVENT_START:
        case ProgressEventActions.CREATE_PROGRESS_EVENT_SUCCESS:
            return {...state, create: null};
        case ProgressEventActions.UPDATE_PROGRESS_EVENT_FAILED:
            return {...state, update: action.error};
        case ProgressEventActions.UPDATE_PROGRESS_EVENT_START:
        case ProgressEventActions.UPDATE_PROGRESS_EVENT_SUCCESS:
            return {...state, update: null};
        case ProgressEventActions.RETRIEVE_PROGRESS_EVENT_FAILED:
            return {...state, retrieve: action.error};
        case ProgressEventActions.RETRIEVE_PROGRESS_EVENT_START:
        case ProgressEventActions.RETRIEVE_PROGRESS_EVENT_SUCCESS:
            return {...state, retrieve: null};
        case ProgressEventActions.DELETE_PROGRESS_EVENT_FAILED:
            return {...state, delete: action.error};
        case ProgressEventActions.DELETE_PROGRESS_EVENT_START:
        case ProgressEventActions.DELETE_PROGRESS_EVENT_SUCCESS:
            return {...state, delete: null};
        case ProgressEventActions.LIST_PROGRESS_EVENTS_FAILED:
            return {...state, list: action.error};
        case ProgressEventActions.LIST_PROGRESS_EVENTS_START:
        case ProgressEventActions.LIST_PROGRESS_EVENTS_SUCCESS:
            return {...state, list: null};
        case ProgressEventActions.LIST_MORE_PROGRESS_EVENTS_FAILED:
            return {...state, list: action.error};
        case ProgressEventActions.LIST_MORE_PROGRESS_EVENTS_START:
        case ProgressEventActions.LIST_MORE_PROGRESS_EVENTS_SUCCESS:
            return {...state, list: null};
        case ProgressReportActions.CREATE_PROGRESS_REPORT_FAILED:
        case ProgressReportActions.UPDATE_PROGRESS_REPORT_FAILED:
            return {...state, report: action.error};
        case ProgressReportActions.CREATE_PROGRESS_REPORT_START:
        case ProgressReportActions.CREATE_PROGRESS_REPORT_SUCCESS:
        case ProgressReportActions.UPDATE_PROGRESS_REPORT_START:
        case ProgressReportActions.UPDATE_PROGRESS_REPORT_SUCCESS:
            return {...state, report: null};
        default:
            return state;
    }
}

const ProgressEvent = combineReducers({
    created,
    deleted,
    ids,
    progress_events,
    isSaving,
    isSaved,
    isRetrieving,
    isDeleting,
    isFetching,
    isFetchingMore,
    next,
    previous,
    count,
    errors,
});

export default ProgressEvent;
