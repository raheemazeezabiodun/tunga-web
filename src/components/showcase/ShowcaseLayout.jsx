import React from 'react';
import PropTypes from "prop-types";
import {Switch, Route, Redirect} from 'react-router-dom';

import NavBar from '../NavBar';
import Home from "./Home";

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
                    <Route path='/' component={Home}/>
                    <Redirect to="*" from='/'/>
                </Switch>
            </div>
        )
    }
}
