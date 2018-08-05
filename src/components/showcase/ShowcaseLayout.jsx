import React from 'react';
import PropTypes from "prop-types";
import {Switch, Route, Redirect} from 'react-router-dom';

import NavBar from '../NavBar';
import Home from "./Home";
import OurStory from "./OurStory";
import Quality from "./Quality";
import Pricing from "./Pricing";
import Friends from "./Friends";
import FriendsRules from "./FriendsRules";

export default class ShowcaseLayout extends React.Component {

    static propTypes = {
        user: PropTypes.object,
        logout: PropTypes.func,
        match: PropTypes.object,
    };

    render() {
        const {user, logout, match, isLargeDevice} = this.props;

        return (
            <div className="showcase">
                <NavBar variant="showcase" user={user} onSignOut={logout} isLargeDevice={isLargeDevice}/>

                <Switch>
                    <Route path='/our-story' component={OurStory}/>
                    <Route path='/quality' component={Quality}/>
                    <Route path='/pricing' component={Pricing}/>
                    <Route path='/friends/rules' component={FriendsRules}/>
                    <Route path='/friends' component={Friends}/>
                    <Redirect from="/friends-of-tunga" to='/friends'/>
                    <Redirect from="/friends-of-tunga-rules" to='/friends/rules'/>
                    <Route exact path='/' component={Home}/>
                    <Redirect from="*" to='/'/>
                </Switch>
            </div>
        )
    }
}
