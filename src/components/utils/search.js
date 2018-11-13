import * as Cookies from "js-cookie";
import freeEmailDomains from "../../utils/free-email-domains";

export function getNumSearches() {
    return parseInt(Cookies.get('numSearches')) || 0;
}

export function updateSearches() {
    const searches = getNumSearches() + 1;
    Cookies.set('numSearches', searches);
}

export function getNumDevViews() {
    return parseInt(Cookies.get('numDevViews')) || 0;
}

export function updateDevViews() {
    const searches = getNumDevViews() + 1;
    Cookies.set('numDevViews', searches);
}

export function isBusinessEmail(email) {
    console.log(freeEmailDomains);
    const [match, domain] = (email || '').match(/[A-Z0-9._%+-]+@([A-Z0-9.-]+\.[A-Z]{2,})/i) || [];
    if(!domain) {
        return false;
    }
    return !freeEmailDomains.includes(domain);
}
