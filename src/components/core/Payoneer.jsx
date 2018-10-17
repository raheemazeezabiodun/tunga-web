import PropTypes from 'prop-types';
import React from 'react';

import Icon from "../core/Icon";

import {
    ENDPOINT_PAYONEER_SIGNUP, STATUS_APPROVED, STATUS_DECLINED, STATUS_INITIATED,
    STATUS_PENDING
} from "../../actions/utils/api";

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
                {user.payoneer_status === STATUS_APPROVED ? (
                    <div>
                        <Icon name="check" size="main" className="green"/>
                        <span> Payoneer is set up correctly. You are ready to receive payments.</span>
                    </div>
                ) : user.payoneer_status === STATUS_PENDING || status === STATUS_PENDING ? (
                    <div>
                        <Icon name="attention" size="main" className="orange"/>
                        <span> {message || 'Your Payoneer application is still under review'}</span>
                    </div>
                ) : (
                    <div>
                        {user.payoneer_status === STATUS_DECLINED ||
                        status === 'error' ? (
                            <p>
                                <Icon name="attention" size="main" className="error"/>
                                <span> {message || 'Your Payoneer application was declined, please try again'}</span>
                            </p>
                        ) : null}

                        {user.payoneer_status === STATUS_INITIATED? (
                            <p>
                                <Icon name="attention" size="main" className="orange"/>
                                <span> {message || 'Your Payoneer application has been initiated'}</span>
                            </p>
                        ) : null}

                        <a
                            href={`${ENDPOINT_PAYONEER_SIGNUP}?next_url=${encodeURIComponent(nextUrl || currentUrl)}&error_url=${encodeURIComponent(errorUrl || currentUrl)}`}
                            className="btn btn-primary"
                            title="Set up Payoneer Account for payments">
                            <Icon name="cash" size="main"/> {user.payoneer_status === STATUS_INITIATED?'Having trouble? Re-setup Payoneer account':'Set up Payoneer account for payments'}
                        </a>
                    </div>
                )}
            </div>
        );
    }
}
