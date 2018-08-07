import {
    USER_TYPE_PROJECT_OWNER,
    USER_TYPE_DEVELOPER,
    PROJECT_TYPE_WEB,
    PROJECT_TYPE_MOBILE,
    PROJECT_TYPE_OTHER,
    PROJECT_DURATION_2_WEEKS,
    PROJECT_DURATION_6_MONTHS,
    PROJECT_DURATION_PERMANENT,
} from './api';

export const TWITTER_SIGNUP_EVENT_CODE = __PRODUCTION__ ? 'nve6f' : null;

export const AUTH_METHODS = {
    EMAIL: 'Email',
    FACEBOOK: 'Facebook',
    GOOGLE: 'Google',
    GITHUB: 'GitHub',
};

export const USER_TYPES = {
    CLIENT: 'client',
    DEVELOPER: 'developer',
};

export const GA_COMMANDS = {
    SEND: 'send',
};

export const GA_HIT = {
    PAGE_VIEW: 'pageview',
    EVENT: 'event',
};

export const GA_EVENT_CATEGORIES = {
    AUTH: 'Authentication',
    REGISTRATION: 'Registration',
    PROFILE: 'Profile',
    COMPANY: 'Company',
    TASK: 'Task',
    BATCH_PAY: 'Batch Pay',
    CONTACT: 'Contact',
    VIDEO: 'Video',
    MESSAGE: 'Message',
    CHAT: 'Chat',
};

export const GA_EVENT_ACTIONS = {
    SIGN_IN: 'Sign In',
    SIGN_UP: 'Sign Up',
    BROWSE_DEVS: 'Browse Developers',
    LOG_OUT: 'Log Out',
    CHANGE_PASSWORD: 'Change Password',
    RECOVER_PASSWORD: 'Recover Password',
    RECOVER_PASSWORD_CONFIRM: 'Recover Password Confirm',
    DEV_APPLY: 'Developer Apply',
    DEV_INVITE: 'Invite Developer',
    PLAY: 'Play',
    PAUSE: 'Pause',
    CREATE: 'Create',
    UPDATE: 'Update',
    APPLY: 'Apply',
    INTEGRATE: 'Integrate',
    INVOICE: 'Invoice',
    RATE: 'Rate',
    SCHEDULE_CALL: 'Schedule Call',
    REQUEST_OFFER: 'Request Offer',
    SEND: 'Send',
    PAY: 'Pay',
    START: 'Start',
    UPLOAD_DOCUMENT: 'Upload Document',
};

export const GA_EVENT_LABELS = {
    DEVELOPER: 'Developer',
    CLIENT: 'Client',
    ADMIN: 'Admin',
    ANONYMOUS: 'Anonymous',
    INTRO_VIDEO: 'Intro Video',
    INTRO_VIDEO_STORY: 'Intro Video: Story',
};

export function getUserTypeTwitter(type) {
    switch (type) {
        case USER_TYPE_PROJECT_OWNER:
            return 'client';
        case USER_TYPE_DEVELOPER:
            return 'developer';
        default:
            return null;
    }
}

export function getGAUserType(user) {
    if (user && user.id) {
        if (user.is_staff || user.is_superuser) {
            return 'Admin';
        }
        switch (user.type) {
            case USER_TYPE_PROJECT_OWNER:
                return 'Client';
            case USER_TYPE_DEVELOPER:
                return 'Developer';
            default:
                return 'Unknown';
        }
    } else {
        return 'Anonymous';
    }
}

export function sendGAEvent(category, action, label) {
    if (window.ga) {
        window.ga(
            GA_COMMANDS.SEND,
            GA_HIT.EVENT,
            category || null,
            action || null,
            label || null,
        );
    } else {
        console.log(
            'GA Page View',
            GA_COMMANDS.SEND,
            GA_HIT.EVENT,
            category || null,
            action || null,
            label || null,
        );
    }
}

export function sendGAPageView(url) {
    if (window.ga) {
        window.ga('send', 'pageview', url);
    } else {
        console.log('GA Page View', url);
    }
}

export function sendTwitterSignUpEvent(data) {
    if (window.twttr) {
        window.twttr.conversion.trackPid(TWITTER_SIGNUP_EVENT_CODE, data);
    }
}

export const TASK_TYPE_CHOICES_URL = {1: 'web', 2: 'mobile', 3: 'other'};

export function getTaskTypeUrl(type) {
    switch (type) {
        case PROJECT_TYPE_MOBILE:
            return 'mobile';
        case PROJECT_TYPE_WEB:
            return 'web';
        case PROJECT_TYPE_OTHER:
            return 'other';
        default:
            return null;
    }
}

export function getScopeUrl(type) {
    switch (type) {
        case PROJECT_DURATION_2_WEEKS:
            return 'task';
        case PROJECT_DURATION_6_MONTHS:
            return 'project';
        case PROJECT_DURATION_PERMANENT:
            return 'ongoing';
        default:
            return null;
    }
}

