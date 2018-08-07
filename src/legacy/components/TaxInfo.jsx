import React from 'react';
import Progress from './status/Progress';
import FormStatus from './status/FormStatus';
import FieldError from './status/FieldError';

export default class TaxInfo extends React.Component {
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
        const {profile} = Profile;

        var tax_name = this.refs.tax_name.value.trim();
        var tax_percentage = this.refs.tax_percentage.value.trim();

        ProfileActions.updateProfile(Profile.profile.id, {
            tax_name,
            tax_percentage,
        });
        return;
    }

    render() {
        const {Auth, Profile} = this.props;

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
                        Profile.error.profile.tax_name ? (
                            <FieldError
                                message={Profile.error.profile.tax_name}
                            />
                        ) : null}
                        <div className="form-group">
                            <label className="control-label">Tax Name *</label>
                            <div>
                                <input
                                    type="text"
                                    className="form-control"
                                    ref="tax_name"
                                    placeholder="Tax Name"
                                    required
                                    defaultValue={Profile.profile.tax_name}
                                />
                            </div>
                        </div>

                        {Profile.error.profile &&
                        Profile.error.profile.tax_percentage ? (
                            <FieldError
                                message={Profile.error.profile.tax_percentage}
                            />
                        ) : null}
                        <div className="form-group">
                            <label className="control-label">
                                Tax Percentage *
                            </label>
                            <div>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="form-control"
                                    ref="tax_percentage"
                                    placeholder="Tax Percentage"
                                    required
                                    defaultValue={
                                        Profile.profile.tax_percentage
                                    }
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
