import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { withRouter, Switch, Route } from 'react-router-dom';

import * as AuthActions from '../legacy/actions/AuthActions';

import NavBar from './NavBar';
import SideBar from './SideBar';
import TitleBar from './TitleBar';
import MainContent from './MainContent';
import Progress from "./core/Progress";
import BootLogo from "./core/BootLogo";

class DashboardLayout extends React.Component {

    constructor(props) {
        super(props);

        const {Auth: {user}} = this.props;

        this.state= {
            hasVerified: user && user.id,
            showProgress: !user || !user.id // Used to prevent flickering
        };
    }

    componentDidMount() {
        const {Auth} = this.props;
        if (!this.state.hasVerified && !Auth.isAuthenticated && !this.props.Auth.isVerifying) {
            this.props.AuthActions.verify();
        }

        if(this.state.showProgress) {
            // Wait one second to prevent flickering
            let self = this;
            setTimeout(() => {
                self.setState({showProgress: false});
            }, 1000);
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
            user && user.id && !this.state.showProgress?(
                <React.Fragment>
                    <NavBar user={user} onSignOut={logout}/>
                    <SideBar/>
                    <TitleBar user={user}/>
                    <MainContent/>
                </React.Fragment>
            ):(
                <BootLogo/>
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
