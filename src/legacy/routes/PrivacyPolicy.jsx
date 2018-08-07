import React from 'react';
import _ from 'lodash';

import ShowcaseContainer from '../containers/ShowcaseContainer';
import ShowCaseFooter from '../containers/ShowCaseFooter';
import MetaTags from '../components/MetaTags';
import {COOKIE_OPTIONS, getCookieConsent, getCookieConsentCloseAt, openCookieConsentPopUp} from "../utils/tracking";

const DATA_SHARING = _.orderBy([
    [
        'HubSpot', 'https://www.hubspot.com/', (
        <div>
            HubSpot is CRM (Customer Relation Management) software we use to manage our interactions with current and potential customers.<br/>
            We store data about companies and contacts and our direct communication history like e-mails and meeting notes with these contacts.
        </div>
        ), ['First and last name', 'email']
    ],
    [
        'Exact', 'https://www.exact.com/', 'We use Exact for accounting and financial compliance.', ['First and last name', 'email', 'tunga unique identifier']
    ],
    [
        'Google Analytics', 'https://analytics.google.com/analytics/web/', 'We use Google Analytics to monitor statistical data about the use of our application.', ['Anonymous IP address']
    ],
    [
        'Hotjar', 'https://www.hotjar.com/', 'We use Google Analytics to monitor statistical data about the use of our application.', ['Anonymous IP address']
    ],
    [
        'Mailchimp', 'https://mailchimp.com/', 'We use Mailchimp to send our newsletter and information about events to users who have subscribed to these kinds of notifications.', ['First and last name', 'email']
    ],
    [
        'Mandrill', 'https://www.mandrill.com/', 'We use Mandrill to send emails in a safe and reliable way.', ['First and last name', 'email', 'email content']
    ],
    [
        'Stripe', 'https://stripe.com/', 'We use Stripe to process payments for work performed on our platform.', ['email'],
    ],
    [
        'Payoneer', 'https://www.payoneer.com/', 'We use Payoneer to pay freelancers. Only developer personal data is shared with Payoneer.', ['First and last name', 'email', 'tunga unique identifier']
    ],
    [
        'Calendly', 'https://calendly.com/', 'We use Calendly widget to schedule meetings. Your data is only shared with Calendly when you use the widget.', ['First and last name', 'email']
    ],
    [
        'Optimizely', 'https://www.optimizely.com/', 'We use Optimizely to perform experiments that help us improve the platform.', ['Anonymous IP address']
    ],
    [
        'Snitcher', 'https://www.snitcher.com/', 'We use Snitcher to tell us which companies are visiting our website, and what they do on the website. It is important to note, that Snitcher does not identify individual visitors, only companies and other organizations (e.g universities).', ['IP address']
    ]
]);

export default class PrivacyPolicy extends React.Component {

    onCookieSettings() {
        openCookieConsentPopUp();
    }

    renderHeaderContent() {
        return (
            <div className="content">
                <h2>TUNGA PRIVACY POLICY</h2>

                <p>
                    At Tunga we take great care and precaution to protect the
                    privacy of the users of our website and services.
                </p>

                <p>
                    This privacy policy is applicable to all our services and
                    the use of our website (https://tunga.io) and all associated
                    products and services available on our website. This policy
                    summarizes Tunga data collection policies and practices on
                    the Tunga Account and our website. This policy does not
                    apply to the practices of companies that Tunga does not own
                    or control, or to people that Tunga does not employ or
                    manage.
                </p>

                <p>
                    As used in this policy “Tunga” refers to Tunga B.V., a
                    private company under Dutch law with is registered office in
                    Amsterdam (The Netherlands) and any of its subsidiaries and
                    affiliates.
                </p>

                <p>
                    Tunga complies with the “Dutch Personal Data Protection Act”
                    (Wet Bescherming Persoonsgegevens), the “Dutch
                    Telecommunications Act” (Telecommunicatiewet ) and the codes
                    of conduct drawn up by the DDMA (Dutch Dialogue Marketing
                    Association).
                </p>

                <h3>The use of information provided by you</h3>

                <p>
                    We store and use the information you give us in accordance
                    with the terms of this policy.
                </p>

                <p>
                    When you sign up for a Tunga Account, personal information,
                    as your name, address, nationality, may be collected. We use
                    this additional data to personalize your Tunga experience.
                    By obtaining and using this information, we can provide you
                    with the most timely, relevant and individualized service
                    according to your preferences and interests.
                </p>

                <p>
                    The data that is communicated back and forth between Tunga
                    and your computer is encrypted. This means third parties are
                    not able to intercept or read the data stream between Tunga
                    and you. Tunga uses the same safety standards as most large
                    marketplace websites.
                </p>

                <p>
                    When you sign up with Tunga and as you use the Tunga
                    Website, we also record your decision to: (1) receive e-mail
                    updates from Tunga; and (2) have a third-party sponsor
                    contact you to provide information regarding their product
                    or services.
                </p>

                <p>
                    We may include certain links in our e-mails that will allow
                    us to monitor whether you access specific content or
                    advertisements contained in that e-mail. When you click on
                    one of these links, we will record that click and certain
                    activities on the web page associated with that link. We use
                    this information to conduct internal research on our users'
                    demographics, interests, and behavior related to our e-mail
                    advertisements and content, and to better understand and
                    serve you.
                </p>

                <p>
                    We use log files to track system activity and maintain our
                    systems. Log data includes IP addresses, browser type,
                    referring/exit pages, platform type, date/time stamp, and
                    number and nature of clicks through our website. We use this
                    information primarily for security purposes, but also to
                    analyze usage patterns, observe trends, administer the
                    website, track user movements in the aggregate, and gather
                    broad demographic information for aggregate use. Information
                    gathered from log files is for Tunga internal use only and
                    will not be shared with any third parties, except law
                    enforcement, when necessary and/or obliged. For non-member
                    visitors of our website, log files are not linked to
                    personally identifiable information.
                </p>

                <p>
                    We may use your submitted e-mail address to compare our
                    member list to lists received from other companies, in an
                    effort to avoid sending identical messages to our members.
                </p>

                <p>
                    We may use information collected on your account or on the
                    website in the following ways:
                </p>

                <ul>
                    <li>
                        to provide you with personalized information via
                        electronic delivery and/or direct mail;
                    </li>
                    <li>
                        to send you information about reward opportunities or
                        promotions;
                    </li>
                    <li>
                        to prevent potentially prohibited or illegal activities,
                        and enforce our terms of use;
                    </li>
                    <li>
                        to send you targeted advertising via electronic delivery
                        and/or direct mail;
                    </li>
                    <li>
                        to contact you for feedback and surveys via electronic
                        delivery and/or direct mail;
                    </li>
                    <li>
                        to send you general and administrative information about
                        your Tunga membership via electronic delivery and/or
                        direct mail;
                    </li>
                    <li>
                        compare information for accuracy, and verify it with
                        third parties;
                    </li>
                    <li>
                        to provide your contact information to Tunga marketing
                        partners whose offer(s) you have selected to receive in
                        order for them to send you special offers via electronic
                        delivery, telemarketing and direct mail; and
                    </li>
                    <li>
                        to monitor, track and research ways to improve Tunga
                        services and enhance the safety of the Tunga website.
                    </li>
                </ul>

                <h3>Disclosure of your information</h3>

                <p>
                    We may disclose your personal information to respond to
                    legal requirements, enforce our policies, respond to claims
                    that your posting and/or other content violates the rights
                    of others, or protect anyone's rights, property, or safety.
                </p>

                <p>We may also share your personal information with:</p>

                <ul>
                    <li>
                        service providers under contract who help with our
                        business operations (such as marketing, investigation of
                        unlawful activities, and affiliate and rewards
                        programs);
                    </li>
                    <li>
                        other third parties to whom you explicitly ask us to
                        send your information (or about whom you are otherwise
                        explicitly notified and consent to when using a specific
                        service).
                    </li>
                    <li>
                        law enforcement or other governmental officials relating
                        to alleged illegal activity. In such events, we will
                        disclose information relevant to the investigation, such
                        as name, city, state, zip code, telephone number, e-mail
                        address, user name history, IP address, complaints,
                        postings and other content. Without limiting the above,
                        in an effort to respect your privacy and our ability to
                        keep Tunga free from bad actors, we will not otherwise
                        disclose your personal information to law enforcement or
                        other government officials without a subpoena, court
                        order or substantially similar legal procedure, except
                        when we believe in good faith that the disclosure of
                        information is necessary to prevent imminent physical
                        harm or financial loss or to report suspected illegal
                        activity;
                    </li>
                    <li>
                        business entities, with whom we could plan to merge with
                        or be acquired by. (Should such a combination occur, we
                        will require that the new combined entity follow this
                        policy with respect to your personal information. If
                        your personal information will be used contrary to this
                        policy, you will receive prior notice).
                    </li>
                </ul>

                <h3 id="personal-data">Personal data shared with third parties</h3>
                These are the third party service providers that we may directly share your personal data with.
                <div className="info-list">
                    {DATA_SHARING.map(service => {
                        return (
                            <div className="row">
                                <div className="col-md-6">
                                    <a href={service[1]}>{service[0]}</a>
                                    <div>{service[2]}</div>
                                </div>
                                <div className="col-md-6">
                                    {service[3].map(item => {
                                        return(
                                            <span className="tag">{item}</span>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <h3>Change or delete personally identifiable information</h3>

                <p>
                    At any time, you can refuse to permit us to collect
                    additional personal information and also may request that we
                    delete any personal information we have collected. Please be
                    advised that by refusing to permit us to collect personal
                    information or requesting the deletion from our database,
                    you will be unsubscribing from your Tunga Account.
                </p>

                <h3>
                    Amendments to this privacy policy and your acceptance of the
                    privacy policy
                </h3>

                <p>
                    We may amend this policy from time to time. By using the
                    Tunga Account or our Website, you signify your agreement to
                    the terms of this policy. In the event that there are any
                    material changes to the way we collect, use and/or share
                    personal information, we will provide you with notice via
                    e-mail. In addition, we will post a link to our revised
                    privacy policy on our home page so our users are always
                    aware of what information we collect, how we use it, and
                    under what circumstances, if any, we disclose it. It is most
                    likely that any material changes to this policy will be to
                    conform with applicable laws.
                </p>

                <p>
                    Your continued use of our services and/or website shall
                    constitute your acceptance of any revised privacy policy.
                </p>

                <h3 id="cookies">Cookies</h3>

                {/*
                <p>
                    We use cookies to, among other things, persist your current
                    session so you don't have to re-enter your credentials each
                    time you visit the website and to deliver personalized
                    content. We use cookies (small files placed on your hard
                    drive) to analyze visits to our services and help us to
                    deliver a more useful final product. These cookies may be
                    from third parties (e.g. Google). At entering our website
                    you will be asked for your permission for the use of our
                    cookies. Please note that rejecting cookies while visiting
                    the website may result in certain parts of the website not
                    operating correctly or as efficiently as if they were
                    allowed.
                </p>
                */}

                <p>
                    A cookie is a small piece of data (text file) that a website – when visited by a user – asks your browser to store on your device in order to remember information about you, such as your login information.
                    Those cookies which are set by us and called first party cookies. We also use third party cookies – which are cookies from a domain different than the domain of the website you are visiting – for analytics, measuring performance and to assist in our advertising and marketing efforts.
                </p>

                <p>
                    We may use third-party advertising companies to serve ads on
                    our behalf. These companies may employ cookies and action
                    tags (also known as single pixel gifs or web beacons) to
                    measure advertising effectiveness. Any information that
                    these third parties collect via cookies and action tags is
                    completely anonymous.
                </p>

                <p>
                    The specific types of first and third party cookies served through our Websites and the purposes they perform are described in further detail below:
                </p>

                <div>
                    {COOKIE_OPTIONS.map(category => {
                        return (
                            <div>
                                <h4>{category[1]}</h4>
                                <p>{category[2]}</p>
                                <div className="info-list">
                                    {(category[5] || []).map(service => {
                                        return (
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <a href={service[1]}>{service[0]}</a>
                                                    <div>{service[2]}</div>
                                                </div>
                                                <div className="col-md-6">
                                                    {service[3].map(item => {
                                                        return(
                                                            <span className="tag">{item}</span>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <p>
                    You can opt-out of each cookie category (except essential website cookies) by clicking on the “Cookie Settings” button below:
                </p>

                <button className="btn" onClick={this.onCookieSettings.bind(this)}>Cookie Settings</button>

                <h3>Security</h3>

                <p>
                    Tunga takes every reasonable precaution to protect our
                    users' information. When you submit sensitive information
                    via our service, your information is protected both online
                    and off-line. We have physical, electronic, and procedural
                    safeguards to protect personal information about you.
                </p>

                <p>
                    However, we cannot guarantee that communications between you
                    and Tunga and/or communications with other users of Tunga
                    will not be intercepted by others and that information
                    stored on our servers will be free from unauthorized access.
                    While we have taken reasonable precautions to protect this
                    information, you should always use discretion in what
                    information you register and send to us and not expect that
                    such information will be absolutely free from intrusion.
                </p>

                <h3>Reports</h3>

                <p>
                    We periodically prepare analyses and reports reflecting
                    visitor and member use of the website and our services for
                    our internal use as well as for a limited number of our
                    business partners. These reports include aggregate
                    (non-personal) information about Tunga users, and in certain
                    instances, visitors of the website. The information in these
                    reports will not identify you individually. Our business
                    partners who have access to these reports will not be able
                    to contact you from the information contained in the
                    reports.
                </p>

                <h3>Links/others websites</h3>

                <p>
                    You should be aware that when you use our services or are on
                    the website or when you receive e-mails, you could be
                    directed to other sites beyond our control. This includes
                    links from advertisers, sponsors and partners. These other
                    websites may send their own cookies to you, independently
                    collect data or solicit personal information and may or may
                    not have their own published privacy policies.
                </p>

                <h3>Access and control of personal information</h3>

                <p>
                    If you are a registered user of Tunga, you may view,
                    correct, and delete personal information by logging into
                    your account and editing your profile, or by contacting our
                    customer support. All user information, included that which
                    is deleted, can be maintained in Tunga’s database solely for
                    its internal use in ensuring the safety of the Tunga
                    services and for disclosure to law enforcement, if
                    necessary. Generally, you should be careful when providing
                    any personal information available to the public.
                </p>

                <h3>Contact Us</h3>

                <p>
                    If you have any questions about this policy, please contact
                    us at <a href="mailto:admin@tunga.com">admin@tunga.com</a>
                </p>
            </div>
        );
    }

    render() {
        let meta_title = 'Tunga | Privacy Policy';
        let meta_description =
            'This privacy policy is applicable to all our services and the use of our website (https://tunga.io) and all associated products and services available on our website. This policy summarizes Tunga data collection policies and practices on the Tunga Account and our website. This policy does not apply to the practices of companies that Tunga does not own or control, or to people that Tunga does not employ or manage.';

        return (
            <ShowcaseContainer
                className="agreement-page"
                headerContent={this.renderHeaderContent()}
                hasGlassNav={false}
                autoOpenChat={false}>
                <MetaTags title={meta_title} description={meta_description} />

                <ShowCaseFooter />
            </ShowcaseContainer>
        );
    }
}
