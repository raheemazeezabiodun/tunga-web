import React from 'react';
import Progress from './status/Progress';
import FormStatus from './status/FormStatus';
import FieldError from './status/FieldError';

export default class Profile extends React.Component {
    componentDidMount() {
        this.props.ProfileActions.retrieveProfile();
    }

    handleSubmit = e => {
        e.preventDefault();
        var first_name = this.refs.first_name.value.trim();
        var last_name = this.refs.last_name.value.trim();
        var email = this.refs.email.value.trim();
        var password = this.refs.password.value.trim();
        const {ProfileActions} = this.props;
        ProfileActions.updateAccountInfo({
            first_name,
            last_name,
            email,
            password,
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
                        name="profile"
                        role="form"
                        ref="profile_form">
                        <FormStatus
                            loading={Profile.isSaving.account}
                            success={Profile.isSaved.account}
                            message={'Profile Saved'}
                            error={Profile.error.account}
                        />

                        {Profile.error.account &&
                        Profile.error.account.first_name ? (
                            <FieldError
                                message={Profile.error.account.first_name}
                            />
                        ) : (
                            ''
                        )}
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

                        {Profile.error.account &&
                        Profile.error.account.last_name ? (
                            <FieldError
                                message={Profile.error.account.last_name}
                            />
                        ) : (
                            ''
                        )}
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

                        {Profile.error.account &&
                        Profile.error.account.email ? (
                            <FieldError message={Profile.error.account.email} />
                        ) : (
                            ''
                        )}
                        <div className="form-group">
                            <label className="control-label">
                                Email Address *
                            </label>
                            <div>
                                <input
                                    type="text"
                                    className="form-control"
                                    ref="email"
                                    placeholder="Email Address"
                                    required
                                    defaultValue={Auth.user.email}
                                />
                            </div>
                        </div>

                        {Profile.error.account &&
                        Profile.error.account.password ? (
                            <FieldError
                                message={Profile.error.account.password}
                            />
                        ) : (
                            ''
                        )}
                        <div className="form-group">
                            <label className="control-label">
                                Enter password to save changes
                            </label>
                            <div>
                                <input
                                    type="password"
                                    className="form-control"
                                    ref="password"
                                    required
                                    placeholder="Password"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn  pull-right"
                            disabled={Profile.isSaving.account}>
                            Save
                        </button>
                        <div className="clearfix" />
                    </form>
                )}
            </div>
        );
    }
}
