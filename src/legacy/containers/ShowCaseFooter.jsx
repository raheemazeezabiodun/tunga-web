import PropTypes from 'prop-types';
import React from 'react';
import {Link} from 'react-router';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Button, FormGroup} from 'react-bootstrap';

import SectionHeading from '../components/SectionHeading';
import Success from '../components/status/Success';
import Error from '../components/status/Error';
import FieldError from '../components/status/FieldError';

import * as UtilityActions from '../actions/UtilityActions';

import {openCalendlyWidget, proxySafeUrl} from '../utils/router';
import {safeParseJSON} from "../utils/helpers";

class ShowCaseFooter extends React.Component {
    componentDidMount() {
        const {UtilityActions} = this.props;
        UtilityActions.getMediumPosts();
    }

    componentDidUpdate(prevProps, prevState) {
        if (
            this.props.Utility.contact.isSent &&
            !prevProps.Utility.contact.isSent
        ) {
            this.refs.contact_form.reset();
        }
    }

    onScheduleCall() {
        openCalendlyWidget();
    }

    sendEmail(e) {
        e.preventDefault();
        const fullname = this.refs.fullname.value.trim();
        const email = this.refs.email.value.trim();
        const body = this.refs.body.value.trim();
        const {UtilityActions} = this.props;
        UtilityActions.sendContactRequest({fullname, email, body});
        return;
    }

    render() {
        const {Utility, showContactUs} = this.props;

        return (
            <div>
                {showContactUs ? (
                    <section id="contact-us">
                        <SectionHeading>Where to find us</SectionHeading>

                        <div className="contact-sections">
                            <div className="section">
                                <div className="contact-info">
                                    <p>
                                        <strong>Kampala office:</strong>
                                        <br />
                                        Design Hub Kampala, 5th Street,
                                        Industrial Area, Kampala, Uganda
                                    </p>
                                    <p>
                                        <strong>Amsterdam office:</strong>
                                        <br />
                                        The Collab, Wibautstraat 131, 1091 GL
                                        Amsterdam, The Netherlands
                                    </p>
                                    <p>
                                        <strong>Lagos office:</strong>
                                        <br />
                                        32 Barikisu Iyede street, Yaba, Lagos,
                                        Nigeria
                                    </p>

                                    <Link href="mailto:hello@tunga.io">
                                        hello@tunga.io
                                    </Link>
                                </div>
                                <div>
                                    <button
                                        className="btn btn-callout"
                                        onClick={this.onScheduleCall.bind(
                                            this,
                                        )}>
                                        Schedule a call with us
                                    </button>
                                </div>
                            </div>
                            <div className="section">
                                <form
                                    ref="contact_form"
                                    onSubmit={this.sendEmail.bind(this)}>
                                    {Utility.contact.isSent ? (
                                        <Success message="We've received your message and we'll get back to you shortly." />
                                    ) : null}
                                    {Utility.contact &&
                                    Utility.contact.error ? (
                                        <Error
                                            message={
                                                Utility.contact.error.message ||
                                                'Please fix the errors below and try again.'
                                            }
                                        />
                                    ) : null}

                                    {Utility.contact.error &&
                                    Utility.contact.error.fullname ? (
                                        <FieldError
                                            message={
                                                Utility.contact.error.fullname
                                            }
                                        />
                                    ) : null}
                                    <FormGroup>
                                        <input
                                            type="text"
                                            ref="fullname"
                                            className="form-control"
                                            required
                                            placeholder="Your Name"
                                        />
                                    </FormGroup>

                                    {Utility.contact.error &&
                                    Utility.contact.error.email ? (
                                        <FieldError
                                            message={
                                                Utility.contact.error.email
                                            }
                                        />
                                    ) : null}
                                    <FormGroup>
                                        <input
                                            type="text"
                                            ref="email"
                                            className="form-control"
                                            placeholder="Your email address"
                                            required
                                        />
                                    </FormGroup>

                                    {Utility.contact.error &&
                                    Utility.contact.error.body ? (
                                        <FieldError
                                            message={Utility.contact.error.body}
                                        />
                                    ) : null}
                                    <FormGroup>
                                        <textarea
                                            ref="body"
                                            className="form-control"
                                            placeholder="Type your message here"
                                            required
                                        />
                                    </FormGroup>
                                    <div className="pull-right">
                                        <Button
                                            className="btn btn-callout"
                                            type="submit">
                                            Send
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </section>
                ) : null}
                <footer>
                    <div className="sections">
                        <div className="section social">
                            <div>
                                <div className="tunga-logo-btm">
                                    <img
                                        src={require('../images/logo_round.png')}
                                    />
                                </div>
                                <p>
                                    <a href="http://www.butterflyworks.org/">
                                        a butterfly works initiative
                                    </a>
                                </p>
                                <div className="social-networks">
                                    <a
                                        target="_blank"
                                        href="https://www.linkedin.com/company/tunga"
                                        id="fb"
                                        title="LinkedIn">
                                        <i className="fa fa-linkedin" />
                                    </a>
                                    <a
                                        target="_blank"
                                        href="https://www.facebook.com/tunga.io"
                                        id="fb"
                                        title="Facebook">
                                        <i className="fa fa-facebook" />
                                    </a>
                                    <a
                                        target="_blank"
                                        href="https://twitter.com/tunga_io"
                                        id="twitter"
                                        title="Twitter">
                                        <i className="fa fa-twitter" />
                                    </a>
                                    <a
                                        target="_blank"
                                        href="https://blog.tunga.io"
                                        id="medium"
                                        title="Medium">
                                        <i className="fa fa-medium" />
                                    </a>
                                </div>
                                <div className="footer-address">
                                    <p>Wibautstraat 131</p>
                                    <p>1091 GL Amsterdam, The Netherlands</p>
                                    <p>
                                        <a href="mailto:hello@tunga.io">
                                            hello@tunga.io
                                        </a>
                                    </p>
                                    <p>
                                        <a href="tel:+31615955194">
                                            +31615955194
                                        </a>
                                    </p>
                                    <p>
                                        <Link
                                            to="/call"
                                            onClick={this.onScheduleCall.bind(
                                                this,
                                            )}>
                                            Schedule a call with us
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="section footer-info">
                            <div>
                                <h4>Top Pages</h4>
                                <ul>
                                    <li>
                                        <a href={safeParseJSON('/pricing')}>Pricing</a>
                                    </li>
                                    <li>
                                        <a href={safeParseJSON('/our-story')}>Our Story</a>
                                    </li>
                                    <li>
                                        <a href="https://blog.tunga.io/" target="_blank">
                                            Blog
                                        </a>
                                    </li>
                                    <li>
                                        <a href={safeParseJSON('/effortless-software-projects')}>Effortless Software projects</a>
                                    </li>
                                    <li>
                                        <a href={safeParseJSON('/dedicated-developers')}>Dedicated Developers</a>
                                    </li>
                                    <li>
                                        <a href={safeParseJSON('/IT-recruitment')}>Recruitment Services</a>
                                    </li>
                                    <li>
                                        <a href={safeParseJSON('/hire-ios-developers')}>iOS Developers</a>
                                    </li>
                                    <li>
                                        <a href={safeParseJSON('/african-software-developers')}>African Developers</a>
                                    </li>
                                    <li>
                                        <a href={safeParseJSON('/remote-developers')}>Remote Teams</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="section footer-info">
                            <div>
                                <h4>Legal information</h4>
                                <ul className="list-info">
                                    <li>
                                        <a
                                            href="https://tunga.io/privacy">
                                            Privacy Policy
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="https://tunga.io/agreement">
                                            User Agreement
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="https://tunga.io/code-of-conduct">
                                            Code of Conduct
                                        </a>
                                    </li>
                                </ul>

                            </div>
                        </div>
                        <div className="section latest-from-blog">
                            <div>
                                <h4>Latest from our blog</h4>
                                <ul className="list-unstyled">
                                    {Utility.posts.length
                                        ? Utility.posts
                                              .slice(0, 4)
                                              .map(article => {
                                                  return (
                                                      <li>
                                                          <a
                                                              target="_blank"
                                                              href={
                                                                  article.url
                                                              }>
                                                              <i className="fa fa-angle-right" />{' '}
                                                              {article.title}
                                                          </a>
                                                      </li>
                                                  );
                                              })
                                        : null}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="text-center">
                        2018 Tunga BV - All rights reserved
                    </div>
                </footer>
            </div>
        );
    }
}

ShowCaseFooter.propTypes = {
    showContactUs: PropTypes.bool,
};

ShowCaseFooter.defaultProps = {
    showContactUs: false,
};

function mapStateToProps(state) {
    return {Utility: state.Utility};
}

function mapDispatchToProps(dispatch) {
    return {
        UtilityActions: bindActionCreators(UtilityActions, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ShowCaseFooter);
