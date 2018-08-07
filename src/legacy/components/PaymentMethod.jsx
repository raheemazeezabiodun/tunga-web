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
} from '../constants/Api';

export default class PaymentMethod extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            payment_method: PAYMENT_METHOD_BTC_WALLET,
            country_code: null,
        };
    }

    componentDidMount() {
        this.props.ProfileActions.retrieveProfile();
        const {Profile, ProfileActions} = this.props;
        var payment_method = Profile.profile.payment_method || null;
        this.setState({payment_method});
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.Profile.profile.id != prevProps.Profile.profile.id) {
            const {Profile, ProfileActions} = this.props;
            if (Profile.profile.id) {
                this.setState({payment_method: Profile.profile.payment_method});
            }
        }
    }

    onCountryCodeChange(country_code) {
        this.setState({country_code: country_code.id});
    }

    onPaymentMethodChange(payment_method) {
        this.setState({payment_method});
    }

    handleSubmit = e => {
        e.preventDefault();

        const {Profile, ProfileActions} = this.props;
        const {profile} = Profile;

        var payment_method = this.state.payment_method;
        var mobile_money_cc =
            this.state.country_code || profile.mobile_money_cc;
        var mobile_money_number = this.refs.mobile_money_number
            ? this.refs.mobile_money_number.value.trim()
            : profile.mobile_money_number;
        var btc_address = this.refs.btc_address
            ? this.refs.btc_address.value.trim()
            : profile.btc_address;
        ProfileActions.updateProfile(Profile.profile.id, {
            payment_method,
            mobile_money_cc,
            mobile_money_number,
            btc_address,
        });
        return;
    };

    render() {
        const {Profile} = this.props;
        const {profile} = Profile;

        var country_codes = [
            {id: null, name: '- Country Code -'},
            {id: 234, name: 'Nigeria (+234)'},
            {id: 255, name: 'Tanzania (+255)'},
            {id: 256, name: 'Uganda (+256)'},
        ];

        return (
            <div>
                {Profile.isRetrieving ? (
                    <Progress />
                ) : (
                    <form
                        onSubmit={this.handleSubmit}
                        name="profile"
                        role="form"
                        ref="profile_form">
                        <FormStatus
                            loading={Profile.isSaving.profile}
                            success={Profile.isSaved.profile}
                            message={'Payment details saved'}
                            error={Profile.error.profile}
                        />

                        {Profile.error.profile &&
                        Profile.error.profile.payment_method ? (
                            <FieldError
                                message={Profile.error.profile.payment_method}
                            />
                        ) : null}
                        <div className="form-group">
                            <label className="control-label">
                                Payment Method *
                            </label>
                            <div>
                                <div
                                    className="btn-group btn-choices"
                                    role="group"
                                    aria-label="payment method">
                                    {PAYMENT_METHOD_CHOICES.map(
                                        payment_method => {
                                            return (
                                                <button
                                                    key={payment_method.id}
                                                    type="button"
                                                    className={
                                                        'btn ' +
                                                        (this.state
                                                            .payment_method ==
                                                        payment_method.id
                                                            ? ' active'
                                                            : '')
                                                    }
                                                    onClick={this.onPaymentMethodChange.bind(
                                                        this,
                                                        payment_method.id,
                                                    )}>
                                                    {payment_method.name}
                                                </button>
                                            );
                                        },
                                    )}
                                </div>
                            </div>
                        </div>

                        {this.state.payment_method ==
                        PAYMENT_METHOD_BTC_WALLET ? (
                            <div>
                                {Profile.profile.payment_method ==
                                    PAYMENT_METHOD_BTC_WALLET &&
                                Profile.profile.btc_wallet &&
                                Profile.profile.btc_wallet.provider ==
                                    'coinbase' ? (
                                    <div>
                                        <div className="alert alert-success">
                                            <i className="fa fa-check-square-o" />{' '}
                                            Connected to Coinbase
                                        </div>

                                        <div className="v-spacer">
                                            Having any issue?
                                            <a
                                                href={
                                                    SOCIAL_LOGIN_URLS.coinbase +
                                                    `?action=connect&next=/profile/payment/coinbase/`
                                                }
                                                className="btn coinbase-connect-button"
                                                style={{marginLeft: '5px'}}>
                                                <i className="tunga-icon-coinbase fa-lg" />{' '}
                                                Re-connect to Coinbase
                                            </a>
                                        </div>
                                    </div>
                                ) : (
                                    <a
                                        href={
                                            SOCIAL_LOGIN_URLS.coinbase +
                                            `?action=connect&next=/profile/payment/coinbase/`
                                        }
                                        className="btn coinbase-connect-button"
                                        title="Connect with Coinbase">
                                        <i className="tunga-icon-coinbase fa-lg" />{' '}
                                        Connect with Coinbase
                                    </a>
                                )}
                            </div>
                        ) : null}

                        {this.state.payment_method ==
                        PAYMENT_METHOD_MOBILE_MONEY ? (
                            <div>
                                {Profile.error.profile &&
                                Profile.error.profile.mobile_money_number ? (
                                    <FieldError
                                        message={
                                            Profile.error.profile
                                                .mobile_money_number
                                        }
                                    />
                                ) : null}
                                {Profile.error.profile &&
                                Profile.error.profile.mobile_money_cc ? (
                                    <FieldError
                                        message={
                                            Profile.error.profile
                                                .mobile_money_cc
                                        }
                                    />
                                ) : null}
                                <div className="form-group">
                                    <label className="control-label">
                                        Mobile Money Number
                                    </label>
                                    <div className="alert alert-info">
                                        This number{' '}
                                        <strong>MUST BE REGISTERED</strong> for
                                        Mobile Money
                                    </div>
                                    <div className="row">
                                        <div className="col-md-4">
                                            <DropdownList
                                                valueField="id"
                                                textField="name"
                                                data={country_codes}
                                                defaultValue={
                                                    profile.mobile_money_cc
                                                }
                                                onChange={this.onCountryCodeChange.bind(
                                                    this,
                                                )}
                                            />
                                        </div>
                                        <div className="col-md-8">
                                            <input
                                                type="text"
                                                className="form-control"
                                                ref="mobile_money_number"
                                                placeholder="Enter phone number"
                                                defaultValue={
                                                    profile.mobile_money_number
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : null}

                        {this.state.payment_method ==
                        PAYMENT_METHOD_BTC_ADDRESS ? (
                            <div>
                                {Profile.error.profile &&
                                Profile.error.profile.btc_address ? (
                                    <FieldError
                                        message={
                                            Profile.error.profile.btc_address
                                        }
                                    />
                                ) : null}
                                <div className="form-group">
                                    <label className="control-label">
                                        Bitcoin Address
                                    </label>
                                    <div>
                                        <input
                                            type="text"
                                            className="form-control"
                                            ref="btc_address"
                                            placeholder="Enter a bitcoin address you own"
                                            defaultValue={profile.btc_address}
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : null}

                        {this.state.payment_method !=
                            PAYMENT_METHOD_BTC_WALLET &&
                        this.state.payment_method != null ? (
                            <button
                                type="submit"
                                className="btn  pull-right"
                                disabled={Profile.isSaving.profile}>
                                Save
                            </button>
                        ) : null}
                        <div className="clearfix" />
                    </form>
                )}
            </div>
        );
    }
}
