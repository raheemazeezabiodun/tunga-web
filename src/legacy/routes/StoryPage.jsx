import React from 'react';
import {Link} from 'react-router';
import Reveal from 'react-reveal';
import YouTube from 'react-youtube';

import ShowcaseContainer from '../containers/ShowcaseContainer';
import MetaTags from '../components/MetaTags';
import ShowCaseFooter from '../containers/ShowCaseFooter';
import SectionHeading from '../components/SectionHeading';

import {openCalendlyWidget} from '../utils/router';
import {
    sendGAEvent,
    GA_EVENT_CATEGORIES,
    GA_EVENT_ACTIONS,
    GA_EVENT_LABELS,
} from '../utils/tracking';

export default class StoryPage extends React.Component {
    onCloseVideo() {
        this.setState({play: false});
        if (this.state.player) {
            this.state.player.stopVideo();
        }
    }

    onPauseVideo() {
        sendGAEvent(
            GA_EVENT_CATEGORIES.VIDEO,
            GA_EVENT_ACTIONS.PAUSE,
            GA_EVENT_LABELS.INTRO_VIDEO_STORY,
        );
    }

    onPlayVideo() {
        this.setState({play: true});
        if (this.state.player) {
            this.state.player.playVideo();
            sendGAEvent(
                GA_EVENT_CATEGORIES.VIDEO,
                GA_EVENT_ACTIONS.PLAY,
                GA_EVENT_LABELS.INTRO_VIDEO_STORY,
            );
        }
    }

    onScheduleCall() {
        openCalendlyWidget();
    }

    onVideoReady(e) {
        var player = e.target;
        if (player) {
            this.setState({player: e.target});
        }
    }

    renderHeaderContent() {
        return (
            <div className="showcase-header">
                <h1>
                    Our journey to unleash <br /> Africa’s tech talent
                </h1>
                <div className="sub-header">
                    Our Mission: 21st Century Jobs for African Youths
                </div>
                <p>
                    <a
                        onClick={this.onScheduleCall}
                        className="btn btn-callout">
                        Schedule a call
                    </a>
                </p>
            </div>
        );
    }

    render() {
        let meta_title = 'Tunga | Our Story';
        let meta_description = 'Our journey to unleash Africa’s tech talent';

        return (
            <ShowcaseContainer
                className="our-story-page"
                headerContent={this.renderHeaderContent()}>
                <MetaTags title={meta_title} description={meta_description} />

                <div className="content">
                    <section>
                        <div className="container">
                            <SectionHeading>
                                Our Dream: Equal Opportunity for All Youths
                            </SectionHeading>
                            <p id="text">
                                Being able to take control of and choose your
                                own destiny is a universal value. And it
                                probably is disproportionately so among software
                                developers and startup entrepreneurs like
                                ourselves. Tunga is founded by not-for-profit
                                design studio{' '}
                                <a href="http://www.butterflyworks.org/">
                                    Butterfly Works{' '}
                                </a>{' '}
                                and long-time social entrepreneur Ernesto
                                Spruyt, who together with his colleague Bart
                                Leijssenaar (CMO) and Michiel Huisman (Board
                                Advisor) not only is a tech person, but also has
                                a background in hospitality management. In
                                short: Tunga is founded by ‘people-people’. We
                                think that what you make of your life is your
                                own responsibility. But we would like for
                                everyone, especially the youth that holds the
                                world’s future, to be free and able to take
                                control of their own destiny.
                            </p>
                            <div className="partner-wrapper">
                                <a
                                    href="http://www.butterflyworks.org/"
                                    target="_blank"
                                    title="Butterfly Works">
                                    <img
                                        src={require('../images/partners/butterfly-works-logo.png')}
                                    />
                                </a>
                            </div>
                            <div className="image-wrapper">
                                <img
                                    src={require('../images/story/uprise.jpg')}
                                />
                            </div>
                        </div>
                    </section>

                    <section>
                        <div className="container">
                            <SectionHeading>
                                The Problem: African Youths Don’t Have The Same
                                Opportunities
                            </SectionHeading>
                            <p id="text">
                                But the reality is that in many parts of the
                                world, the opportunity you have to determine
                                your own destiny is limited by circumstances. By
                                factors outside of your own control. In our
                                search for software developers, we ended up on
                                the African continent. And through the{' '}
                                <a
                                    href="http://bitsacademy.org/"
                                    target="_blank">
                                    WeAreBits school network
                                </a>{' '}
                                we met many young Africans that are as brilliant
                                and skilled as their counterparts from other
                                parts of the world. But who have limited access
                                to interesting, worthwhile and well-paying work.
                            </p>
                            <div className="image-wrapper">
                                <img
                                    src={require('../images/story/Section2.jpg')}
                                />
                            </div>
                        </div>
                    </section>

                    <section id="partners">
                        <div className="container">
                            <SectionHeading>
                                Our Mission: 21st Century Jobs for African
                                Youths
                            </SectionHeading>
                            <p id="text">
                                That’s why in 2015 we embarked on a mission to
                                create 21st century jobs for African youths.
                                With the support of institutions like Dioraphte,
                                Oxfam, the DOEN Foundation, Edukans and Triodos
                                Bank we started Tunga. To help talented African
                                youths get access to the cool tech jobs that
                                define this generation. So that they can become
                                independent and make their mark in the
                                international economic marketplace.
                            </p>

                            <Reveal effect="animated fadeInLeft">
                                <div>
                                    <ul className="partner-links">
                                        <li>
                                            <a
                                                href="https://www.dioraphte.nl/en/"
                                                target="_blank"
                                                title="Dioraphte">
                                                <img
                                                    src={require('../images/partners/dioraphte.jpg')}
                                                />
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="https://www.oxfam.org/"
                                                target="_blank"
                                                title="Oxfam">
                                                <img
                                                    src={require('../images/partners/oxfam.png')}
                                                />
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="http://www.doen.nl/about-doen/general.htm"
                                                target="_blank"
                                                title="the DOEN Foundation">
                                                <img
                                                    src={require('../images/partners/DOEN.gif')}
                                                />
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="https://www.edukans.nl/"
                                                target="_blank"
                                                title="Edukans">
                                                <img
                                                    src={require('../images/partners/edukans.jpg')}
                                                />
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="https://www.triodos.com/"
                                                target="_blank"
                                                title="Triodos Bank">
                                                <img
                                                    src={require('../images/partners/triodos-bank.png')}
                                                />
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </Reveal>
                        </div>
                    </section>

                    <section>
                        <div className="container">
                            <SectionHeading>
                                Our Solution: Link African Software Developers<br />{' '}
                                to International Teams and Projects
                            </SectionHeading>
                            <p id="text">
                                We believe in the power of business to transform
                                society. And probably the most attractive area
                                for creating high skilled jobs and skills
                                development for today’s ambitious youths is
                                software development. As production methods from
                                the open source community are increasingly being
                                adopted in the industry, software is often
                                already being produced in virtual teams. At the
                                same time, there is a huge shortage of software
                                developers around the world, resulting in an
                                infinite demand for software development skills.
                                So Tunga was set up as a platform to remove all
                                barriers for these youths to participate in
                                international software teams and projects.
                            </p>
                            <div className="video-wrapper">
                                <YouTube
                                    videoId="RVVtyapBmuo"
                                    opts={{height: '360px'}}
                                    onReady={this.onVideoReady.bind(this)}
                                    onPause={this.onPauseVideo.bind(this)}
                                />
                            </div>
                        </div>
                    </section>

                    <section>
                        <div className="container">
                            <SectionHeading>
                                Impact Sourcing - (Software) Outsourcing Done
                                Right
                            </SectionHeading>
                            <p id="text">
                                Tunga is not a traditional software outsourcing
                                platform. Our way of working is called Impact
                                Sourcing: the deployment of workers from
                                low-employment areas into the processes of
                                businesses worldwide either through outsourcing
                                or by setting up remote or virtual teams using
                                digital technology. It aims to provide
                                higher-income employment and access to new
                                income opportunities to workers that otherwise
                                might not be employed in that particular sector.
                                For example, people in rural areas or in slums,
                                people without access to education or educated
                                individuals in areas of high unemployment.
                            </p>

                            <div className="image-wrapper">
                                <a
                                    href="https://blog.tunga.io/tech-for-good-will-impact-sourcing-be-the-new-fair-trade-61e8c8d3dcce"
                                    target="_blank">
                                    <img
                                        src={require('../images/story/impact-sourcing.png')}
                                    />
                                </a>
                            </div>
                        </div>
                    </section>

                    <section>
                        <div className="container">
                            <SectionHeading>
                                Why Africa: Tackling Huge Youth Unemployment
                            </SectionHeading>
                            <p id="text">
                                Tunga’s clients come from all over the world,
                                but our developers exclusively come from Africa.
                                At this moment mostly from Uganda, Nigeria and
                                Egypt. We started operations in Uganda and
                                that’s also where our own core team is based.
                                Partly because of the infrastructure,
                                availability of developers and the English
                                language. But also because we can make a huge
                                impact there. According to the ADB <br />
                                <a
                                    href="https://www.theguardian.com/global-development/2014/jan/16/uganda-unemployed-graduates-held-back-skills-gap"
                                    target="_blank">
                                    According to the ADB
                                </a>{' '}
                                youth unemployment in Uganda is as high as 83%.
                                With 78% of the population being under 30 this
                                is a huge challenge.
                            </p>
                            <div className="image-wrapper">
                                <img
                                    src={require('../images/story/tunga-workshop.jpg')}
                                />
                            </div>
                        </div>
                    </section>

                    <section>
                        <div className="container">
                            <SectionHeading>
                                Our Human-Centered Approach Cuts Both Ways
                            </SectionHeading>
                            <p id="text">
                                Our way of working allows us to do software
                                outsourcing better than traditional players in
                                the market. Users of outsourcing services are
                                generally complaining about 2 things: quality
                                and communication. Tunga works with highly
                                motivated and loyal developers who are eager to
                                learn and understand that meeting client
                                expectations in terms of quality and
                                communication is key. Our platform is set-up to
                                help the developers be successful by matching
                                only verified skills, by using best practice
                                templates in project planning and specifying
                                requirements, and by requiring them to report
                                daily on progress and quality so that any hiccup
                                can be dealt with early on. Building experience
                                and client relations like this, our developers
                                eventually can take charge of their own careers
                                and ultimately their lives. And that’s exactly
                                what we aim for..
                            </p>
                            {/* <p className="text-center">
                <Link to="/start/" className="btn btn-callout">
                  Schedule a call now
                </Link>
              </p> */}
                        </div>
                    </section>
                </div>
                <ShowCaseFooter />
            </ShowcaseContainer>
        );
    }
}
