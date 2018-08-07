import React from 'react';
import {Link} from 'react-router';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as UtilityActions from '../actions/UtilityActions';
import ShowcaseContainer from '../containers/ShowcaseContainer';
import ShowCaseFooter from '../containers/ShowCaseFooter';

import ComponentWithModal from '../components/ComponentWithModal';
import MetaTags from '../components/MetaTags';

import {
    OFFER_REQUEST_ITEMS,
    TASK_SCOPE_TASK,
    TASK_SCOPE_PROJECT,
} from '../constants/Api';

export default class FriendOfTungaRulesPage extends React.Component {
    renderHeaderContent() {
        return (
            <div className="showcase-header">
                <h1> The program in detail</h1>
            </div>
        );
    }

    render() {
        let meta_title = 'Tunga | Friends of Tunga Rules';
        let meta_description = 'Friends of Tunga program in detail';

        return (
            <ShowcaseContainer
                className="friends-rule-page"
                headerContent={this.renderHeaderContent()}>
                <MetaTags title={meta_title} description={meta_description}/>
                <div className="content">
                    <section>
                        <div className="container">
                            <p>
                                <b>How does your referral program work?</b>
                            </p>
                            <p>
                                Tunga is a commercial company (Dutch B.V.) with
                                a registered branch office in Uganda. As any
                                commercial company we want to run a healthy
                                profit, but next to that we have an explicitly
                                social mission. Tunga was founded to create
                                opportunities for African youths, in particular
                                by creating job opportunities in the tech
                                sector.
                            </p>
                            <p>
                                Do you support this mission? Then you can help us
                                directly as a company by referring leads to us.
                                On top of that, for each referral that becomes a
                                paying customer we donate 5% up to EUR1,000 to
                                WeAreBits, a network of schools that gives
                                free tech education to African youths from less
                                privileged backgrounds. We have come up with
                                this mechanism to improve access to tech jobs
                                for those youths who need it most, so that we
                                can do more to achieve our mission.
                            </p>
                            <p>
                                <b>The program rules</b>
                            </p>
                            <p>
                                - You can refer leads to us by putting us in cc
                                in a referral e-mail.
                            </p>
                            <p>
                                - On the <a href="/friends-of-tunga/">program page</a> we have created some tools
                                to make this easier for you.
                            </p>
                            <p>
                                - If you have referred a lead to use via other
                                channels, please send us an e-mail at
                                bart@tunga.io and we’ll make sure it is properly
                                administered.
                            </p>
                            <p>
                                - Each referral lead is formally tagged as a
                                ‘Referral’ in our CRM system.
                            </p>
                            <p>
                                - For each referral that becomes a paying
                                customer Tunga commits to supporting WeAreBits,
                                which provides free tech education to African youths.
                            </p>
                            <p>
                                - WeAreBits for now is run as a project by
                                the Butterfly Works Foundation (Netherlands),
                                who will administer any donations.
                            </p>
                            <p>
                                - At the end of each calendar year we calculate
                                the applicable donation by multiplying the total
                                received invoice amounts (ex VAT) from that
                                client with 5%.
                            </p>
                            <p>
                                - For example, if the donation amount for a
                                referral is 600 in year 1, 500 in year 2 and 700
                                in year 3, then 600 is donated in year 1, 400 in
                                year 2 and 0 in years (and onwards, because the
                                maximum amount has been reached).
                            </p>
                            <p>
                                - The sum of donations for a calendar year is
                                transferred to the WeAreBits budget account
                                at Butterfly Works within 2 months of the start
                                of the next calendar year.
                            </p>
                            <p>
                                - Tunga will discuss with WeAreBits before
                                the end of each calendar year if and for what
                                the donation amount will be earmarked.
                            </p>
                            <p>
                                - We reserve the right to remove access to the
                                referral program or to refuse a reward if we
                                suspect cheating or any activity we determine as
                                abusive (for example, by inviting yourself,
                                fictitious people, or already existing users) or
                                damaging of the Tunga brand (for example, in
                                connection with sexually explicit,
                                discriminatory or illegal content).
                            </p>
                            <p>
                                - We reserve the right to modify the referral
                                offer at any time. By continuing to invite
                                friends after an update to the terms, you are
                                indicating that you are accepting them.
                            </p>
                        </div>
                    </section>
                </div>
                <ShowCaseFooter/>
            </ShowcaseContainer>
        );
    }
}
