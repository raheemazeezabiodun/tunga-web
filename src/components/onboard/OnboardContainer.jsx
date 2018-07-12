import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import connect from '../../connectors/ProfileConnector';

import Intro from './Intro';
import StepOne from './StepOne';
import StepTwo from './StepTwo';
import StepThree from './StepThree';
import Finish from './Finish';

const OnboardContainer = (props) => {
    let onboardProps = {
        user: props.Auth.user,
        isSaving: props.Profile.isSaving,
        isSaved: props.Profile.isSaved,
        errors: props.Profile.errors,
        ProfileActions: props.ProfileActions,
        history: props.history
    };
    return (
        <div className="onboard-card">
            <div className="onboard-title">
                <Switch>
                    <Route path="/onboard/finish" render={props => { return 'Thank you for filling in your profile' }}/>
                    <Route path="/onboard/*" render={props => { return "Let's set up your account" }}/>
                </Switch>
            </div>
            <div className="onboard-content">
                <Switch>
                    <Redirect exact from='/onboard' to='/onboard/intro'/>
                    {[
                        ['intro', <Intro {...onboardProps}/>],
                        ['step-one', <StepOne {...onboardProps}/>],
                        ['step-two', <StepTwo {...onboardProps}/>],
                        ['step-three', <StepThree {...onboardProps}/>],
                        ['finish', <Finish {...onboardProps}/>],

                    ].map(path => {
                        return (
                            <Route key={`onboard-container-path--${path}`} path={`/onboard/${path[0]}`} render={props => path[1]}/>
                        );
                    })}
                </Switch>
            </div>
        </div>
    );
};

export default connect(OnboardContainer);
