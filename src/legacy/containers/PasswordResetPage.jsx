import React from 'react';
import Progress from '../components/status/Progress';
import Error from '../components/status/Error';
import Success from '../components/status/Success';
import ShowcaseContainer from './ShowcaseContainer';

import connect from '../utils/connectors/AuthConnector';

class PasswordReset extends React.Component {
    componentDidUpdate(prevProps, prevState) {
        if (this.props.Auth.isReset && !prevProps.Auth.isReset) {
            this.refs.reset_form.reset();
        }
    }

    handleSubmit = e => {
        e.preventDefault();
        var email = this.refs.email.value.trim();
        if (!email) {
            return;
        }

        this.props.AuthActions.resetPassword({email});
        return;
    };

    renderHeaderContent() {
        const {Auth} = this.props;

        return (
            <form
                onSubmit={this.handleSubmit}
                name="reset-form"
                role="form"
                ref="reset_form">
                <div className="heading-3">Reset Password</div>

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
                    <button
                        type="submit"
                        className="btn pull-right"
                        disabled={Auth.isResetting}>
                        Reset Password
                    </button>
                </div>
            </form>
        );
    }

    render() {
        return (
            <ShowcaseContainer
                className="auth-page"
                headerContent={this.renderHeaderContent()}
            />
        );
    }
}

export default connect(PasswordReset);
