import PropTypes from 'prop-types';
import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import Progress from '../components/status/Progress';

import * as AuthActions from '../actions/AuthActions';
import * as NavActions from '../actions/NavActions';
import * as UserSelectionActions from '../actions/UserSelectionActions';
import * as SkillSelectionActions from '../actions/SkillSelectionActions';

import {PROFILE_COMPLETE_PATH} from '../constants/patterns';

import {initNavUIController} from '../utils/ui';
import {runOptimizely} from '../utils/html';
import {
    requiresAuth,
    requiresNoAuth,
    requiresAuthOrEmail,
    isTungaDomain,
} from '../utils/router';

import {
    getCookieConsentCloseAt, setCookieConsentCloseAt, getCookieConsent, openCookieConsentPopUp
} from "../utils/tracking";


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {showConsentAlert: !getCookieConsentCloseAt() && !getCookieConsent()};
    }

    getChildContext() {
        const {router} = this.context;
        return {router};
    }

    componentDidMount() {
        if (!this.props.Auth.isVerifying) {
            this.props.AuthActions.verify();
        }

        initNavUIController();

        runOptimizely();
    }

    componentDidUpdate(prevProps, prevState) {
        const {router} = this.context;
        const {Auth, location, NavActions, AuthActions, routes} = this.props;
        if (
            prevProps.location.pathname !== location.pathname ||
            prevProps.Auth.isAuthenticated !== Auth.isAuthenticated ||
            (prevProps.Auth.isVerifying !== Auth.isVerifying &&
                !Auth.isVerifying)
        ) {
            if (requiresNoAuth(routes) && Auth.isAuthenticated) {
                var next = Auth.next;
                if (!next) {
                    next = location.query.next || '/home';
                }

                window.location.href = next;

                /*if (/^\/api\//i.test(next)) {
                    window.location.href = next;
                } else {
                    router.replace(next);
                }*/
                return;
            }

            if (
                requiresAuthOrEmail(routes) &&
                !Auth.isAuthenticated &&
                !Auth.isEmailVisitor
            ) {
                AuthActions.authRedirect(location.pathname);
                router.replace('/signin?next=' + location.pathname);
                return;
            }

            if (requiresAuth(routes) && !Auth.isAuthenticated) {
                AuthActions.authRedirect(location.pathname);
                router.replace('/signin?next=' + location.pathname);
                return;
            }
        }

        if (
            Auth.isAuthenticated &&
            !Auth.user.type &&
            !PROFILE_COMPLETE_PATH.test(location.pathname)
        ) {
            router.replace('/profile/complete?next=' + location.pathname);
            return;
        }

        if (
            Auth.isAuthenticated &&
            Auth.user.type &&
            PROFILE_COMPLETE_PATH.test(location.pathname)
        ) {
            router.replace('/home?next=' + location.pathname);
            return;
        }

        if (
            prevProps.Auth.isAuthenticating != Auth.isAuthenticating &&
            !Auth.isAuthenticating &&
            Auth.isEmailVisitor
        ) {
            router.replace('/people/');
        }

        if (prevProps.location.pathname != location.pathname) {
            NavActions.reportPathChange(
                prevProps.location.pathname,
                location.pathname,
            );
        }

        runOptimizely();
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

    getSkill(props) {
        if (props.params && props.params.skill) {
            return props.params.skill;
        }
        return null;
    }

    UNSAFE_componentWillMount() {
        this.verifyRoute(this.props);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        this.verifyRoute(nextProps);
    }

    handleAppClick() {
        const {UserSelectionActions, SkillSelectionActions} = this.props;
        UserSelectionActions.invalidateUserSuggestions();
        SkillSelectionActions.invalidateSkillSuggestions();
    }

    shouldRender = true;

    verifyRoute(props) {
        let path = (window.location.pathname + location.search).replace(
            '/tunga',
            '',
        );
        if (
            !this.getSkill(props) &&
            !isTungaDomain() &&
            !/^\/?((welcome|our-story|quality|pricing|friends-of-tunga|friends-of-tunga-rules)\/?)?(\?.*|$)/.test(path)
        ) {
            this.shouldRender = false;
            window.location.href = `https://tunga.io${path}`;
        }
    }

    renderChildren() {
        return React.Children.map(
            this.props.children,
            function(child) {
                return React.cloneElement(child, {
                    Auth: this.props.Auth,
                    AuthActions: this.props.AuthActions,
                    location: this.props.location,
                    onAppClick: this.handleAppClick.bind(this),
                });
            }.bind(this),
        );
    }

    render() {
        const {Auth} = this.props,
            underMaintenance = false;
        return (
            <div style={{height: '100%'}}>
                {Auth.isVerifying || !this.shouldRender || underMaintenance ? (
                    <div className="app-loading">
                        <div>
                            <img
                                src={require('../images/logo.png')}
                                height="50px"
                            />
                        </div>
                        {underMaintenance ? (
                            <blockquote
                                className="highlight"
                                style={{
                                    margin: '15px auto 0',
                                    display: 'inline-block',
                                }}>
                                Tunga is being updated. Please check back in a
                                bit.
                            </blockquote>
                        ) : (
                            <Progress message="Initializing ..." />
                        )}
                    </div>
                ) : (
                    <div
                        style={{
                            height: '100%',
                            display: Auth.isVerifying ? 'none' : 'block',
                        }}>
                        {this.renderChildren()}
                    </div>
                )}
                {this.state.showConsentAlert?(
                    <div id="cookie-consent" className="clearfix">
                        <div className="consent-actions pull-right">
                            <button className="btn btn-borderless" onClick={this.onCookieSettings.bind(this)}>Cookie Settings</button>
                            <button className="btn" onClick={this.onCloseCookieConsent.bind(this)}>Got it!</button>
                        </div>
                        <div>
                            We use cookies to offer you a better browsing experience, analyze site traffic, personalize content, assist with our promotional and marketing efforts and and provide content from third parties.
                            Read about how we use cookies and how you can control them by clicking "Cookie Settings."
                            If you continue to use this site, you consent to our use of cookies.
                        </div>
                    </div>
                ):null}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {Auth: state.Auth};
}

function mapDispatchToProps(dispatch) {
    return {
        AuthActions: bindActionCreators(AuthActions, dispatch),
        NavActions: bindActionCreators(NavActions, dispatch),
        UserSelectionActions: bindActionCreators(
            UserSelectionActions,
            dispatch,
        ),
        SkillSelectionActions: bindActionCreators(
            SkillSelectionActions,
            dispatch,
        ),
    };
}

App.contextTypes = {
    router: PropTypes.object.isRequired,
};

App.childContextTypes = {
    router: PropTypes.object,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
