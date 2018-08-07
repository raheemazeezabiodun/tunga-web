import React from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import {withProps} from 'recompose';

import OnboardContainer from './onboard/OnboardContainer';
import Dashboard from './Dashboard';
import PaymentListContainer from './payments/PaymentListContainer';
import NetworkContainer from './network/NetworkContainer';
import SettingsContainer from './settings/SettingsContainer';
import ProjectsContainer from "./projects/ProjectsContainer";
import UserForm from "./network/UserForm";
import {getUser} from "../utils/auth";

const MainContent = ({isLargeDevice=true, className}) => {
    return (
        <div className={`main-content ${className || ''}`}>
            <Switch>
                <Route path='/onboard' component={OnboardContainer}/>
                {getUser().can_contribute?(
                    [
                        <Route key='dashboard' path='/dashboard' component={withProps({isLargeDevice})(Dashboard)}/>,
                        <Route key='projects' path='/projects' component={ProjectsContainer}/>,
                        ...(isLargeDevice?(
                            [
                                <Route key='network-invite' path='/network/invite' component={UserForm}/>,
                                <Route key='network' path='/network' component={NetworkContainer}/>,
                                <Route key='payments' path='/payments' component={PaymentListContainer}/>,
                                <Route key='settings' path='/settings' component={SettingsContainer}/>
                            ]
                        ):[]),
                        <Redirect key='dashboard-redirect' path="*" to="/dashboard"/>
                    ]
                ):(
                    <Redirect path="*" to="/onboard"/>
                )}
            </Switch>
        </div>
    )
};

export default MainContent;
