import React from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import {LOCATION_CHANGE} from 'react-router-redux';
import Media from "react-media";

import connect from '../connectors/AuthConnector';

import store from '../store';

import DashboardLayout from './dashboard/DashboardLayout';
import ChatWidget from "./chat/ChatWidget";
import LegacyRedirect from './showcase/LegacyRedirect';
import BootLogo from "./core/BootLogo";
import ShowcaseLayout from "./showcase/ShowcaseLayout";
import {getCookieConsent, getCookieConsentCloseAt, openCookieConsentPopUp, setCookieConsentCloseAt} from "./utils/consent";
import Button from "./core/Button";


class App extends React.Component {

    constructor(props) {
        super(props);

        const {Auth: {user}} = this.props;

        this.state= {
            hasVerified: user && user.id,
            showProgress: !user || !user.id, // Used to prevent flickering
            showConsentAlert: !getCookieConsentCloseAt() && !getCookieConsent()
        };
    }

    componentDidMount() {
        const {Auth} = this.props;
        if (!this.state.hasVerified && !Auth.isAuthenticating && !this.props.Auth.isVerifying) {
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

    componentDidUpdate(prevProps, prevState, snapShot) {
        const {Auth, history} = this.props;
        if (
            prevProps.Auth.isAuthenticating !== Auth.isAuthenticating && !Auth.isAuthenticating ||
            (prevProps.Auth.isVerifying !== Auth.isVerifying && !Auth.isVerifying)
        ) {
            this.setState({isVerified: true});
        }

        if (this.props.location !== prevProps.location) {
            store.dispatch({type: LOCATION_CHANGE});
        }
    }

    onCloseCookieConsent() {
        setCookieConsentCloseAt();
        this.setState({showConsentAlert: !getCookieConsentCloseAt() && !getCookieConsent()});
    }

    onCookieSettings() {
        let self = this;
        openCookieConsentPopUp(consents => {
            self.setState({showConsentAlert: !getCookieConsentCloseAt() && !getCookieConsent()});
        });
    }

    render() {
        const {Auth: {user}, AuthActions: {logout}, match} = this.props;

        return (
            !this.state.isVerified || this.state.showProgress?(
                <BootLogo/>
            ):(
                <Media query="(min-width: 992px)">
                    {isLargeDevice => (
                        <div>
                            <Switch>
                                {user && user.id?'dashboard|projects|network|payments|settings|onboard'.split('|').map(path => {
                                    return (
                                        <Route key={`app-path--${path}`} path={`/${path}`} render={props => <DashboardLayout {...props} user={user} logout={logout} isLargeDevice={isLargeDevice}/>}/>
                                    );
                                }):null}
                                <Redirect from="/home" to={{...location, pathname: '/dashboard'}}/>
                                <Redirect from="/profile" to={{...location, pathname: '/settings'}}/>
                                <Redirect from="/task" to={{...location, pathname: '/projects'}}/>
                                <Redirect from="/work" to={{...location, pathname: '/projects'}}/>
                                <Redirect from="/people" to={{...location, pathname: '/network'}}/>
                                <Redirect from="/member" to={{...location, pathname: '/network'}}/>
                                <Redirect from="/estimate" to={{...location, pathname: '/proposal'}}/>
                                <Route path="/legacy" component={LegacyRedirect} />
                                {['/tunga', '*'].map(path => {
                                    return (
                                        <Route key={`app-path--${path}`} path={path} render={props => <ShowcaseLayout {...props} user={user} logout={logout} isLargeDevice={isLargeDevice}/>} />
                                    );
                                })}
                            </Switch>

                            {!user || user.is_admin || user.is_project_manager?null:(
                                <ChatWidget/>
                            )}

                            {this.state.showConsentAlert?(
                                <div id="cookie-consent" className="clearfix">
                                    <div className="consent-actions float-right">
                                        <Button variant="link" className="btn" onClick={this.onCookieSettings.bind(this)}>Cookie Settings</Button>
                                        <Button onClick={this.onCloseCookieConsent.bind(this)}>Got it!</Button>
                                    </div>
                                    <div>
                                        We use cookies to offer you a better browsing experience, analyze site traffic, personalize content, assist with our promotional and marketing efforts and and provide content from third parties.
                                        Read about how we use cookies and how you can control them by clicking "Cookie Settings."
                                        If you continue to use this site, you consent to our use of cookies.
                                    </div>
                                </div>
                            ):null}
                        </div>
                    )}
                </Media>
            )
        )
    }
}

export default connect(App);
