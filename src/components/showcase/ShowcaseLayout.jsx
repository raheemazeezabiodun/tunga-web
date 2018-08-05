import React from 'react';
import { Redirect } from 'react-router-dom';
import Media from "react-media";

import NavBar from '../NavBar';
import SideBar from '../SideBar';
import TitleBar from '../TitleBar';
import MainContent from '../MainContent';
import PropTypes from "prop-types";

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
                <header>

                </header>
            </div>
        )
    }
}

