import PropTypes from 'prop-types';
import React from 'react';

import {SOCIAL_LOGIN_URLS, objectToQueryString} from '../../actions/utils/api';
import {sendTwitterSignUpEvent, AUTH_METHODS, getUserTypeTwitter} from '../../actions/utils/tracking';
import Icon from "./Icon";

export default class SocialSignIn extends React.Component {

    static propTypes = {
        user_type: PropTypes.number,
        action: PropTypes.string,
    };

    getParams() {
        let query_params = objectToQueryString({
            user_type: this.props.user_type,
            action: this.props.action,
        });
        if (query_params) {
            return '?' + query_params;
        }
        return '';
    }

    trackSignUp(method, e) {
        // TODO: Track Social Sign In/ Sign Up with GA
        sendTwitterSignUpEvent({
            user_type: getUserTypeTwitter(this.props.user_type),
            method,
        });
    }

    render() {
        return (
            <div className={`social-auth-options ${this.props.className || ''}`}>
                <ul>
                    <li>
                        <a
                            rel="nofollow"
                            href={SOCIAL_LOGIN_URLS.facebook + this.getParams()}
                            className="facebook"
                            title="Sign In with Facebook"
                            onClick={this.trackSignUp.bind(
                                this,
                                AUTH_METHODS.FACEBOOK,
                            )}>
                            <Icon
                                name="facebook-square"
                                aria-hidden="true"
                            />
                        </a>
                    </li>

                    <li>
                        <a
                            rel="nofollow"
                            href={SOCIAL_LOGIN_URLS.google + this.getParams()}
                            className="google"
                            title="Sign In with Google"
                            onClick={this.trackSignUp.bind(
                                this,
                                AUTH_METHODS.GOOGLE,
                            )}>
                            <Icon
                                name="google-plus-square"
                                aria-hidden="true"
                            />
                        </a>
                    </li>

                    <li>
                        <a
                            rel="nofollow"
                            href={SOCIAL_LOGIN_URLS.github + this.getParams()}
                            className="github"
                            title="Sign In with GitHub"
                            onClick={this.trackSignUp.bind(
                                this,
                                AUTH_METHODS.GITHUB,
                            )}>
                            <Icon
                                name="github-square"
                                aria-hidden="true"
                            />
                        </a>
                    </li>
                </ul>
            </div>
        );
    }
}

