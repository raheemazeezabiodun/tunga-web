import store from '../../store';

export function getAuth() {
    return store.getState().Auth;
}

export function getUser() {
    return getAuth().user;
}

export function isAuthenticated() {
    return getAuth().isAuthenticated;
}

export function getUserType() {
    return getUser().type || null;
}

export function isAdmin() {
    let user = getUser();
    return user.is_admin;
}

export function isDev() {
    return getUser().is_developer;
}

export function isClient() {
    return getUser().is_project_owner;
}

export function isPM() {
    return getUser().is_project_manager;
}

export function isAdminOrClient() {
    return isAdmin() || isClient();
}

export function isAdminOrPM() {
    return isAdmin() || isPM();
}

export function isAdminOrPMOrClient() {
    return isAdmin() || isClient();
}
