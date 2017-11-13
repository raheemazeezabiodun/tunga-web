import React from 'react';
import {Link} from 'react-router-dom';
import Reveal from 'react-reveal';
import YouTube from 'react-youtube';

import ShowcaseContainer from '../containers/ShowcaseContainer';
import MetaTags from '../components/MetaTags';
import ShowCaseFooter from '../containers/ShowCaseFooter';

import {
  sendGAEvent,
  GA_EVENT_CATEGORIES,
  GA_EVENT_ACTIONS,
  GA_EVENT_LABELS,
} from '../utils/tracking';

export default class StoryPage extends React.Component {
  onVideoReady(e) {
    var player = e.target;
    if (player) {
      this.setState({player: e.target});
    }
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

  onPauseVideo() {
    sendGAEvent(
      GA_EVENT_CATEGORIES.VIDEO,
      GA_EVENT_ACTIONS.PAUSE,
      GA_EVENT_LABELS.INTRO_VIDEO_STORY,
    );
  }

  onCloseVideo() {
    this.setState({play: false});
    if (this.state.player) {
      this.state.player.stopVideo();
    }
  }

  renderHeaderContent() {
    return (
      <div>
        <h1>
          Our journey<br /> to unleash Africa’s tech talent
        </h1>
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
              <div className="section-heading text-center">
                Our Dream: Equal Opportunity for All Youths
              </div>
              <p>
                Being able to take control of and choose your own destiny is a
                universal value. And it probably is disproportionately so among
                software developers and startup entrepreneurs like ourselves.
                Tunga is founded by not-for-profit design studio Butterfly Works
                and long-time social entrepreneur Ernesto Spruyt. Our people
                have all built a lifestyle not aimed at making as much money as
                possible, but at allowing us to be free and keep control of our
                own fate under all circumstances. And as founders we have built
                a track record of trying to make this lifestyle possible for the
                rest of the world as well. In particular for the world’s youth,
                because the youth has the future.
              </p>

              <div className="image-wrapper">
                <img src={require('../images/story/uprise.jpg')} />
              </div>
            </div>
          </section>

          <section>
            <div className="container">
              <div className="section-heading text-center">
                The Problem: African Youths Don’t Have The Same Opportunities
              </div>
              <p>
                But the reality is that in many parts of the world, the
                opportunity you have to determine your own destiny is limited by
                circumstances. By factors outside of your own control. In our
                search for software developers, we ended up in the African
                continent. And through the{' '}
                <a href="http://bitsacademy.org/" target="_blank">
                  Bits Academy school network
                </a>{' '}
                we met many young Africans that are as intelligent and skilled
                as their western counterparts. But who have limited access to
                interesting, intelligent and well-paying work. Just because of
                where they were born.
              </p>
              <div className="image-wrapper">
                <img src={require('../images/story/Section2.jpg')} />
              </div>
            </div>
          </section>

          <section id="partners">
            <div className="container">
              <div className="section-heading text-center">
                Our Mission: 21st Century Jobs for African Youths
              </div>
              <p>
                That’s why in 2015 we embarked on a mission to create 21st
                century jobs for African youths. With the support of
                institutions like Dioraphte, Oxfam, the DOEN Foundation, Edukans
                and Triodos Bank we started Tunga. To help talented African
                youths get access to modern, well-paid and intelligent work. So
                that they can become independent, empowered and able to
                participate in the international economic marketplace as equal
                and worthy actors.
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
                        <img src={require('../images/partners/oxfam.png')} />
                      </a>
                    </li>
                    <li>
                      <a
                        href="http://www.doen.nl/about-doen/general.htm"
                        target="_blank"
                        title="the DOEN Foundation">
                        <img src={require('../images/partners/DOEN.gif')} />
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www.edukans.nl/"
                        target="_blank"
                        title="Edukans">
                        <img src={require('../images/partners/edukans.jpg')} />
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
              <div className="section-heading text-center">
                Our Solution: Link African Software Developers<br /> to
                International Teams and Projects
              </div>
              <p>
                We believe in the power of business to transform society. And
                probably the most attractive area for creating high skilled jobs
                and skills development for disadvantaged youths is software
                development. As production methods from the open source
                community are increasingly being adopted in the industry,
                software is often already being produced in virtual teams. At
                the same time, there is a huge shortage of software developers
                around the world, resulting in an infinite demand for software
                development skills. So Tunga was set up as a platform to remove
                all barriers for these youths to participate in international
                software teams and projects.
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
              <div className="section-heading text-center">
                Impact Sourcing - (Software) Outsourcing Done Right
              </div>
              <p>
                Tunga is not a traditional software outsourcing platform. Our
                way of working is called Impact Sourcing: the integration of
                disadvantaged workers from low-employment areas into the
                processes of businesses from more economically advanced
                countries either through outsourcing or by setting up remote or
                virtual teams using digital technology. It aims to provide
                higher-income employment and access to new income opportunities
                to workers that otherwise might not be employed in that
                particular sector. For example, people in rural areas or in
                slums, people without access to education or educated
                individuals in areas of high unemployment.
              </p>

              <div className="image-wrapper">
                <a
                  href="https://blog.tunga.io/tech-for-good-will-impact-sourcing-be-the-new-fair-trade-61e8c8d3dcce"
                  target="_blank">
                  <img src={require('../images/story/impact-sourcing.png')} />
                </a>
              </div>
            </div>
          </section>

          <section>
            <div className="container">
              <div className="section-heading text-center">
                Why Africa: Tackling Huge Youth Unemployment
              </div>
              <p>
                Tunga’s clients come from all over the world, but our developers
                exclusively come from Africa. Mostly from Uganda, Kenya and
                Nigeria. We started operations in Uganda and that’s also where
                our own core team is based. Partly because of the
                infrastructure, availability of developers and the English
                language. But also because we can make a huge impact there.<br />
                <a
                  href="https://www.theguardian.com/global-development/2014/jan/16/uganda-unemployed-graduates-held-back-skills-gap"
                  target="_blank">
                  According to the ADB
                </a>{' '}
                youth unemployment in Uganda is as high as 83%. With 78% of the
                population being under 30 this is a huge problem.
              </p>
              <div className="image-wrapper">
                <img src={require('../images/story/tunga-workshop.jpg')} />
              </div>
            </div>
          </section>

          <section>
            <div className="container">
              <div className="section-heading text-center">
                Ain’t No Mountain High Enough
              </div>
              <p>
                Our way of working allows us to do software outsourcing better
                than traditional players in the market. Users of outsourcing
                services are generally complaining about 2 things: quality and
                communication. Tunga works with highly motivated and loyal
                developers who are eager to learn and understand that meeting
                client expectations in terms of quality and communication is
                key. Our platform is set-up to help the developers be successful
                by matching only verified skills, by using best practice
                templates in project planning and specifying requirements, and
                by requiring them to report daily on progress and quality so
                that any hiccup can be dealt with early on. Building experience
                and client relations like this, our developers eventually can
                take charge of their own careers and ultimately their lives. And
                that’s exactly what we aim for.
              </p>
              <p className="text-center">
                <Link to="/start/" className="btn btn-callout btn-main-cta">
                  <i className="tunga-icon-rocket fa-lg" /> Start your project
                  now
                </Link>
              </p>
            </div>
          </section>
        </div>
        <ShowCaseFooter />
      </ShowcaseContainer>
    );
  }
}
