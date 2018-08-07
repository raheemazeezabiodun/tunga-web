import React from 'react';
import Progress from './status/Progress';
import FormStatus from './status/FormStatus';
import FieldError from './status/FieldError';

export default class PasswordChangeForm extends React.Component {
    componentDidUpdate(prevProps, prevState) {
        if (
            this.props.Profile.isSaved.security &&
            !prevProps.Profile.isSaved.security
        ) {
            this.refs.password_form.reset();
        }
    }

    handleSubmit = e => {
        e.preventDefault();
        var old_password = this.refs.old_password.value.trim();
        var new_password1 = this.refs.new_password1.value.trim();
        var new_password2 = this.refs.new_password2.value.trim();
        if (!old_password || !new_password1 || !new_password2) {
            return;
        }

        const {ProfileActions} = this.props;
        ProfileActions.updatePassword({
            old_password,
            new_password1,
            new_password2,
        });
        return;
    };

    render() {
        const {Auth, Profile} = this.props;

        return (
            <div>
                {Auth.isVerifying ? (
                    <Progress />
                ) : (
                    <form
                        onSubmit={this.handleSubmit}
                        name="password"
                        role="form"
                        ref="password_form">
                        <FormStatus
                            loading={Profile.isSaving.security}
                            success={Profile.isSaved.security}
                            message={'Password changed'}
                            error={Profile.error.security}
                        />

                        {Profile.error.security &&
                        Profile.error.security.old_password ? (
                            <FieldError
                                message={Profile.error.security.old_password}
                            />
                        ) : (
                            ''
                        )}
                        <div className="form-group">
                            <label className="control-label">
                                Current Password
                            </label>
                            <div>
                                <input
                                    type="password"
                                    className="form-control"
                                    ref="old_password"
                                    required
                                    placeholder="Current Password"
                                />
                            </div>
                        </div>

                        {Profile.error.security &&
                        Profile.error.security.new_password1 ? (
                            <FieldError
                                message={Profile.error.security.new_password1}
                            />
                        ) : (
                            ''
                        )}
                        <div className="form-group">
                            <label className="control-label">
                                New Password
                            </label>
                            <div>
                                <input
                                    type="password"
                                    className="form-control"
                                    ref="new_password1"
                                    required
                                    placeholder="New Password"
                                />
                            </div>
                        </div>

                        {Profile.error.security &&
                        Profile.error.security.new_password2 ? (
                            <FieldError
                                message={Profile.error.security.new_password2}
                            />
                        ) : (
                            ''
                        )}
                        <div className="form-group">
                            <label className="control-label">
                                Confirm New Password
                            </label>
                            <div>
                                <input
                                    type="password"
                                    className="form-control"
                                    ref="new_password2"
                                    required
                                    placeholder="Confirm New Password"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn  pull-right"
                            disabled={Profile.isSaving.security}>
                            Save
                        </button>
                        <div className="clearfix" />
                    </form>
                )}
            </div>
        );
    }
}
