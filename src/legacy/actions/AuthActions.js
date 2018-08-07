import axios from 'axios';
import {
    ENDPOINT_LOGIN,
    ENDPOINT_LOGOUT,
    ENDPOINT_VERIFY,
    ENDPOINT_REGISTER,
    ENDPOINT_APPLY,
    ENDPOINT_RESET_PASSWORD,
    ENDPOINT_RESET_PASSWORD_CONFIRM,
    ENDPOINT_MY_APPS,
    ENDPOINT_TASK,
    ENDPOINT_EMAIL_VISITOR,
    ENDPOINT_INVITE,
    SOCIAL_PROVIDERS,
} from '../constants/Api';
import {updateAccountInfo, updateAuthUser} from './ProfileActions';

import {
    sendGAEvent,
    sendTwitterSignUpEvent,
    GA_EVENT_CATEGORIES,
    GA_EVENT_ACTIONS,
    GA_EVENT_LABELS,
    AUTH_METHODS,
    getGAUserType,
    getUserTypeTwitter,
} from '../utils/tracking';
import {getUser} from '../utils/auth';

export const LOGIN_START = 'LOGIN_START';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILED = 'LOGIN_FAILED';
export const VERIFY_START = 'VERIFY_START';
export const VERIFY_SUCCESS = 'VERIFY_SUCCESS';
export const VERIFY_FAILED = 'VERIFY_FAILED';
export const LOGOUT_START = 'LOGOUT_START';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const LOGOUT_FAILED = 'LOGOUT_FAILED';
export const REGISTER_START = 'REGISTER_START';
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
export const REGISTER_FAILED = 'REGISTER_FAILED';
export const APPLY_START = 'APPLY_START';
export const APPLY_SUCCESS = 'APPLY_SUCCESS';
export const APPLY_FAILED = 'APPLY_FAILED';
export const RETRIEVE_APPLICATION_START = 'RETRIEVE_APPLICATION_START';
export const RETRIEVE_APPLICATION_SUCCESS = 'RETRIEVE_APPLICATION_SUCCESS';
export const RETRIEVE_APPLICATION_FAILED = 'RETRIEVE_APPLICATION_FAILED';
export const RESET_PASSWORD_START = 'RESET_PASSWORD_START';
export const RESET_PASSWORD_SUCCESS = 'RESET_PASSWORD_SUCCESS';
export const RESET_PASSWORD_FAILED = 'RESET_PASSWORD_FAILED';
export const RESET_PASSWORD_CONFIRM_START = 'RESET_PASSWORD_CONFIRM_START';
export const RESET_PASSWORD_CONFIRM_SUCCESS = 'RESET_PASSWORD_CONFIRM_SUCCESS';
export const RESET_PASSWORD_CONFIRM_FAILED = 'RESET_PASSWORD_CONFIRM_FAILED';
export const AUTH_REDIRECT = 'AUTH_REDIRECT';
export const LIST_RUNNING_TASKS_START = 'LIST_RUNNING_TASKS_START';
export const LIST_RUNNING_TASKS_SUCCESS = 'LIST_RUNNING_TASKS_SUCCESS';
export const LIST_RUNNING_TASKS_FAILED = 'LIST_RUNNING_TASKS_FAILED';
export const LIST_REPOS_START = 'LIST_REPOS_START';
export const LIST_REPOS_SUCCESS = 'LIST_REPOS_SUCCESS';
export const LIST_REPOS_FAILED = 'LIST_REPOS_FAILED';
export const LIST_ISSUES_START = 'LIST_ISSUES_START';
export const LIST_ISSUES_SUCCESS = 'LIST_ISSUES_SUCCESS';
export const LIST_ISSUES_FAILED = 'LIST_ISSUES_FAILED';
export const GET_SLACK_APP_START = 'GET_SLACK_APP_START';
export const GET_SLACK_APP_SUCCESS = 'GET_SLACK_APP_SUCCESS';
export const GET_SLACK_APP_FAILED = 'GET_SLACK_APP_FAILED';
export const LIST_SLACK_CHANNELS_START = 'LIST_SLACK_CHANNELS_START';
export const LIST_SLACK_CHANNELS_SUCCESS = 'LIST_SLACK_CHANNELS_SUCCESS';
export const LIST_SLACK_CHANNELS_FAILED = 'LIST_SLACK_CHANNELS_FAILED';
export const EMAIL_VISITOR_AUTH_START = 'EMAIL_VISITOR_AUTH_START';
export const EMAIL_VISITOR_AUTH_SUCCESS = 'EMAIL_VISITOR_AUTH_SUCCESS';
export const EMAIL_VISITOR_AUTH_FAILED = 'EMAIL_VISITOR_AUTH_FAILED';
export const EMAIL_VISITOR_VERIFY_START = 'EMAIL_VISITOR_VERIFY_START';
export const EMAIL_VISITOR_VERIFY_SUCCESS = 'EMAIL_VISITOR_VERIFY_SUCCESS';
export const EMAIL_VISITOR_VERIFY_FAILED = 'EMAIL_VISITOR_VERIFY_FAILED';
export const INVITE_START = 'INVITE_START';
export const INVITE_SUCCESS = 'INVITE_SUCCESS';
export const INVITE_FAILED = 'INVITE_FAILED';
export const RETRIEVE_INVITE_START = 'RETRIEVE_INVITE_START';
export const RETRIEVE_INVITE_SUCCESS = 'RETRIEVE_INVITE_SUCCESS';
export const RETRIEVE_INVITE_FAILED = 'RETRIEVE_INVITE_FAILED';

export function authenticate(credentials) {
    return dispatch => {
        dispatch(authStart(credentials));
        axios
            .post(ENDPOINT_LOGIN, credentials)
            .then(function(response) {
                dispatch(authSuccess(response.data));
            })
            .catch(function(error) {
                dispatch(
                    authFailed(error.response ? error.response.data : null),
                );
            });
    };
}

export function authStart(credentials) {
    return {
        type: LOGIN_START,
        credentials,
    };
}

export function authSuccess(data) {
    let user = data.user;
    sendGAEvent(
        GA_EVENT_CATEGORIES.AUTH,
        GA_EVENT_ACTIONS.SIGN_IN,
        getGAUserType(user),
    );
    return {
        type: LOGIN_SUCCESS,
        user,
    };
}

export function authFailed(error) {
    return {
        type: LOGIN_FAILED,
        error,
    };
}

export function authenticateEmailVisitor(credentials) {
    return dispatch => {
        dispatch(authEmailVisitorStart(credentials));
        axios
            .post(ENDPOINT_EMAIL_VISITOR, credentials)
            .then(function(response) {
                dispatch(authEmailVisitorSuccess(response.data));
            })
            .catch(function(error) {
                dispatch(
                    authEmailVisitorFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function authEmailVisitorStart(credentials) {
    return {
        type: EMAIL_VISITOR_AUTH_START,
        credentials,
    };
}

export function authEmailVisitorSuccess(visitor) {
    sendGAEvent(GA_EVENT_CATEGORIES.AUTH, GA_EVENT_ACTIONS.BROWSE_DEVS);
    return {
        type: EMAIL_VISITOR_AUTH_SUCCESS,
        visitor,
    };
}

export function authEmailVisitorFailed(error) {
    return {
        type: EMAIL_VISITOR_AUTH_FAILED,
        error,
    };
}

export function verify() {
    return dispatch => {
        dispatch(verifyStart());
        axios
            .get(ENDPOINT_VERIFY)
            .then(function(response) {
                dispatch(verifySuccess(response.data));
            })
            .catch(function(error) {
                //dispatch(verifyFailed(error.response?error.response.data:null));
                dispatch(verifyEmailVisitor());
            });
    };
}

export function verifyStart() {
    return {
        type: VERIFY_START,
    };
}

export function verifySuccess(user) {
    return {
        type: VERIFY_SUCCESS,
        user,
    };
}

export function verifyFailed(error) {
    return {
        type: VERIFY_FAILED,
        error,
    };
}

export function verifyEmailVisitor() {
    return dispatch => {
        dispatch(verifyEmailVisitorStart());
        axios
            .get(ENDPOINT_EMAIL_VISITOR)
            .then(function(response) {
                dispatch(verifyEmailVisitorSuccess(response.data));
            })
            .catch(function(error) {
                dispatch(
                    verifyEmailVisitorFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function verifyEmailVisitorStart() {
    return {
        type: EMAIL_VISITOR_VERIFY_START,
    };
}

export function verifyEmailVisitorSuccess(visitor) {
    return {
        type: EMAIL_VISITOR_VERIFY_SUCCESS,
        visitor,
    };
}

export function verifyEmailVisitorFailed(error) {
    return {
        type: EMAIL_VISITOR_VERIFY_FAILED,
        error,
    };
}

export function logout() {
    return dispatch => {
        dispatch(logoutStart());
        axios
            .post(ENDPOINT_LOGOUT, {})
            .then(function() {
                dispatch(logoutSuccess());
            })
            .catch(function(error) {
                dispatch(
                    logoutFailed(error.response ? error.response.data : null),
                );
            });
    };
}

export function logoutStart() {
    return {
        type: LOGOUT_START,
    };
}

export function logoutSuccess() {
    sendGAEvent(
        GA_EVENT_CATEGORIES.AUTH,
        GA_EVENT_ACTIONS.LOG_OUT,
        getGAUserType(getUser()),
    );
    return {
        type: LOGOUT_SUCCESS,
    };
}

export function logoutFailed(error) {
    console.log('logoutFailed: ', error);
    return {
        type: LOGOUT_FAILED,
        error,
    };
}

export function register(details) {
    return dispatch => {
        dispatch(registerStart(details));
        axios
            .post(ENDPOINT_REGISTER, details)
            .then(function(response) {
                dispatch(registerSuccess(response.data));

                var user_type = getUserTypeTwitter(details.type);
                var method = AUTH_METHODS.EMAIL;
                sendTwitterSignUpEvent({user_type, method});
            })
            .catch(function(error) {
                dispatch(
                    registerFailed(error.response ? error.response.data : null),
                );
            });
    };
}

export function registerStart(details) {
    return {
        type: REGISTER_START,
        details,
    };
}

export function registerSuccess(data) {
    let user = data.user;
    sendGAEvent(
        GA_EVENT_CATEGORIES.REGISTRATION,
        GA_EVENT_ACTIONS.SIGN_UP,
        getGAUserType(user),
    );

    return {
        type: REGISTER_SUCCESS,
        user,
    };
}

export function registerFailed(error) {
    return {
        type: REGISTER_FAILED,
        error,
    };
}

export function apply(details) {
    return dispatch => {
        dispatch(applyStart(details));
        axios
            .post(ENDPOINT_APPLY, details)
            .then(function(response) {
                dispatch(applySuccess(response.data));
            })
            .catch(function(error) {
                dispatch(
                    applyFailed(error.response ? error.response.data : null),
                );
            });
    };
}

export function applyStart(details) {
    return {
        type: APPLY_START,
        details,
    };
}

export function applySuccess(application) {
    sendGAEvent(
        GA_EVENT_CATEGORIES.AUTH,
        GA_EVENT_ACTIONS.DEV_APPLY,
        GA_EVENT_LABELS.DEVELOPER,
    );
    return {
        type: APPLY_SUCCESS,
        application,
    };
}

export function applyFailed(error) {
    return {
        type: APPLY_FAILED,
        error,
    };
}

export function retrieveApplication(key) {
    return dispatch => {
        dispatch(retrieveApplicationStart(key));
        axios
            .get(ENDPOINT_APPLY + 'key/' + key + '/')
            .then(function(response) {
                dispatch(retrieveApplicationSuccess(response.data));
            })
            .catch(function(error) {
                dispatch(
                    retrieveApplicationFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function retrieveApplicationStart(key) {
    return {
        type: RETRIEVE_APPLICATION_START,
        key,
    };
}

export function retrieveApplicationSuccess(application) {
    return {
        type: RETRIEVE_APPLICATION_SUCCESS,
        application,
    };
}

export function retrieveApplicationFailed(error) {
    return {
        type: RETRIEVE_APPLICATION_FAILED,
        error,
    };
}

export function resetPassword(email) {
    return dispatch => {
        dispatch(resetPasswordStart(email));
        axios
            .post(ENDPOINT_RESET_PASSWORD, email)
            .then(function(response) {
                dispatch(resetPasswordSuccess(response.data));
            })
            .catch(function(error) {
                dispatch(
                    resetPasswordFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function resetPasswordStart(email) {
    return {
        type: RESET_PASSWORD_START,
        email,
    };
}

export function resetPasswordSuccess(response) {
    sendGAEvent(GA_EVENT_CATEGORIES.AUTH, GA_EVENT_ACTIONS.RECOVER_PASSWORD);
    return {
        type: RESET_PASSWORD_SUCCESS,
        response,
    };
}

export function resetPasswordFailed(error) {
    return {
        type: RESET_PASSWORD_FAILED,
        error,
    };
}

export function resetPasswordConfirm(credentials) {
    return dispatch => {
        dispatch(resetPasswordConfirmStart(credentials));
        axios
            .post(ENDPOINT_RESET_PASSWORD_CONFIRM, credentials)
            .then(function(response) {
                dispatch(resetPasswordConfirmSuccess(response.data));
            })
            .catch(function(error) {
                dispatch(
                    resetPasswordConfirmFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function resetPasswordConfirmStart(credentials) {
    return {
        type: RESET_PASSWORD_CONFIRM_START,
        credentials,
    };
}

export function resetPasswordConfirmSuccess(response) {
    sendGAEvent(
        GA_EVENT_CATEGORIES.AUTH,
        GA_EVENT_ACTIONS.RECOVER_PASSWORD_CONFIRM,
    );

    return {
        type: RESET_PASSWORD_CONFIRM_SUCCESS,
        response,
    };
}

export function resetPasswordConfirmFailed(error) {
    return {
        type: RESET_PASSWORD_CONFIRM_FAILED,
        error,
    };
}

export function authRedirect(path) {
    return {
        type: AUTH_REDIRECT,
        path,
    };
}

export function listRunningTasks() {
    return dispatch => {
        var filter = {filter: 'running'};
        dispatch(listRunningTasksStart(filter));
        axios
            .get(ENDPOINT_TASK, {params: filter})
            .then(function(response) {
                dispatch(listRunningTasksSuccess(response.data));
            })
            .catch(function(error) {
                dispatch(
                    listRunningTasksFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function listRunningTasksStart(filter) {
    return {
        type: LIST_RUNNING_TASKS_START,
        filter,
    };
}

export function listRunningTasksSuccess(response) {
    return {
        type: LIST_RUNNING_TASKS_SUCCESS,
        items: response.results,
        previous: response.previous,
        next: response.next,
        count: response.count,
    };
}

export function listRunningTasksFailed(error) {
    return {
        type: LIST_RUNNING_TASKS_FAILED,
        error,
    };
}

export function listRepos(provider, task = null) {
    return dispatch => {
        dispatch(listReposStart(provider));
        axios
            .get(ENDPOINT_MY_APPS + provider + '/repos/', {params: {task}})
            .then(function(response) {
                dispatch(listReposSuccess(response.data, provider));
            })
            .catch(function(error) {
                dispatch(
                    listReposFailed(
                        error.response ? error.response.data : null,
                        error.response ? error.response.status : null,
                        provider,
                    ),
                );
            });
    };
}

export function listReposStart(provider) {
    return {
        type: LIST_REPOS_START,
        provider,
    };
}

export function listReposSuccess(repos, status_code, provider) {
    return {
        type: LIST_REPOS_SUCCESS,
        repos,
        provider,
    };
}

export function listReposFailed(error, status_code, provider) {
    return {
        type: LIST_REPOS_FAILED,
        error,
        status_code,
        provider,
    };
}

export function listIssues(provider, task = null) {
    return dispatch => {
        dispatch(listIssuesStart(provider));
        axios
            .get(ENDPOINT_MY_APPS + provider + '/issues/', {params: {task}})
            .then(function(response) {
                dispatch(listIssuesSuccess(response.data, provider));
            })
            .catch(function(error) {
                dispatch(
                    listIssuesFailed(
                        error.response ? error.response.data : null,
                        error.response ? error.response.status : null,
                        provider,
                    ),
                );
            });
    };
}

export function listIssuesStart(provider) {
    return {
        type: LIST_ISSUES_START,
        provider,
    };
}

export function listIssuesSuccess(issues, provider) {
    return {
        type: LIST_ISSUES_SUCCESS,
        issues,
        provider,
    };
}

export function listIssuesFailed(error, status_code, provider) {
    return {
        type: LIST_ISSUES_FAILED,
        error,
        status_code,
        provider,
    };
}

export function getSlackApp(task = null) {
    return dispatch => {
        dispatch(getSlackAppStart());
        axios
            .get(ENDPOINT_MY_APPS + `${SOCIAL_PROVIDERS.slack}/`, {
                params: {task},
            })
            .then(function(response) {
                dispatch(getSlackAppSuccess(response.data));
            })
            .catch(function(error) {
                dispatch(
                    getSlackAppFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function getSlackAppStart() {
    return {
        type: GET_SLACK_APP_START,
    };
}

export function getSlackAppSuccess(details) {
    return {
        type: GET_SLACK_APP_SUCCESS,
        details,
    };
}

export function getSlackAppFailed(error) {
    return {
        type: GET_SLACK_APP_FAILED,
        error,
    };
}

export function listSlackChannels(task = null) {
    return dispatch => {
        dispatch(listSlackChannelsStart());
        axios
            .get(
                ENDPOINT_MY_APPS + `${SOCIAL_PROVIDERS.slack}` + '/channels/',
                {
                    params: {task},
                },
            )
            .then(function(response) {
                dispatch(listSlackChannelsSuccess(response.data));
            })
            .catch(function(error) {
                dispatch(
                    listSlackChannelsFailed(
                        error.response ? error.response.data : null,
                        error.response ? error.response.status : null,
                    ),
                );
            });
    };
}

export function listSlackChannelsStart() {
    return {
        type: LIST_SLACK_CHANNELS_START,
    };
}

export function listSlackChannelsSuccess(channels) {
    return {
        type: LIST_SLACK_CHANNELS_SUCCESS,
        channels,
    };
}

export function listSlackChannelsFailed(error, status_code) {
    return {
        type: LIST_SLACK_CHANNELS_FAILED,
        error,
        status_code,
    };
}

export function invite(details) {
    return dispatch => {
        dispatch(inviteStart(details));
        axios
            .post(ENDPOINT_INVITE, details)
            .then(function(response) {
                dispatch(inviteSuccess(response.data));
            })
            .catch(function(error) {
                dispatch(
                    inviteFailed(error.response ? error.response.data : null),
                );
            });
    };
}

export function inviteStart(details) {
    return {
        type: INVITE_START,
        details,
    };
}

export function inviteSuccess(invite) {
    sendGAEvent(
        GA_EVENT_CATEGORIES.AUTH,
        GA_EVENT_ACTIONS.DEV_INVITE,
        getGAUserType(getUser()),
    );
    return {
        type: INVITE_SUCCESS,
        invite,
    };
}

export function inviteFailed(error) {
    return {
        type: INVITE_FAILED,
        error,
    };
}

export function retrieveInvite(key) {
    return dispatch => {
        dispatch(retrieveInviteStart(key));
        axios
            .get(ENDPOINT_INVITE + 'key/' + key + '/')
            .then(function(response) {
                dispatch(retrieveInviteSuccess(response.data));
            })
            .catch(function(error) {
                dispatch(
                    retrieveInviteFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function retrieveInviteStart(key) {
    return {
        type: RETRIEVE_INVITE_START,
        key,
    };
}

export function retrieveInviteSuccess(invite) {
    return {
        type: RETRIEVE_INVITE_SUCCESS,
        invite,
    };
}

export function retrieveInviteFailed(error) {
    return {
        type: RETRIEVE_INVITE_FAILED,
        error,
    };
}

export {updateAccountInfo, updateAuthUser};
