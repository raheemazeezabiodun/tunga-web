import React from 'react';
import {FormGroup} from 'reactstrap';

import Title from './Title';
import Success from '../../core/Success';
import Error from '../../core/Error';
import FieldError from '../../core/FieldError';
import Button from '../../core/Button';

import connect from '../../../connectors/UtilityConnector';

import {openCalendlyWidget} from '../../utils/calendly';

class ContactUs extends React.Component {

    componentDidUpdate(prevProps, prevState, snapShot) {
        if (
            this.props.Utility.contact.isSent.contact &&
            !prevProps.Utility.contact.isSent.contact
        ) {
            this.refs.contact_form.reset();
        }
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
        const {Utility} = this.props;

        return (
            <section id="contact-us">
                <Title>Where to find us</Title>

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

                            <a href="mailto:hello@tunga.io" target="_blank">
                                hello@tunga.io
                            </a>
                        </div>
                        <div>
                            <Button onClick={() => {openCalendlyWidget()}} size="lg">
                                Schedule a call with us
                            </Button>
                        </div>
                    </div>
                    <div className="section">
                        <form
                            ref="contact_form"
                            onSubmit={this.sendEmail.bind(this)}>
                            {Utility.contact.isSent.contact ? (
                                <Success message="We've received your message and we'll get back to you shortly." />
                            ) : null}
                            {Utility.contact &&
                            Utility.contact.error &&
                            Utility.contact.error.contact ? (
                                <Error
                                    message={
                                        Utility.contact.error.contact.message ||
                                        'Please fix the errors below and try again.'
                                    }
                                />
                            ) : null}

                            {Utility.contact.error &&
                            Utility.contact.error.contact &&
                            Utility.contact.error.contact.fullname ? (
                                <FieldError
                                    message={
                                        Utility.contact.error.contact.fullname
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
                            Utility.contact.error.contact &&
                            Utility.contact.error.contact.email ? (
                                <FieldError
                                    message={
                                        Utility.contact.error.contact.email
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
                            Utility.contact.error.contact &&
                            Utility.contact.error.contact.body ? (
                                <FieldError
                                    message={Utility.contact.error.contact.body}
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
                            <div className="float-right">
                                <Button type="submit" size="lg">
                                    Send
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        );
    }
}

export default connect(ContactUs);
