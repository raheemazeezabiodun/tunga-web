import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import querystring from 'querystring';

import connect from '../../connectors/ProfileConnector';

import Profile from './Profile';
import CompanyProfile from './CompanyProfile';
import CompanyDetails from './CompanyDetails';
import Experience from './Experience';
import Payment from './Payment';
import Account from './Account';
import Privacy from './Privacy';

const SettingsContainer = (props) => {
    let settingsProps = {
        user: props.Auth.user,
        isRetrieving: props.Profile.isRetrieving,
        isSaving: props.Profile.isSaving,
        isSaved: props.Profile.isSaved,
        errors: props.Profile.errors,
        ProfileActions: props.ProfileActions,
    };

    const queryParams = querystring.parse((props.location.search || '').replace('?', ''));

    return (
        <div className="content-card settings-card settings-container clearfix">
            <Switch>
                <Redirect exact from='/settings' to='/settings/profile'/>
                {[
                    ['profile', <Profile {...settingsProps}/>],
                    ['company-profile', <CompanyProfile {...settingsProps}/>],
                    ['company-details', <CompanyDetails {...settingsProps}/>],
                    ['experience', <Experience {...settingsProps}/>],
                    ['payment', <Payment user={props.Auth.user} status={queryParams.status} message={queryParams.message}/>],
                    ['account', <Account {...settingsProps}/>],
                    ['privacy', <Privacy {...settingsProps}/>],
                ].map(path => {
                    return (
                        <Route key={`settings-container-path--${path}`} path={`/settings/${path[0]}`} render={props => path[1]}/>
                    );
                })}
            </Switch>
        </div>
    );
};

export default connect(SettingsContainer);
