import {combineReducers} from 'redux';
import {LOCATION_CHANGE} from "react-router-redux";

import {getIds} from './utils';
import * as ProjectActions from "../actions/ProjectActions";
import * as ParticipationActions from "../actions/ParticipationActions";
import * as DocumentActions from "../actions/DocumentActions";
import * as ProgressEventActions from "../actions/ProgressEventActions";
import * as InterestActions from '../actions/InterestPollActions';

function created(state = {}, action) {
    let targetKey = action.target || 'new';
    let newState = {};
    switch (action.type) {
        case ProjectActions.CREATE_PROJECT_SUCCESS:
            newState[targetKey] = action.project.id;
            return {...state, ...newState};
        default:
            return state;
    }
}

function deleted(state = {}, action) {
    let targetKey = action.id || 'default';
    let newState = {};
    switch (action.type) {
        case ProjectActions.DELETE_PROJECT_SUCCESS:
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
        case ProjectActions.LIST_PROJECTS_SUCCESS:
            newState[selectionKey] = getIds(action.items);
            return {...state, ...newState};
        case ProjectActions.LIST_MORE_PROJECTS_SUCCESS:
            newState[selectionKey] = [
                ...state[selectionKey],
                ...getIds(action.items),
            ];
            return {...state, ...newState};
        case ProjectActions.LIST_PROJECTS_START:
            if (action.prev_selection && state[action.prev_selection]) {
                newState[selectionKey] = state[action.prev_selection];
                return {...state, ...newState};
            }
            return state;
        case ProjectActions.LIST_PROJECTS_FAILED:
            return state;
        default:
            return state;
    }
}

function projects(state = {}, action) {
    switch (action.type) {
        case ProjectActions.LIST_PROJECTS_SUCCESS:
        case ProjectActions.LIST_MORE_PROJECTS_SUCCESS:
            let all_projects = {};
            action.items.forEach(project => {
                all_projects[project.id] = project;
            });
            return {...state, ...all_projects};
        case ProjectActions.RETRIEVE_PROJECT_SUCCESS:
        case ProjectActions.UPDATE_PROJECT_SUCCESS:
            let new_project = {};
            new_project[action.project.id] = action.project;
            return {...state, ...new_project};
        case InterestActions.CREATE_INTEREST_POLL_SUCCESS:
        case InterestActions.UPDATE_INTEREST_POLL_SUCCESS:
            let new_interest = {};
            new_interest[action.interest.id] = action.interest;
            return {...state, ...new_interest};
        case ParticipationActions.CREATE_PARTICIPATION_SUCCESS:
        case ParticipationActions.UPDATE_PARTICIPATION_SUCCESS:
            let participation = action.participation;
            if(participation && participation.project && participation.project.id) {
                let projectId = participation.project.id,
                    participationProject = state[projectId] || {};

                delete participation.project;

                let currentParticipation = [...(participationProject.participation || [])];
                let currentParticipationIdx = currentParticipation.map(item => {
                    return item.id;
                }).indexOf(participation.id);

                if(currentParticipationIdx === -1) {
                    currentParticipation.push(participation);
                } else {
                    currentParticipation[currentParticipationIdx] = participation;
                }

                let newState = {};
                newState[projectId] = {...participationProject, participation: currentParticipation};
                return {...state, ...newState};
            }
            return state;
        case DocumentActions.CREATE_DOCUMENT_SUCCESS:
        case DocumentActions.UPDATE_DOCUMENT_SUCCESS:
            let document = action.document;

            if(document && document.project && document.project.id) {
                let projectId = document.project.id,
                    documentProject = state[projectId] || {};
                delete document.project;

                let currentDocuments = [...(documentProject.documents || [])];
                let currentDocumentIdx = currentDocuments.map(item => {
                    return item.id;
                }).indexOf(document.id);

                if(currentDocumentIdx === -1) {
                    currentDocuments.push(document);
                } else {
                    currentDocuments[currentDocumentIdx] = document;
                }

                let newState = {};
                newState[projectId] = {...documentProject, documents: currentDocuments};
                return {...state, ...newState};
            }
            return state;
        case ProgressEventActions.CREATE_PROGRESS_EVENT_SUCCESS:
        case ProgressEventActions.UPDATE_PROGRESS_EVENT_SUCCESS:
            let progress_event = action.progress_event;

            if(progress_event && progress_event.project && progress_event.project.id) {
                let projectId = progress_event.project.id,
                    progressEventProject = state[projectId] || {};
                delete progress_event.project;

                let currentProgressEvents = [...(progressEventProject.progress_events || [])];
                let currentProgressEventIdx = currentProgressEvents.map(item => {
                    return item.id;
                }).indexOf(progress_event.id);

                if(currentProgressEventIdx === -1) {
                    currentProgressEvents.push(progress_event);
                } else {
                    currentProgressEvents[currentProgressEventIdx] = progress_event;
                }

                let newState = {};
                newState[projectId] = {...progressEventProject, progress_events: currentProgressEvents};
                return {...state, ...newState};
            }
            return state;
        case ParticipationActions.DELETE_PARTICIPATION_SUCCESS:
            let newState = {};
            Object.keys(state).forEach(id => {
                let project = state[id],
                    newParticipation = [];

                project.participation.forEach(participation => {
                    if(participation.id !== action.id) {
                        newParticipation.push(participation);
                    }
                });
                newState[project.id] = {...project, participation: newParticipation};
            });
            return newState;
        case DocumentActions.DELETE_DOCUMENT_SUCCESS:
            newState = {};
            Object.keys(state).forEach(id => {
                let project = state[id],
                    newDocs = [];

                project.documents.forEach(doc => {
                    if(doc.id !== action.id) {
                        newDocs.push(doc);
                    }
                });
                newState[project.id] = {...project, documents: newDocs};
            });
            return newState;
        case ProgressEventActions.DELETE_PROGRESS_EVENT_SUCCESS:
            newState = {};
            Object.keys(state).forEach(id => {
                let project = state[id],
                    newProgressEvents = [];

                project.progress_events.forEach(progressEvent => {
                    if(progressEvent.id !== action.id) {
                        newProgressEvents.push(progressEvent);
                    }
                });
                newState[project.id] = {...project, progress_events: newProgressEvents};
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
        case ProjectActions.CREATE_PROJECT_START:
        case ProjectActions.UPDATE_PROJECT_START:
            newState[targetKey] = true;
            return {...state, ...newState};
        case ProjectActions.CREATE_PROJECT_SUCCESS:
        case ProjectActions.CREATE_PROJECT_FAILED:
        case ProjectActions.UPDATE_PROJECT_SUCCESS:
        case ProjectActions.UPDATE_PROJECT_FAILED:
            newState[targetKey] = false;
            return {...state, ...newState};
        case ProjectActions.SEND_REMINDER_START:
            newState['remind'] = true;
            return {...state, ...newState};
        case ProjectActions.SEND_REMINDER_SUCCESS:
        case ProjectActions.SEND_REMINDER_FAILED:
            newState['remind'] = false;
            return {...state, ...newState};
        case LOCATION_CHANGE:
            return {};
        default:
            return state;
    }
}

function isSaved(state = {}, action) {
    let targetKey = action.target || action.id || 'default';
    let newState = {};
    switch (action.type) {
        case ProjectActions.CREATE_PROJECT_SUCCESS:
        case ProjectActions.UPDATE_PROJECT_SUCCESS:
            newState[targetKey] = true;
            return {...state, ...newState};
        case ProjectActions.CREATE_PROJECT_START:
        case ProjectActions.CREATE_PROJECT_FAILED:
        case ProjectActions.UPDATE_PROJECT_START:
        case ProjectActions.UPDATE_PROJECT_FAILED:
            newState[targetKey] = false;
            return {...state, ...newState};
        case InterestActions.CREATE_INTEREST_POLL_SUCCESS:
        case InterestActions.UPDATE_INTEREST_POLL_SUCCESS:
            newState['interest'] = true;
            return {...state, ...newState};
        case InterestActions.CREATE_INTEREST_POLL_START:
        case InterestActions.CREATE_INTEREST_POLL_FAILED:
        case InterestActions.UPDATE_INTEREST_POLL_START:
        case InterestActions.UPDATE_INTEREST_POLL_FAILED:
            newState['interest'] = false;
            return {...state, ...newState};
        case ParticipationActions.CREATE_PARTICIPATION_SUCCESS:
        case ParticipationActions.UPDATE_PARTICIPATION_SUCCESS:
            newState['participation'] = true;
            return {...state, ...newState};
        case ParticipationActions.CREATE_PARTICIPATION_START:
        case ParticipationActions.CREATE_PARTICIPATION_FAILED:
        case ParticipationActions.UPDATE_PARTICIPATION_START:
        case ParticipationActions.UPDATE_PARTICIPATION_FAILED:
            newState['participation'] = false;
            return {...state, ...newState};
        case DocumentActions.CREATE_DOCUMENT_SUCCESS:
        case DocumentActions.UPDATE_DOCUMENT_SUCCESS:
            newState['docs'] = true;
            return {...state, ...newState};
        case DocumentActions.CREATE_DOCUMENT_START:
        case DocumentActions.CREATE_DOCUMENT_FAILED:
        case DocumentActions.UPDATE_DOCUMENT_START:
        case DocumentActions.UPDATE_DOCUMENT_FAILED:
            newState['docs'] = false;
            return {...state, ...newState};
        case ProjectActions.SEND_REMINDER_SUCCESS:
            newState['remind'] = true;
            return {...state, ...newState};
        case ProjectActions.SEND_REMINDER_START:
        case ProjectActions.SEND_REMINDER_FAILED:
            newState['remind'] = false;
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
        case ProjectActions.RETRIEVE_PROJECT_START:
            newState[targetKey] = true;
            return {...state, ...newState};
        case ProjectActions.RETRIEVE_PROJECT_SUCCESS:
        case ProjectActions.RETRIEVE_PROJECT_FAILED:
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
        case ProjectActions.DELETE_PROJECT_START:
            newState[targetKey] = true;
            return {...state, ...newState};
        case ProjectActions.DELETE_PROJECT_SUCCESS:
        case ProjectActions.DELETE_PROJECT_FAILED:
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
        case ProjectActions.LIST_PROJECTS_START:
            newState[selectionKey] = true;
            return {...state, ...newState};
        case ProjectActions.LIST_PROJECTS_SUCCESS:
        case ProjectActions.LIST_PROJECTS_FAILED:
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
        case ProjectActions.LIST_MORE_PROJECTS_START:
            newState[selectionKey] = true;
            return {...state, ...newState};
        case ProjectActions.LIST_MORE_PROJECTS_SUCCESS:
        case ProjectActions.LIST_MORE_PROJECTS_FAILED:
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
        case ProjectActions.LIST_PROJECTS_SUCCESS:
        case ProjectActions.LIST_MORE_PROJECTS_SUCCESS:
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
        case ProjectActions.LIST_PROJECTS_SUCCESS:
        case ProjectActions.LIST_MORE_PROJECTS_SUCCESS:
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
        case ProjectActions.LIST_PROJECTS_SUCCESS:
            newState[selectionKey] = action.count;
            return {...state, ...newState};
        case ProjectActions.LIST_PROJECTS_START:
        case ProjectActions.LIST_PROJECTS_FAILED:
            newState[selectionKey] = 0;
            return {...state, ...newState};
        default:
            return state;
    }
}

function errors(state = {}, action) {
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
        case ProjectActions.RETRIEVE_PROJECT_FAILED:
            return {...state, retrieve: action.error};
        case ProjectActions.RETRIEVE_PROJECT_START:
        case ProjectActions.RETRIEVE_PROJECT_SUCCESS:
            return {...state, retrieve: null};
        case ProjectActions.DELETE_PROJECT_FAILED:
            return {...state, delete: action.error};
        case ProjectActions.DELETE_PROJECT_START:
        case ProjectActions.DELETE_PROJECT_SUCCESS:
            return {...state, delete: null};
        case ProjectActions.LIST_PROJECTS_FAILED:
            return {...state, list: action.error};
        case ProjectActions.LIST_PROJECTS_START:
        case ProjectActions.LIST_PROJECTS_SUCCESS:
            return {...state, list: null};
        case ProjectActions.LIST_MORE_PROJECTS_FAILED:
            return {...state, list: action.error};
        case ProjectActions.LIST_MORE_PROJECTS_START:
        case ProjectActions.LIST_MORE_PROJECTS_SUCCESS:
            return {...state, list: null};
        case ProjectActions.SEND_REMINDER_FAILED:
            return {...state, remind: action.error};
        case ProjectActions.SEND_REMINDER_START:
        case ProjectActions.SEND_REMINDER_SUCCESS:
            return {...state, remind: null};
        case LOCATION_CHANGE:
            return {};
        default:
            return state;
    }
}

const Project = combineReducers({
    created,
    deleted,
    ids,
    projects,
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

export default Project;
