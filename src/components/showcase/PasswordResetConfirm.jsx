import React from 'react';
import querystring from "querystring";

import Error from '../core/Error';
import Success from '../core/Success';
import Button from "../core/Button";

import connect from '../../connectors/AuthConnector';
import FieldError from "../core/FieldError";
import PropTypes from "prop-types";

class PasswordResetConfirm extends React.Component {

    static defaultProps = {
        newUser: false
    };

    static propTypes = {
        uid: PropTypes.string.required,
        token: PropTypes.string.required,
        newUser: PropTypes.bool,
    };

    componentDidUpdate(prevProps, prevState, snapShot) {
        if (this.props.Auth.isReset && !prevProps.Auth.isReset) {
            this.refs.reset_confirm_form.reset();

            const {location} = this.props,
                queryParams = querystring.parse((location.search || '').replace('?', ''));
            let next = '/';
            if (queryParams && queryParams.next) {
                next = queryParams.next;
            }
            window.location.href = next;
        }
    }

    onConfirm = e => {
        e.preventDefault();
        let {uid, token} = this.props,
            new_password1 = this.refs.new_password1.value.trim(),
            new_password2 = this.refs.new_password2.value.trim();

        if (!new_password1 || !new_password2) {
            return;
        }

        this.props.AuthActions.resetPasswordConfirm({
            uid,
            token,
            new_password1,
            new_password2,
        });
    };

    render() {
        const {Auth, newUser} = this.props,
            queryParams = querystring.parse((location.search || '').replace('?', ''));
        let isNew = newUser || queryParams.new_user;

        return (
            <div className="auth-page">
                <header className="height-100">
                    <div className="container">
                        <form
                            onSubmit={this.onConfirm}
                            name="reset-confirm"
                            role="form"
                            ref="reset_confirm_form">
                            <h3>
                                {isNew ? 'Create' : 'Reset'} Password
                            </h3>

                            {Auth.error.reset_confirm && Auth.error.reset_confirm.token ? (
                                <Error message="Invalid token" />
                            ):null}

                            {Auth.isReset?(
                                <Success message={`Password ${isNew?'set':'changed'} successfully`}/>
                            ):null}

                            {Auth.error.reset_confirm &&
                            Auth.error.reset_confirm.new_password1 ? (
                                <FieldError
                                    message={Auth.error.reset_confirm.new_password1}
                                />
                            ) : (
                                ''
                            )}
                            <div className="form-group">
                                <label className="control-label">
                                    {isNew ? null : 'New '}Password
                                </label>
                                <div>
                                    <input
                                        type="password"
                                        className="form-control"
                                        ref="new_password1"
                                        required
                                        placeholder={`${isNew ? '' : 'New '}Password`}
                                    />
                                </div>
                            </div>

                            {Auth.error.reset_confirm &&
                            Auth.error.reset_confirm.new_password2 ? (
                                <FieldError
                                    message={Auth.error.reset_confirm.new_password2}
                                />
                            ) : (
                                ''
                            )}
                            <div className="form-group">
                                <label className="control-label">
                                    Confirm {isNew ? null : 'New '}Password
                                </label>
                                <div>
                                    <input
                                        type="password"
                                        className="form-control"
                                        ref="new_password2"
                                        required
                                        placeholder={`Confirm ${
                                            isNew ? '' : 'New '
                                            }Password`}
                                    />
                                </div>
                            </div>

                            <div className="clearfix">
                                <Button
                                    type="submit"
                                    disabled={Auth.isResetting}>
                                    {isNew ? 'Set' : 'Change'} Password
                                </Button>
                            </div>
                        </form>
                    </div>
                </header>
            </div>
        );
    }
}

export default connect(PasswordResetConfirm);
