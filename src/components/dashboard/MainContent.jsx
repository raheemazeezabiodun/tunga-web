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
import Info from "../core/Info";
import WorkRedirect from "./projects/WorkRedirect";

import {getUser} from "../utils/auth";

export default ({isLargeDevice=true, className}) => {
    return (
        <div className={`main-content ${className || ''}`}>
            <Switch>
                {'proposal'.split('|').map(path => {
                    return (
                        <Route key={`app-path--${path}`} path={`/${path}`} render={props => <div>
                            <Info message="This part of Tunga is being updated. Please check back in a bit."/>
                            <p>For urgent matters, please use the chat function.</p>
                        </div>}/>
                    );
                })}
                <Route path='/onboard' component={OnboardContainer}/>
                {getUser().can_contribute?(
                    [
                        <Route key='dashboard' path='/dashboard' component={withProps({isLargeDevice})(Dashboard)}/>,
                        <Route key='projects' path='/projects' component={ProjectsContainer}/>,
                        ['/work/:taskId', '/work/:taskId/event/:eventId'].map(path => {
                            return (
                                <Route key={`app-path--${path}`} exact path={path} render={props =>
                                    <WorkRedirect {...props}
                                                  taskId={props.match.params.taskId}
                                                  eventId={props.match.params.eventId}
                                    />}
                                />
                            );
                        }),
                        <Redirect from="work" to="projects"/>,
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

