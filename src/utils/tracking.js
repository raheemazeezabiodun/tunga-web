import React from 'react';
import moment from 'moment';
import * as Cookies from "js-cookie";

import CookieSettings from '../components/CookieSettings';

import {
    USER_TYPE_PROJECT_OWNER,
    USER_TYPE_DEVELOPER,
    TASK_TYPE_WEB,
    TASK_TYPE_MOBILE,
    TASK_TYPE_OTHER,
    TASK_SCOPE_TASK,
    TASK_SCOPE_PROJECT,
    TASK_SCOPE_ONGOING,
} from '../constants/Api';
import confirm from "./confirm";

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
        case TASK_TYPE_MOBILE:
            return 'mobile';
        case TASK_TYPE_WEB:
            return 'web';
        case TASK_TYPE_OTHER:
            return 'other';
        default:
            return null;
    }
}

export function getScopeUrl(type) {
    switch (type) {
        case TASK_SCOPE_TASK:
            return 'task';
        case TASK_SCOPE_PROJECT:
            return 'project';
        case TASK_SCOPE_ONGOING:
            return 'ongoing';
        default:
            return null;
    }
}

export const COOKIE_OPTIONS = [
    [
        'essential', 'Essential Website Cookies',
        'These cookies are strictly necessary to provide you with services available through our website and to use some of its features, such as logging in, filling forms and setting your privacy settings.\nBecause these cookies are strictly necessary to deliver the website, you cannot refuse them without impacting how our website functions.',
        true, true,
        [
            ['Tunga', 'https://tunga.io', 'These cookies are strictly necessary to provide you with services through Tunga', ['sessionid', 'csrftoken', 'taskEditToken', 'cookieConsent', 'cookieConsentClosedAt']],
            ['Google Tag Manager', 'https://www.google.com/analytics/tag-manager/', 'This cookie is associated with Google Tag Manager which we use to load scripts into our website pages.', ['_dc_gtm_UA-70644715-1']]
        ]
    ],
    [
        'perf_func', 'Performance and Functionality Cookies',
        'These cookies are used to enhance the performance and functionality of our websites but are non-essential to their use. However, without these cookies, certain functionality may become unavailable.',
        true, false,
        [
            ['Tunga', 'https://tunga.io', 'These cookies are used to enhance the performance and functionality of our website but are not essential to its use.', ['chatAutoOpenAt']],
        ]
    ],
    [
        'analytics_custom', 'Analytics and Customization Cookies', 'These cookies collect information that is used either in aggregate form to help us understand how our website is being used or how effective our marketing campaigns are, or to help us customize our website for you in order to enhance your experience.',
        true, false,
        [
            ['Google Analytics', 'https://analytics.google.com/analytics/web/', 'Google Analytics gathers information allowing us to understand interactions with our websites and ultimately refine that experience to better serve you.', ['_gat', '_ga', '_gid']],
            ['Hotjar', 'https://www.hotjar.com/', 'Hotjar gathers information allowing us to understand interactions with our websites and ultimately refine that experience to better serve you.', ['_hj*']],
            ['Optimizely', 'https://www.optimizely.com/', 'Optimizely is a testing and experimentation platform that helps us uncover customer insights and create optimal web experiences.', ['optimizelyDomainTestCookie', 'optimizelyEndUserId']],
        ]
    ],
    [
        'target_advert', 'Targeting and Advertising Cookies',
        'These cookies are used to make advertising messages more relevant to you and your interests. They also perform functions like preventing the same ad from continuously reappearing, ensuring that ads are properly displayed, and in some cases selecting advertisements that are based on your interests.',
        true, false
    ]
];

export function setCookieConsent(consentDetails) {
    Cookies.set('cookieConsent', `${moment.utc().format()}|${consentDetails.join('|')}`, { expires: 365 });
}

export function getCookieConsent() {
    return Cookies.get('cookieConsent');
}

export function removeCookieConsent() {
    Cookies.remove('cookieConsent');
}

export function setCookieConsentCloseAt() {
    Cookies.set('cookieConsentClosedAt', moment.utc().format(), { expires: 365 });
}

export function getCookieConsentCloseAt() {
    return Cookies.get('cookieConsentClosedAt');
}

export function parseDefaultConsents() {
    let currentConsents = [], currentConsentCookie = getCookieConsent();
    if(currentConsentCookie) {
        currentConsentCookie.split('|').forEach((category, idx) => {
            if(idx !== 0 && !moment.utc(category).isValid()) {
                currentConsents.push(category);
            }
        })
    } else {
        COOKIE_OPTIONS.forEach(category => {
            if(category[3] && !category[4]) {
                currentConsents.push(category[0]);
            }
        });
    }
    return currentConsents;
}

export function openCookieConsentPopUp(onSave, onCancel) {
    let cookieConsents = parseDefaultConsents();

    function onConsentChange(consents) {
        cookieConsents = consents;
    }

    confirm(
        <CookieSettings onChange={onConsentChange}/>,
        false,
        {ok: 'Save Settings', mustRespond: false, heading: (<h3>Cookie Settings</h3>)},
    ).then(
        function() {
            setCookieConsent(cookieConsents);
            setCookieConsentCloseAt();

            if(onSave) {
                onSave(cookieConsents);
            }
        },
        function() {
            if(onCancel) {
                onCancel();
            }
        },
    );
}
