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
export const ENDPOINT_NOTIFICATIONS = getEndpointUrl('me/notification/');
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
export const ENDPOINT_PROGRESS_REPORTS = getEndpointUrl('progress-reports/');
export const ENDPOINT_SKILLS = getEndpointUrl('skill/');
export const ENDPOINT_ACTIVITIES = getEndpointUrl('activity/');
export const ENDPOINT_COMMENTS = getEndpointUrl('comments/');
export const ENDPOINT_CHANNELS = getEndpointUrl('channels/');
export const ENDPOINT_MESSAGES = getEndpointUrl('messages/');
export const ENDPOINT_UPLOADS = getEndpointUrl('uploads/');
export const ENDPOINT_INVOICES = getEndpointUrl('invoices/');

export const ENDPOINT_COUNTRIES = getEndpointUrl('countries/');

export const ENDPOINT_CONTACT_REQUEST = getEndpointUrl('contact-request/');
export const ENDPOINT_MEDIUM = getEndpointUrl('medium/');
export const ENDPOINT_OEMBED = getEndpointUrl('oembed/');
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

export const USER_TYPE_DEVELOPER = 1;
export const USER_TYPE_PROJECT_OWNER = 2;
export const USER_TYPE_PROJECT_MANAGER = 3;

export const USER_TYPE_CHOICES = [
    {id: USER_TYPE_DEVELOPER, name: 'Developer'},
    {id: USER_TYPE_PROJECT_OWNER, name: 'Project Owner'},
    {id: USER_TYPE_PROJECT_MANAGER, name: 'Project Manager'},
];

export const PROJECT_TYPE_WEB = 'web';
export const PROJECT_TYPE_MOBILE = 'mobile';
export const PROJECT_TYPE_OTHER = 'other';

export const PROJECT_DURATION_2_WEEKS = '2w';
export const PROJECT_DURATION_6_MONTHS = '6m';
export const PROJECT_DURATION_PERMANENT = 'permanent';

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

export const REPORT_STATUS_ON_SCHEDULE = 'on_schedule';
export const REPORT_STATUS_BEHIND = 'behind';
export const REPORT_STATUS_STUCK = 'stuck';
export const REPORT_STATUS_BEHIND_BUT_PROGRESSING = 'behind_progressing';
export const REPORT_STATUS_BEHIND_AND_STUCK = 'behind_stuck';

export const REPORT_STATUSES = [
    [REPORT_STATUS_ON_SCHEDULE,'On schedule'],
    [REPORT_STATUS_BEHIND_AND_STUCK, 'Behind and Stuck'],
    [REPORT_STATUS_BEHIND_BUT_PROGRESSING, 'Behind but Progressing'],
];

export const REPORT_STUCK_RESOLVING_ERROR = 'resolving_error';
export const REPORT_STUCK_POOR_DOC = 'poor_doc';
export const REPORT_STUCK_HARDWARE_PROBLEM = 'hardware_problem';
export const REPORT_STUCK_UNCLEAR_SPEC = 'unclear_spec';
export const REPORT_STUCK_PERSONAL_ISSUE = 'personal_issue';
export const REPORT_STUCK_OTHER = 'other';

export const REPORT_STUCK_REASONS = [
    [REPORT_STUCK_RESOLVING_ERROR, 'Resolving an error'],
    [REPORT_STUCK_POOR_DOC, 'Poor documentation'],
    [REPORT_STUCK_HARDWARE_PROBLEM, 'Hardware problem'],
    [REPORT_STUCK_UNCLEAR_SPEC, 'Unclear specification'],
    [REPORT_STUCK_PERSONAL_ISSUE, 'Personal circumstances'],
    [REPORT_STUCK_OTHER, 'Other']
];

export const PROGRESS_EVENT_TYPE_MILESTONE = 'milestone';
export const PROGRESS_EVENT_TYPE_DEVELOPER = 'developer';
export const PROGRESS_EVENT_TYPE_PM = 'pm';
export const PROGRESS_EVENT_TYPE_CLIENT = 'client';
export const PROGRESS_EVENT_TYPE_MILESTONE_INTERNAL = 'internal';
export const PROGRESS_EVENT_TYPE_CLIENT_MID_SPRINT = 9;

export const LEGACY_PROGRESS_EVENT_TYPE_DEFAULT = 1;
export const LEGACY_PROGRESS_EVENT_TYPE_PERIODIC = 2;
export const LEGACY_PROGRESS_EVENT_TYPE_MILESTONE = 3;
export const LEGACY_PROGRESS_EVENT_TYPE_SUBMIT = 4;
export const LEGACY_PROGRESS_EVENT_TYPE_COMPLETE = 5;
export const LEGACY_PROGRESS_EVENT_TYPE_PM = 6;
export const LEGACY_PROGRESS_EVENT_TYPE_CLIENT = 7;
export const LEGACY_PROGRESS_EVENT_TYPE_MILESTONE_INTERNAL = 8;
export const LEGACY_PROGRESS_EVENT_TYPE_CLIENT_MID_SPRINT = 9;

export const SLACK_SHARE_COMMENTS = 'slack_share_tunga_comments';
export const SLACK_SHARE_DOCS = 'slack_share_tunga_docs';
export const SLACK_SHARE_REPORTS = 'slack_share_tunga_reports';

export const SLACK_SHARE_EVENTS = [
    [SLACK_SHARE_COMMENTS, 'Comments'],
    [SLACK_SHARE_DOCS, 'Documents and uploads'],
    [SLACK_SHARE_REPORTS, 'Progress reports']
];

export const INVOICE_TYPE_SALE = 'sale';
export const INVOICE_TYPE_PURCHASE = 'purchase';

export const PAYMENT_TYPE_SALE = 'sale';
export const PAYMENT_TYPE_PURCHASE = 'purchase';


export const STATUS_INITIAL = 'initial';
export const STATUS_PENDING = 'pending';
export const STATUS_INITIATED = 'initiated';
export const STATUS_SUBMITTED = 'submitted';
export const STATUS_PROCESSING = 'processing';
export const STATUS_COMPLETED = 'completed';
export const STATUS_FAILED = 'failed';
export const STATUS_ACCEPTED = 'accepted';
export const STATUS_REJECTED = 'rejected';
export const STATUS_APPROVED = 'approved';
export const STATUS_DECLINED = 'declined';

export const CHANNEL_TYPES = {
    direct: 1,
    topic: 2,
    support: 3,
    developer: 4,
};
