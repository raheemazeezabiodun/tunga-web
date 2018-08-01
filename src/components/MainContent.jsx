import React from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import {withProps} from 'recompose';

import OnboardContainer from './onboard/OnboardContainer';
import Dashboard from './dashboard/Dashboard';
import PaymentListContainer from './payments/PaymentListContainer';
import NetworkContainer from './network/NetworkContainer';
import SettingsContainer from './settings/SettingsContainer';
import ProjectsContainer from "./projects/ProjectsContainer";
import UserForm from "./network/UserForm";

const MainContent = ({isLargeDevice=true, className}) => {
    return (
        <div className={`main-content ${className || ''}`}>
            <Switch>
                <Route path='/onboard' component={OnboardContainer}/>
                <Route path='/dashboard' component={withProps({isLargeDevice})(Dashboard)}/>
                <Route path='/projects' component={ProjectsContainer}/>
                {isLargeDevice?(
                    <React.Fragment>
                        <Route path='/network/invite' component={UserForm}/>
                        <Route path='/network' component={NetworkContainer}/>
                        <Route path='/payments' component={PaymentListContainer}/>
                        <Route path='/settings' component={SettingsContainer}/>
                    </React.Fragment>
                ):null}
                <Redirect path="*" to="/dashboard"/>
            </Switch>
        </div>
    )
};

export default MainContent;
