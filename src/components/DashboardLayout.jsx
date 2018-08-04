import React from 'react';
import { Redirect } from 'react-router-dom';
import Media from "react-media";

import NavBar from './NavBar';
import SideBar from './SideBar';
import TitleBar from './TitleBar';
import MainContent from './MainContent';
import PropTypes from "prop-types";

export default class DashboardLayout extends React.Component {

    static propTypes = {
        user: PropTypes.object.required,
        logout: PropTypes.object,
        match: PropTypes.object,
    };

    render() {
        const {user, logout, match} = this.props,
            isProjectsRoute = match.url === '/projects';

        return (
            user && user.id?(
                <React.Fragment>
                    <NavBar user={user} onSignOut={logout}/>
                    <Media query="(min-width: 992px)">
                        {isLargeDevice =>
                            <React.Fragment>
                                {isLargeDevice?(
                                    <SideBar/>
                                ):null}
                                <TitleBar user={user} isLargeDevice={isLargeDevice} showBreadCrumbs={isProjectsRoute && !isLargeDevice}/>
                                <MainContent isLargeDevice={isLargeDevice} className={isProjectsRoute && !isLargeDevice?'has-breadcrumbs':''}/>
                            </React.Fragment>
                        }
                    </Media>
                </React.Fragment>
            ):(
                <Redirect from="*" to="/"/>
            )
        )
    }
}

