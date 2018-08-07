import React from 'react';

import ShowcaseContainer from '../containers/ShowcaseContainer';
import ShowCaseFooter from '../containers/ShowCaseFooter';
import MetaTags from '../components/MetaTags';

export default class CodeOfConduct extends React.Component {
    renderHeaderContent() {
        return (
            <div className="content">
                <h2>TUNGA CODE OF CONDUCT</h2>

                <p>
                    To promote optimal relations between the Users on our
                    Website, Tunga has formulated a Code of Conduct. This serves
                    as a guide to help all our Users to use the Tunga Website in
                    a way that promotes and ensures trust, safety and respect.
                    And which leads to successful cooperations!
                </p>

                <p>
                    This Code of Conduct is in addition to the User Agreement
                    and focuses on the way that Users interact on the Website
                    and during the process of providing and acquiring Services.
                    So, in addition to acting in compliance with our User
                    Agreement, we expect our users to follow the following
                    guidelines.
                </p>

                <h3>Buyers</h3>

                <ul>
                    <li>I always act ethically and with integrity.</li>
                    <li>I will facilitate the Seller where possible.</li>
                    <li>
                        I will do my best to make my wishes as clear as
                        possible.
                    </li>
                    <li>
                        If applicable, I will give the Seller access to and
                        clear instruction about my preferred communication and
                        workflow tools.
                    </li>
                    <li>
                        I will make clear how and how often I would like to
                        receive progress updates from the Seller during the
                        execution of the Services.
                    </li>
                    <li>
                        If applicable, I will make clear how and how often I
                        would like to receive time tracking reports.
                    </li>
                    <li>
                        I shall not offer the Seller work outside of the Tunga
                        Website.
                    </li>
                </ul>

                <h3>Sellers</h3>

                <ul>
                    <li>I always act ethically and with integrity.</li>
                    <li>
                        I deliver the agreed Services to the best of my ability.
                    </li>
                    <li>
                        I make sure that I truly understand the required scope
                        of Services.
                    </li>
                    <li>
                        I familiarize myself with the communication and workflow
                        tools of preference of the Buyer.
                    </li>
                    <li>
                        I make sure I provide timely and comprehensive updates
                        to the buyer in accordance with the Buyer’s preferences
                        in Service Contract.
                    </li>
                    <li>
                        If applicable, I make sure that I track and report my
                        working hours accurately and timely.
                    </li>
                    <li>
                        I shall not solicit work from the Buyer outside of the
                        Tunga Website.
                    </li>
                </ul>

                <h3>Contact Us</h3>
                <p>
                    If you have any questions about this Code of Conduct, please
                    contact us at{' '}
                    <a href="mailto:admin@tunga.com">admin@tunga.com</a>
                </p>
            </div>
        );
    }

    render() {
        let meta_title = 'Tunga | Code of Conduct';
        let meta_description =
            'To promote optimal relations between the Users on our Website, Tunga has formulated a Code of Conduct. This serves as a guide to help all our Users to use the Tunga Website in a way to promotes and ensures trust, safety and respect. And which leads to successful cooperations!';

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
