import React from 'react';
import FormStatus from './status/FormStatus';
import FieldError from './status/FieldError';
import {USER_TYPE_CHOICES} from '../constants/Api';

export default class Profile extends React.Component {
    componentDidMount() {
        this.props.ProfileActions.retrieveProfile();
    }

    handleSubmit = e => {
        e.preventDefault();
        var first_name = this.refs.first_name.value.trim();
        var last_name = this.refs.last_name.value.trim();
        var type = this.refs.user_type.value.trim();
        if (!type || !last_name || !type) {
            return;
        }
        const {ProfileActions} = this.props;
        ProfileActions.updateAuthUser({first_name, last_name, type});
        return;
    };

    render() {
        const {Auth, Profile} = this.props;
        return (
            <div className="auth-form-wrapper">
                {Profile.isRetrieving ? (
                    ''
                ) : (
                    <form
                        onSubmit={this.handleSubmit}
                        name="profile"
                        role="form"
                        ref="profile_form"
                        className="well">
                        <h3>Complete your profile</h3>

                        <FormStatus
                            loading={Profile.isSaving.user}
                            success={Profile.isSaved.user}
                            message={'Profile Saved'}
                            error={Profile.error.user}
                        />

                        {Profile.error.user && Profile.error.user.first_name ? (
                            <FieldError
                                message={Profile.error.user.first_name}
                            />
                        ) : null}
                        <div className="form-group">
                            <label className="control-label">First Name</label>
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

                        {Profile.error.user && Profile.error.user.last_name ? (
                            <FieldError
                                message={Profile.error.user.last_name}
                            />
                        ) : null}
                        <div className="form-group">
                            <label className="control-label">Last Name</label>
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

                        {Auth.error.user && Auth.error.user.type ? (
                            <FieldError message={Auth.error.user.type} />
                        ) : null}
                        <div className="form-group">
                            <select
                                className="form-control"
                                ref="user_type"
                                defaultValue={Auth.user.type}
                                required>
                                <option value=""> I am a ... </option>
                                {USER_TYPE_CHOICES.map(user_type => {
                                    return (
                                        <option
                                            key={user_type.id}
                                            value={user_type.id}>
                                            {user_type.name}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>

                        <button
                            type="submit"
                            className="btn  pull-right"
                            disabled={Profile.isSaving.user}>
                            Save
                        </button>
                        <div className="clearfix" />
                    </form>
                )}
            </div>
        );
    }
}
