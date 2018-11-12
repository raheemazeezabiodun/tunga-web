import * as Cookies from "js-cookie";

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
