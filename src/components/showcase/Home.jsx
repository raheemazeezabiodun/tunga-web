import React from 'react';
import {Link} from 'react-router-dom';
import {Row, Col} from 'reactstrap';
import Slider from 'react-slick';
import YouTube from 'react-youtube';
import axios from 'axios';

import Header from "./elements/Header";
import ContactUs from "./elements/ContactUs";
import Footer from "./elements/Footer";
import Title from "./elements/Title";
import Press from "./elements/Press";
import Partners from "./elements/Partners";
import Button from "../core/Button";
import Icon from "../core/Icon";
import JSXify from "../core/JSXify";

import {openCalendlyWidget} from "../utils/calendly";
import {TESTIMONIALS} from "../utils/testimonials";
import SearchBox from "../core/SearchBox";
import IconButton from "../core/IconButton";
import {openModal} from "../core/utils/modals";

const SLIDER_SETTINGS = {
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

const HOME_DEFAULTS = {
    welcome_header: "Unleashing Africa's Tech Talent",
    welcome_sub_header: "Small and large businesses from all over the world use Tunga for hiring African software engineers to address their most pressing software development needs.",
    welcome_cta: 'Schedule a call',
    pitch_header: "Our unusual approach to software development",
    pitch_body: (
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
    ),
};

export default class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {videos: [], playerMap: {}};
    }

    componentDidMount() {
        const {showCall} = this.props;
        if(showCall) {
            openCalendlyWidget();
        }

        axios.get('https://www.googleapis.com/youtube/v3/search?key=AIzaSyAuIXqeLrUkyZhsau0WpAVzWlyuv_P9YE8&channelId=UC_Pl6wmR-t9Zv9z7_s1aWNg&part=snippet,id&order=date&maxResults=6').then(res => {
            const videos = res.data.items || [];
            if(videos) {
                this.setState({
                    videos
                });
            }
        }).catch(err => {

        });
    }

    componentDidUpdate(prevProps, prevState, snapShot) {
        if(this.props.showCall && !prevProps.showCall) {
            openCalendlyWidget();
        }
    }

    onPlay(video) {
        const videoId = video.id.videoId;

        openModal(
            <div className="video-wrapper">
                <YouTube videoId={videoId} onReady={event => { event.target.playVideo(); }}/>
            </div>,
            null, true, {className: 'modal-youtube'}
        );
    }

    render() {
        const {skill_page, isLoading} = this.props;
        const getSafeValue = (key) => {
            return isLoading?'...':(skill_page && skill_page[key] || HOME_DEFAULTS[key] || null);
        };

        let title = getSafeValue('welcome_header'),
            description = (
                <JSXify>
                    {getSafeValue('welcome_sub_header')}
                </JSXify>
            ),
            ctaText = getSafeValue('welcome_cta'),
            pitchImage = getSafeValue('pitch_image');

        return (
            <div className={`landing-page ${skill_page?'skill-page':''}`}>
                <Header className={`height-${skill_page?'90':'100'}`}
                        title={title} description={description} showCTA={false} ctaText={ctaText} ctaSize={'xxl'} videoBg={true}>

                    <div className="showcase-actions">
                        <div className="action-group">
                            Search our database of developers, UX engineers and project managers

                            <form method="get" action="/developers">
                                <div className="row">
                                    <div className="col">
                                        <SearchBox branded={false}
                                                   placeholder="Search on skills or technology"
                                                   disableResults={true}
                                                   disableForm={true}/>
                                    </div>
                                    <div className="col col-auto">
                                        <Button type="submit" size="sm">Go</Button>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="action-group">
                            <div className="row">
                                <div className="col">
                                    Talk to a project manager to discuss your project or development team needs
                                </div>
                                <div className="col col-auto">
                                    <IconButton name="headphone-alt" size="lg"
                                                variant="primary"
                                                className="btn-cta" onClick={() => {openCalendlyWidget()}}/>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='icon-scroll'/>
                </Header>

                <section id="unique-approach" className="clearfix">
                    <div className="col-body clearfix">
                        <div className="approach-body">
                            <Title>
                                {getSafeValue('pitch_header')}
                            </Title>

                            <div>
                                {getSafeValue('pitch_body')}
                            </div>
                        </div>
                    </div>
                    <div className="col-pic" style={pitchImage?{backgroundImage: `url(${pitchImage})`}:{}}/>
                </section>

                {isLoading || skill_page?null:(
                    <React.Fragment>
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

                        {/*
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
                        */}
                    </React.Fragment>
                )}

                <div id="video-slideshow">
                    {(this.state.videos || []).map(video => {
                        return (
                            <div className="thumbnail">
                                <img src={video.snippet.thumbnails.medium.url}/>
                                <div className="title">{video.snippet.title}</div>
                                <Icon name="youtube-play" className="play-icon" onClick={this.onPlay.bind(this, video)}/>
                            </div>
                        );
                    })}
                </div>


                <Press/>

                {isLoading || skill_page?(
                    skill_page?(
                        <React.Fragment>
                            <section id="story">
                                <div className="container">
                                    <Title>
                                        <JSXify>
                                            {skill_page.content_header}
                                        </JSXify>
                                    </Title>

                                    <div className="readable">
                                        <JSXify>
                                            {getSafeValue('content')}
                                        </JSXify>
                                    </div>

                                    {skill_page.content_image ? (
                                        <img src={skill_page.content_image} />
                                    ) : null}

                                    <div className="readable">
                                        <JSXify>
                                            {skill_page.story_body_two}
                                        </JSXify>
                                    </div>

                                    <div className="readable">
                                        <JSXify>
                                            {skill_page.story_body_three}
                                        </JSXify>
                                    </div>

                                    <div className="text-center">
                                        <Button size="lg"
                                                onClick={() => {openCalendlyWidget()}}>
                                            Schedule a call with us
                                        </Button>
                                    </div>
                                </div>
                            </section>
                            {skill_page.story_interlude_one_text?(
                                <section
                                    id="story-interlude-one"
                                    style={
                                        skill_page.story_interlude_one_image
                                            ? {
                                                backgroundImage: `url(${
                                                    skill_page.story_interlude_one_image
                                                    })`,
                                            }
                                            : {}
                                    }>
                                    <div className="container">
                                        <JSXify>
                                            {skill_page.story_interlude_one_text}
                                        </JSXify>
                                        {skill_page.story_interlude_one_cta ? (
                                            <Link to="/start" className="cta">
                                                {skill_page.story_interlude_one_cta}
                                            </Link>
                                        ) : null}
                                    </div>
                                </section>
                            ):null}
                        </React.Fragment>
                    ):null
                ):(
                    <React.Fragment>
                        <section id="case-studies">
                            <div className="container">
                                <Title>Case Studies</Title>
                                <div>
                                    <Slider
                                        className="testimonials-slider text-center"
                                        {...SLIDER_SETTINGS}>
                                        {TESTIMONIALS.map(testimonial => {
                                            return (
                                                <div className="testimonial-slide">
                                                    <div className="body">
                                                        <div>
                                                            <Icon name="quote-left" className="float-left"/>
                                                            <span
                                                                dangerouslySetInnerHTML={{
                                                                    __html:
                                                                    testimonial.message,
                                                                }}
                                                            />
                                                            <Icon name="quote-right" className="float-right"/>
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
                    </React.Fragment>
                )}

                <ContactUs/>

                <Footer/>
            </div>
        );
    }
}
