import React from 'react';
import {Link} from 'react-router-dom';
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

export default class QuizForm extends ComponentWithModal {
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
      autoSubmit: false
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if(this.state.autoSubmit && !prevState.autoSubmit) {
      // submit form
      console.log('Ready to submit');
    }
  }

  componentWillUnmount() {
    // incase someone does not finish the quiz, send current choices
  }

  onStateValueChange(key, value) {
    this.setState({step: this.state.step + 1});
    if (key != '') {
      let extraState = {};
      if(key == 'manage') {
        extraState.autoSubmit = true;
      }
      this.setState({ ...extraState, [key]: value});
    }
  }

  onChange(e) {
    this.setState({[e.target.name]: e.target.value});
  }

  renderHeaderContent() {

    if(this.state.autoSubmit) {
      return (
        <div>
          <div className="heading-3 bold text-center">
            Thank you for using Tunga!
          </div>
          <div className="thank-you">
            We will reach out to you shortly!<br />
            <i className="fa fa-check-circle status-icon" />
          </div>
        </div>
      );
    }

    let skypeComp = (
      <div>
        <div className="form-group">
          <label className="control-label">Skype ID</label>
          <div className="row">
            <div className="col-md-12">
              <div>
                <input
                  type="text"
                  className="form-control"
                  name="skype_id"
                  placeholder="Your Skype ID"
                  value={this.state.skype_id}
                  onChange={this.onChange.bind(this)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );

    let emailComp = (
      <div>
        <div className="form-group">
          <label className="control-label">E-mail address *</label>
          <div>
            <input
              type="email"
              name="email"
              className="form-control"
              required
              placeholder="Email"
              onChange={this.onChange.bind(this)}
              value={this.state.email}
            />
          </div>
        </div>
      </div>
    );

    let personalComp = (
      <div>
        <div className="form-group">
          <label className="control-label">Name *</label>
          <div className="row">
            <div className="col-xs-5">
              <input
                type="text"
                name="first_name"
                className="form-control"
                required
                placeholder="First Name"
                onChange={this.onChange.bind(this)}
                value={this.state.first_name}
              />
            </div>
            <div className="col-xs-7">
              <input
                type="text"
                name="last_name"
                className="form-control"
                required
                placeholder="Last Name"
                onChange={this.onChange.bind(this)}
                value={this.state.last_name}
              />
            </div>
          </div>
        </div>
      </div>
    );

    let startQuizComp = (
      <div className="form-group">
        <div className="nav text-center">
          <button
            type="button"
            className="btn btn-callout btn-main-cta quiz-start"
            onClick={this.onStateValueChange.bind(this)}>
            Start
          </button>
        </div>
      </div>
    );

    let taskTypeComp = (
      <div>
        <div className="btn-choices choice-fork" role="group">
          {TASK_TYPE_CHOICES.map(type => {
            return (
              <div className="choice">
                <button
                  key={type.id}
                  type="button"
                  className={
                    'btn ' + (this.state.type == type.id ? ' active' : '')
                  }
                  onClick={this.onStateValueChange.bind(this, 'type', type.id)}>
                  <i className={`icon ${type.icon}`} />
                </button>
                <div>
                  {type.name}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );

    let taskScopeComp = (
      <div>
        <div className="btn-choices choice-fork" role="group">
          {TASK_SCOPE_QUIZ_CHOICES.map(scope_type => {
            return (
              <div className="choice">
                <button
                  key={scope_type.id}
                  type="button"
                  className={
                    'btn' + (this.state.scope == scope_type.id ? ' active' : '')
                  }
                  onClick={this.onStateValueChange.bind(
                    this,
                    'scope',
                    scope_type.id,
                  )}>
                  <i className={`icon ${scope_type.icon}`} />
                </button>
                <div dangerouslySetInnerHTML={{__html: scope_type.name}} />
              </div>
            );
          })}
        </div>
      </div>
    );

    let taskTechComp = (
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
              <div className="choice">
                <button
                  key={require_tech.id}
                  type="button"
                  className="btn"
                  onClick={this.onStateValueChange.bind(
                    this,
                    'tech',
                    require_tech.id,
                  )}>
                  <i className={`icon ${require_tech.icon}`} />
                </button>
                <div dangerouslySetInnerHTML={{__html: require_tech.name}} />
              </div>
            );
          })}
        </div>
      </div>
    );

    let taskManageComp = (
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
              <div className="choice">
                <button
                  key={can_manage.id}
                  type="button"
                  className="btn"
                  onClick={this.onStateValueChange.bind(
                    this,
                    'manage',
                    can_manage.id,
                  )}>
                  <i className={`icon ${can_manage.icon}`} />
                </button>
                <div dangerouslySetInnerHTML={{__html: can_manage.name}} />
              </div>
            );
          })}
        </div>
      </div>
    );

    let taskSpecificationComp = (
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
              <div className="choice">
                <button
                  key={has_details.id}
                  type="button"
                  className="btn"
                  onClick={this.onStateValueChange.bind(
                    this,
                    'details',
                    has_details.id,
                  )}>
                  <i className={`icon ${has_details.icon}`} />
                </button>
                <div dangerouslySetInnerHTML={{__html: has_details.name}} />
              </div>
            );
          })}
        </div>
      </div>
    );

    sections = [
      {
        title: 'Your guide towards effectively executing your project',
        subtitle: 'find out in 5 clicks what way of working works best for you',
        items: [startQuizComp],
      },
      {
        title: 'What kind of product are you building?',
        items: [taskTypeComp],
      },
      {
        title: 'What is the scope for your project?',
        items: [taskScopeComp],
      },
      {
        title: 'Do you know which technologies you want to use?',
        items: [taskTechComp],
      },
      {
        title: 'Do you have detailed project specifications?',
        items: [taskSpecificationComp],
      },
      {
        title: 'Do you need help in managing and cordinating the project?',
        items: [taskManageComp],
      },
    ];

    let current_section = sections[this.state.step];

    return (
      <div className="task-wizard">
        <div className="title-bar">
          <div className="heading-3 bold text-center">
            {current_section.title}
          </div>
          <div className="heading-1">
            {current_section.subtitle}
          </div>
        </div>
        <div className="task-section">
          {/*begin steps*/}
          <div className="form-wrapper task-form">
            <form role="form">
              {/*<div>*/}
              <div className="step">
                {current_section.items.map(item => {
                  return item;
                })}
              </div>
              {/*</div>*/}
            </form>
          </div>
          {/* end steps */}
        </div>
        <section id="press">
          <div className="container ">
            <Reveal effect="animated fadeInLeft">
              <div>
                <ul className="press-links">
                  <li>
                    <a
                      href="http://www.bbc.co.uk/news/world-africa-38294998"
                      target="_blank">
                      <img src={require('../images/press/bbc.png')} />
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.youtube.com/watch?v=v9uRtYpZDQs"
                      target="_blank">
                      <img src={require('../images/press/campus-party.png')} />
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.oneworld.nl/startup-tunga-lanceert-pilot-programma-voor-nieuw-soort-freelance-platform"
                      target="_blank">
                      <img src={require('../images/press/OWlogo.png')} />
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
                      <img src={require('../images/press/Spend-Matters.png')} />
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
  }

  render() {
    let meta_title = 'Tunga | Quiz';
    let meta_description = 'Guide towards effectively executing project!';

    return (
      <ShowcaseContainer
        className="quiz-page quiz"
        headerContent={this.renderHeaderContent()}>
        <MetaTags title={meta_title} description={meta_description} />
      </ShowcaseContainer>
    );
  }
}
