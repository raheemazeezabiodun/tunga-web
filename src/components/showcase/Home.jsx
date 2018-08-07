import React from 'react';
import {Link} from 'react-router-dom';
import {Row, Col} from 'reactstrap';
import Slider from 'react-slick';
import Reveal from 'react-reveal';

import Header from "./elements/Header";
import ContactUs from "./elements/ContactUs";
import Footer from "./elements/Footer";
import Title from "./elements/Title";
import Press from "./elements/Press";
import Partners from "./elements/Partners";
import Button from "../core/Button";
import Icon from "../core/Icon";

import {proxySafeUrl} from "../utils/proxy";
import {openCalendlyWidget} from "../utils/calendly";
import {TESTIMONIALS} from "../utils/testimonials";

export default () => {
    let title = "Unleashing Africa's Tech Talent",
        description =
            'Small and large businesses from all over the world use Tunga for hiring African software engineers to address their most pressing software development needs.';

    let slider_settings = {
        dots: true,
        arrows: true,
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        centerMode: true,
        centerPadding: 0,
        responsive: [
            {
                breakpoint: 481,
                settings: {slidesToShow: 1 /*, centerMode: true*/},
            },
            {
                breakpoint: 769,
                settings: {slidesToShow: 2 /*, centerMode: true*/},
            },
            {
                breakpoint: 1025,
                settings: {
                    slidesToShow: 3,
                    centerMode: true,
                    centerPadding: 0,
                },
            },
        ],
    };

    return (
        <div className="landing-page">
            <Header className="height-100" title={title} description={description} ctaSize={'xxl'}>
                <section id="services">
                    <div className="service">
                        <div className="wrapper">
                            <div className="headline">
                                Effortless software projects
                            </div>
                            <div>
                                Need an app or website? We can build software for
                                you on-demand and turn-key.
                                <Link
                                    to={proxySafeUrl('/effortless-software-projects')}>
                                    find out more
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="service">
                        <div className="wrapper">
                            <div className="headline">Dedicated developers</div>
                            <div>
                                Use Tunga to quickly mobilize developers. Parttime
                                or fulltime. Individuals or entire teams.
                                <Link
                                    to={proxySafeUrl('/dedicated-developers')}>
                                    find out more
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="service">
                        <div className="wrapper">
                            <div className="headline">Recruitment services</div>
                            <div>
                                Tap into our network of top African software
                                programmers to reinforce your own tech team.
                                <Link
                                    to={proxySafeUrl('/it-recruitment')}>
                                    find out more
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </Header>

            <section id="unique-approach" className="clearfix">
                <Row>
                    <Col lg={8}>
                        <div className="approach-body">
                            <Title>
                                Our unusual approach to software development
                            </Title>

                            <div>
                                <p>
                                    Software projects often go wrong because of
                                    people misunderstanding each other. Tunga
                                    was founded by people from the hospitality
                                    sector to solve this problem with a simple
                                    idea: apply our human-centered mindset to
                                    the software development process and its
                                    actors.
                                </p>

                                <p>
                                    We work with a community of highly talented
                                    youths from several African countries, who
                                    are committed to go the extra mile for you.
                                    Why? Because we not only pay a lot of
                                    attention to our managers and developers
                                    growing a customer-focused attitude, we also
                                    do our utmost to address their needs by
                                    creating interesting and worthwhile work
                                    opportunities for them.
                                </p>

                                <p>
                                    Do you support our mission to create
                                    opportunities for African youths? Become a{' '}
                                    <Link to="/friends-of-tunga">
                                        'Friend of Tunga'!
                                    </Link>{' '}
                                    For each client you refer to us we donate a
                                    sum to WeAreBits, a network of African
                                    schools that focus on giving quality and
                                    free IT-education to youths from less
                                    privileged backgrounds.
                                </p>

                                <Button onClick={() => {openCalendlyWidget()}} size="lg">
                                    Find out what we can do for you
                                </Button>

                                <Link
                                    className="btn btn-primary btn-lg d-block d-sm-none"
                                    to="/friends">
                                    Become a friend of Tunga
                                </Link>
                            </div>
                        </div>
                    </Col>
                    <Col className="side-pic"/>
                </Row>
            </section>

            <section id="development-style">
                <div>
                    <Title>
                        Software development Tunga-style
                    </Title>

                    <div className="development-style-pitch">
                        We have built a large pool of top African
                        tech talent that can be deployed flexibly
                        and rapidly to help you meet your specific
                        software development needs.
                    </div>

                    <div className="development-style-cases">
                        <div className="case">
                            <Icon name="file-search" className="icon"/>

                            <p>
                                <div className="title">
                                    Result-oriented
                                </div>
                                We pay a lot of attention to scoping
                                your project and working out the
                                technical details. Then we go all
                                the way to deliver them.
                            </p>
                        </div>
                        <div className="case">
                            <Icon name="team" className="icon"/>

                            <p>
                                <div className="title">
                                    Quality assured
                                </div>
                                We have developed a unique, highly
                                professional and effective way of
                                working that enables clients and
                                developers from any part of the
                                world to collaborate efficiently.
                            </p>
                        </div>
                        <div className="case">
                            <Icon name="money-loop" className="icon"/>
                            <p>
                                <div className="title">
                                    Affordable
                                </div>
                                Our developers are for hire at a
                                flat rate. We
                                calculate projects transparently and
                                stick with that. No excuses, no
                                discussions, no additional costs.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section id="meet-developers">
                <div>
                    <Link to="/quality" className="headline">
                        Meet our thriving community of developers
                    </Link>
                    <p>
                        Find out how we select our developers and meet some
                        of our talented experts.
                    </p>
                </div>
            </section>

            <Press/>

            <section id="case-studies">
                <div className="container">
                    <Title>Case Studies</Title>
                    <div id="clients-testmonial-landing-page">
                        <Slider
                            className="testimonials-slider text-center"
                            {...slider_settings}>
                            {TESTIMONIALS.map(testimonial => {
                                return (
                                    <div className="testimonial-landing-page">
                                        <div className="body">
                                            <div>
                                                <i className="fa fa-quote-left pull-left"/>
                                                <span
                                                    dangerouslySetInnerHTML={{
                                                        __html:
                                                        testimonial.message,
                                                    }}
                                                />
                                                <i className="fa fa-quote-right pull-right"/>
                                            </div>
                                        </div>
                                        <div
                                            className="image"
                                            style={{
                                                backgroundImage: `url(${
                                                    testimonial.image
                                                    })`,
                                            }}
                                        />
                                        <div className="author">
                                            {testimonial.name}
                                        </div>
                                        <div className="company">
                                            <p>
                                                {testimonial.position}{' '}
                                                {testimonial.company}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </Slider>
                    </div>
                </div>
            </section>

            <Partners title={
                <div className="supported-by">
                    Supported By:
                </div>
            }>
            </Partners>

            <section className="what-we-do-best">
                <div className="container ">
                    <div>
                        <Title>What we do best</Title>
                        <Row>
                            <Col md={4} className="skill">
                                <img
                                    src={require('../../assets/images/showcase/TungaMobileSkills.png')}
                                />
                            </Col>
                            <Col md={4} className="skill">
                                <img
                                    src={require('../../assets/images/showcase/TungaWebSkills.png')}
                                />
                            </Col>
                            <Col md={4} className="skill">
                                <img
                                    src={require('../../assets/images/showcase/TungaOtherSkills.png')}
                                />
                            </Col>
                        </Row>
                    </div>
                    <div className="text-center">
                        <Button onClick={() => {openCalendlyWidget()}} size="lg">
                            Find out what we can do for you
                        </Button>
                    </div>
                </div>
            </section>

            <ContactUs/>

            <Footer/>
        </div>
    );
}
