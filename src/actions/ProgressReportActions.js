import axios from 'axios';
import {composeFormData, ENDPOINT_PROGRESS_REPORTS} from './utils/api';

export const CREATE_PROGRESS_REPORT_START = 'CREATE_PROGRESS_REPORT_START';
export const CREATE_PROGRESS_REPORT_SUCCESS = 'CREATE_PROGRESS_REPORT_SUCCESS';
export const CREATE_PROGRESS_REPORT_FAILED = 'CREATE_PROGRESS_REPORT_FAILED';
export const LIST_PROGRESS_REPORTS_START = 'LIST_PROGRESS_REPORTS_START';
export const LIST_PROGRESS_REPORTS_SUCCESS = 'LIST_PROGRESS_REPORTS_SUCCESS';
export const LIST_PROGRESS_REPORTS_FAILED = 'LIST_PROGRESS_REPORTS_FAILED';
export const RETRIEVE_PROGRESS_REPORT_START = 'RETRIEVE_PROGRESS_REPORT_START';
export const RETRIEVE_PROGRESS_REPORT_SUCCESS = 'RETRIEVE_PROGRESS_REPORT_SUCCESS';
export const RETRIEVE_PROGRESS_REPORT_FAILED = 'RETRIEVE_PROGRESS_REPORT_FAILED';
export const UPDATE_PROGRESS_REPORT_START = 'UPDATE_PROGRESS_REPORT_START';
export const UPDATE_PROGRESS_REPORT_SUCCESS = 'UPDATE_PROGRESS_REPORT_SUCCESS';
export const UPDATE_PROGRESS_REPORT_FAILED = 'UPDATE_PROGRESS_REPORT_FAILED';
export const LIST_MORE_PROGRESS_REPORTS_START = 'LIST_MORE_PROGRESS_REPORTS_START';
export const LIST_MORE_PROGRESS_REPORTS_SUCCESS = 'LIST_MORE_PROGRESS_REPORTS_SUCCESS';
export const LIST_MORE_PROGRESS_REPORTS_FAILED = 'LIST_MORE_PROGRESS_REPORTS_FAILED';
export const DELETE_PROGRESS_REPORT_START = 'DELETE_PROGRESS_REPORT_START';
export const DELETE_PROGRESS_REPORT_SUCCESS = 'DELETE_PROGRESS_REPORT_SUCCESS';
export const DELETE_PROGRESS_REPORT_FAILED = 'DELETE_PROGRESS_REPORT_FAILED';

export function createProgressReport(progress_report, target) {
    return dispatch => {
        dispatch(createProgressReportStart(progress_report, target));

        let headers = {},
            data = progress_report;

        if(progress_report.uploads) {
            headers['Content-Type'] = 'multipart/form-data';
            data = composeFormData(progress_report);
        }

        axios
            .post(ENDPOINT_PROGRESS_REPORTS, data, {headers})
            .then(function(response) {
                dispatch(createProgressReportSuccess(response.data, target));
            })
            .catch(function(error) {
                dispatch(
                    createProgressReportFailed(
                        (error.response ? error.response.data : null), progress_report, target
                    ),
                );
            });
    };
}

export function createProgressReportStart(progress_report, target) {
    return {
        type: CREATE_PROGRESS_REPORT_START,
        progress_report,
        target
    };
}

export function createProgressReportSuccess(progress_report, target) {
    return {
        type: CREATE_PROGRESS_REPORT_SUCCESS,
        progress_report,
        target
    };
}

export function createProgressReportFailed(error, progress_report, target) {
    return {
        type: CREATE_PROGRESS_REPORT_FAILED,
        error,
        progress_report,
        target
    };
}

export function listProgressReports(filter, selection, prev_selection) {
    return dispatch => {
        dispatch(listProgressReportsStart(filter, selection, prev_selection));
        axios
            .get(ENDPOINT_PROGRESS_REPORTS, {params: filter})
            .then(function(response) {
                dispatch(listProgressReportsSuccess(response.data, filter, selection));
            })
            .catch(function(error) {
                dispatch(
                    listProgressReportsFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function listProgressReportsStart(filter, selection, prev_selection) {
    return {
        type: LIST_PROGRESS_REPORTS_START,
        filter,
        selection,
        prev_selection,
    };
}

export function listProgressReportsSuccess(response, filter, selection) {
    return {
        type: LIST_PROGRESS_REPORTS_SUCCESS,
        items: response.results,
        previous: response.previous,
        next: response.next,
        count: response.count,
        filter,
        selection,
    };
}

export function listProgressReportsFailed(error, selection) {
    return {
        type: LIST_PROGRESS_REPORTS_FAILED,
        error,
        selection,
    };
}

export function retrieveProgressReport(id) {
    return dispatch => {
        dispatch(retrieveProgressReportStart(id));
        axios
            .get(ENDPOINT_PROGRESS_REPORTS + id + '/')
            .then(function(response) {
                dispatch(retrieveProgressReportSuccess(response.data, id));
            })
            .catch(function(error) {
                dispatch(
                    retrieveProgressReportFailed(
                        error.response ? error.response.data : null, id
                    ),
                );
            });
    };
}

export function retrieveProgressReportStart(id) {
    return {
        type: RETRIEVE_PROGRESS_REPORT_START,
        id,
    };
}

export function retrieveProgressReportSuccess(progress_report, id) {
    return {
        type: RETRIEVE_PROGRESS_REPORT_SUCCESS,
        progress_report,
        id
    };
}

export function retrieveProgressReportFailed(error, id) {
    return {
        type: RETRIEVE_PROGRESS_REPORT_FAILED,
        error,
        id
    };
}

export function updateProgressReport(id, progress_report) {
    return dispatch => {
        dispatch(updateProgressReportStart(id, progress_report, id));

        let headers = {},
            data = progress_report;

        if(progress_report.uploads) {
            headers['Content-Type'] = 'multipart/form-data';
            data = composeFormData(progress_report);
        }

        axios
            .patch(ENDPOINT_PROGRESS_REPORTS + id + '/', data, {
                headers: {...headers},
            })
            .then(function(response) {
                dispatch(updateProgressReportSuccess(response.data, id));
            })
            .catch(function(error) {
                dispatch(
                    updateProgressReportFailed(
                        (error.response ? error.response.data : null), progress_report, id
                    ),
                );
            });
    };
}

export function updateProgressReportStart(id, progress_report, target) {
    return {
        type: UPDATE_PROGRESS_REPORT_START,
        id,
        progress_report,
        target
    };
}

export function updateProgressReportSuccess(progress_report, target) {
    return {
        type: UPDATE_PROGRESS_REPORT_SUCCESS,
        progress_report,
        target
    };
}

export function updateProgressReportFailed(error, progress_report, target) {
    return {
        type: UPDATE_PROGRESS_REPORT_FAILED,
        error,
        progress_report,
        target
    };
}

export function listMoreProgressReports(url, selection) {
    return dispatch => {
        dispatch(listMoreProgressReportsStart(url, selection));
        axios
            .get(url)
            .then(function(response) {
                dispatch(listMoreProgressReportsSuccess(response.data, selection));
            })
            .catch(function(error) {
                dispatch(
                    listMoreProgressReportsFailed(
                        error.response ? error.response.data : null,
                        selection,
                    ),
                );
            });
    };
}

export function listMoreProgressReportsStart(url, selection) {
    return {
        type: LIST_MORE_PROGRESS_REPORTS_START,
        url,
        selection,
    };
}

export function listMoreProgressReportsSuccess(response, selection) {
    return {
        type: LIST_MORE_PROGRESS_REPORTS_SUCCESS,
        items: response.results,
        previous: response.previous,
        next: response.next,
        count: response.count,
        selection,
    };
}

export function listMoreProgressReportsFailed(error) {
    return {
        type: LIST_MORE_PROGRESS_REPORTS_FAILED,
        error,
    };
}

export function deleteProgressReport(id) {
    return dispatch => {
        dispatch(deleteProgressReportStart(id));
        axios.delete(ENDPOINT_PROGRESS_REPORTS + id + '/')
            .then(function () {
                dispatch(deleteProgressReportSuccess(id));
            }).catch(function (response) {
            dispatch(deleteProgressReportFailed(response.data, id));
        });
    }
}

export function deleteProgressReportStart(id) {
    return {
        type: DELETE_PROGRESS_REPORT_START,
        id
    }
}

export function deleteProgressReportSuccess(id) {
    return {
        type: DELETE_PROGRESS_REPORT_SUCCESS,
        id
    }
}

export function deleteProgressReportFailed(error, id) {
    return {
        type: DELETE_PROGRESS_REPORT_FAILED,
        error,
        id
    }
}
