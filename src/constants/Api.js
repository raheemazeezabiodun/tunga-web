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
export const ENDPOINT_PROFILE = getEndpointUrl('me/profile/');
export const ENDPOINT_COMPANY = getEndpointUrl('me/company/');
export const ENDPOINT_NOTIFICATION = getEndpointUrl('me/notification/');
export const ENDPOINT_ACCOUNT_INFO = getEndpointUrl('me/account/');
export const ENDPOINT_ACCOUNT_SETTINGS = getEndpointUrl('me/settings/');
export const ENDPOINT_USER_INFO = getEndpointUrl('me/user/');
export const ENDPOINT_USER_EDUCATION = getEndpointUrl('me/education/');
export const ENDPOINT_USER_WORK = getEndpointUrl('me/work/');
export const ENDPOINT_MY_APPS = getEndpointUrl('me/app/');
export const ENDPOINT_PROJECT = getEndpointUrl('project/');
export const ENDPOINT_TASK = getEndpointUrl('task/');
export const ENDPOINT_USER = getEndpointUrl('user/');
export const ENDPOINT_COMMENT = getEndpointUrl('comment/');
export const ENDPOINT_CHANNEL = getEndpointUrl('channel/');
export const ENDPOINT_DIRECT_CHANNEL = getEndpointUrl('channel/direct/');
export const ENDPOINT_MESSAGE = getEndpointUrl('message/');
export const ENDPOINT_CONNECTION = getEndpointUrl('connection/');
export const ENDPOINT_APPLICATION = getEndpointUrl('application/');
export const ENDPOINT_ESTIMATE = getEndpointUrl('estimate/');
export const ENDPOINT_QUOTE = getEndpointUrl('sprint/');
export const ENDPOINT_SAVED_TASK = getEndpointUrl('saved-task/');
export const ENDPOINT_MILESTONE = getEndpointUrl('progress-event/');
export const ENDPOINT_PROGRESS_REPORT = getEndpointUrl('progress-report/');
export const ENDPOINT_SKILL = getEndpointUrl('skill/');
export const ENDPOINT_COUNTRIES = getEndpointUrl('countries/');
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
export const ENDPOINT_PAYONEER_SIGNUP = getEndpointUrl('payoneer/');
export const ENDPOINT_BLOG = getEndpointUrl('blog/');

export const USER_TYPE_DEVELOPER = 1;
export const USER_TYPE_PROJECT_OWNER = 2;
export const USER_TYPE_PROJECT_MANAGER = 3;

export const USER_TYPE_CHOICES = [
    {id: USER_TYPE_DEVELOPER, name: 'Developer'},
    {id: USER_TYPE_PROJECT_OWNER, name: 'Project Owner'},
    {id: USER_TYPE_PROJECT_MANAGER, name: 'Project Manager'},
];

export const DEVELOPER_FEE = 20;
export const PM_FEE = 40;
export const TUNGA_PERCENTAGE_DEVELOPER = 0.375; // 37.5%
export const TUNGA_PERCENTAGE_PM = 1; // 100%

export const PAYMENT_METHOD_BTC_WALLET = 'btc_wallet';
export const PAYMENT_METHOD_BTC_ADDRESS = 'btc_address';
export const PAYMENT_METHOD_MOBILE_MONEY = 'mobile_money';

export const PAYMENT_METHOD_CHOICES = [
    {id: PAYMENT_METHOD_BTC_WALLET, name: 'Bitcoin Wallet'},
    {id: PAYMENT_METHOD_MOBILE_MONEY, name: 'Mobile Money'},
    {id: PAYMENT_METHOD_BTC_ADDRESS, name: 'Bitcoin Address'},
];

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

export const BTC_WALLET_PROVIDER_COINBASE = 'coinbase';

export const TASK_TYPE_WEB = 1;
export const TASK_TYPE_MOBILE = 2;
export const TASK_TYPE_OTHER = 3;

export const TASK_TYPE_CHOICES = [
    {id: TASK_TYPE_WEB, name: 'Web', icon: 'tunga-icon-web-alt'},
    {id: TASK_TYPE_MOBILE, name: 'Mobile', icon: 'tunga-icon-mobile'},
    {id: TASK_TYPE_OTHER, name: 'Other', icon: 'tunga-icon-other'},
];

export function suggestTaskTypeSkills(type) {
    switch (type) {
        case TASK_TYPE_WEB:
            return {
                selected: ['HTML', 'CSS', 'JavaScript'],
                suggested: [
                    'PHP',
                    'WordPress',
                    'jQuery',
                    'Node.js',
                    'Bootstrap',
                    'React.js',
                    'Angular.js',
                    'Rails',
                    'Django',
                    'express.js',
                ],
            };
        case TASK_TYPE_MOBILE:
            return {
                selected: [],
                suggested: [
                    'Android',
                    'iOS',
                    'Java',
                    'Swift',
                    'React Native',
                    'Apache Cordova',
                    'Ionic',
                ],
            };
        default:
            return {
                selected: [],
                suggested: [
                    'PHP',
                    'Python',
                    'Node.js',
                    'Java',
                    'Ruby',
                    'C#',
                    'API',
                    'Docker',
                    'Heroku',
                    'Amazon Web Services',
                    'Google App Engine',
                    'Microsoft Azure',
                ],
            };
    }
}

export const TASK_SCOPE_TASK = 1;
export const TASK_SCOPE_ONGOING = 2;
export const TASK_SCOPE_PROJECT = 3;

export const TASK_SCOPE_CHOICES = [
    {
        id: TASK_SCOPE_TASK,
        name: 'Task<br/> (up to 12 hours)',
        icon: 'tunga-icon-task',
    },
    {
        id: TASK_SCOPE_PROJECT,
        name: 'Project <br/> (from 13 hours onwards)',
        icon: 'tunga-icon-project',
    },
    {
        id: TASK_SCOPE_ONGOING,
        name: 'Ongoing project<br/> (constant need)',
        icon: 'tunga-icon-running-tasks',
    },
];

export const TASK_SCOPE_QUIZ_CHOICES = [
    {
        id: TASK_SCOPE_TASK,
        name: 'Task<br/> (up to 12 hours)',
        icon: 'tunga-icon-task',
    },
    {
        id: TASK_SCOPE_PROJECT,
        name: 'Project<br/> (more than 50 hours)',
        icon: 'tunga-icon-project',
    },
    {
        id: TASK_SCOPE_ONGOING,
        name: 'Ongoing project<br/> (constant need)',
        icon: 'tunga-icon-running-tasks',
    },
];

export const TASK_SCOPE_CHOICES_NEW_USER = [
    {
        id: TASK_SCOPE_TASK,
        name: 'Task<br/>&lt; 12 hours',
        icon: 'tunga-icon-task',
    },
    {
        id: TASK_SCOPE_PROJECT,
        name: 'Project<br/>&gt; 50 hours',
        icon: 'tunga-icon-project',
    },
    {
        id: TASK_SCOPE_ONGOING,
        name: 'Ongoing project<br/>unlimited',
        icon: 'tunga-icon-running-tasks',
    },
];

export const TASK_BILLING_METHOD_FIXED = 1;
export const TASK_BILLING_METHOD_HOURLY = 2;

export const TASK_BILLING_METHOD_CHOICES = [
    {id: TASK_BILLING_METHOD_FIXED, name: 'I want to pay a fixed fee'},
    {id: TASK_BILLING_METHOD_HOURLY, name: 'I want to pay per actual hour'},
];

export const TASK_CODERS_NEEDED_ONE = 1;
export const TASK_CODERS_NEEDED_MULTIPLE = -1;

export const TASK_CODERS_NEEDED_CHOICES = [
    {id: TASK_CODERS_NEEDED_ONE, name: `I need one coder`},
    {id: TASK_CODERS_NEEDED_MULTIPLE, name: 'I need more than one coder'},
];

export const VISIBILITY_DEVELOPERS = 1;
export const VISIBILITY_MY_TEAM = 2;
export const VISIBILITY_CUSTOM = 3;
export const VISIBILITY_ONLY_ME = 4;

export const TASK_VISIBILITY_CHOICES = [
    {id: VISIBILITY_DEVELOPERS, name: 'All Tunga developers'},
    {id: VISIBILITY_MY_TEAM, name: 'Only my team'},
    {id: VISIBILITY_CUSTOM, name: 'Select developer(s)'},
];

export const SETTINGS_VISIBILITY_CHOICES = [
    {id: VISIBILITY_DEVELOPERS, name: 'All developers'},
    {id: VISIBILITY_MY_TEAM, name: 'Only my team'},
    {id: VISIBILITY_ONLY_ME, name: 'Only me'},
];

export const UPDATE_INTERVAL_UNIT_HOURLY = 1;
export const UPDATE_INTERVAL_UNIT_DAILY = 2;
export const UPDATE_INTERVAL_UNIT_WEEKLY = 3;
export const UPDATE_INTERVAL_UNIT_MONTHLY = 4;
export const UPDATE_INTERVAL_UNIT_QUATERLY = 5;
export const UPDATE_INTERVAL_UNIT_ANNUALLY = 6;

export const UPDATE_SCHEDULE_CHOICES = [
    {number: 1, unit: UPDATE_INTERVAL_UNIT_DAILY, name: 'Daily'},
    {number: 2, unit: UPDATE_INTERVAL_UNIT_DAILY, name: 'Every 2 Days'},
    {number: 3, unit: UPDATE_INTERVAL_UNIT_DAILY, name: 'Every 3 Days'},
    {number: 4, unit: UPDATE_INTERVAL_UNIT_DAILY, name: 'Every 4 Days'},
    {number: 1, unit: UPDATE_INTERVAL_UNIT_WEEKLY, name: 'Weekly'},
];

export const RATING_CRITERIA_CODING = 1;
export const RATING_CRITERIA_COMMUNICATION = 2;
export const RATING_CRITERIA_SPEED = 3;

export const RATING_CRITERIA_CHOICES = [
    {id: RATING_CRITERIA_CODING, name: 'Coding skills'},
    {id: RATING_CRITERIA_COMMUNICATION, name: 'Communication skills'},
    {id: RATING_CRITERIA_SPEED, name: 'Speed'},
];

export const PROGRESS_EVENT_TYPE_DEFAULT = 1;
export const PROGRESS_EVENT_TYPE_PERIODIC = 2;
export const PROGRESS_EVENT_TYPE_MILESTONE = 3;
export const PROGRESS_EVENT_TYPE_SUBMIT = 4;
export const PROGRESS_EVENT_TYPE_COMPLETE = 5;
export const PROGRESS_EVENT_TYPE_PM = 6;
export const PROGRESS_EVENT_TYPE_CLIENT = 7;
export const PROGRESS_EVENT_TYPE_MILESTONE_INTERNAL = 8;
export const PROGRESS_EVENT_TYPE_CLIENT_MID_SPRINT = 9;

export const PROGRESS_REPORT_STATUS_ON_SCHEDULE = 1;
export const PROGRESS_REPORT_STATUS_BEHIND = 2;
export const PROGRESS_REPORT_STATUS_STUCK = 3;

export const PROGRESS_REPORT_STATUS_BEHIND_BUT_PROGRESSING = 4;
export const PROGRESS_REPORT_STATUS_BEHIND_AND_STUCK = 5;

export const PROGRESS_REPORT_STATUS_CHOICES = [
    {id: PROGRESS_REPORT_STATUS_ON_SCHEDULE, name: 'On schedule'},
    {id: PROGRESS_REPORT_STATUS_BEHIND_AND_STUCK, name: 'Behind and Stuck'},
    {
        id: PROGRESS_REPORT_STATUS_BEHIND_BUT_PROGRESSING,
        name: 'Behind but Progressing',
    },
];

export const INTEGRATION_TYPE_REPO = 1;
export const INTEGRATION_TYPE_ISSUE = 2;

export const INTEGRATION_TYPE_CHOICES = [
    {id: INTEGRATION_TYPE_REPO, name: 'Repository'},
    {id: INTEGRATION_TYPE_ISSUE, name: 'Issue'},
];

export const INTEGRATION_EVENT_PUSH = 'push';
export const INTEGRATION_EVENT_BRANCH = 'branch';
export const INTEGRATION_EVENT_TAG = 'tag';
export const INTEGRATION_EVENT_COMMIT_COMMENT = 'commit_comment';
export const INTEGRATION_EVENT_PULL_REQUEST = 'pull_request';
export const INTEGRATION_EVENT_PULL_REQUEST_COMMENT = 'pull_request_comment';
export const INTEGRATION_EVENT_ISSUE = 'issue';
export const INTEGRATION_EVENT_ISSUE_COMMENT = 'issue_comment';
export const INTEGRATION_EVENT_WIKI = 'wiki';
export const INTEGRATION_EVENT_RELEASE = 'release';

export const INTEGRATION_EVENT_COMMUNICATION = 'communication';
export const INTEGRATION_EVENT_PROGRESS = 'progress';
export const INTEGRATION_EVENT_APPLICATION = 'application';

export const GIT_INTEGRATION_EVENT_CHOICES = [
    {id: INTEGRATION_EVENT_PUSH, name: 'Push events'},
    {id: INTEGRATION_EVENT_BRANCH, name: 'Branch creation and deletion'},
    {id: INTEGRATION_EVENT_TAG, name: 'Tag creation and deletion'},
    {id: INTEGRATION_EVENT_COMMIT_COMMENT, name: 'Commit comments'},
    {id: INTEGRATION_EVENT_PULL_REQUEST, name: 'Pull requests'},
    {id: INTEGRATION_EVENT_PULL_REQUEST_COMMENT, name: 'Pull request comments'},
    {id: INTEGRATION_EVENT_ISSUE, name: 'Issue creation and modification'},
    {id: INTEGRATION_EVENT_ISSUE_COMMENT, name: 'Issue comments'},
    {id: INTEGRATION_EVENT_WIKI, name: 'Wiki updates'},
];

export const CHAT_INTEGRATION_EVENT_CHOICES = [
    {id: INTEGRATION_EVENT_COMMUNICATION, name: 'Comments and file uploads'},
    {
        id: INTEGRATION_EVENT_PROGRESS,
        name: 'Progress reports and milestone updates',
    },
    {
        id: INTEGRATION_EVENT_APPLICATION,
        name: 'Developer applications and invitations',
    },
];

export const TASK_PAYMENT_METHOD_BITONIC = 'bitonic';
export const TASK_PAYMENT_METHOD_BITCOIN = 'bitcoin';
export const TASK_PAYMENT_METHOD_BANK = 'bank';
export const TASK_PAYMENT_METHOD_STRIPE = 'stripe';

export const TASK_PAYMENT_METHOD_CHOICES = [
    {
        id: TASK_PAYMENT_METHOD_STRIPE,
        name: 'Pay with Card',
        meta: '2.9% payment fee + €0.25',
        icon_class: 'fa fa-cc-stripe',
        details: 'Click continue to pay with your credit/debit card on Stripe.',
    },
    /*{
    id: TASK_PAYMENT_METHOD_BITONIC,
    name: 'Pay with iDeal (NL)',
    meta: '3% payment fee',
    icon_class: 'tunga-icon-iDeal',
    details:
      'Our payment partner Bitonic makes it possible to send bitcoins to our developers in Africa. Tunga uses Bitcoin because it is the easiest and fastest way of sending money to Africa. Our developers in Africa can very conveniently convert the received Bitcoin to local currency. if you continue with paying with iDeal you will be directed to the website of Bitonic where you can complete the payment. Note: When it is your first time paying via Bitonic you need to verify your bank account. This process will take less than a minute. ',
  },
  {
    id: TASK_PAYMENT_METHOD_BITCOIN,
    name: 'Pay with BitCoin',
    meta: 'No payment fee',
    icon_class: 'fa fa-bitcoin',
    details:
      'Click continue to view the BTC address the payment needs to be sent to or scan our QR code.',
  },*/
    {
        id: TASK_PAYMENT_METHOD_BANK,
        name: 'Pay by bank transfer via invoice',
        meta: '5% payment fee',
        icon_class: 'fa fa-bank',
        details:
            'Click continue to be able to download the invoice. Please make the payment within a week. To be able to perform a bank transfer you need to fill in VAT number on your profile.',
    },
];

export const CHANNEL_TYPES = {
    direct: 1,
    topic: 2,
    support: 3,
    developer: 4,
};

export const OFFER_REQUEST_ITEMS = {
    self_guided: 'self_guided',
    onboarding: 'onboarding',
    onboarding_special: 'onboarding_special',
    project: 'project',
};

export const OFFER_ITEM_NAMES = {
    self_guided: 'Do-it-yourself',
    onboarding: 'Intensive Guidance & Support',
    onboarding_special: 'Onboarding Special Offer',
    project: 'Dedicated Monitor & Troubleshooter',
};

export const TASK_DOCUMENT_TYPES = {
    estimate: 'Estimate',
    proposal: 'Proposal',
    planning: 'Planning',
    requirements: 'Requirements Document',
    wireframes: 'Wireframes',
    timeline: 'Timeline',
    other: 'Other',
};
