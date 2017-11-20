import React from 'react';
import {Link, NavLink} from 'react-router-dom';

import ProfileContainer from '../containers/ProfileContainer';

import {PROFILE_COMPLETE_PATH} from '../constants/patterns';
import {
  isAdmin,
  isDeveloper,
  isProjectManager,
  isProjectOwner,
} from 'utils/auth';

export default class ProfilePage extends React.Component {
  render() {
    return (
      <div className="profile-form-wrapper form-wrapper">
        {PROFILE_COMPLETE_PATH.test(this.props.location.pathname)
          ? null
          : <div>
              <h2 className="title">Profile</h2>
              <ul className="nav nav-pills nav-top-filter">
                <li role="presentation">
                  <NavLink to="/profile/personal" activeClassName="active">
                    Personal
                  </NavLink>
                </li>
                {isDeveloper() || isProjectManager()
                  ? [
                      <li role="presentation">
                        <NavLink to="/profile/stack" activeClassName="active">
                          Experience
                        </NavLink>
                      </li>,
                      <li role="presentation">
                        <NavLink
                          to="/profile/id-document"
                          activeClassName="active">
                          ID Document
                        </NavLink>
                      </li>,
                      <li role="presentation">
                        <NavLink to="/profile/payment" activeClassName="active">
                          Payment
                        </NavLink>
                      </li>,
                    ]
                  : <li role="presentation">
                      <NavLink to="/profile/company" activeClassName="active">
                        Company Profile
                      </NavLink>
                    </li>}
                <li role="presentation">
                  <NavLink to="/profile/photo" activeClassName="active">
                    Photo
                  </NavLink>
                </li>
                <li role="presentation">
                  <NavLink to="/profile/account" activeClassName="active">
                    Account
                  </NavLink>
                </li>
                <li role="presentation">
                  <NavLink to="/profile/security" activeClassName="active">
                    Security
                  </NavLink>
                </li>
              </ul>
            </div>}
        <div className="form-wrapper">
          <ProfileContainer>
            {this.props.children}
          </ProfileContainer>
        </div>
      </div>
    );
  }
}
