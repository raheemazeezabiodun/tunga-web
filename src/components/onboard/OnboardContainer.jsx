import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import {withProps} from 'recompose';
import querystring from "querystring";

import connect from '../../connectors/ProfileConnector';

import Intro from './Intro';
import StepOne from './StepOne';
import StepTwo from './StepTwo';
import StepThree from './StepThree';
import Finish from './Finish';
import Identity from "./Identity";
import Payment from "./Payment";

const OnboardContainer = (props) => {
    let onboardProps = {
        user: props.Auth.user,
        isSaving: props.Profile.isSaving,
        isSaved: props.Profile.isSaved,
        errors: props.Profile.errors,
        ProfileActions: props.ProfileActions,
        history: props.history
    };

    const queryParams = querystring.parse((props.location.search || '').replace('?', ''));

    return (
        <div className="onboard-card">
            <div className="onboard-title">
                <Switch>
                    <Route path="/onboard/finish" component={() => { return 'Thank you for filling in your profile' }}/>
                    <Route path="/onboard/*" component={() => { return "Let's set up your account" }}/>
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
                        ['identity', <Identity {...onboardProps}/>],
                        ['payment', <Payment {...onboardProps} status={queryParams.status} message={queryParams.message}/>],
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
