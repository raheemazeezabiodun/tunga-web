import React from 'react';
import {FormGroup} from 'reactstrap';

import Title from './elements/Title';
import Header from "./elements/Header";
import Footer from "./elements/Footer";
import Success from '../core/Success';
import Error from '../core/Error';
import FieldError from '../core/FieldError';
import Button from '../core/Button';
import MetaTags from "../MetaTags";
import Upload from "../core/Upload";
import CountrySelector from '../core/CountrySelector';

import connect from '../../connectors/UtilityConnector';

class Join extends React.Component {

    constructor(props) {
        super(props);
        this.state = {cv: null, country: null};
    }

    componentDidUpdate(prevProps, prevState, snapShot) {
        if (
            this.props.Utility.contact.isSent.invite &&
            !prevProps.Utility.contact.isSent.invite
        ) {
            this.refs.contact_form.reset();
            this.setState({cv: null, country: null});
        }
    }

    sendEmail(e) {
        e.preventDefault();

        const {UtilityActions} = this.props;

        const name = this.refs.name.value.trim(),
            email = this.refs.email.value.trim(),
            motivation = this.refs.motivation.value.trim();

        let reqData = {name, email, motivation, country: this.state.country};
        if(this.state.cv) {
            reqData.cv = this.state.cv;
        }
        UtilityActions.sendInviteRequest(reqData);
        return;
    }

    render() {
        const {Utility} = this.props;

        return (
            <div className="developer-invite-page">
                <MetaTags title="Join Tunga!" description="Become a member of our thriving community of software developers"/>

                <Header title="Join Tunga!" showCTA={false}/>

                <section id="contact-us">
                    <Title>Become a member of our thriving community of software developers</Title>

                    <div className="contact-sections">
                        <div className="section">
                            <div className="contact-info">
                                <p>
                                    Hey, you! Do you have at least 2 years of software development experience? Do you want to work on reputable, international software development projects? Are you looking to expand your portfolio with exciting and diverse experience?
                                </p>
                                <p>
                                    <strong>Join Tunga!</strong>
                                    <br />
                                    Being a Tunga software developer allows you to work on international and well-paid software projects, at a freelance or full-time basis. Joining is easy. Just fill in the details in the box to the right and add your CV. If you meet the prerequisites, we’ll be in touch very soon for the onboarding procedure.
                                </p>
                                <p>
                                    <strong>Prerequisites</strong>
                                    <br />
                                    - You need to have at least two years of software development expertise (educational projects included)<br/>
                                    - A national of an African country and residing in an African country<br/>
                                    - A CV and/or portfolio
                                </p>

                                <p>
                                    <strong>Next Steps</strong><br/>
                                    If you pass the CV and/or portfolio screening, we’ll follow up with an introduction. We’ll explain a few details, such as our code of conduct, pay, and our background story. Furthermore, we’ll send you an invite for an informal chat. During this chat, someone from Tunga will ask you a few questions to get to know you a little better. If all goes well and it seems that we’re a fit so far, we’ll move on to the last step: the soft skills and hard skills tests. Once you pass these, we’ll start looking for your first Tunga project!
                                </p>
                            </div>
                        </div>
                        <div className="section">
                            <form
                                ref="contact_form"
                                onSubmit={this.sendEmail.bind(this)}>
                                <div className="statuses">
                                    {Utility.contact &&
                                        Utility.contact.isSent &&
                                        Utility.contact.isSent.invite ? (
                                        <Success variant='light' message="Your details have been sent successfully. Thank you!" />
                                    ) : null}
                                    {Utility.contact &&
                                    Utility.contact.error &&
                                    Utility.contact.error.invite ? (
                                        <Error
                                            message={
                                                Utility.contact.error.invite.message ||
                                                'Please fix the errors below and try again.'
                                            }
                                        />
                                    ) : null}
                                </div>

                                {Utility.contact.error &&
                                Utility.contact.error.invite &&
                                Utility.contact.error.invite.name ? (
                                    <FieldError
                                        message={
                                            Utility.contact.error.invite.name
                                        }
                                    />
                                ) : null}
                                <FormGroup>
                                    <input
                                        type="text"
                                        ref="name"
                                        className="form-control"
                                        required
                                        placeholder="Your Name"
                                    />
                                </FormGroup>

                                {Utility.contact.error &&
                                Utility.contact.error.invite &&
                                Utility.contact.error.invite.email ? (
                                    <FieldError
                                        message={
                                            Utility.contact.error.invite.email
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
                                Utility.contact.error.country &&
                                Utility.contact.error.invite.country ? (
                                    <FieldError
                                        message={Utility.contact.error.invite.country}
                                    />
                                ) : null}
                                <FormGroup>
                                    <CountrySelector selected={this.state.country} onChange={(country) => {this.setState({country})}}
                                                     required/>
                                </FormGroup>

                                {Utility.contact.error &&
                                Utility.contact.error.invite &&
                                Utility.contact.error.invite.motivation ? (
                                    <FieldError
                                        message={Utility.contact.error.invite.motivation}
                                    />
                                ) : null}
                                <FormGroup>
                                        <textarea
                                            ref="motivation"
                                            className="form-control"
                                            placeholder="Type your motivation here"
                                            required
                                        />
                                </FormGroup>
                                {Utility.contact.error &&
                                Utility.contact.error.invite &&
                                Utility.contact.error.invite.cv ? (
                                    <FieldError
                                        message={Utility.contact.error.invite.cv}
                                    />
                                ) : null}
                                <FormGroup>
                                    <Upload variant="icon" size="icon"
                                            actionText="Add CV (pdf format)"
                                            onChange={(files) => {this.setState({cv: files[0]})}}
                                            showSelected={!!this.state.cv}
                                            showSelector={!this.state.cv} accept="application/pdf"/>
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

                <Footer/>
            </div>
        );
    }
}

export default connect(Join);
