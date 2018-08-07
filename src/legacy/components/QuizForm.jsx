import React from 'react';
import {Link} from 'react-router';
import moment from 'moment';
import _ from 'lodash';
import {Button, OverlayTrigger, Tooltip} from 'react-bootstrap';
import momentLocalizer from 'react-widgets/lib/localizers/moment';
import {DateTimePicker, Calendar} from 'react-widgets';
import Dropzone from 'react-dropzone';
import randomstring from 'randomstring';

import Progress from './status/Progress';
import FormStatus from './status/FormStatus';
import FieldError from './status/FieldError';

import UserSelector from '../containers/UserSelector';
import SkillSelector from '../containers/SkillSelector';
import ComponentWithModal from './ComponentWithModal';
import LargeModal from './LargeModal';
import MilestoneForm from './MilestoneForm';
import ShowcaseContainer from '../containers/ShowcaseContainer';
import MetaTags from '../components/MetaTags';
import Reveal from 'react-reveal';

import {
    USER_TYPE_DEVELOPER,
    USER_TYPE_PROJECT_MANAGER,
    USER_TYPE_PROJECT_OWNER,
    TASK_TYPE_CHOICES,
    TASK_SCOPE_CHOICES,
    TASK_SCOPE_QUIZ_CHOICES,
    TASK_SCOPE_CHOICES_NEW_USER,
    TASK_SCOPE_ONGOING,
    TASK_SCOPE_PROJECT,
    TASK_BILLING_METHOD_CHOICES,
    TASK_BILLING_METHOD_FIXED,
    TASK_BILLING_METHOD_HOURLY,
    TASK_CODERS_NEEDED_CHOICES,
    TASK_VISIBILITY_CHOICES,
    VISIBILITY_DEVELOPERS,
    VISIBILITY_CUSTOM,
    UPDATE_SCHEDULE_CHOICES,
    suggestTaskTypeSkills,
    TASK_TYPE_OTHER,
    TASK_SCOPE_TASK,
} from '../constants/Api';

import {getTaskTypeUrl, getScopeUrl, sendGAPageView} from '../utils/tracking';
import {
    isAuthenticated,
    isProjectManager,
    getUser,
    isAdmin,
    openProfileWizard,
} from '../utils/auth';
import {estimateDevHoursForFee, getAcquisitionUrl} from '../utils/tasks';
import {parseNumber} from '../utils/helpers';

momentLocalizer(moment);

var sections = [];
var quiz_choices = {};
export default class QuizForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            step: 0,
            first_name: '',
            last_name: '',
            email: '',
            skype_id: '',
            type: '',
            scope: '',
            tech: '',
            details: '',
            manage: '',
            enable_btn: false,
            disabled: true,
            autoSubmit: false,
            bottomContent: null,
        };
    }

    onChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    onStateValueChange(value) {
        this.setState({step: this.state.step + 1});
        if (value != '') {
            if (value == 'manage') {
                this.setState({
                    autoSubmit: !this.state.autoSubmit,
                    bottomContent: <BottomContent />,
                });
            }
        }
    }

    renderHeaderContent() {
        var rendered_output = null;

        if (this.state.autoSubmit) {
            return (
                <div>
                    <div className="heading-3 bold text-center">
                        Get started on your first task
                    </div>
                </div>
            );
        }

        sections = [
            {
                title: 'Your guide towards effectively executing your project',
                subtitle:
                    'find out in 5 clicks what way of working works best for you',
                items: [
                    <StartQuiz
                        onStateValueChange={stage =>
                            this.onStateValueChange(stage)
                        }
                    />,
                ],
            },
            {
                title: 'What kind of product are you building?',
                items: [
                    <TaskType
                        type={this.state.type}
                        onStateValueChange={stage =>
                            this.onStateValueChange(stage)
                        }
                    />,
                ],
            },
            {
                title: 'What is the scope for your project?',
                items: [
                    <TaskScope
                        scope={this.state.scope}
                        onStateValueChange={stage =>
                            this.onStateValueChange(stage)
                        }
                    />,
                ],
            },
            {
                title: 'Do you know which technologies you want to use?',
                items: [
                    <TaskTech
                        onStateValueChange={stage =>
                            this.onStateValueChange(stage)
                        }
                    />,
                ],
            },
            {
                title: 'Do you have detailed project specifications?',
                items: [
                    <TaskSpecification
                        onStateValueChange={stage =>
                            this.onStateValueChange(stage)
                        }
                    />,
                ],
            },
            {
                title:
                    'Do you need help in managing and cordinating the project?',
                items: [
                    <TaskManage
                        onStateValueChange={stage =>
                            this.onStateValueChange(stage)
                        }
                    />,
                ],
            },
        ];

        let current_section = sections[this.state.step];

        return <ContentWrapper current_section={current_section} />;
    }

    render() {
        let meta_title = 'Tunga | Quiz';
        let meta_description = 'Guide towards effectively executing project!';

        return (
            <ShowcaseContainer
                className={
                    this.state.autoSubmit
                        ? 'quiz-page-result'
                        : 'quiz-page quiz'
                }
                headerContent={this.renderHeaderContent()}>
                <MetaTags title={meta_title} description={meta_description} />
                {this.state.bottomContent}
            </ShowcaseContainer>
        );
    }
}

const StartQuiz = props => (
    <div className="form-group">
        <div className="nav text-center">
            <button
                type="button"
                className="btn btn-callout btn-main-cta quiz-start"
                onClick={() => props.onStateValueChange('start')}>
                Start
            </button>
        </div>
    </div>
);

const TaskType = props => (
    <div>
        <div className="btn-choices choice-fork" role="group">
            {TASK_TYPE_CHOICES.map(type => {
                return (
                    <div key={type.id} className="choice">
                        <button
                            type="button"
                            className={
                                'btn ' +
                                (props.type == type.id ? ' active' : '')
                            }
                            onClick={() => props.onStateValueChange('type')}>
                            <i className={`icon ${type.icon}`} />
                        </button>
                        <div>{type.name}</div>
                    </div>
                );
            })}
        </div>
    </div>
);

const TaskScope = props => (
    <div>
        <div className="btn-choices choice-fork" role="group">
            {TASK_SCOPE_QUIZ_CHOICES.map(scope_type => {
                return (
                    <div key={scope_type.id} className="choice">
                        <button
                            type="button"
                            className={
                                'btn' +
                                (props.scope == scope_type.id ? ' active' : '')
                            }
                            onClick={() => props.onStateValueChange('scope')}>
                            <i className={`icon ${scope_type.icon}`} />
                        </button>
                        <div
                            dangerouslySetInnerHTML={{__html: scope_type.name}}
                        />
                    </div>
                );
            })}
        </div>
    </div>
);

const TaskTech = props => (
    <div className="form-group">
        <div className="btn-choices choice-fork" role="group">
            {[
                {
                    id: 1,
                    name: 'Yes',
                    icon: 'tunga-icon-check',
                },
                {
                    id: 2,
                    name: 'No',
                    icon: 'tunga-icon-cross',
                },
            ].map(require_tech => {
                return (
                    <div key={require_tech.id} className="choice">
                        <button
                            key={require_tech.id}
                            type="button"
                            className="btn"
                            onClick={() => props.onStateValueChange('tech')}>
                            <i className={`icon ${require_tech.icon}`} />
                        </button>
                        <div
                            dangerouslySetInnerHTML={{
                                __html: require_tech.name,
                            }}
                        />
                    </div>
                );
            })}
        </div>
    </div>
);

const TaskManage = props => (
    <div className="form-group">
        <div className="btn-choices choice-fork" role="group">
            {[
                {
                    id: 1,
                    name: 'Yes',
                    icon: 'tunga-icon-check',
                },
                {
                    id: 2,
                    name: 'No',
                    icon: 'tunga-icon-cross',
                },
                {
                    id: 3,
                    name: "Don't know yet",
                    icon: 'tunga-icon-question',
                },
            ].map(can_manage => {
                return (
                    <div key={can_manage.id} className="choice">
                        <button
                            type="button"
                            className="btn"
                            onClick={() => props.onStateValueChange('manage')}>
                            <i className={`icon ${can_manage.icon}`} />
                        </button>
                        <div
                            dangerouslySetInnerHTML={{__html: can_manage.name}}
                        />
                    </div>
                );
            })}
        </div>
    </div>
);

const TaskSpecification = props => (
    <div className="form-group">
        <div className="btn-choices choice-fork" role="group">
            {[
                {
                    id: 1,
                    name: 'Yes',
                    icon: 'tunga-icon-check',
                },
                {
                    id: 2,
                    name: 'No',
                    icon: 'tunga-icon-cross',
                },
            ].map(has_details => {
                return (
                    <div key={has_details.id} className="choice">
                        <button
                            type="button"
                            className="btn"
                            onClick={() => props.onStateValueChange('details')}>
                            <i className={`icon ${has_details.icon}`} />
                        </button>
                        <div
                            dangerouslySetInnerHTML={{__html: has_details.name}}
                        />
                    </div>
                );
            })}
        </div>
    </div>
);

const Footer = props => (
    <div>
        <section id="press" className={props.extra_class}>
            <div className="container">
                <Reveal effect="animated fadeInLeft">
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
                                    href="https://www.youtube.com/watch?v=v9uRtYpZDQs"
                                    target="_blank">
                                    <img
                                        src={require('../images/press/campus-party.png')}
                                    />
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://www.oneworld.nl/startup-tunga-lanceert-pilot-programma-voor-nieuw-soort-freelance-platform"
                                    target="_blank">
                                    <img
                                        src={require('../images/press/OWlogo.png')}
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
                            <li>
                                <a
                                    href="http://spendmatters.com/2016/04/01/tunga-wip-of-the-week/"
                                    target="_blank">
                                    <img
                                        src={require('../images/press/Spend-Matters.png')}
                                    />
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://www.nabc.nl/africa-business-news/5/technology/377/tunga-founder-ernesto-spruyt-we-create-21st-century-jobs-in-africa"
                                    target="_blank">
                                    <img
                                        src={require('../images/press/netherlands-african-business-council.png')}
                                    />
                                </a>
                            </li>
                        </ul>
                    </div>
                </Reveal>
            </div>
        </section>
        <div className="text-center">
            <small>
                &copy; {moment().format('YYYY')} Tunga.io &mdash; All rights
                reserved.
            </small>
        </div>
    </div>
);

const ContentWrapper = ({current_section}) => (
    <div className="task-wizard">
        <div className="title-bar">
            <div className="heading-3 bold text-center">
                {current_section.title}
            </div>
            <div className="heading-1">{current_section.subtitle}</div>
        </div>
        <div className="task-section">
            {/*begin steps*/}
            <div className="form-wrapper task-form">
                <form role="form">
                    <div className="step">
                        {current_section.items.map(item => {
                            return item;
                        })}
                    </div>
                </form>
            </div>
            {/* end steps */}
        </div>
        <Footer />
    </div>
);

const BottomContent = () => (
    <div className="content">
        <section>
            <div className="container">
                <div
                    className="heading-1 text-center bold"
                    style={{marginTop: 20, marginBottom: 40}}>
                    You are ready to source developers from a database to work
                    on your task. If you need help you can always call us if you
                    have questions.
                    {/*
          Explame text regarding the outcome/advise the give the visitor. MAX number of characters 350!
          */}
                    <br />
                    <div className="row" style={{marginTop: 20}}>
                        <div className="col-lg-4 col-lg-offset-4">
                            <a className="btn btn-callout btn-block">
                                Post task on Tunga
                            </a>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-4 col-lg-offset-4">
                            <a className="btn btn-callout btn-block">
                                Schedule a call to find out more
                            </a>
                        </div>
                    </div>
                </div>

                <Footer extra_class="quiz-result" />
            </div>
        </section>
    </div>
);
