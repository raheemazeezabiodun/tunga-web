import React from 'react';

import ShowcaseContainer from '../containers/ShowcaseContainer';

import TaskContainer from '../containers/TaskContainer';
import TaskDetailContainer from '../containers/TaskDetailContainer';
import TaskForm from '../components/TaskForm';
import QuizForm from '../components/QuizForm';
import Avatar from '../components/Avatar';
import MetaTags from '../components/MetaTags';
import Slider from 'react-slick';

import {getClientTestimonials} from '../constants/data';
import {getEditToken} from '../utils/tasks';

export default class TaskWizard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: 'Hire top African developers!',
            subtitle: null,
            step: 1,
        };
    }

    onStepChange(step, idx, all_steps) {
        this.setState({
            title:
                step && step.title
                    ? step.title
                    : 'Hire top African developers!',
            subtitle: step && step.subtitle ? step.subtitle : null,
            step: idx ? idx + 1 : -1,
        });
    }

    getPhase() {
        if (this.props.params) {
            return this.props.params.phase;
        }
        return null;
    }

    getTaskId() {
        if (
            this.props.params &&
            ['schedule', 'speed-up'].indexOf(this.getPhase()) > -1
        ) {
            return this.props.params.taskId;
        }
        return null;
    }

    getUrlPrefix() {
        if (/\/(start-welcome)\/?/.test(window.location.href)) {
            return 'start-welcome';
        } else if (/\/(start-outsource)\/?/.test(window.location.href)) {
            return 'start-outsource';
        }
        return 'start';
    }

    getUser() {
        let user = {};
        if (this.props.location && this.props.location.query) {
            if (this.props.location.query.first_name) {
                user.first_name = this.props.location.query.first_name;
            }
            if (this.props.location.query.last_name) {
                user.last_name = this.props.location.query.last_name;
            }
            if (this.props.location.query.email) {
                user.email = this.props.location.query.email;
            }
        }
        return user;
    }

    renderHeaderContent() {
        var testimonials = getClientTestimonials(2);
        const {options} = this.props;

        let phase = this.getPhase();
        if (['schedule', 'speed-up'].indexOf(phase) == -1) {
            phase = '';
        }

        let slider_settings = {
            dots: true,
            arrows: true,
            infinite: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 3000, //,
            /*responsive: [
                { breakpoint: 320, settings: { slidesToShow: 1 } },
                { breakpoint: 768, settings: { slidesToShow: 2 } },
                { breakpoint: 1024, settings: { slidesToShow: 3 } }
            ]*/
        };

        return (
            <div
                className={`task-wizard ${
                    this.state.step == 1 && !this.getTaskId()
                        ? 'show-trust'
                        : ''
                }`}>
                <div className="title-bar">
                    <i className="icon tunga-icon-post-task" />
                    <div className="heading-3 bold text-center">
                        {this.state.title}
                    </div>
                    <div className="heading-1">{this.state.subtitle}</div>
                </div>
                <div className="task-section">
                    <TaskContainer>
                        <TaskDetailContainer
                            taskId={this.getTaskId()}
                            editToken={getEditToken()}>
                            <TaskForm
                                showSectionHeader={false}
                                options={{...options, ...this.getUser()}}
                                onStepChange={this.onStepChange.bind(this)}
                                phase={phase}
                                urlPrefix={this.getUrlPrefix()}
                            />
                        </TaskDetailContainer>
                    </TaskContainer>
                </div>
                <div className="dev-section">
                    <div className="dev-list ">
                        <Slider className="text-center" {...slider_settings}>
                            <div className="testimonial">
                                {testimonials.map(testimonial => {
                                    return (
                                        <div className="card">
                                            <div className="media">
                                                <div className="media-left">
                                                    <Avatar
                                                        src={testimonial.image}
                                                        size="medium"
                                                    />
                                                </div>
                                                <div className="media-body">
                                                    <div className="media-heading">
                                                        <strong>
                                                            {testimonial.name}
                                                        </strong>,{' '}
                                                        {testimonial.position}{' '}
                                                        at {testimonial.company}
                                                    </div>
                                                    <div>
                                                        <span
                                                            dangerouslySetInnerHTML={{
                                                                __html:
                                                                    testimonial.message,
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div>
                                <ul className="press-links">
                                    <li>
                                        <a
                                            href="http://www.bbc.co.uk/news/world-africa-38294998"
                                            target="_blank">
                                            <img
                                                src={require('../images/press/bbc.png')}
                                            />
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="http://trendwatching.com/blog/featured-innovator-tunga/"
                                            target="_blank">
                                            <img
                                                src={require('../images/press/trend-watching.png')}
                                            />
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="https://soundcloud.com/african-tech-round-up/a-chat-with-ernesto-spruyt-of-tungaio?in=african-tech-round-up/sets/quick-chats"
                                            target="_blank">
                                            <img
                                                src={require('../images/press/African-Tech-Round-Up.png')}
                                            />
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div id="what-we-can-do">
                                <h3>Expertise:</h3>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div id="mobile-app">
                                            <i className="icon tunga-icon-do-app" />
                                            <p>
                                                Excellent native app development<br />
                                                Specialized iOS and Android
                                                teams<br />
                                                App maintenance and improvements<br />
                                                From idea to application
                                            </p>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div id="building-websites">
                                            <i className="icon tunga-icon-do-web" />
                                            <p>
                                                Full stack capacity for web<br />
                                                API development<br />
                                                All popular JS frameworks
                                                capacity<br />
                                                Backend development
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Slider>
                    </div>
                </div>
                <div className="clearfix" />
            </div>
        );
    }

    render() {
        let meta_title = 'Tunga | Get Started';
        let meta_description = 'Hire top African developers!';

        return (
            <ShowcaseContainer
                className="task-wizard-page"
                headerContent={this.renderHeaderContent()}
                hasGlassNav={false}>
                <MetaTags title={meta_title} description={meta_description} />
            </ShowcaseContainer>
        );
    }
}
