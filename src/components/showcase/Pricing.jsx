import React from 'react';
import {Row, Col} from 'reactstrap';

import Header from "./elements/Header";
import Footer from "./elements/Footer";
import Title from "./elements/Title";
import {openCalendlyWidget} from "../utils/calendly";
import Button from "../core/Button";

export default () => {
    let title = "High quality and service level at affordable fees",
        description = "We calculate our fees transparently and stick with that. No excuses, no discussions, no additional costs";

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
                {service: 'Frontend development', fee: "€26,-"},
                {service: 'Backend development/Devops', fee: "€29,-"},
                {service: 'Specialty skill (rates start at)', fee: "€30,-"},
                {service: 'Data Scientist/Solutions Architect', fee: "€30,-"},
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
                {service: 'Frontend development', fee: "€26,-"},
                {service: 'Backend development/Devops', fee: "€29,-"},
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

    return (
        <div className="pricing-page">
            <Header title={title} description={description}/>

            <section id="pricing-options">
                <div className="container">
                    <div className="pricing-slides">
                        <Row>
                            {OFFER_DETAILS.map((offer, idx) => {
                                return (
                                    <Col key={offer.key} lg={12/OFFER_DETAILS.length}>
                                        <div className="slide">
                                            <Title>
                                                {offer.title}
                                            </Title>
                                            <div className="description">
                                                {offer.description}
                                            </div>
                                            <div className="perks">
                                                <table>
                                                    <tbody>
                                                    {offer.perks &&
                                                    offer.perks.map(comp => {
                                                        return <tr>
                                                            <td className='perk-service'><p>{comp.service}</p></td>
                                                            <td className='perk-fee'><p>{comp.fee}</p></td>
                                                            {comp && comp.custom ?
                                                                <td className='perk-custom'><p>{comp.custom}</p></td>
                                                                : null}
                                                        </tr>;
                                                    })}
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="disclaimer">
                                                {offer.disclaimer}
                                            </div>
                                        </div>
                                    </Col>
                                );
                            })}
                        </Row>
                    </div>
                </div>
            </section>

            <section id="pricing-action">
                <div className="container">
                    <p className="text-center">
                        <Button size="xl" onClick={() => {openCalendlyWidget()}}>
                            Schedule a call
                        </Button>
                    </p>
                </div>
            </section>

            <Footer/>
        </div>
    );
}
