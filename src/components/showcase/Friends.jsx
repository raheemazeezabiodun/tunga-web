import React from 'react';
import {Link} from 'react-router-dom';
import CopyToClipboard from 'react-copy-to-clipboard';

import Header from "./elements/Header";
import Footer from "./elements/Footer";
import MetaTags from "../MetaTags";
import Icon from "../core/Icon";
import OverlayTooltip from "../core/OverlayTooltip";

import {nl_to_br} from "../../legacy/utils/html";

const L10N_RESOURCES = {
    en: {
        flag: '../images/showcase/English.png',
        linkedin:
        'Trouble finding good developers or looking to build an app? Please check out this great initiative called Tunga .\n' +
        '\n' +
        'If you send me a message I can connect you to them by e-mail. For every paying customer I refer to them they donate 5% up to EUR1,000 to WeAreBits, a network of schools that gives free tech education to African youths from less privileged backgrounds',
        email: {
            subject: 'Introduction to Tunga',
            body:
            'Hey,\n' +
            '\n' +
            'I wanted to connect you with Bart Leijssenaar of Tunga (cc), which helps companies build software and find good developers. Their mission is to create tech jobs for African youths. I think this could be interesting for you and a contact would be mutually beneficial.\n' +
            '\n' +
            'I’ll let you guys take it from here.',
            meta: {
                cc: 'To CC:',
                subject: 'Subject:',
            },
        },
    },
    nl: {
        flag: '../images/showcase/Dutch.png',
        linkedin:
        'Ben je op zoek naar goede software developers of heb je plannen voor het bouwen van een app? Dan moet je zeker even de website van Tunga bekijken.\n' +
        '\n' +
        'Als je me een berichtje stuurt dan kan ik je rechtstreeks met ze in contact brengen. Voor iedere betalende klant die ik doorstuur doneren zij 5% tot max EUR1,000 aan WeAreBits, een netwerk van scholen die gratis opleiding bieden aan Afrikaanse jongeren met een minder bevoorrechte achtergrond.\n',
        email: {
            subject: 'Introductie Tunga',
            body:
            'Hi,\n' +
            '\n' +
            'Ik wil je bij deze even in contact brengen met Bart Leijssenaar van Tunga (cc). Zij helpen bedrijven om software te bouwen en goede programmeurs te vinden. Hun missie is het creëren van IT banen voor Afrikaanse jongeren. Ik denk dat een kennismaking interessant voor je kan zijn en wederzijds voordeel kan opleveren.\n' +
            '\n' +
            'Ik laat het verder even aan jullie om opvolging te geven.\n',
            meta: {
                cc: 'Aan CC:',
                subject: 'Onderwerpen',
            },
        },
    },
};

export default class Friends extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            lang: 'en',
            langClass: '',
            copied: null,
        };
    }

    onSelectLanguage(lang) {
        this.setState({lang, langClass: ''});
    }

    setCopied(field) {
        this.setState({copied: field});
        let fot = this;

        // Clear message after 3 seconds
        setTimeout(() => {
            if (fot.state.copied === field) {
                this.setState({copied: null});
            }
        }, 5000);
    }

    getLinkedInShareLink() {
        return `https://www.linkedin.com/shareArticle?mini=true&url=https://tunga.io?latest&source=tunga.io`;
    }

    renderLanguageWidget() {
        return (
            <div
                className={`lang-list ${this.state.lang} ${
                    this.state.langClass
                    }`}>
                <div className="controls">
                    <Icon
                        name="caret-down" className="open"
                        onClick={() => {
                            this.setState({langClass: ''});
                        }}
                    />
                    <Icon
                        name="caret-left" className="closed"
                        onClick={() => {
                            this.setState({langClass: 'open'});
                        }}
                    />
                </div>
                <div className="flags">
                    <img
                        className="en"
                        src={require('../../assets/images/flags/English.png')}
                        onClick={this.onSelectLanguage.bind(this, 'en')}
                    />
                    <img
                        className="nl"
                        src={require('../../assets/images/flags/Dutch.png')}
                        onClick={this.onSelectLanguage.bind(this, 'nl')}
                    />
                </div>
            </div>
        );
    }

    render() {
        let title = (
                <div>
                    Help Us Create Tech Jobs for <br />African Youths
                </div>
            ),
            description = (
                <div>
                    <div style={{marginBottom: '40px'}}>
                        Become a Friend of Tunga by referring leads to us. For each
                        lead that becomes a paying customer we donate 5% up to EUR
                        1,000 to{' '}
                        <a href="http://bitsacademy.org/" target="_blank">
                            WeAreBits
                        </a>, a network of schools that gives free tech education to
                        African youths from less privileged backgrounds
                    </div>
                    <div>
                        <Link to="/friends/rules">
                            How it works in detail
                        </Link>
                    </div>
                </div>
            );

        let localeText = L10N_RESOURCES[this.state.lang];

        return (
            <div className="friends-page">
                <MetaTags title="Friends of Tunga"
                          description="Become a Friend of Tunga by referring leads to us"/>
                <Header title={title} description={description} showCTA={false} addMeta={false}/>

                <section id="who-we-are">
                    <div className="container">
                        <div className="who-we-are">
                            Who are we looking for?
                        </div>
                        <div className="text-center">
                            <div className="looking-for-options">
                                <div className="option">
                                    <div className="first-content-box">
                                        <div className="img-container">
                                            <Icon name="building" />
                                        </div>
                                        <div className="text-container">
                                            <p>
                                                <strong>
                                                    Companies large and
                                                    small
                                                </strong>{' '}
                                                that want to develop their
                                                app or website
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="option">
                                    <div className="first-content-box">
                                        <div className="img-container">
                                            <Icon name="team-thick" />
                                        </div>
                                        <div className="text-container">
                                            <p>
                                                <strong>
                                                    Software teams{' '}
                                                </strong>
                                                that have trouble finding
                                                flexible access to good
                                                developers
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="option">
                                    <div className="first-content-box">
                                        <div className="img-container">
                                            <Icon name="rocket-side-thick" />
                                        </div>
                                        <div className="text-container">
                                            <p>
                                                <strong>
                                                    Startups and innovation
                                                    teams
                                                </strong>{' '}
                                                that need to build a
                                                prototype or MVP
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section>
                    <div className="container">
                        <div className="middle-content-box">
                            Send your friends a personal e-mail with{' '}
                            <a href="mailto:bart@tunga.io">bart@tunga.io</a>{' '}
                            in cc. To make it easy for you, we made an
                            example email that you can copy or use to draft
                            your own e-mail.
                        </div>
                    </div>
                </section>

                <section id="referral">
                    <div className="container">
                        <div className="referral-widgets">
                            <div className="cc-email">
                                {this.renderLanguageWidget()}
                                <div className="cc-email-widget">
                                    <div className="meta">
                                        <div className="item">
                                            {localeText.email.meta.cc}
                                        </div>
                                        <div className="item">
                                            {localeText.email.meta.subject}
                                        </div>
                                    </div>
                                    <div className="values">
                                        <div className="item">
                                            <CopyToClipboard
                                                text='bart@tunga.io'>
                                                <div>
                                                    <OverlayTooltip className="float-right"
                                                        placement="top"
                                                        overlay={
                                                            <strong>Cop{this.state.copied === 'email_cc'?'ied':'y'}</strong>
                                                        }>
                                                        <Icon
                                                            name="copy"
                                                            onClick={this.setCopied.bind(
                                                                this,
                                                                'email_cc',
                                                            )}
                                                        />
                                                    </OverlayTooltip>
                                                    bart@tunga.io
                                                </div>
                                            </CopyToClipboard>
                                        </div>
                                        <div className="item">
                                            <CopyToClipboard
                                                text={
                                                    localeText.email.subject
                                                }>
                                                <div>
                                                    <OverlayTooltip className="float-right"
                                                        placement="top"
                                                        overlay={
                                                            <strong>Cop{this.state.copied === 'email_subject'?'ied':'y'}</strong>
                                                        }>
                                                        <Icon
                                                            name="copy"
                                                            onClick={this.setCopied.bind(
                                                                this,
                                                                'email_subject',
                                                            )}
                                                        />
                                                    </OverlayTooltip>
                                                    {
                                                        localeText.email
                                                            .subject
                                                    }
                                                </div>
                                            </CopyToClipboard>
                                        </div>
                                        <div className="item body">
                                            <CopyToClipboard
                                                text={
                                                    localeText.email.body
                                                }>
                                                <div>
                                                    <OverlayTooltip  className="float-right"
                                                        placement="top"
                                                        overlay={
                                                            <strong>Cop{this.state.copied === 'email_body'?'ied':'y'}</strong>
                                                        }>
                                                        <Icon
                                                            name="copy"
                                                            onClick={this.setCopied.bind(
                                                                this,
                                                                'email_body',
                                                            )}
                                                        />
                                                    </OverlayTooltip>
                                                    <div
                                                        dangerouslySetInnerHTML={{
                                                            __html: nl_to_br(
                                                                localeText
                                                                    .email
                                                                    .body,
                                                            ),
                                                        }}
                                                    />
                                                </div>
                                            </CopyToClipboard>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="linkedin-share">
                                <div className="linkedin-share-widget">
                                    <a
                                        href={this.getLinkedInShareLink()}
                                        target="_blank"
                                        className="btn btn-linkedin-share">
                                        Share this post on Linkedin
                                    </a>
                                    <Icon name="linkedin-square" />
                                </div>
                                <div className="share-title">
                                    Linkedin Post:
                                    {this.renderLanguageWidget()}
                                </div>
                                <div className="share-text">
                                    <CopyToClipboard
                                        text={localeText.linkedin}>
                                        <div>
                                            <OverlayTooltip className="float-right"
                                                placement="top"
                                                overlay={
                                                    <strong>Cop{this.state.copied === 'linkedin'?'ied':'y'}</strong>
                                                }>
                                                <Icon
                                                    name="copy"
                                                    onClick={this.setCopied.bind(
                                                        this,
                                                        'linkedin',
                                                    )}
                                                />
                                            </OverlayTooltip>
                                            <div
                                                dangerouslySetInnerHTML={{
                                                    __html: nl_to_br(
                                                        localeText.linkedin,
                                                    ),
                                                }}
                                            />
                                        </div>
                                    </CopyToClipboard>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <Footer/>
            </div>
        );
    }
}
