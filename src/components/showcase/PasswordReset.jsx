import React from 'react';

import Progress from '../core/Progress';
import Error from '../core/Error';
import Success from '../core/Success';
import Button from "../core/Button";

import connect from '../../connectors/AuthConnector';

class PasswordReset extends React.Component {

    componentDidUpdate(prevProps, prevState, snapShot) {
        if (this.props.Auth.isReset && !prevProps.Auth.isReset) {
            this.refs.reset_form.reset();
        }
    }

    onReset = e => {
        e.preventDefault();
        let email = this.refs.email.value.trim();
        if (!email) {
            return;
        }

        this.props.AuthActions.resetPassword({email});
    };

    render() {
        const {Auth} = this.props;

        return (
            <div className="auth-page">
                <header className="height-100">
                    <div className="container">
                        <form
                            onSubmit={this.onReset}
                            name="reset-form"
                            role="form"
                            ref="reset_form">
                            <h3>Reset Password</h3>

                            {Auth.isResetting ? <Progress /> : null}

                            {Auth.isReset ? (
                                <Success message="Instructions for resetting your password have been sent to your email." />
                            ) : null}

                            {Auth.error.reset ? (
                                <Error
                                    message={
                                        Auth.error.reset.non_field_errors ||
                                        "Sorry, we couldn't reset your password. Please try again."
                                    }
                                />
                            ) : null}

                            <div className="form-group">
                                <label className="control-label" htmlFor="email">
                                    Email:
                                </label>
                                <input
                                    type="email"
                                    className="form-control"
                                    ref="email"
                                    required
                                    placeholder="Email"
                                />
                            </div>

                            <div className="clearfix">
                                <Button
                                    type="submit"
                                    className="btn float-right"
                                    disabled={Auth.isResetting}>
                                    Reset Password
                                </Button>
                            </div>
                        </form>
                    </div>
                </header>
            </div>
        );
    }
}

export default connect(PasswordReset);
