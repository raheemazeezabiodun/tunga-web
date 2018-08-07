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
    return isAdmin() || isPM() || isClient();
}

export function isDevOrClient() {
    return isDev() || isClient();
}

export function isDevOrPM() {
    return isDev() || isPM();
}

export function getMyParticipation(project) {
    let myParticipation = null;
    if(project.participation) {
        (project.participation || []).forEach(item => {
            if(item.user.id === getUser().id) {
                myParticipation = item;
            }
        });
    }
    return myParticipation;
}

export function isPendingProjectParticipant(project) {
    let isPending = false;
    if(isDev()) {
        let myParticipation = getMyParticipation(project);
        if(myParticipation) {
            return myParticipation.status === 'initial'
        }
    }
    return isPending;
}

export function hasProjectAccess(project) {
    let allowedUserIds = [];
    ['user', 'owner', 'pm'].forEach(key => {
        if(project[key]) {
            allowedUserIds.push(project[key].id);
        }
    });
    if(project.participation) {
        project.participation.forEach(item => {
            if(item.status === 'accepted' && item.user) {
                allowedUserIds.push(item.user.id);
            }
        });
    }
    return isAdmin() || allowedUserIds.includes(getUser().id);
}
