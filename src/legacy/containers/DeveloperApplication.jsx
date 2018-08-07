import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Helmet from 'react-helmet';

import Progress from '../components/status/Progress';
import Error from '../components/status/Error';
import Success from '../components/status/Success';
import FieldError from '../components/status/FieldError';
import ShowcaseContainer from './ShowcaseContainer';

import * as AuthActions from '../actions/AuthActions';
import * as ProfileActions from '../actions/ProfileActions';

import {nl_to_br} from '../utils/html';

class DeveloperApplication extends React.Component {
    componentDidMount() {
        this.props.ProfileActions.getCountries();
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.Auth.hasApplied && !prevProps.Auth.hasApplied) {
            this.refs.signup_form.reset();
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        var first_name = this.refs.first_name.value.trim();
        var last_name = this.refs.last_name.value.trim();
        var email = this.refs.email.value.trim();
        var phone_number = this.refs.phone_number.value.trim();
        var country = this.refs.country.value.trim();
        var city = this.refs.city.value.trim();
        var stack = nl_to_br(this.refs.stack.value.trim());
        var experience = nl_to_br(this.refs.experience.value.trim());
        var discovery_story = nl_to_br(this.refs.discovery_story.value.trim());

        this.props.AuthActions.apply({
            first_name,
            last_name,
            email,
            phone_number,
            country,
            city,
            stack,
            experience,
            discovery_story,
        });
        return;
    }

    renderHeaderContent() {
        const {Auth, Profile, isHiring} = this.props;

        return (
            <div>
                <Helmet title="Tunga | Developer Application" />
                <h2 className="crt-acc-heading">
                    Apply to become a Tunga developer
                </h2>

                {isHiring ? (
                    <div className="form-elements-container">
                        <form
                            onSubmit={this.handleSubmit.bind(this)}
                            name="signup"
                            role="form"
                            ref="signup_form">
                            {Auth.isApplying ? <Progress /> : null}

                            {Auth.hasApplied ? (
                                <Success message="Thank you for your application. Your application has been sent to the Tunga team successfully. We will reach out to you soon." />
                            ) : null}

                            {Auth.error.apply ? (
                                <Error
                                    message={
                                        Auth.error.apply.non_field_errors ||
                                        'Please correct the errors below'
                                    }
                                />
                            ) : null}

                            {Auth.error.apply && Auth.error.apply.first_name ? (
                                <FieldError
                                    message={Auth.error.apply.first_name}
                                />
                            ) : null}
                            <div className="form-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="fname"
                                    ref="first_name"
                                    required
                                    placeholder="First name"
                                />
                            </div>

                            {Auth.error.apply && Auth.error.apply.last_name ? (
                                <FieldError
                                    message={Auth.error.apply.last_name}
                                />
                            ) : null}
                            <div className="form-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="lname"
                                    ref="last_name"
                                    required
                                    placeholder="Last name"
                                />
                            </div>

                            {Auth.error.apply && Auth.error.apply.email ? (
                                <FieldError message={Auth.error.apply.email} />
                            ) : null}
                            <div className="form-group">
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    ref="email"
                                    required
                                    placeholder="E-mail"
                                />
                            </div>

                            {Auth.error.apply &&
                            Auth.error.apply.phone_number ? (
                                <FieldError
                                    message={Auth.error.apply.phone_number}
                                />
                            ) : null}
                            <div className="form-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="phone_number"
                                    ref="phone_number"
                                    required
                                    placeholder="Phone Number"
                                />
                            </div>

                            {Auth.error.apply && Auth.error.apply.country ? (
                                <FieldError
                                    message={Auth.error.apply.country}
                                />
                            ) : (
                                ''
                            )}
                            <div className="form-group">
                                <select
                                    className="form-control"
                                    ref="country"
                                    required>
                                    <option value="">- Country -</option>
                                    {Profile.countries.map(country => {
                                        if (!country.code) {
                                            return null;
                                        }
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

                            {Auth.error.apply && Auth.error.apply.city ? (
                                <FieldError message={Auth.error.apply.city} />
                            ) : null}
                            <div className="form-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="city"
                                    ref="city"
                                    required
                                    placeholder="City of residence"
                                />
                            </div>

                            {Auth.error.update && Auth.error.update.stack ? (
                                <FieldError message={Auth.error.update.stack} />
                            ) : null}
                            <div className="form-group">
                                <label className="control-label">
                                    Your software stack *
                                </label>
                                <textarea
                                    id="stack"
                                    className="form-control"
                                    ref="stack"
                                    rows="3"
                                    placeholder="Please fill in the programming languages and frameworks you master"
                                    required
                                />
                            </div>

                            {Auth.error.update &&
                            Auth.error.update.experience ? (
                                <FieldError
                                    message={Auth.error.update.experience}
                                />
                            ) : null}
                            <div className="form-group">
                                <label className="control-label">
                                    Software experience *
                                </label>
                                <textarea
                                    id="experience"
                                    className="form-control"
                                    ref="experience"
                                    rows="5"
                                    placeholder="Please fill in your experience"
                                    required
                                />
                            </div>

                            {Auth.error.update &&
                            Auth.error.update.discovery_story ? (
                                <FieldError
                                    message={Auth.error.update.discovery_story}
                                />
                            ) : null}
                            <div className="form-group">
                                <textarea
                                    id="discovery-story"
                                    className="form-control"
                                    ref="discovery_story"
                                    rows="3"
                                    placeholder="How did you hear about Tunga?"
                                    required
                                />
                            </div>

                            <div className="form-group text-center">
                                <button
                                    type="submit"
                                    className="btn"
                                    disabled={Auth.isApplying}>
                                    Apply
                                </button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div className="announcement">
                        <p>
                            We are not accepting new applications from
                            developers at the moment.
                        </p>
                        <p>
                            Please follow us on{' '}
                            <i className="fa fa-twitter twitter" /> Twitter{' '}
                            <a
                                className="twitter"
                                href="https://twitter.com/tunga_io"
                                target="_blank">
                                @tunga_io
                            </a>{' '}
                            to get notified when opportunities for new
                            developers open up.
                        </p>
                    </div>
                )}
            </div>
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

function mapStateToProps(state) {
    return {Auth: state.Auth, Profile: state.Profile};
}

function mapDispatchToProps(dispatch) {
    return {
        AuthActions: bindActionCreators(AuthActions, dispatch),
        ProfileActions: bindActionCreators(ProfileActions, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(
    DeveloperApplication,
);
