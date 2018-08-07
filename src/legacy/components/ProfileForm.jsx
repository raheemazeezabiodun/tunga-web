import React from 'react';
import Dropzone from 'react-dropzone';

import Progress from './status/Progress';
import FormStatus from './status/FormStatus';
import FieldError from './status/FieldError';

import {ENDPOINT_PAYONEER_SIGNUP} from '../constants/Api';

export default class ProfileForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 1,
            photo: null,
            payment_method: null,
            country_code: null,
            overrideErrors: false,
        };
    }

    componentDidMount() {
        this.props.ProfileActions.getCountries();
        this.props.ProfileActions.retrieveProfile();
    }

    componentDidUpdate(prevProps, prevState) {
        if (
            this.props.Profile.isSaved.profile &&
            !prevProps.Profile.isSaved.profile
        ) {
            window.location.reload();
        }
    }

    onClickOpen() {
        this.refs.dropzone.open();
    }

    onCountryCodeChange(country_code) {
        this.setState({country_code: country_code.id});
    }

    onDrop(files) {
        this.setState({photo: files[0]});
    }

    onPaymentMethodChange(payment_method) {
        this.setState({payment_method});
    }

    canSkip(required, requires) {
        if (required) {
            return false;
        }
        if (requires) {
            var i = 0;
            do {
                var key = requires[i];
                var val = this.state[key];
                if (!val || (Array.isArray(val) && !val.length)) {
                    return false;
                }
                i++;
            } while (i < requires.length);
        }
        return true;
    }

    changeStep(direction = true, overrideErrors) {
        var next_step = this.state.step + (direction ? 1 : -1);
        var new_state = {step: next_step};
        if (typeof overrideErrors == 'boolean') {
            new_state.overrideErrors = overrideErrors;
        }
        this.setState(new_state);
    }

    handleSubmit = e => {
        e.preventDefault();
        const {Profile, ProfileActions} = this.props;
        const {profile} = Profile;

        var req_data = {};
        req_data.first_name = this.refs.first_name.value.trim();
        req_data.last_name = this.refs.last_name.value.trim();

        req_data.company = this.refs.company
            ? this.refs.company.value.trim()
            : null;
        req_data.vat_number = this.refs.vat_number
            ? this.refs.vat_number.value.trim()
            : profile.vat_number;
        req_data.country = this.refs.country
            ? this.refs.country.value.trim()
            : null;
        req_data.city = this.refs.city ? this.refs.city.value.trim() : null;
        req_data.street = this.refs.street
            ? this.refs.street.value.trim()
            : null;
        req_data.plot_number = this.refs.plot_number
            ? this.refs.plot_number.value.trim()
            : null;
        req_data.postal_code = this.refs.postal_code
            ? this.refs.postal_code.value.trim()
            : null;
        req_data.phone_number = this.refs.phone_number
            ? this.refs.phone_number.value.trim()
            : null;
        req_data.id_document = this.state.photo;
        req_data.payment_method = this.state.payment_method;
        req_data.mobile_money_cc =
            this.state.country_code || profile.mobile_money_cc;
        req_data.mobile_money_number = this.refs.mobile_money_number
            ? this.refs.mobile_money_number.value.trim()
            : profile.mobile_money_number;
        req_data.btc_address = this.refs.btc_address
            ? this.refs.btc_address.value.trim()
            : profile.btc_address;

        var profile_info = {};
        Object.keys(req_data).forEach(function(key) {
            const data_value = req_data[key];
            if (data_value || typeof data_value == 'boolean') {
                profile_info[key] = data_value;
            }
        });

        ProfileActions.updateProfile(Profile.profile.id, profile_info);
        return;
    };

    showAll(e) {
        this.setState({
            showAll: !this.refs.profile_form.checkValidity(),
            overrideErrors: false,
        });
    }

    render() {
        const {Auth, Profile} = this.props;
        let id_doc = this.state.photo
            ? this.state.photo.preview
            : Profile.profile.id_document;

        const {user} = Auth;

        const has_error = Profile.error.profile;
        let canShowAll =
            (this.state.showAll || has_error) && !this.state.overrideErrors;

        let personalComp = (
            <div>
                {Profile.error.profile && Profile.error.profile.first_name ? (
                    <FieldError message={Profile.error.profile.first_name} />
                ) : null}
                <div className="form-group">
                    <label className="control-label">First Name *</label>
                    <div>
                        <input
                            type="text"
                            className="form-control"
                            ref="first_name"
                            placeholder="First Name"
                            required
                            defaultValue={Auth.user.first_name}
                        />
                    </div>
                </div>

                {Profile.error.profile && Profile.error.profile.last_name ? (
                    <FieldError message={Profile.error.profile.last_name} />
                ) : null}
                <div className="form-group">
                    <label className="control-label">Last Name *</label>
                    <div>
                        <input
                            type="text"
                            className="form-control"
                            ref="last_name"
                            placeholder="Last Name"
                            required
                            defaultValue={Auth.user.last_name}
                        />
                    </div>
                </div>
            </div>
        );

        let addressComp = (
            <div>
                {Profile.error.profile && Profile.error.profile.country ? (
                    <FieldError message={Profile.error.profile.country} />
                ) : null}
                <div className="form-group">
                    <label className="control-label">Country *</label>
                    <select
                        className="form-control"
                        ref="country"
                        required
                        defaultValue={Profile.profile.country}>
                        {Profile.countries.map(country => {
                            return (
                                <option key={country.code} value={country.code}>
                                    {country.name}
                                </option>
                            );
                        })}
                    </select>
                </div>

                {Profile.error.profile && Profile.error.profile.city ? (
                    <FieldError message={Profile.error.profile.city} />
                ) : null}
                <div className="form-group">
                    <label className="control-label">City *</label>
                    <div>
                        <input
                            type="text"
                            className="form-control"
                            ref="city"
                            placeholder="City"
                            required
                            defaultValue={Profile.profile.city}
                        />
                    </div>
                </div>

                {Profile.error.profile && Profile.error.profile.street ? (
                    <FieldError message={Profile.error.profile.street} />
                ) : null}
                <div className="form-group">
                    <label className="control-label">Street *</label>
                    <div>
                        <input
                            type="text"
                            className="form-control"
                            ref="street"
                            placeholder="Street"
                            required
                            defaultValue={Profile.profile.street}
                        />
                    </div>
                </div>
            </div>
        );

        let addressComp2 = (
            <div>
                {Profile.error.profile && Profile.error.profile.plot_number ? (
                    <FieldError message={Profile.error.profile.plot_number} />
                ) : null}
                <div className="form-group">
                    <label className="control-label">(Plot) Number *</label>
                    <div>
                        <input
                            type="text"
                            className="form-control"
                            ref="plot_number"
                            placeholder="Plot Number"
                            required
                            defaultValue={Profile.profile.plot_number}
                        />
                    </div>
                </div>

                {Profile.error.profile && Profile.error.profile.postal_code ? (
                    <FieldError message={Profile.error.profile.postal_code} />
                ) : null}
                <div className="form-group">
                    <label className="control-label">ZIP Code *</label>
                    <div>
                        <input
                            type="text"
                            className="form-control"
                            ref="postal_code"
                            placeholder="ZIP Code"
                            required
                            defaultValue={Profile.profile.postal_code}
                        />
                    </div>
                </div>

                {Profile.error.profile && Profile.error.profile.phone_number ? (
                    <FieldError message={Profile.error.profile.phone_number} />
                ) : null}
                <div className="form-group">
                    <label className="control-label">Phone Number</label>
                    <div>
                        <input
                            type="text"
                            className="form-control"
                            ref="phone_number"
                            placeholder="Phone Number"
                            defaultValue={Profile.profile.phone_number}
                        />
                    </div>
                </div>
            </div>
        );

        let paymentComp = (
            <div>
                {user.payoneer_status == 'approved' ? (
                    <div>
                        <div className="thank-you">
                            <div>Payoneer is set up correctly.</div>
                            <i className="fa fa-check-circle status-icon" />
                            <div>You are ready to receive payments.</div>
                        </div>
                    </div>
                ) : user.payoneer_status == 'pending' ? (
                    <div>
                        <div
                            className="alert alert-info"
                            style={{fontSize: '16px'}}>
                            <i className="fa fa-info-circle" /> Your Payoneer
                            application is still under review
                        </div>
                    </div>
                ) : (
                    <div>
                        {user.payoneer_status == 'declined' ? (
                            <div
                                className="alert alert-danger"
                                style={{fontSize: '16px'}}>
                                <i className="fa fa-exclamation-triangle" />{' '}
                                Your Payoneer application was declined, please
                                try again
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
        let companyComp = (
            <div>
                {Profile.error.profile && Profile.error.profile.company ? (
                    <FieldError message={Profile.error.profile.company} />
                ) : null}
                <div className="form-group">
                    <label className="control-label">
                        Company{' '}
                        {Auth.user.is_developer || Auth.user.is_project_manager
                            ? '(if applicable)'
                            : null}
                    </label>
                    <div>
                        <input
                            type="text"
                            className="form-control"
                            ref="company"
                            placeholder="Company"
                            defaultValue={Profile.profile.company}
                        />
                    </div>
                </div>

                {(Auth.user.is_developer || Auth.user.is_project_manager) &&
                Profile.error.profile &&
                Profile.error.profile.vat_number ? (
                    <FieldError message={Profile.error.profile.vat_number} />
                ) : null}
                {Auth.user.is_developer ||
                Auth.user.is_project_manager ||
                Auth.user.tax_location == 'europe' ? (
                    <div className="form-group">
                        <label className="control-label">
                            VAT Number{' '}
                            {Auth.user.tax_location == 'europe'
                                ? '*'
                                : ' (if applicable)'}
                        </label>
                        <div>
                            <input
                                type="text"
                                className="form-control"
                                ref="vat_number"
                                placeholder="VAT Number"
                                defaultValue={Profile.profile.vat_number}
                                required={Auth.user.tax_location == 'europe'}
                            />
                        </div>
                    </div>
                ) : null}
            </div>
        );

        let IDComp = (
            <div>
                {Profile.error.profile && Profile.error.profile.id_document ? (
                    <FieldError message={Profile.error.profile.id_document} />
                ) : null}
                <div className="form-group">
                    <label>
                        Upload a scan of your National ID, Passport or Driver's
                        license *
                    </label>

                    <p className="alert alert-info">
                        This must be a PNG or JPG/JPEG file not exceeding 5MB
                    </p>

                    <Dropzone
                        ref="dropzone"
                        className="dropzone"
                        multiple={false}
                        accept={'image/*'}
                        onDrop={this.onDrop.bind(this)}>
                        <div className="msg">
                            {id_doc ? (
                                <div>
                                    <img
                                        src={id_doc}
                                        style={{
                                            maxWidth: '100%',
                                            maxHeight: '300px',
                                        }}
                                    />
                                    {this.state.photo ? (
                                        <p>{this.state.photo.name}</p>
                                    ) : null}
                                </div>
                            ) : (
                                <i
                                    className="fa fa-cloud-upload fa-2x"
                                    style={{marginTop: '30px'}}
                                />
                            )}
                            <div>
                                Drop an image here or click to select an image
                                to upload.
                            </div>
                        </div>
                    </Dropzone>
                </div>
            </div>
        );

        var sections = [
            {
                title: `Personal`,
                items: [personalComp],
                requires: ['first_name', 'last_name'],
            },
            {
                title: `Address`,
                items: [addressComp],
                requires: ['country', 'city', 'street'],
            },
            {
                title: `Address`,
                items: [addressComp2],
                requires: ['plot_number', 'postal_code'],
            },
            {
                title: `Company`,
                items: [companyComp],
                requires: ['company', 'last_name'],
            },
        ];

        if (Auth.user.is_developer || Auth.user.is_project_manager) {
            sections = [
                ...sections,
                {
                    title: `Payment`,
                    items: [paymentComp],
                },
                {
                    title: `ID Document`,
                    items: [IDComp],
                },
            ];
        }

        let current_section = sections[this.state.step - 1];

        return (
            <div>
                {Profile.isRetrieving ? (
                    <Progress />
                ) : (
                    <div className="form-wrapper profile-form">
                        {current_section &&
                        current_section.title &&
                        !canShowAll ? (
                            <div className="section-title clearfix">
                                <h4
                                    className="pull-left"
                                    id="profile-wizard-title">
                                    {current_section.title}
                                </h4>
                                <div className="slider pull-right">
                                    {sections.map((section, idx) => {
                                        return (
                                            <i
                                                className={`fa fa-circle${
                                                    this.state.step == idx + 1
                                                        ? ''
                                                        : '-o'
                                                }`}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        ) : null}

                        <form
                            onSubmit={this.handleSubmit.bind(this)}
                            name="profile"
                            role="form"
                            ref="profile_form"
                            className={canShowAll ? 'steps-all' : null}>
                            <FormStatus
                                loading={Profile.isSaving.profile}
                                success={Profile.isSaved.profile}
                                message={'Profile saved'}
                                error={Profile.error.profile}
                            />

                            {sections.map((section, idx) => {
                                return (
                                    <div
                                        className={
                                            this.state.step == idx + 1 ||
                                            canShowAll
                                                ? 'step'
                                                : 'sr-only'
                                        }>
                                        {section.items.map(item => {
                                            return item;
                                        })}
                                    </div>
                                );
                            })}

                            <div className="nav text-center">
                                {this.state.step > 1 ? (
                                    <button
                                        type="button"
                                        className="btn btn-alt nav-btn prev-btn pull-left"
                                        onClick={this.changeStep.bind(
                                            this,
                                            false,
                                            true,
                                        )}>
                                        <i className="fa fa-chevron-left" />{' '}
                                        Previous
                                    </button>
                                ) : null}
                                {this.state.step < sections.length &&
                                (current_section &&
                                    !current_section.required &&
                                    !canShowAll) ? (
                                    <button
                                        type="button"
                                        className="btn btn-alt nav-btn next-btn pull-right"
                                        onClick={this.changeStep.bind(
                                            this,
                                            true,
                                        )}>
                                        {current_section &&
                                        this.canSkip(
                                            current_section.required,
                                            current_section.requires,
                                        )
                                            ? 'Next'
                                            : 'Skip'}{' '}
                                        <i className="fa fa-chevron-right" />
                                    </button>
                                ) : null}
                                {this.state.step == sections.length ||
                                canShowAll ? (
                                    <div className="text-center">
                                        <button
                                            type="submit"
                                            onClick={this.showAll.bind(this)}
                                            className="btn"
                                            disabled={Profile.isSaving.profile}>
                                            Save
                                        </button>
                                    </div>
                                ) : null}
                            </div>
                            <div className="clearfix" />
                        </form>
                    </div>
                )}
            </div>
        );
    }
}
