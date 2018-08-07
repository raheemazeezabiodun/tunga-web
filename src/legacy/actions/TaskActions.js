import axios from 'axios';
import {ENDPOINT_TASK} from '../constants/Api';
import {
    sendGAEvent,
    GA_EVENT_CATEGORIES,
    GA_EVENT_ACTIONS,
    getGAUserType,
} from '../utils/tracking';
import {getUser} from '../utils/auth';
import {setEditToken} from '../utils/tasks';

export const CREATE_TASK_START = 'CREATE_TASK_START';
export const CREATE_TASK_SUCCESS = 'CREATE_TASK_SUCCESS';
export const CREATE_TASK_FAILED = 'CREATE_TASK_FAILED';
export const LIST_TASKS_START = 'LIST_TASKS_START';
export const LIST_TASKS_SUCCESS = 'LIST_TASKS_SUCCESS';
export const LIST_TASKS_FAILED = 'LIST_TASKS_FAILED';
export const LIST_MORE_TASKS_START = 'LIST_MORE_TASKS_START';
export const LIST_MORE_TASKS_SUCCESS = 'LIST_MORE_TASKS_SUCCESS';
export const LIST_MORE_TASKS_FAILED = 'LIST_MORE_TASKS_FAILED';
export const RETRIEVE_TASK_START = 'RETRIEVE_TASK_START';
export const RETRIEVE_TASK_SUCCESS = 'RETRIEVE_TASK_SUCCESS';
export const RETRIEVE_TASK_FAILED = 'RETRIEVE_TASK_FAILED';
export const UPDATE_TASK_START = 'UPDATE_TASK_START';
export const UPDATE_TASK_SUCCESS = 'UPDATE_TASK_SUCCESS';
export const UPDATE_TASK_FAILED = 'UPDATE_TASK_FAILED';
export const DELETE_TASK_START = 'DELETE_TASK_START';
export const DELETE_TASK_SUCCESS = 'DELETE_TASK_SUCCESS';
export const DELETE_TASK_FAILED = 'DELETE_TASK_FAILED';
export const LIST_TASK_ACTIVITY_START = 'LIST_TASK_ACTIVITY_START';
export const LIST_TASK_ACTIVITY_SUCCESS = 'LIST_TASK_ACTIVITY_SUCCESS';
export const LIST_TASK_ACTIVITY_FAILED = 'LIST_TASK_ACTIVITY_FAILED';
export const LIST_MORE_TASK_ACTIVITY_START = 'LIST_MORE_TASK_ACTIVITY_START';
export const LIST_MORE_TASK_ACTIVITY_SUCCESS =
    'LIST_MORE_TASK_ACTIVITY_SUCCESS';
export const LIST_MORE_TASK_ACTIVITY_FAILED = 'LIST_MORE_TASK_ACTIVITY_FAILED';
export const LIST_NEW_TASK_ACTIVITY_START = 'LIST_NEW_TASK_ACTIVITY_START';
export const LIST_NEW_TASK_ACTIVITY_SUCCESS = 'LIST_NEW_TASK_ACTIVITY_SUCCESS';
export const LIST_NEW_TASK_ACTIVITY_FAILED = 'LIST_NEW_TASK_ACTIVITY_FAILED';
export const SHARE_TASK_UPLOAD_SUCCESS = 'SHARE_TASK_UPLOAD_SUCCESS';
export const UPDATE_TASK_READ_START = 'UPDATE_TASK_READ_START';
export const UPDATE_TASK_READ_SUCCESS = 'UPDATE_TASK_READ_SUCCESS';
export const UPDATE_TASK_READ_FAILED = 'UPDATE_TASK_READ_FAILED';
export const CREATE_TASK_INTEGRATION_START = 'CREATE_TASK_INTEGRATION_START';
export const CREATE_TASK_INTEGRATION_SUCCESS =
    'CREATE_TASK_INTEGRATION_SUCCESS';
export const CREATE_TASK_INTEGRATION_FAILED = 'CREATE_TASK_INTEGRATION_FAILED';
export const RETRIEVE_TASK_INTEGRATION_START =
    'RETRIEVE_TASK_INTEGRATION_START';
export const RETRIEVE_TASK_INTEGRATION_SUCCESS =
    'RETRIEVE_TASK_INTEGRATION_SUCCESS';
export const RETRIEVE_TASK_INTEGRATION_FAILED =
    'RETRIEVE_TASK_INTEGRATION_FAILED';
export const CREATE_TASK_INVOICE_START = 'CREATE_TASK_INVOICE_START';
export const CREATE_TASK_INVOICE_SUCCESS = 'CREATE_TASK_INVOICE_SUCCESS';
export const CREATE_TASK_INVOICE_FAILED = 'CREATE_TASK_INVOICE_FAILED';
export const RETRIEVE_TASK_INVOICE_START = 'RETRIEVE_TASK_INVOICE_START';
export const RETRIEVE_TASK_INVOICE_SUCCESS = 'RETRIEVE_TASK_INVOICE_SUCCESS';
export const RETRIEVE_TASK_INVOICE_FAILED = 'RETRIEVE_TASK_INVOICE_FAILED';
export const UPDATE_TASK_CLAIM_START = 'UPDATE_TASK_CLAIM_START';
export const UPDATE_TASK_CLAIM_SUCCESS = 'UPDATE_TASK_CLAIM_SUCCESS';
export const UPDATE_TASK_CLAIM_FAILED = 'UPDATE_TASK_CLAIM_FAILED';
export const UPDATE_TASK_RETURN_START = 'UPDATE_TASK_RETURN_START';
export const UPDATE_TASK_RETURN_SUCCESS = 'UPDATE_TASK_RETURN_SUCCESS';
export const UPDATE_TASK_RETURN_FAILED = 'UPDATE_TASK_RETURN_FAILED';
export const MAKE_TASK_PAYMENT_START = 'MAKE_TASK_PAYMENT_START';
export const MAKE_TASK_PAYMENT_SUCCESS = 'MAKE_TASK_PAYMENT_SUCCESS';
export const MAKE_TASK_PAYMENT_FAILED = 'MAKE_TASK_PAYMENT_FAILED';
export const CREATE_TASK_DOCUMENT_START = 'CREATE_TASK_DOCUMENT_START';
export const CREATE_TASK_DOCUMENT_SUCCESS = 'CREATE_TASK_DOCUMENT_SUCCESS';
export const CREATE_TASK_DOCUMENT_FAILED = 'CREATE_TASK_DOCUMENT_FAILED';

export function createTask(task, attachments) {
    return dispatch => {
        dispatch(createTaskStart(task));

        var headers = {},
            data = task;

        if (attachments && attachments.length) {
            headers['Content-Type'] = 'multipart/form-data';

            data = new FormData();
            Object.keys(task).map(key => {
                if (
                    (Array.isArray(task[key]) && task[key].length) ||
                    (!Array.isArray(task[key]) && task[key] != null)
                ) {
                    data.append(key, task[key]);
                }
            });

            attachments.map((file, idx) => {
                data.append('file' + idx, file);
            });
        }

        axios
            .post(ENDPOINT_TASK, data, {headers})
            .then(function(response) {
                dispatch(createTaskSuccess(response.data));
            })
            .catch(function(error) {
                dispatch(
                    createTaskFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function createTaskStart(task) {
    return {
        type: CREATE_TASK_START,
        task,
    };
}

export function createTaskSuccess(task) {
    sendGAEvent(
        GA_EVENT_CATEGORIES.TASK,
        GA_EVENT_ACTIONS.CREATE,
        getGAUserType(getUser()),
    );

    setEditToken(task.edit_token);

    return {
        type: CREATE_TASK_SUCCESS,
        task,
    };
}

export function createTaskFailed(error) {
    return {
        type: CREATE_TASK_FAILED,
        error,
    };
}

export function listTasks(filter, selection, prev_selection) {
    return dispatch => {
        dispatch(listTasksStart(filter, selection, prev_selection));
        axios
            .get(ENDPOINT_TASK, {params: filter})
            .then(function(response) {
                dispatch(listTasksSuccess(response.data, filter, selection));
            })
            .catch(function(error) {
                dispatch(
                    listTasksFailed(
                        error.response ? error.response.data : null,
                        selection,
                    ),
                );
            });
    };
}

export function listTasksStart(filter, selection, prev_selection) {
    return {
        type: LIST_TASKS_START,
        filter,
        selection,
        prev_selection,
    };
}

export function listTasksSuccess(response, filter, selection) {
    return {
        type: LIST_TASKS_SUCCESS,
        items: response.results,
        previous: response.previous,
        next: response.next,
        count: response.count,
        filter,
        selection,
    };
}

export function listTasksFailed(error, selection) {
    return {
        type: LIST_TASKS_FAILED,
        error,
        selection,
    };
}

export function listMoreTasks(url, selection) {
    return dispatch => {
        dispatch(listMoreTasksStart(url, selection));
        axios
            .get(url)
            .then(function(response) {
                dispatch(listMoreTasksSuccess(response.data, selection));
            })
            .catch(function(error) {
                dispatch(
                    listMoreTasksFailed(
                        error.response ? error.response.data : null,
                        selection,
                    ),
                );
            });
    };
}

export function listMoreTasksStart(url, selection) {
    return {
        type: LIST_MORE_TASKS_START,
        url,
        selection,
    };
}

export function listMoreTasksSuccess(response, selection) {
    return {
        type: LIST_MORE_TASKS_SUCCESS,
        items: response.results,
        previous: response.previous,
        next: response.next,
        count: response.count,
        selection,
    };
}

export function listMoreTasksFailed(error, selection) {
    return {
        type: LIST_MORE_TASKS_FAILED,
        error,
        selection,
    };
}

export function retrieveTask(id, editToken) {
    return dispatch => {
        dispatch(retrieveTaskStart(id));
        axios
            .get(ENDPOINT_TASK + id + '/', {
                headers: {'X-EDIT-TOKEN': editToken},
            })
            .then(function(response) {
                dispatch(retrieveTaskSuccess(response.data));
            })
            .catch(function(error) {
                console.log('retrieveTask: ', error);
                /*dispatch(
          retrieveTaskFailed(error.response ? error.response.data : null),
        );*/
            });
    };
}

export function retrieveTaskStart(id) {
    return {
        type: RETRIEVE_TASK_START,
        id,
    };
}

export function retrieveTaskSuccess(task) {
    return {
        type: RETRIEVE_TASK_SUCCESS,
        task,
    };
}

export function retrieveTaskFailed(error) {
    return {
        type: RETRIEVE_TASK_FAILED,
        error,
    };
}

export function updateTask(id, task_data, uploads, editToken) {
    return dispatch => {
        dispatch(updateTaskStart(id));

        var headers = {},
            data = task_data;
        if (uploads && uploads.length) {
            headers['Content-Type'] = 'multipart/form-data';

            data = new FormData();
            if (task_data) {
                Object.keys(task_data).map(key => {
                    if (
                        (Array.isArray(task_data[key]) &&
                            task_data[key].length) ||
                        (!Array.isArray(task_data[key]) &&
                            task_data[key] != null)
                    ) {
                        data.append(key, task_data[key]);
                    }
                });
            }

            uploads.map((file, idx) => {
                data.append('file' + idx, file);
            });
        }

        axios
            .patch(ENDPOINT_TASK + id + '/', data, {
                headers: {'X-EDIT-TOKEN': editToken, ...headers},
            })
            .then(function(response) {
                dispatch(updateTaskSuccess(response.data, task_data));
            })
            .catch(function(error) {
                dispatch(
                    updateTaskFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function updateTaskStart(id) {
    return {
        type: UPDATE_TASK_START,
        id,
    };
}

export function updateTaskSuccess(task, data) {
    sendGAEvent(
        GA_EVENT_CATEGORIES.TASK,
        GA_EVENT_ACTIONS.UPDATE,
        getGAUserType(getUser()),
    );
    if (data && data.ratings) {
        sendGAEvent(
            GA_EVENT_CATEGORIES.TASK,
            GA_EVENT_ACTIONS.RATE,
            getGAUserType(getUser()),
        );
    }

    return {
        type: UPDATE_TASK_SUCCESS,
        task,
    };
}

export function updateTaskFailed(error) {
    return {
        type: UPDATE_TASK_FAILED,
        error,
    };
}

export function shareTaskUploadSuccess(task, number) {
    let uploads = task.all_uploads.slice(0, number);
    return {
        type: SHARE_TASK_UPLOAD_SUCCESS,
        task,
        uploads,
    };
}

export function deleteTask(id) {
    return dispatch => {
        dispatch(deleteTaskStart(id));
        axios
            .delete(ENDPOINT_TASK + id + '/')
            .then(function() {
                dispatch(deleteTaskSuccess(id));
            })
            .catch(function(error) {
                dispatch(
                    deleteTaskFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function deleteTaskStart(id) {
    return {
        type: DELETE_TASK_START,
        id,
    };
}

export function deleteTaskSuccess(id) {
    return {
        type: DELETE_TASK_SUCCESS,
        id,
    };
}

export function deleteTaskFailed(error) {
    return {
        type: DELETE_TASK_FAILED,
        error,
    };
}

export function listTaskActivity(id, filter) {
    return dispatch => {
        let get_new = filter && filter.since > -1;
        dispatch(listTaskActivityStart(id, filter, get_new));
        axios
            .get(ENDPOINT_TASK + id + '/activity/', {params: filter})
            .then(function(response) {
                if (response.data.results && response.data.results.length) {
                    dispatch(
                        updateTaskRead(id, {
                            last_read: response.data.results[0].id,
                        }),
                    );
                }
                dispatch(
                    listTaskActivitySuccess(response.data, id, filter, get_new),
                );
            })
            .catch(function(error) {
                dispatch(
                    listTaskActivityFailed(
                        error.response ? error.response.data : null,
                        id,
                        get_new,
                    ),
                );
            });
    };
}

export function listTaskActivityStart(id, filter, new_only = false) {
    return {
        type: new_only
            ? LIST_NEW_TASK_ACTIVITY_START
            : LIST_TASK_ACTIVITY_START,
        id,
        filter,
    };
}

export function listTaskActivitySuccess(
    response,
    id,
    filter,
    new_only = false,
) {
    return {
        type: new_only
            ? LIST_NEW_TASK_ACTIVITY_SUCCESS
            : LIST_TASK_ACTIVITY_SUCCESS,
        items: response.results,
        previous: response.previous,
        next: response.next,
        count: response.count,
        id,
        filter,
    };
}

export function listTaskActivityFailed(error, id, new_only = false) {
    return {
        type: new_only
            ? LIST_NEW_TASK_ACTIVITY_FAILED
            : LIST_TASK_ACTIVITY_FAILED,
        error,
        id,
    };
}

export function listMoreTaskActivity(url) {
    var matches = url.match(/.*\/(\d+)\/activity/);
    var id = matches[1];

    return dispatch => {
        dispatch(listMoreTaskActivityStart(url, id));
        axios
            .get(url)
            .then(function(response) {
                dispatch(listMoreTaskActivitySuccess(response.data, id));
            })
            .catch(function(error) {
                dispatch(
                    listMoreTaskActivityFailed(
                        error.response ? error.response.data : null,
                        id,
                    ),
                );
            });
    };
}

export function listMoreTaskActivityStart(url, id) {
    return {
        type: LIST_MORE_TASK_ACTIVITY_START,
        url,
        id,
    };
}

export function listMoreTaskActivitySuccess(response, id) {
    return {
        type: LIST_MORE_TASK_ACTIVITY_SUCCESS,
        items: response.results,
        previous: response.previous,
        next: response.next,
        count: response.count,
        id,
    };
}

export function listMoreTaskActivityFailed(error, id) {
    return {
        type: LIST_MORE_TASK_ACTIVITY_FAILED,
        error,
        id,
    };
}

export function createTaskIntegration(id, provider, data) {
    return dispatch => {
        dispatch(createTaskIntegrationStart(id));
        axios
            .post(ENDPOINT_TASK + id + '/integration/' + provider + '/', data)
            .then(function(response) {
                dispatch(createTaskIntegrationSuccess(response.data, provider));
            })
            .catch(function(error) {
                dispatch(
                    createTaskIntegrationFailed(
                        error.response ? error.response.data : null,
                        provider,
                    ),
                );
            });
    };
}

export function createTaskIntegrationStart(id, provider) {
    return {
        type: CREATE_TASK_INTEGRATION_START,
        id,
        provider,
    };
}

export function createTaskIntegrationSuccess(response, provider) {
    sendGAEvent(GA_EVENT_CATEGORIES.TASK, GA_EVENT_ACTIONS.INTEGRATE, provider);

    return {
        type: CREATE_TASK_INTEGRATION_SUCCESS,
        task: response.task,
        provider,
        integration: response,
    };
}

export function createTaskIntegrationFailed(error, provider) {
    return {
        type: CREATE_TASK_INTEGRATION_FAILED,
        error,
        provider,
    };
}

export function updateTaskRead(id, data) {
    return dispatch => {
        dispatch(updateTaskReadStart(id));
        axios
            .post(ENDPOINT_TASK + id + '/read/', data)
            .then(function(response) {
                dispatch(updateTaskReadSuccess(response.data));
            })
            .catch(function(error) {
                dispatch(
                    updateTaskReadFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function updateTaskReadStart(id) {
    return {
        type: UPDATE_TASK_READ_START,
        id,
    };
}

export function updateTaskReadSuccess(response) {
    return {
        type: UPDATE_TASK_READ_SUCCESS,
        task: response,
    };
}

export function updateTaskReadFailed(error) {
    return {
        type: UPDATE_TASK_READ_FAILED,
        error,
    };
}

export function retrieveTaskIntegration(id, provider) {
    return dispatch => {
        dispatch(retrieveTaskIntegrationStart(id));
        axios
            .get(ENDPOINT_TASK + id + '/integration/' + provider + '/')
            .then(function(response) {
                dispatch(
                    retrieveTaskIntegrationSuccess(response.data, provider),
                );
            })
            .catch(function(error) {
                dispatch(
                    retrieveTaskIntegrationFailed(
                        error.response ? error.response.data : null,
                        provider,
                    ),
                );
            });
    };
}

export function retrieveTaskIntegrationStart(id, provider) {
    return {
        type: RETRIEVE_TASK_INTEGRATION_START,
        id,
        provider,
    };
}

export function retrieveTaskIntegrationSuccess(response, provider) {
    return {
        type: RETRIEVE_TASK_INTEGRATION_SUCCESS,
        task: response.task,
        provider,
        integration: response,
    };
}

export function retrieveTaskIntegrationFailed(error, provider) {
    return {
        type: RETRIEVE_TASK_INTEGRATION_FAILED,
        error,
        provider,
    };
}

export function createTaskInvoice(id, data) {
    return dispatch => {
        dispatch(createTaskInvoiceStart(id));
        axios
            .post(ENDPOINT_TASK + id + '/invoice/', data)
            .then(function(response) {
                dispatch(createTaskInvoiceSuccess(response.data));
            })
            .catch(function(error) {
                dispatch(
                    createTaskInvoiceFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function createTaskInvoiceStart(id) {
    return {
        type: CREATE_TASK_INVOICE_START,
        id,
    };
}

export function createTaskInvoiceSuccess(response) {
    sendGAEvent(
        GA_EVENT_CATEGORIES.TASK,
        GA_EVENT_ACTIONS.INVOICE,
        getGAUserType(getUser()),
    );

    return {
        type: CREATE_TASK_INVOICE_SUCCESS,
        invoice: response,
    };
}

export function createTaskInvoiceFailed(error) {
    return {
        type: CREATE_TASK_INVOICE_FAILED,
        error,
    };
}

export function retrieveTaskInvoice(id) {
    return dispatch => {
        dispatch(retrieveTaskInvoiceStart(id));
        axios
            .get(ENDPOINT_TASK + id + '/invoice/')
            .then(function(response) {
                dispatch(retrieveTaskInvoiceSuccess(response.data));
            })
            .catch(function(error) {
                dispatch(
                    retrieveTaskInvoiceFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function retrieveTaskInvoiceStart(id) {
    return {
        type: RETRIEVE_TASK_INVOICE_START,
        id,
    };
}

export function retrieveTaskInvoiceSuccess(response) {
    return {
        type: RETRIEVE_TASK_INVOICE_SUCCESS,
        invoice: response,
    };
}

export function retrieveTaskInvoiceFailed(error) {
    return {
        type: RETRIEVE_TASK_INVOICE_FAILED,
        error,
    };
}

export function claimTask(id, data) {
    return dispatch => {
        dispatch(claimTaskStart(id));
        axios
            .post(ENDPOINT_TASK + id + '/claim/', data)
            .then(function(response) {
                dispatch(claimTaskSuccess(response.data));
            })
            .catch(function(error) {
                dispatch(
                    claimTaskFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function claimTaskStart(id) {
    return {
        type: UPDATE_TASK_CLAIM_START,
        id,
    };
}

export function claimTaskSuccess(response) {
    return {
        type: UPDATE_TASK_CLAIM_SUCCESS,
        task: response,
    };
}

export function claimTaskFailed(error) {
    return {
        type: UPDATE_TASK_CLAIM_FAILED,
        error,
    };
}

export function returnTask(id, data) {
    return dispatch => {
        dispatch(returnTaskStart(id));
        axios
            .post(ENDPOINT_TASK + id + '/return/', data)
            .then(function(response) {
                dispatch(returnTaskSuccess(response.data));
            })
            .catch(function(error) {
                dispatch(
                    returnTaskFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function returnTaskStart(id) {
    return {
        type: UPDATE_TASK_RETURN_START,
        id,
    };
}

export function returnTaskSuccess(response) {
    return {
        type: UPDATE_TASK_RETURN_SUCCESS,
        task: response,
    };
}

export function returnTaskFailed(error) {
    return {
        type: UPDATE_TASK_RETURN_FAILED,
        error,
    };
}

export function makeTaskPayment(id, provider, data) {
    return dispatch => {
        dispatch(makeTaskPaymentStart(id));
        axios
            .post(ENDPOINT_TASK + id + '/pay/' + provider + '/', data)
            .then(function(response) {
                dispatch(makeTaskPaymentSuccess(response.data, provider));
            })
            .catch(function(error) {
                dispatch(
                    makeTaskPaymentFailed(
                        error.response ? error.response.data : null,
                        provider,
                    ),
                );
            });
    };
}

export function makeTaskPaymentStart(id, provider) {
    return {
        type: MAKE_TASK_PAYMENT_START,
        id,
        provider,
    };
}

export function makeTaskPaymentSuccess(response, provider) {
    sendGAEvent(GA_EVENT_CATEGORIES.TASK, GA_EVENT_ACTIONS.PAY, provider);

    return {
        type: MAKE_TASK_PAYMENT_SUCCESS,
        task: response.task,
        payment: response.payment,
        provider,
        integration: response,
    };
}

export function makeTaskPaymentFailed(error, provider) {
    return {
        type: MAKE_TASK_PAYMENT_FAILED,
        error,
        provider,
    };
}

export function createTaskDocument(id, document_data, file) {
    return dispatch => {
        dispatch(createTaskDocumentStart(id));

        var headers = {},
            data = new FormData();

        headers['Content-Type'] = 'multipart/form-data';

        Object.keys(document_data).map(key => {
            if (
                (Array.isArray(document_data[key]) &&
                    document_data[key].length) ||
                (!Array.isArray(document_data[key]) &&
                    document_data[key] != null)
            ) {
                data.append(key, document_data[key]);
            }
        });

        data.append('file', file);

        axios
            .post(ENDPOINT_TASK + id + '/documents/', data, {headers})
            .then(function(response) {
                dispatch(createTaskDocumentSuccess(response.data));
            })
            .catch(function(error) {
                dispatch(
                    createTaskDocumentFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function createTaskDocumentStart(id) {
    return {
        type: CREATE_TASK_DOCUMENT_START,
        id,
    };
}

export function createTaskDocumentSuccess(response) {
    sendGAEvent(
        GA_EVENT_CATEGORIES.TASK,
        GA_EVENT_ACTIONS.UPLOAD_DOCUMENT,
        getGAUserType(getUser()),
    );

    return {
        type: CREATE_TASK_DOCUMENT_SUCCESS,
        document: response,
    };
}

export function createTaskDocumentFailed(error) {
    return {
        type: CREATE_TASK_DOCUMENT_FAILED,
        error,
    };
}
