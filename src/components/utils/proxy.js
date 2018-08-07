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
