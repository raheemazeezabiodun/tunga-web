import React from 'react';
import {Link} from 'react-router';

import ProfileContainer from '../containers/ProfileContainer';

import {PROFILE_COMPLETE_PATH} from '../constants/patterns';
import {
    isAdmin,
    isDeveloper,
    isProjectManager,
    isProjectOwner,
} from '../utils/auth';

export default class ProfilePage extends React.Component {
    render() {
        return (
            <div className="profile-form-wrapper form-wrapper">
                {PROFILE_COMPLETE_PATH.test(
                    this.props.location.pathname,
                ) ? null : (
                    <div>
                        <h2 className="title">Profile</h2>
                        <ul className="nav nav-pills nav-top-filter">
                            <li role="presentation">
                                <Link
                                    to="/profile/personal"
                                    activeClassName="active">
                                    Personal
                                </Link>
                            </li>
                            {isDeveloper() || isProjectManager() ? (
                                [
                                    <li role="presentation">
                                        <Link
                                            to="/profile/stack"
                                            activeClassName="active">
                                            Experience
                                        </Link>
                                    </li>,
                                    <li role="presentation">
                                        <Link
                                            to="/profile/id-document"
                                            activeClassName="active">
                                            ID Document
                                        </Link>
                                    </li>,
                                    <li role="presentation">
                                        <Link
                                            to="/profile/payment"
                                            activeClassName="active">
                                            Payment
                                        </Link>
                                    </li>,
                                ]
                            ) : (
                                <li role="presentation">
                                    <Link
                                        to="/profile/company"
                                        activeClassName="active">
                                        Company Profile
                                    </Link>
                                </li>
                            )}
                            <li role="presentation">
                                <Link
                                    to="/profile/photo"
                                    activeClassName="active">
                                    Photo
                                </Link>
                            </li>
                            <li role="presentation">
                                <Link
                                    to="/profile/account"
                                    activeClassName="active">
                                    Account
                                </Link>
                            </li>
                            <li role="presentation">
                                <Link
                                    to="/profile/security"
                                    activeClassName="active">
                                    Security
                                </Link>
                            </li>
                        </ul>
                    </div>
                )}
                <div className="form-wrapper">
                    <ProfileContainer>{this.props.children}</ProfileContainer>
                </div>
            </div>
        );
    }
}
