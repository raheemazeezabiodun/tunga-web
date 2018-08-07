import axios from 'axios';
import {ENDPOINT_PROGRESS_REPORT} from '../constants/Api';

export const CREATE_PROGRESS_REPORT_START = 'CREATE_PROGRESS_REPORT_START';
export const CREATE_PROGRESS_REPORT_SUCCESS = 'CREATE_PROGRESS_REPORT_SUCCESS';
export const CREATE_PROGRESS_REPORT_FAILED = 'CREATE_PROGRESS_REPORT_FAILED';
export const LIST_PROGRESS_REPORTS_START = 'LIST_PROGRESS_REPORTS_START';
export const LIST_PROGRESS_REPORTS_SUCCESS = 'LIST_PROGRESS_REPORTS_SUCCESS';
export const LIST_PROGRESS_REPORTS_FAILED = 'LIST_PROGRESS_REPORTS_FAILED';
export const RETRIEVE_PROGRESS_REPORT_START = 'RETRIEVE_PROGRESS_REPORT_START';
export const RETRIEVE_PROGRESS_REPORT_SUCCESS =
    'RETRIEVE_PROGRESS_REPORT_SUCCESS';
export const RETRIEVE_PROGRESS_REPORT_FAILED =
    'RETRIEVE_PROGRESS_REPORT_FAILED';
export const UPDATE_PROGRESS_REPORT_START = 'UPDATE_PROGRESS_REPORT_START';
export const UPDATE_PROGRESS_REPORT_SUCCESS = 'UPDATE_PROGRESS_REPORT_SUCCESS';
export const UPDATE_PROGRESS_REPORT_FAILED = 'UPDATE_PROGRESS_REPORT_FAILED';
export const DELETE_PROGRESS_REPORT_START = 'DELETE_PROGRESS_REPORT_START';
export const DELETE_PROGRESS_REPORT_SUCCESS = 'DELETE_PROGRESS_REPORT_SUCCESS';
export const DELETE_PROGRESS_REPORT_FAILED = 'DELETE_PROGRESS_REPORT_FAILED';
export const LIST_MORE_PROGRESS_REPORTS_START =
    'LIST_MORE_PROGRESS_REPORTS_START';
export const LIST_MORE_PROGRESS_REPORTS_SUCCESS =
    'LIST_MORE_PROGRESS_REPORTS_SUCCESS';
export const LIST_MORE_PROGRESS_REPORTS_FAILED =
    'LIST_MORE_PROGRESS_REPORTS_FAILED';

export function createProgressReport(progress_report, attachments) {
    return dispatch => {
        dispatch(createProgressReportStart(progress_report));

        let headers = {},
            data = progress_report;
        if (attachments.length) {
            headers['Content-Type'] = 'multipart/form-data';

            data = new FormData();
            Object.keys(progress_report).map((key, idx) => {
                if (
                    (Array.isArray(progress_report[key]) &&
                        progress_report[key].length) ||
                    (!Array.isArray(progress_report[key]) &&
                        progress_report[key] != null)
                ) {
                    data.append(key, progress_report[key]);
                }
            });

            attachments.map((file, idx) => {
                data.append('file' + idx, file);
            });
        }

        axios
            .post(ENDPOINT_PROGRESS_REPORT, data, {headers})
            .then(function(response) {
                dispatch(createProgressReportSuccess(response.data));
            })
            .catch(function(error) {
                dispatch(
                    createProgressReportFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function createProgressReportStart(progress_report) {
    return {
        type: CREATE_PROGRESS_REPORT_START,
        progress_report,
    };
}

export function createProgressReportSuccess(progress_report) {
    return {
        type: CREATE_PROGRESS_REPORT_SUCCESS,
        progress_report,
    };
}

export function createProgressReportFailed(error) {
    return {
        type: CREATE_PROGRESS_REPORT_FAILED,
        error,
    };
}

export function listProgressReports(filter) {
    return dispatch => {
        dispatch(listProgressReportsStart(filter));
        axios
            .get(ENDPOINT_PROGRESS_REPORT, {params: filter})
            .then(function(response) {
                dispatch(listProgressReportsSuccess(response.data));
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

export function listProgressReportsStart(filter) {
    return {
        type: LIST_PROGRESS_REPORTS_START,
        filter,
    };
}

export function listProgressReportsSuccess(response) {
    return {
        type: LIST_PROGRESS_REPORTS_SUCCESS,
        items: response.results,
        previous: response.previous,
        next: response.next,
        count: response.count,
    };
}

export function listProgressReportsFailed(error) {
    return {
        type: LIST_PROGRESS_REPORTS_FAILED,
        error,
    };
}

export function retrieveProgressReport(id) {
    return dispatch => {
        dispatch(retrieveProgressReportStart(id));
        axios
            .get(ENDPOINT_PROGRESS_REPORT + id + '/')
            .then(function(response) {
                dispatch(retrieveProgressReportSuccess(response.data));
            })
            .catch(function(error) {
                dispatch(
                    retrieveProgressReportFailed(
                        error.response ? error.response.data : null,
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

export function retrieveProgressReportSuccess(progress_report) {
    return {
        type: RETRIEVE_PROGRESS_REPORT_SUCCESS,
        progress_report,
    };
}

export function retrieveProgressReportFailed(error) {
    return {
        type: RETRIEVE_PROGRESS_REPORT_FAILED,
        error,
    };
}

export function updateProgressReport(id, progress_report, attachments) {
    return dispatch => {
        dispatch(updateProgressReportStart(id));

        let headers = {},
            data = progress_report;
        if (attachments.length) {
            headers['Content-Type'] = 'multipart/form-data';

            data = new FormData();
            Object.keys(progress_report).map((key, idx) => {
                if (
                    (Array.isArray(progress_report[key]) &&
                        progress_report[key].length) ||
                    (!Array.isArray(progress_report[key]) &&
                        progress_report[key] != null)
                ) {
                    data.append(key, progress_report[key]);
                }
            });

            attachments.map((file, idx) => {
                data.append('file' + idx, file);
            });
        }

        axios
            .patch(ENDPOINT_PROGRESS_REPORT + id + '/', data, {headers})
            .then(function(response) {
                dispatch(updateProgressReportSuccess(response.data));
            })
            .catch(function(error) {
                dispatch(
                    updateProgressReportFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function updateProgressReportStart(id) {
    return {
        type: UPDATE_PROGRESS_REPORT_START,
        id,
    };
}

export function updateProgressReportSuccess(progress_report) {
    return {
        type: UPDATE_PROGRESS_REPORT_SUCCESS,
        progress_report,
    };
}

export function updateProgressReportFailed(error) {
    return {
        type: UPDATE_PROGRESS_REPORT_FAILED,
        error,
    };
}

export function deleteProgressReport(id) {
    return dispatch => {
        dispatch(deleteProgressReportStart(id));
        axios
            .delete(ENDPOINT_PROGRESS_REPORT + id + '/')
            .then(function() {
                dispatch(deleteProgressReportSuccess(id));
            })
            .catch(function(error) {
                dispatch(
                    deleteProgressReportFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function deleteProgressReportStart(id) {
    return {
        type: DELETE_PROGRESS_REPORT_START,
        id,
    };
}

export function deleteProgressReportSuccess(id) {
    return {
        type: DELETE_PROGRESS_REPORT_SUCCESS,
        id,
    };
}

export function deleteProgressReportFailed(error) {
    return {
        type: DELETE_PROGRESS_REPORT_FAILED,
        error,
    };
}

export function listMoreProgressReports(url) {
    return dispatch => {
        dispatch(listMoreProgressReportsStart(url));
        axios
            .get(url)
            .then(function(response) {
                dispatch(listMoreProgressReportsSuccess(response.data));
            })
            .catch(function(error) {
                dispatch(
                    listMoreProgressReportsFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function listMoreProgressReportsStart(url) {
    return {
        type: LIST_MORE_PROGRESS_REPORTS_START,
        url,
    };
}

export function listMoreProgressReportsSuccess(response) {
    return {
        type: LIST_MORE_PROGRESS_REPORTS_SUCCESS,
        items: response.results,
        previous: response.previous,
        next: response.next,
        count: response.count,
    };
}

export function listMoreProgressReportsFailed(error) {
    return {
        type: LIST_MORE_PROGRESS_REPORTS_FAILED,
        error,
    };
}
