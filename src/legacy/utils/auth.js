import React from 'react';
import store from '../store';

import ProfileContainer from '../containers/ProfileContainer';
import ProfileForm from '../components/ProfileForm';

import createModal from '../components/Modal';

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
    return user.is_staff || user.is_superuser;
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

export function openProfileWizard(options = {}) {
    return createModal(
        <div className="task-wizard">
            <div>
                <div className="title-bar">
                    <h2 className="title text-center">Complete your profile</h2>
                </div>
                <ProfileContainer>
                    <ProfileForm options={options} />
                </ProfileContainer>
            </div>
            <div className="clearfix" />
        </div>,
        null,
        null,
        {className: 'profile-form-dialog', bsStyle: 'lg'},
    );
}
