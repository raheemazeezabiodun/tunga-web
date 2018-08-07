import React from 'react';
import {DropdownList} from 'react-widgets';

import Progress from './status/Progress';
import FormStatus from './status/FormStatus';
import FieldError from './status/FieldError';

import {
    PAYMENT_METHOD_CHOICES,
    PAYMENT_METHOD_BTC_WALLET,
    PAYMENT_METHOD_MOBILE_MONEY,
    PAYMENT_METHOD_BTC_ADDRESS,
    SOCIAL_LOGIN_URLS,
    ENDPOINT_PAYONEER_SIGNUP,
} from '../constants/Api';

export default class PaymentMethod extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            payment_method: PAYMENT_METHOD_BTC_WALLET,
            country_code: null,
        };
    }

    render() {
        const {Auth, Profile} = this.props;
        const {user} = Auth;
        let status = this.props.location && this.props.location.query.status,
            message = this.props.location && this.props.location.query.message;

        return (
            <div>
                {user.payoneer_status == 'approved' ? (
                    <div>
                        <div className="thank-you">
                            <div>Payoneer is set up correctly.</div>
                            <i className="fa fa-check-circle status-icon" />
                            <div>You are ready to receive payments.</div>
                        </div>
                    </div>
                ) : user.payoneer_status == 'pending' || status == 'pending' ? (
                    <div>
                        <div
                            className="alert alert-info"
                            style={{fontSize: '16px'}}>
                            <i className="fa fa-info-circle" />{' '}
                            {message ||
                                'Your Payoneer application is still under review'}
                        </div>
                    </div>
                ) : (
                    <div>
                        {user.payoneer_status == 'declined' ||
                        status == 'error' ? (
                            <div
                                className="alert alert-danger"
                                style={{fontSize: '16px'}}>
                                <i className="fa fa-exclamation-triangle" />{' '}
                                {message ||
                                    'Your Payoneer application was declined, please try again'}
                            </div>
                        ) : null}

                        <a
                            href={ENDPOINT_PAYONEER_SIGNUP}
                            className="btn"
                            title="Set up Payoneer Account for payments">
                            <i className="fa fa-money" /> Set up Payoneer
                            Account for payments
                        </a>
                    </div>
                )}
            </div>
        );
    }
}
