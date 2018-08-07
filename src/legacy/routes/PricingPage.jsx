import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as UtilityActions from '../actions/UtilityActions';
import ShowcaseContainer from '../containers/ShowcaseContainer';
import ShowCaseFooter from '../containers/ShowCaseFooter';
import SectionHeading from '../components/SectionHeading';

import ComponentWithModal from '../components/ComponentWithModal';
import MetaTags from '../components/MetaTags';
import {openCalendlyWidget} from '../utils/router';

let checkMark = <i className="fa fa-check"/>;

let crossMark = <i className="fa fa-times"/>;

const OFFER_DETAILS = [
    {
        title: 'Projects',
        description: (
            <p>
                Outsource entire software projects<br/>
                Clean up your bugs/features backlog<br/>
                Get started quickly<br/>
            </p>
        ),
        perks: [
            {service: 'Frontend development', fee: "€23,-"},
            {service: 'Backend development/Devops', fee: "€26,-"},
            {service: 'Specialty skill (rates start at)', fee: "€30,-"},
            {service: 'Project management', fee: "€40,-"},
            {service: 'Consultancy/Technical analysis', fee: "€45,-"},
        ],
        disclaimer: '* all above prices are hourly rates',
    },
    {
        title: 'Dedicated developers',
        description: (
            <p>
                Reinforce your team with remote developers <br/>
                Full/part-time. Temporary/permanently<br/>
                Instant access to Africa’s best programmers
            </p>
        ),
        perks: [
            {service: 'Frontend development', fee: "€23,-"},
            {service: 'Backend development/Devops', fee: "€26,-"},
            {service: 'Full stack development', fee: "€26,-"},
            {service: 'Specialty skill', fee: "€30,-"},
        ],
        disclaimer: '* all above prices are hourly rates',
    },
    {
        title: 'Recruitment ',
        description: (
            <p>
                Expand your team with African developers <br/>
                Tap into our extensive developer network <br/>
                Quickly find, select and recruit the best fit <br/>
            </p>
        ),
        perks: [
            // '', 'Custom pricing', '', ''
            {service: '', fee: ""},
            {service: '', fee: ""},
            {custom: 'Custom Pricing Solution'},
        ],
        disclaimer: '* Schedule a call to find out more',
    },
];

class PricingPage extends ComponentWithModal {
    onScheduleCall() {
        openCalendlyWidget();
    }

    renderHeaderContent() {
        return (
            <div className="showcase-header">
                <h1>High quality and service level at affordable fees</h1>
                <div className="sub-header">
                    We calculate our fees transparently and stick with that. No
                    excuses, no discussions, no additional costs
                </div>
                <p>
                    <a
                        onClick={this.onScheduleCall.bind(this)}
                        className="btn btn-callout">
                        Schedule a call
                    </a>
                </p>
            </div>
        );
    }

    render() {
        let meta_title = 'Tunga | Pricing';
        let meta_description =
            'Tunga offers flexible and affordable pricing. Choose from 3 different plans.';

        return (
            <ShowcaseContainer
                className="pricing-page"
                headerContent={this.renderHeaderContent()}>
                <MetaTags title={meta_title} description={meta_description}/>

                <section id="pricing-options">
                    <div className="container">
                        <div className="pricing-slides">
                            {OFFER_DETAILS.map((offer, idx) => {
                                return (
                                    <div key={offer.key} className="slide">
                                        <SectionHeading>
                                            {offer.title}
                                        </SectionHeading>
                                        <div className="description">
                                            {offer.description}
                                        </div>
                                        <div className="perks">
                                            <table>
                                                {offer.perks &&
                                                offer.perks.map(comp => {
                                                    return <tr>
                                                        <div>
                                                            <td className='perk-service'><p>{comp.service}</p></td>
                                                            <td className='perk-fee'><p>{comp.fee}</p></td>
                                                        </div>
                                                        {comp && comp.custom ?
                                                            <td className='perk-custom'><p>{comp.custom}</p></td>
                                                            : null}
                                                    </tr>;
                                                })}

                                            </table>
                                        </div>
                                        <div className="disclaimer">
                                            {offer.disclaimer}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
                <section id="pricing-action">
                    <div className="container">
                        <p className="text-center">
                            <button
                                onClick={this.onScheduleCall.bind(this)}
                                className="btn btn-callout">
                                Schedule a call
                            </button>
                        </p>
                    </div>
                </section>
                <ShowCaseFooter/>
            </ShowcaseContainer>
        );
    }
}

function mapStateToProps(state) {
    return {Utility: state.Utility};
}

function mapDispatchToProps(dispatch) {
    return {
        UtilityActions: bindActionCreators(UtilityActions, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PricingPage);
