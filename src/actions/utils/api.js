import axios from 'axios';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

let BACKEND_PATH =
    __BACKEND_ROOT_URL__ || (__PRODUCTION__ ? (/butterflyworks\.org/ig.test(window.location.hostname)?'https://tunga.io/':'/') : 'http://sandbox.tunga.io/');
let API_PATH = 'api/';
let SOCIAL_LOGIN_PATH = 'accounts/social/';

export const API_ROOT = `${BACKEND_PATH}${API_PATH}`;

export const SOCIAL_LOGIN_PREFIX = `${BACKEND_PATH}${SOCIAL_LOGIN_PATH}`;

function createSocialLoginUrl(provider) {
    return SOCIAL_LOGIN_PREFIX + provider + '/';
}

export const SOCIAL_PROVIDERS = {
    facebook: 'facebook',
    google: 'google',
    linkedin: 'linkedin',
    github: 'github',
    coinbase: 'coinbase',
    slack: 'slack',
    trello: 'trello',
    'google-drive': 'google-drive',
};

export const SOCIAL_LOGIN_URLS = {
    facebook: createSocialLoginUrl('facebook'),
    google: createSocialLoginUrl('google'),
    linkedin: createSocialLoginUrl('linkedin_oauth2'),
    github: createSocialLoginUrl('github'),
    coinbase: createSocialLoginUrl('coinbase'),
    slack: createSocialLoginUrl('slack'),
};


function getEndpointUrl(path) {
    return API_ROOT + path;
}

// Auth
export const ENDPOINT_LOGIN = getEndpointUrl('auth/login/');
export const ENDPOINT_LOGOUT = getEndpointUrl('auth/logout/');
export const ENDPOINT_VERIFY = getEndpointUrl('auth/verify/');
export const ENDPOINT_REGISTER = getEndpointUrl('auth/register/');
export const ENDPOINT_EMAIL_VISITOR = getEndpointUrl('auth/visitor/');
export const ENDPOINT_APPLY = getEndpointUrl('apply/');
export const ENDPOINT_INVITE = getEndpointUrl('invite/');
export const ENDPOINT_CHANGE_PASSWORD = getEndpointUrl('auth/password/change/');
export const ENDPOINT_RESET_PASSWORD = getEndpointUrl('auth/password/reset/');
export const ENDPOINT_RESET_PASSWORD_CONFIRM = getEndpointUrl(
    'auth/password/reset/confirm/',
);

// Account
export const ENDPOINT_PROFILE = getEndpointUrl('me/profile/');
export const ENDPOINT_COMPANY = getEndpointUrl('me/company/');
export const ENDPOINT_NOTIFICATION = getEndpointUrl('me/notification/');
export const ENDPOINT_ACCOUNT_INFO = getEndpointUrl('me/account/');
export const ENDPOINT_ACCOUNT_SETTINGS = getEndpointUrl('me/settings/');
export const ENDPOINT_USER_INFO = getEndpointUrl('me/user/');
export const ENDPOINT_USER_EDUCATION = getEndpointUrl('me/education/');
export const ENDPOINT_USER_WORK = getEndpointUrl('me/work/');
export const ENDPOINT_PAYONEER_SIGNUP = getEndpointUrl('payoneer/');

export const ENDPOINT_PROJECTS = getEndpointUrl('projects/');
export const ENDPOINT_USERS = getEndpointUrl('users/');
export const ENDPOINT_DOCUMENTS = getEndpointUrl('documents/');
export const ENDPOINT_PARTICIPATION = getEndpointUrl('participation/');
export const ENDPOINT_PROGRESS_EVENTS = getEndpointUrl('progress-events/');
export const ENDPOINT_SKILLS = getEndpointUrl('skill/');
export const ENDPOINT_ACTIVITIES = getEndpointUrl('activity/');
export const ENDPOINT_COMMENTS = getEndpointUrl('comments/');
export const ENDPOINT_UPLOADS = getEndpointUrl('uploads/');

export const ENDPOINT_COUNTRIES = getEndpointUrl('countries/');


export const ENDPOINT_MY_APPS = getEndpointUrl('me/app/');

export const ENDPOINT_CHANNEL = getEndpointUrl('channel/');
export const ENDPOINT_DIRECT_CHANNEL = getEndpointUrl('channel/direct/');
export const ENDPOINT_MESSAGE = getEndpointUrl('message/');
export const ENDPOINT_CONNECTION = getEndpointUrl('connection/');
export const ENDPOINT_APPLICATION = getEndpointUrl('application/');
export const ENDPOINT_ESTIMATE = getEndpointUrl('estimate/');
export const ENDPOINT_QUOTE = getEndpointUrl('sprint/');
export const ENDPOINT_SAVED_TASK = getEndpointUrl('saved-task/');
export const ENDPOINT_PROGRESS_REPORT = getEndpointUrl('progress-report/');
export const ENDPOINT_CONTACT_REQUEST = getEndpointUrl('contact-request/');
export const ENDPOINT_SUPPORT_SECTION = getEndpointUrl('support/section/');
export const ENDPOINT_SUPPORT_PAGE = getEndpointUrl('support/page/');
export const ENDPOINT_MEDIUM = getEndpointUrl('medium/');
export const ENDPOINT_OEMBED = getEndpointUrl('oembed/');
export const ENDPOINT_UPLOAD = getEndpointUrl('upload/');
export const ENDPOINT_MULTI_TASK_PAYMENT = getEndpointUrl(
    'multi-task-payment/',
);
export const ENDPOINT_SKILL_PAGE = getEndpointUrl('skill-page/');
export const ENDPOINT_BLOG = getEndpointUrl('blog/');

export function flattenJson(jsonData, key) {
    let flattenedData = {};

    if (jsonData !== null && jsonData !== undefined) {
        if(jsonData instanceof File) {
            if(key) {
                let flattenedUpdate = {};
                flattenedUpdate[key] = jsonData;
                flattenedData = {...flattenedData, ...flattenedUpdate};
            }
        } else if(Array.isArray(jsonData)) {
            if(key && jsonData.length) {
                jsonData.forEach((item, idx) => {
                    flattenedData = {...flattenedData, ...flattenJson(item, `${key}[${idx}]`)};
                });
            }
        } else if (typeof jsonData === 'object') {
            Object.keys(jsonData).forEach(nestedKey => {
                flattenedData = {...flattenedData, ...flattenJson(jsonData[nestedKey], `${key?`${key}${key.endsWith(']')?'':'.'}`:''}${nestedKey}`)};
            });
        } else if(key) {
            let flattenedUpdate = {};
            flattenedUpdate[key] = jsonData;
            flattenedData = {...flattenedData, ...flattenedUpdate};
        }
    }
    return flattenedData;
}

export function composeFormData(jsonData) {
    let flattenedData = flattenJson(jsonData);
    let formData = new FormData();
    Object.keys(flattenedData).forEach(key => {
        formData.append(key, flattenedData[key]);
    });
    return formData;
}

export function cleanSkills(skills) {
    let cleanedData = [];
    if(Array.isArray(skills)) {
        skills.forEach(skill => {
            cleanedData = [...cleanedData, ...cleanSkills(skill)];
        });
    } else if(typeof skills === 'object') {
        cleanedData = [...cleanedData, skills];
    } else if(typeof skills === 'string'){
        skills.split(',').forEach(skill => {
            if(skill) {
                cleanedData = [...cleanedData, {name: skill.trim()}];
            }
        });
    }
    return cleanedData;
}

export const DOC_TYPE_REQUIREMENTS = 'requirements';
export const DOC_TYPE_WIREFRAMES = 'wireframes';
export const DOC_TYPE_ESTIMATE = 'estimate';
export const DOC_TYPE_PROPOSAL = 'proposal';
export const DOC_TYPE_PLANNING = 'planning';
export const DOC_TYPE_TIMELINE = 'timeline';
export const DOC_TYPE_OTHER = 'other';

export const DOCUMENT_TYPES = [
    [DOC_TYPE_REQUIREMENTS, 'Requirements document'],
    [DOC_TYPE_WIREFRAMES, 'Wireframes'],
    [DOC_TYPE_ESTIMATE, 'Estimate'],
    [DOC_TYPE_PROPOSAL, 'Proposal'],
    [DOC_TYPE_PLANNING, 'Planning'],
    [DOC_TYPE_TIMELINE, 'Timeline'],
    [DOC_TYPE_OTHER, 'Other'],
];

let docTypesMap = {};
DOCUMENT_TYPES.map(doc => {
    docTypesMap[doc[0]] = doc[1];
});

export const DOCUMENT_TYPES_MAP = docTypesMap;

export const DOCUMENT_TYPES_CLIENTS = [
    DOC_TYPE_REQUIREMENTS, DOC_TYPE_WIREFRAMES, DOC_TYPE_OTHER
].map(docType => {
    return [docType, DOCUMENT_TYPES_MAP[docType]];
});
