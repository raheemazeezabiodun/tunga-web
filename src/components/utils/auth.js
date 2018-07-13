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

export function isDeveloper() {
    return getUser().is_developer;
}

export function isProjectOwner() {
    return getUser().is_project_owner;
}

export function isProjectManager() {
    return getUser().is_project_manager;
}

export function isAdminOrProjectOwner() {
    return isAdmin() || isProjectOwner();
}

export function isAdminOrProjectManager() {
    return isAdmin() || isProjectManager();
}
