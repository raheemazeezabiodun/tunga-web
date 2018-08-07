export const AUTHED_ONLY = 'authedOnly';
export const UNAUTHED_ONLY = 'unauthedOnly';
export const AUTHED_OR_EMAIL_ONLY = 'authedOrEmailOnly';

export const CALENDLY_CALL_URL = 'https://calendly.com/tunga/hello/';
import {
    sendGAEvent,
    GA_EVENT_CATEGORIES,
    GA_EVENT_ACTIONS,
} from '../utils/tracking';

export function requiresAuth(routes) {
    return getRouteParamValues(AUTHED_ONLY, routes).indexOf(true) > -1;
}

export function requiresNoAuth(routes) {
    return getRouteParamValues(UNAUTHED_ONLY, routes).indexOf(true) > -1;
}

export function requiresAuthOrEmail(routes) {
    return (
        getRouteParamValues(
            [AUTHED_ONLY, AUTHED_OR_EMAIL_ONLY],
            routes,
        ).indexOf(true) > -1
    );
}

export function getRouteParamValues(keys, routes) {
    var paramValues = [];
    if (routes) {
        var targetKeys = keys;
        if (!Array.isArray(keys)) {
            targetKeys = [keys];
        }

        targetKeys.forEach(function(key) {
            paramValues = paramValues.concat(
                routes.map(function(route) {
                    return route[key];
                }),
            );
        });
    }
    return paramValues;
}

export function getRouteCrumb(routes, section) {
    if (Array.isArray(routes) && routes.length) {
        var x;
        for (x = routes.length - 1; x >= 0; x--) {
            let route = routes[x];
            if (route.crumbs && route.crumbs[section]) {
                return route.crumbs[section];
            }
            if (route.crumb) {
                return route.crumb;
            }
        }
    }
    return null;
}

export function showWizard(routes) {
    if (Array.isArray(routes) && routes.length) {
        var x;
        for (x = routes.length - 1; x >= 0; x--) {
            let route = routes[x];
            if (route.showTaskWizard) {
                return route.showTaskWizard;
            }
        }
    }
    return false;
}

export function showCallWidget(routes) {
    if (Array.isArray(routes) && routes.length) {
        var x;
        for (x = routes.length - 1; x >= 0; x--) {
            let route = routes[x];
            if (route.showCallWidget) {
                return route.showCallWidget;
            }
        }
    }
    return false;
}

export function openCalendlyWidget(url = CALENDLY_CALL_URL) {
    Calendly.showPopupWidget(url);
    sendGAEvent(GA_EVENT_CATEGORIES.CONTACT, GA_EVENT_ACTIONS.SCHEDULE_CALL);
}

export const TUNGA_DOMAINS = [
    'localhost',
    '127.0.0.1',
    'tunga.io',
    'www.tunga.io',
    'test.tunga.io',
    'stage.tunga.io',
    'sandbox.tunga.io',
];

export function isTungaDomain() {
    return TUNGA_DOMAINS.indexOf(window.location.hostname) > -1;
}

export function proxySafeUrl(path) {
    return `${isTungaDomain()?'':'/tunga'}${path}`;
}
