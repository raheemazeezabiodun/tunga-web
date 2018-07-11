import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { withRouter, Switch, Route } from 'react-router-dom';

import * as AuthActions from '../legacy/actions/AuthActions';

import NavBar from './NavBar';
import SideBar from './SideBar';
import TitleBar from './TitleBar';
import MainContent from './MainContent';

class DashboardLayout extends React.Component {

    constructor(props) {
        super(props);
        this.state= {hasVerified: false};
    }

    componentDidMount() {
        const {Auth} = this.props;
        if (!Auth.isAuthenticated && !this.props.Auth.isVerifying && !this.state.hasVerified) {
            this.props.AuthActions.verify();
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const {Auth} = this.props;
        if (
            prevProps.Auth.isAuthenticated !== Auth.isAuthenticated ||
            (prevProps.Auth.isVerifying !== Auth.isVerifying && !Auth.isVerifying)
        ) {
            if(!Auth.isAuthenticated) {
                window.location.href = window.location.origin;
            }
        }
    }

    render() {
        const {Auth: {user}, AuthActions: {logout}} = this.props;

        return (
            user && user.id?(
                <React.Fragment>
                    <NavBar user={user} onSignOut={logout}/>
                    <SideBar/>
                    <TitleBar user={user}/>
                    <MainContent/>
                </React.Fragment>
            ):(
                <div>Loading ...</div>
            )
        )
    }
}

function mapStateToProps(state) {
    return {
        Auth: state.Auth
    };
}

function mapDispatchToProps(dispatch) {
    return {
        AuthActions: bindActionCreators(AuthActions, dispatch),
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DashboardLayout));
