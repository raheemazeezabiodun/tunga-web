import {combineReducers} from 'redux';
import * as AuthActions from '../actions/AuthActions';
import * as ProfileActions from '../actions/ProfileActions';
import {running as runningProjects} from './ProjectReducers';
import {running as runningTasks} from './TaskReducers';
import {PATH_CHANGE} from '../actions/NavActions';

function user(state = {}, action) {
    switch (action.type) {
        case AuthActions.LOGIN_SUCCESS:
        case AuthActions.VERIFY_SUCCESS:
            return action.user;
        case ProfileActions.UPDATE_ACCOUNT_INFO_SUCCESS:
        case ProfileActions.UPDATE_AUTH_USER_SUCCESS:
        case ProfileActions.RETRIEVE_PROFILE_SUCCESS:
            var user = action.user;
            return {...state, ...user};
        case ProfileActions.UPDATE_PROFILE_SUCCESS:
            let profile = {...action.profile, ...action.profile.details};
            user = profile.user;
            delete profile.user;
            return {...state, ...user, profile, company: state.company};
        case ProfileActions.UPDATE_COMPANY_SUCCESS:
            let company = {...action.company, ...action.company.details};
            return {...state, ...user, company, profile: state.profile};
        case ProfileActions.CREATE_WORK_SUCCESS:
        case ProfileActions.UPDATE_WORK_SUCCESS:
            let work = action.work;
            delete work.user;
            let currentWork = [...(state.work || [])];
            let currentWorkIdx = currentWork.map(item => {
                return item.id;
            }).indexOf(work.id);
            if(currentWorkIdx === -1) {
                currentWork.push(work);
            } else {
                currentWork[currentWorkIdx] = work;
            }
            return {...state, work: currentWork};
        case ProfileActions.CREATE_EDUCATION_SUCCESS:
        case ProfileActions.UPDATE_EDUCATION_SUCCESS:
            let education = action.education;
            delete education.user;
            let currentEducation = [...(state.education || [])];
            let currentEducationIdx = currentEducation.map(item => {
                return item.id;
            }).indexOf(education.id);
            if(currentEducationIdx === -1) {
                currentEducation.push(education);
            } else {
                currentEducation[currentEducationIdx] = education;
            }
            return {...state, education: currentEducation};
        case AuthActions.LOGOUT_SUCCESS:
            return {};
        default:
            return state;
    }
}

function visitor(state = {}, action) {
    switch (action.type) {
        case AuthActions.EMAIL_VISITOR_AUTH_SUCCESS:
        case AuthActions.EMAIL_VISITOR_VERIFY_SUCCESS:
            return action.visitor;
        case AuthActions.LOGOUT_SUCCESS:
            return {};
        default:
            return state;
    }
}

function isAuthenticating(state = false, action) {
    switch (action.type) {
        case AuthActions.LOGIN_START:
        case AuthActions.LOGOUT_START:
        case AuthActions.EMAIL_VISITOR_AUTH_START:
            return true;
        case AuthActions.LOGIN_SUCCESS:
        case AuthActions.LOGOUT_SUCCESS:
        case AuthActions.EMAIL_VISITOR_AUTH_SUCCESS:
        case AuthActions.LOGIN_FAILED:
        case AuthActions.LOGOUT_FAILED:
        case AuthActions.EMAIL_VISITOR_AUTH_FAILED:
            return false;
        default:
            return state;
    }
}

function isVerifying(state = false, action) {
    switch (action.type) {
        case AuthActions.VERIFY_START:
        case AuthActions.EMAIL_VISITOR_VERIFY_START:
            return true;
        case AuthActions.VERIFY_SUCCESS:
        case AuthActions.EMAIL_VISITOR_VERIFY_SUCCESS:
        case AuthActions.VERIFY_FAILED:
        case AuthActions.EMAIL_VISITOR_VERIFY_FAILED:
            return false;
        default:
            return state;
    }
}

function isAuthenticated(state = false, action) {
    switch (action.type) {
        case AuthActions.LOGIN_SUCCESS:
        case AuthActions.VERIFY_SUCCESS:
            return true;
        case AuthActions.LOGOUT_SUCCESS:
            return false;
        default:
            return state;
    }
}

function isEmailVisitor(state = false, action) {
    switch (action.type) {
        case AuthActions.EMAIL_VISITOR_AUTH_SUCCESS:
        case AuthActions.EMAIL_VISITOR_VERIFY_SUCCESS:
            return true;
        case AuthActions.LOGOUT_SUCCESS:
            return false;
        default:
            return state;
    }
}

function isRegistering(state = false, action) {
    switch (action.type) {
        case AuthActions.REGISTER_START:
            return true;
        case AuthActions.REGISTER_SUCCESS:
        case AuthActions.REGISTER_FAILED:
            return false;
        default:
            return state;
    }
}

function isRegistered(state = false, action) {
    switch (action.type) {
        case AuthActions.REGISTER_SUCCESS:
            return true;
        case AuthActions.REGISTER_START:
        case AuthActions.REGISTER_FAILED:
            return false;
        default:
            return state;
    }
}

function application(state = {}, action) {
    switch (action.type) {
        case AuthActions.RETRIEVE_APPLICATION_SUCCESS:
            return action.application;
        case ProfileActions.RETRIEVE_PROFILE_START:
        case ProfileActions.RETRIEVE_PROFILE_FAILED:
        case PATH_CHANGE:
            return {};
        default:
            return state;
    }
}

function isApplying(state = false, action) {
    switch (action.type) {
        case AuthActions.APPLY_START:
            return true;
        case AuthActions.APPLY_SUCCESS:
        case AuthActions.APPLY_FAILED:
            return false;
        default:
            return state;
    }
}

function hasApplied(state = false, action) {
    switch (action.type) {
        case AuthActions.APPLY_SUCCESS:
            return true;
        case AuthActions.APPLY_START:
        case AuthActions.APPLY_FAILED:
            return false;
        default:
            return state;
    }
}

function isRetrievingApplication(state = false, action) {
    switch (action.type) {
        case AuthActions.APPLY_START:
            return true;
        case AuthActions.APPLY_SUCCESS:
        case AuthActions.APPLY_FAILED:
            return false;
        default:
            return state;
    }
}

function invitation(state = {}, action) {
    switch (action.type) {
        case AuthActions.RETRIEVE_INVITE_SUCCESS:
            return action.invite;
        case AuthActions.RETRIEVE_INVITE_START:
        case AuthActions.RETRIEVE_INVITE_FAILED:
        case PATH_CHANGE:
            return {};
        default:
            return state;
    }
}

function isInviting(state = false, action) {
    switch (action.type) {
        case AuthActions.INVITE_START:
            return true;
        case AuthActions.INVITE_SUCCESS:
        case AuthActions.INVITE_FAILED:
            return false;
        default:
            return state;
    }
}

function hasInvited(state = false, action) {
    switch (action.type) {
        case AuthActions.INVITE_SUCCESS:
            return true;
        case AuthActions.INVITE_START:
        case AuthActions.INVITE_FAILED:
            return false;
        default:
            return state;
    }
}

function isRetrievingInvitation(state = false, action) {
    switch (action.type) {
        case AuthActions.INVITE_START:
            return true;
        case AuthActions.INVITE_SUCCESS:
        case AuthActions.INVITE_FAILED:
            return false;
        default:
            return state;
    }
}

function isResetting(state = false, action) {
    switch (action.type) {
        case AuthActions.RESET_PASSWORD_START:
            return true;
        case AuthActions.RESET_PASSWORD_SUCCESS:
        case AuthActions.RESET_PASSWORD_FAILED:
            return false;
        default:
            return state;
    }
}

function isReset(state = false, action) {
    switch (action.type) {
        case AuthActions.RESET_PASSWORD_SUCCESS:
        case AuthActions.RESET_PASSWORD_CONFIRM_SUCCESS:
            return true;
        case AuthActions.RESET_PASSWORD_START:
        case AuthActions.RESET_PASSWORD_FAILED:
        case AuthActions.RESET_PASSWORD_CONFIRM_START:
        case AuthActions.RESET_PASSWORD_CONFIRM_FAILED:
            return false;
        default:
            return state;
    }
}

function repoItems(state = {}, action) {
    switch (action.type) {
        case AuthActions.LIST_REPOS_SUCCESS:
            var all_repos = {};
            action.repos.forEach(repo => {
                all_repos[repo.id] = repo;
            });
            return all_repos;
        case AuthActions.LIST_REPOS_START:
        case AuthActions.LIST_ISSUES_FAILED:
            return {};
        default:
            return state;
    }
}

function repoIds(state = [], action) {
    switch (action.type) {
        case AuthActions.LIST_REPOS_SUCCESS:
            return action.repos.map(repo => {
                return repo.id;
            });
        case AuthActions.LIST_REPOS_START:
        case AuthActions.LIST_REPOS_FAILED:
            return [];
        default:
            return state;
    }
}

function isFetchingRepos(state = false, action) {
    switch (action.type) {
        case AuthActions.LIST_REPOS_START:
            return true;
        case AuthActions.LIST_REPOS_SUCCESS:
        case AuthActions.LIST_REPOS_FAILED:
            return false;
        default:
            return state;
    }
}

function issueItems(state = {}, action) {
    switch (action.type) {
        case AuthActions.LIST_ISSUES_SUCCESS:
            var all_issues = {};
            action.issues.forEach(issue => {
                all_issues[issue.id] = issue;
            });
            return all_issues;
        case AuthActions.LIST_ISSUES_START:
        case AuthActions.LIST_ISSUES_FAILED:
            return {};
        default:
            return state;
    }
}

function issueIds(state = [], action) {
    switch (action.type) {
        case AuthActions.LIST_ISSUES_SUCCESS:
            return action.issues.map(issue => {
                return issue.id;
            });
        case AuthActions.LIST_ISSUES_START:
        case AuthActions.LIST_ISSUES_FAILED:
            return [];
        default:
            return state;
    }
}

function isFetchingIssues(state = false, action) {
    switch (action.type) {
        case AuthActions.LIST_ISSUES_START:
            return true;
        case AuthActions.LIST_ISSUES_SUCCESS:
        case AuthActions.LIST_ISSUES_FAILED:
            return false;
        default:
            return state;
    }
}

function isGitHubConnected(state = false, action) {
    switch (action.type) {
        case AuthActions.LIST_REPOS_SUCCESS:
        case AuthActions.LIST_ISSUES_SUCCESS:
            return true;
        case AuthActions.LIST_REPOS_FAILED:
        case AuthActions.LIST_ISSUES_FAILED:
            return false;
        default:
            return state;
    }
}

function slackInfo(state = null, action) {
    switch (action.type) {
        case AuthActions.GET_SLACK_APP_SUCCESS:
            return action.details;
        case AuthActions.GET_SLACK_APP_FAILED:
            return null;
        default:
            return state;
    }
}

function isRetrievingSlackInfo(state = false, action) {
    switch (action.type) {
        case AuthActions.GET_SLACK_APP_START:
            return true;
        case AuthActions.GET_SLACK_APP_SUCCESS:
        case AuthActions.GET_SLACK_APP_FAILED:
            return false;
        default:
            return state;
    }
}

function slackChannelItems(state = {}, action) {
    switch (action.type) {
        case AuthActions.LIST_SLACK_CHANNELS_SUCCESS:
            var all_channels = {};
            action.channels.forEach(slackChannel => {
                all_channels[slackChannel.id] = slackChannel;
            });
            return all_channels;
        case AuthActions.LIST_SLACK_CHANNELS_START:
        case AuthActions.LIST_SLACK_CHANNELS_FAILED:
            return {};
        default:
            return state;
    }
}

function slackChannelIds(state = [], action) {
    switch (action.type) {
        case AuthActions.LIST_SLACK_CHANNELS_SUCCESS:
            return action.channels.map(channel => {
                return channel.id;
            });
        case AuthActions.LIST_SLACK_CHANNELS_START:
        case AuthActions.LIST_SLACK_CHANNELS_FAILED:
            return [];
        default:
            return state;
    }
}

function isFetchingSlackChannels(state = false, action) {
    switch (action.type) {
        case AuthActions.LIST_SLACK_CHANNELS_START:
            return true;
        case AuthActions.LIST_SLACK_CHANNELS_SUCCESS:
        case AuthActions.LIST_SLACK_CHANNELS_FAILED:
            return false;
        default:
            return state;
    }
}

function isSlackConnected(state = false, action) {
    switch (action.type) {
        case AuthActions.GET_SLACK_APP_SUCCESS:
            return action.details != null;
        case AuthActions.GET_SLACK_APP_FAILED:
            return false;
        case AuthActions.LIST_SLACK_CHANNELS_SUCCESS:
            return true;
        case AuthActions.LIST_SLACK_CHANNELS_FAILED:
            return false;
        default:
            return state;
    }
}

function error(state = {}, action) {
    switch (action.type) {
        case AuthActions.LOGIN_FAILED:
            var error = action.error;
            if (
                error &&
                error.non_field_errors ==
                    'Unable to log in with provided credentials.'
            ) {
                error.non_field_errors = 'Wrong username or password';
            }
            return {...state, auth: error};
        case AuthActions.LOGIN_START:
        case AuthActions.LOGIN_SUCCESS:
            return {...state, auth: null};
        case AuthActions.REGISTER_FAILED:
            return {...state, register: action.error};
        case AuthActions.REGISTER_START:
        case AuthActions.REGISTER_SUCCESS:
            return {...state, register: null};
        case AuthActions.APPLY_FAILED:
            return {...state, apply: action.error};
        case AuthActions.APPLY_START:
        case AuthActions.APPLY_SUCCESS:
            return {...state, apply: null};
        case AuthActions.RESET_PASSWORD_FAILED:
            return {...state, reset: action.error};
        case AuthActions.RESET_PASSWORD_START:
        case AuthActions.RESET_PASSWORD_SUCCESS:
            return {...state, reset: null};
        case AuthActions.RESET_PASSWORD_CONFIRM_FAILED:
            return {...state, reset_confirm: action.error};
        case AuthActions.RESET_PASSWORD_CONFIRM_START:
        case AuthActions.RESET_PASSWORD_CONFIRM_SUCCESS:
            return {...state, reset_confirm: null};
        case AuthActions.INVITE_FAILED:
            return {...state, invite: action.error};
        case AuthActions.INVITE_START:
        case AuthActions.INVITE_SUCCESS:
            return {...state, invite: null};
        default:
            return state;
    }
}

function next(state = null, action) {
    switch (action.type) {
        case AuthActions.AUTH_REDIRECT:
            return action.path;
        case AuthActions.LOGOUT_SUCCESS:
            return null;
        default:
            return state;
    }
}

const running = combineReducers({
    projects: runningProjects,
    tasks: runningTasks,
});

const repos = combineReducers({
    ids: repoIds,
    items: repoItems,
    isFetching: isFetchingRepos,
});

const issues = combineReducers({
    ids: issueIds,
    items: issueItems,
    isFetching: isFetchingIssues,
});

const github = combineReducers({
    repos,
    issues,
    isConnected: isGitHubConnected,
});

const slack_channels = combineReducers({
    ids: slackChannelIds,
    items: slackChannelItems,
    isFetching: isFetchingSlackChannels,
});

const slack = combineReducers({
    details: slackInfo,
    channels: slack_channels,
    isRetrieving: isRetrievingSlackInfo,
    isConnected: isSlackConnected,
});

const connections = combineReducers({
    github,
    slack,
});

const Auth = combineReducers({
    user,
    visitor,
    application,
    invitation,
    isAuthenticating,
    isVerifying,
    isAuthenticated,
    isEmailVisitor,
    isRegistering,
    isRegistered,
    isApplying,
    hasApplied,
    isRetrievingApplication,
    isInviting,
    hasInvited,
    isRetrievingInvitation,
    isResetting,
    isReset,
    error,
    next,
    running,
    connections,
});

export default Auth;
