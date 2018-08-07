import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {LandingPage} from '../routes/LandingPage';

import * as SkillPageActions from '../actions/SkillPageActions';
import {nl_to_br} from '../utils/html';
import {isTungaDomain} from '../utils/router';

class TaskWizardLander extends LandingPage {
    constructor(props) {
        super(props);
        this.state = {
            ...(this.state || {}),
            title: (
                <span>
                    Discuss your project within<br />
                    24 hours!
                </span>
            ),
            subtitle: null,
            step: 1,
            pageClass: 'task-wizard-page lander',
            showVideo: false,
        };
    }

    onStepChange(step, idx, all_steps) {
        this.setState({
            title: step && step.title ? step.title : '',
            subtitle: step && step.subtitle ? step.subtitle : null,
            step: idx ? idx + 1 : -1,
        });
    }

    getTaskId() {
        if (this.props.params) {
            return this.props.params.taskId;
        }
        return null;
    }

    renderHeaderContent() {
        let dlp_phrase = this.getDLPPhrase(),
            {
                SkillPage: {detail: {skill_page, isRetrieving, error}},
            } = this.props;
        let isSkillPage = this.state.isSkillPage && !error.retrieve;

        return (
            <div className="row">
                <div className="col-sm-6 col-md-8">
                    <div className="pitch">
                        <h1>
                            {isSkillPage && skill_page.welcome_header ? (
                                <span
                                    dangerouslySetInnerHTML={{
                                        __html: nl_to_br(
                                            skill_page.welcome_header,
                                        ),
                                    }}
                                />
                            ) : (
                                <span>
                                    Getting software projects done is hard.<br />
                                    We make it easy.
                                </span>
                            )}
                        </h1>
                        <div className="details">
                            {isSkillPage && skill_page.welcome_sub_header ? (
                                <span
                                    dangerouslySetInnerHTML={{
                                        __html: nl_to_br(
                                            skill_page.welcome_sub_header,
                                        ),
                                    }}
                                />
                            ) : (
                                <span>
                                    Tunga enables you to have super-bright{' '}
                                    {this.getDLPDesc() || 'developers'} from
                                    Africa work on your software project in a
                                    productive, friendly and worthwhile way.
                                </span>
                            )}
                        </div>
                        <div>
                            <a
                                className="btn btn-callout btn-main-cta"
                                href="/call/">
                                <i class="tunga-icon-rocket" />Schedule a call
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {Auth: state.Auth, SkillPage: state.SkillPage};
}

function mapDispatchToProps(dispatch) {
    return {
        SkillPageActions: bindActionCreators(SkillPageActions, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskWizardLander);
