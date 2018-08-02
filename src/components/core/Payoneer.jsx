import PropTypes from 'prop-types';
import React from 'react';

import Icon from "../core/Icon";

import {ENDPOINT_PAYONEER_SIGNUP} from "../../actions/utils/api";

export default class Payoneer extends React.Component {
    static propTypes = {
        user: PropTypes.object,
        status: PropTypes.string,
        message: PropTypes.string,
        nextUrl: PropTypes.string,
        errorUrl: PropTypes.string
    };

    render() {
        const {user, status, message, nextUrl, errorUrl} = this.props,
            currentUrl = `${window.location.origin}${window.location.pathname}`;

        return (
            <div>
                {user.payoneer_status === 'approved' ? (
                    <div>
                        <Icon name="check" size="main" className="green"/>
                        <span> Payoneer is set up correctly. You are ready to receive payments.</span>
                    </div>
                ) : user.payoneer_status === 'pending' || status === 'pending' ? (
                    <div>
                        <Icon name="attention" size="main" className="orange"/>
                        <span> {message || 'Your Payoneer application is still under review'}</span>
                    </div>
                ) : (
                    <div>
                        {user.payoneer_status === 'declined' ||
                        status === 'error' ? (
                            <p>
                                <Icon name="attention" size="main" className="error"/>
                                <span> {message || 'Your Payoneer application was declined, please try again'}</span>
                            </p>
                        ) : null}

                        <a
                            href={`${ENDPOINT_PAYONEER_SIGNUP}?next_url=${encodeURIComponent(nextUrl || currentUrl)}&error_url=${encodeURIComponent(errorUrl || currentUrl)}`}
                            className="btn btn-primary"
                            title="Set up Payoneer Account for payments">
                            <Icon name="cash" size="main"/> Set up Payoneer account for payments
                        </a>
                    </div>
                )}
            </div>
        );
    }
}
