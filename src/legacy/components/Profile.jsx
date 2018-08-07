import React from 'react';
import Progress from './status/Progress';
import FormStatus from './status/FormStatus';
import FieldError from './status/FieldError';

export default class Profile extends React.Component {
    componentDidMount() {
        this.props.ProfileActions.getCountries();
        this.props.ProfileActions.retrieveProfile();
    }

    componentDidUpdate(prevProps, prevState) {
        var status_msg = $('.alert');
        if (status_msg.size()) {
            $('html, body').animate({scrollTop: status_msg.offset().top - 70});
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        const {Profile, ProfileActions} = this.props;
        const profile = Profile.profile || {};

        var first_name = this.refs.first_name.value.trim();
        var last_name = this.refs.last_name.value.trim();

        var company = this.refs.company ? this.refs.company.value.trim() : null;
        var vat_number = this.refs.vat_number
            ? this.refs.vat_number.value.trim()
            : profile.vat_number;
        var country = this.refs.country.value.trim();
        var city = this.refs.city.value.trim();
        var street = this.refs.street.value.trim();
        var plot_number = this.refs.plot_number.value.trim();
        var postal_code = this.refs.postal_code.value.trim() || null;
        var phone_number = this.refs.phone_number.value.trim();

        ProfileActions.updateProfile(profile.id, {
            first_name,
            last_name,
            country,
            city,
            street,
            plot_number,
            postal_code,
            phone_number,
            company,
            vat_number,
        });
        return;
    }

    render() {
        const {Auth, Profile} = this.props;
        const profile = Profile.profile || {};

        return (
            <div>
                {Profile.isRetrieving ? (
                    <Progress />
                ) : (
                    <form
                        onSubmit={this.handleSubmit.bind(this)}
                        name="profile"
                        role="form"
                        ref="profile_form">
                        <FormStatus
                            loading={Profile.isSaving.profile}
                            success={Profile.isSaved.profile}
                            message={'Profile saved'}
                            error={Profile.error.profile}
                        />

                        {Profile.error.profile &&
                        Profile.error.profile.first_name ? (
                            <FieldError
                                message={Profile.error.profile.first_name}
                            />
                        ) : null}
                        <div className="form-group">
                            <label className="control-label">
                                First Name *
                            </label>
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

                        {Profile.error.profile &&
                        Profile.error.profile.last_name ? (
                            <FieldError
                                message={Profile.error.profile.last_name}
                            />
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

                        {Profile.error.profile &&
                        Profile.error.profile.company ? (
                            <FieldError
                                message={Profile.error.profile.company}
                            />
                        ) : null}
                        <div className="form-group">
                            <label className="control-label">
                                Company{' '}
                                {Auth.user.is_developer
                                    ? '(if applicable)'
                                    : null}
                            </label>
                            <div>
                                <input
                                    type="text"
                                    className="form-control"
                                    ref="company"
                                    placeholder="Company"
                                    defaultValue={profile.company}
                                />
                            </div>
                        </div>

                        {Auth.user.is_developer &&
                        Profile.error.profile &&
                        Profile.error.profile.vat_number ? (
                            <FieldError
                                message={Profile.error.profile.vat_number}
                            />
                        ) : null}
                        {Auth.user.is_developer ||
                        Auth.user.is_project_manager ||
                        Auth.user.tax_location == 'europe' ? (
                            <div className="form-group">
                                <label className="control-label">
                                    VAT Number{' '}
                                    {Auth.user.tax_location == 'europe'
                                        ? '*'
                                        : '(if applicable)'}
                                </label>
                                <div>
                                    <input
                                        type="text"
                                        className="form-control"
                                        ref="vat_number"
                                        placeholder="VAT Number"
                                        defaultValue={profile.vat_number}
                                        required={
                                            Auth.user.tax_location == 'europe'
                                        }
                                    />
                                </div>
                            </div>
                        ) : null}

                        {Profile.error.profile &&
                        Profile.error.profile.country ? (
                            <FieldError
                                message={Profile.error.profile.country}
                            />
                        ) : null}
                        <div className="form-group">
                            <label className="control-label">Country *</label>
                            <select
                                className="form-control"
                                ref="country"
                                required
                                defaultValue={profile.country}>
                                {Profile.countries.map(country => {
                                    return (
                                        <option
                                            key={country.code}
                                            value={country.code}>
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
                                    defaultValue={profile.city}
                                />
                            </div>
                        </div>

                        {Profile.error.profile &&
                        Profile.error.profile.street ? (
                            <FieldError
                                message={Profile.error.profile.street}
                            />
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
                                    defaultValue={profile.street}
                                />
                            </div>
                        </div>

                        {Profile.error.profile &&
                        Profile.error.profile.plot_number ? (
                            <FieldError
                                message={Profile.error.profile.plot_number}
                            />
                        ) : null}
                        <div className="form-group">
                            <label className="control-label">
                                (Plot) Number *
                            </label>
                            <div>
                                <input
                                    type="text"
                                    className="form-control"
                                    ref="plot_number"
                                    placeholder="Plot Number"
                                    required
                                    defaultValue={profile.plot_number}
                                />
                            </div>
                        </div>

                        {Profile.error.profile &&
                        Profile.error.profile.postal_code ? (
                            <FieldError
                                message={Profile.error.profile.postal_code}
                            />
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
                                    defaultValue={profile.postal_code}
                                />
                            </div>
                        </div>

                        {Profile.error.profile &&
                        Profile.error.profile.phone_number ? (
                            <FieldError
                                message={Profile.error.profile.phone_number}
                            />
                        ) : null}
                        <div className="form-group">
                            <label className="control-label">
                                Phone Number
                            </label>
                            <div>
                                <input
                                    type="text"
                                    className="form-control"
                                    ref="phone_number"
                                    placeholder="Phone Number"
                                    defaultValue={profile.phone_number}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn  pull-right"
                            disabled={
                                Profile.isSaving.profile ||
                                Profile.isSaving.user
                            }>
                            Save
                        </button>
                        <div className="clearfix" />
                    </form>
                )}
            </div>
        );
    }
}
