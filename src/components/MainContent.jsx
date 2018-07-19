import React from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';

import OnboardContainer from './onboard/OnboardContainer';
import PaymentsList from './payments/PaymentsList';
import NetworkContainer from './network/NetworkContainer';
import SettingsContainer from './settings/SettingsContainer';
import ProjectsContainer from "./projects/ProjectsContainer";
import UserForm from "./network/UserForm";

const MainContent = () => {
    return (
        <div className='main-content'>
            <Switch>
                <Redirect exact from='/payments' to='/payments/filter/pending-in'/>
                <Route path='/onboard' component={OnboardContainer}/>
                <Route path='/projects' component={ProjectsContainer}/>
                <Route path='/network/invite' component={UserForm}/>
                <Route path='/network' component={NetworkContainer}/>
                <Route path='/payments' component={PaymentsList}/>
                <Route path='/settings' component={SettingsContainer}/>
            </Switch>
        </div>
    )
};

export default MainContent;
