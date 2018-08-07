import PropTypes from "prop-types";
import React from 'react';
import moment from 'moment';
import _ from 'lodash';

import FieldError from '../../core/FieldError';
import DateTimePicker from '../../core/DateTimePicker';
import Success from "../../core/Success";
import Button from "../../core/Button";
import ChoiceGroup from "../../core/ChoiceGroup";
import Upload from "../../core/Upload";
import TextArea from "../../core/TextArea";
import Select from "../../core/Select";
import Input from "../../core/Input";

import {
    REPORT_STATUSES,
    REPORT_STATUS_BEHIND_AND_STUCK,
    PROGRESS_EVENT_TYPE_CLIENT,
    PROGRESS_EVENT_TYPE_PM,
    PROGRESS_EVENT_TYPE_CLIENT_MID_SPRINT,
    REPORT_STUCK_REASONS, PROGRESS_EVENT_TYPE_MILESTONE,
} from '../../../actions/utils/api';
import {getUser, isClient, isDev, isPM} from "../../utils/auth";
import {openConfirm} from "../../core/utils/modals";

export default class ProgressReportForm extends React.Component {
    static propTypes = {
        project: PropTypes.object,
        progress_event: PropTypes.object,
        ProjectActions: PropTypes.object,
        isSaving: PropTypes.bool,
        isSaved: PropTypes.bool,
    };

    constructor(props) {
        super(props);
        const {progress_report} = props;
        let cleanedReport = {};
        if(progress_report) {
            Object.keys(progress_report).forEach(key => {
                if(!['event', 'user', 'created_at', 'updated_at', 'uploads'].includes(key)) {
                    cleanedReport[key] = progress_report[key];
                }
            });
        }
        this.state = {report: cleanedReport};
    }

    componentDidMount() {
        const {progress_report} = this.props;
        if (progress_report.id) {
            this.setState({...progress_report});
        }

        if (this.isDevReport()) {
            openConfirm(
                <div>
                    <p>Hi {getUser().first_name},</p>
                    <p>
                        Please take into account that some of these answers
                        might be shared directly with clients.
                    </p>
                    <p>
                        Therefore, please always consider if your answers are
                        business/client appropriate.
                    </p>
                    <p>Thank you for filling in the survey!</p>
                </div>,
                false,
                {hideCancel: true},
            ).then(function() {
                // Nothing to do for now
            });
        }
    }

    isDevReport() {
        const {progress_event} = this.props;
        return (
            isDev() && progress_event &&
            ![PROGRESS_EVENT_TYPE_CLIENT, PROGRESS_EVENT_TYPE_CLIENT_MID_SPRINT, PROGRESS_EVENT_TYPE_PM].includes(
                progress_event.type,
            )
        );
    }

    isPMReport() {
        const {progress_event} = this.props;
        return isPM() && progress_event && [PROGRESS_EVENT_TYPE_PM, PROGRESS_EVENT_TYPE_MILESTONE].includes(progress_event.type);
    }

    isClientReport() {
        const {progress_event} = this.props;
        return isClient() && progress_event && [PROGRESS_EVENT_TYPE_CLIENT, PROGRESS_EVENT_TYPE_MILESTONE].includes(progress_event.type);
    }

    isClientMidSprintReport() {
        const {progress_event} = this.props;
        return isClient() && progress_event && progress_event.type === PROGRESS_EVENT_TYPE_CLIENT_MID_SPRINT;
    }

    onInputChange(key, e) {
        this.onChangeValue(key, e.target.value);
    }

    onChangeValue(key, value) {
        let newState = {};
        newState[key] = value;
        this.setState({report: {...this.state.report, ...newState}});
    }

    getRatingsMap(to) {
        return _.range(1, to);
    }

    onSave = e => {
        e.preventDefault();

        const {progress_report, progress_event, ProgressReportActions, errors} = this.props;

        let reqData = {event: {id: progress_event.id}, ...this.state.report};
        if(reqData.files && reqData.files.length === 0) {
            delete reqData['files'];
        }

        if (progress_report.id) {
            ProgressReportActions.updateProgressReport(progress_report.id, reqData);
        } else {
            ProgressReportActions.createProgressReport(reqData);
        }
    };

    render() {
        const {progress_report, isSaved, isSaving, errors} = this.props;

        if (isSaved) {
            return (
                <Success variant="icon" message={`Thank you for ${this.isClientReport()?'responding to the survey':'filling in your progress report'}!`}/>
            );
        }

        return (
            <div className="progress-report">
                <form
                    onSubmit={this.onSave}
                    name="progress_report"
                    role="form">
                    <div className="section-title">
                        Progress {this.isClientReport() || this.isClientMidSprintReport()?'Survey':'Report'}
                    </div>

                    {isSaved?(
                        <Success message={`Progress ${this.isClientReport() || this.isClientMidSprintReport()?'Survey':'Report'} saved successfully`}/>
                    ):null}

                    {this.isDevReport() || this.isPMReport() ? (
                        <div>
                            {errors.create &&
                            errors.create.status ? (
                                <FieldError
                                    message={
                                        errors.create
                                            .status
                                    }
                                />
                            ) : null}
                            {errors.update &&
                            errors.update.status ? (
                                <FieldError
                                    message={
                                        errors.update
                                            .status
                                    }
                                />
                            ) : null}
                            <div className="form-group">
                                <label className="control-label">
                                    Task status *
                                </label>
                                <div>
                                    <ChoiceGroup choices={REPORT_STATUSES}
                                                 selected={this.state.report.status}
                                                 onChange={result => this.onChangeValue('status', result)}/>
                                </div>
                            </div>

                            {this.state.report.status ===
                            REPORT_STATUS_BEHIND_AND_STUCK ? (
                                <div>
                                    {/* check status if stuck and is developer for this */}

                                    {errors.create &&
                                    errors.create.stuck_reason ? (
                                        <FieldError
                                            message={
                                                errors.create
                                                    .stuck_reason
                                            }
                                        />
                                    ) : null}
                                    {errors.update &&
                                    errors.update.stuck_reason ? (
                                        <FieldError
                                            message={
                                                errors.update
                                                    .stuck_reason
                                            }
                                        />
                                    ) : null}
                                    <div className="form-group">
                                        <label className="control-label">
                                            Select reason why you are stuck
                                        </label>
                                        <Select options={REPORT_STUCK_REASONS}
                                                selected={this.state.report.stuck_reason}
                                                onChange={value => this.onChangeValue('stuck_reason', value)}/>
                                    </div>

                                    {errors.create &&
                                    errors.create.stuck_details ? (
                                        <FieldError
                                            message={
                                                errors.create
                                                    .stuck_details
                                            }
                                        />
                                    ) : null}
                                    {errors.update &&
                                    errors.update.stuck_details ? (
                                        <FieldError
                                            message={
                                                errors.update
                                                    .stuck_details
                                            }
                                        />
                                    ) : null}
                                    <div className="form-group">
                                        <label className="control-label">
                                            Explain Further why you are stuck/what
                                            should be done.
                                        </label>
                                        <TextArea
                                            placeholder="More details"
                                            onChange={this.onInputChange.bind(this, 'stuck_details')}
                                            value={this.state.report.stuck_details} >
                                    {this.state.report.stuck_details}
                                </TextArea>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    ) : null}

                    {this.isDevReport() ? (
                        <div>
                            <div>
                                <div className="form-group">
                                    <label className="control-label">
                                        When did you start this
                                        sprint/task/project?
                                    </label>
                                    <DateTimePicker
                                        onChange={(date) => this.onChangeValue('started_at', moment(date).utc().format())}
                                        value={this.state.report.started_at?new Date(moment.utc(this.state.report.started_at).format()):null}
                                        calendar={true}
                                        time={false}
                                    />
                                </div>
                            </div>
                        </div>
                    ) : null}

                    {this.isPMReport() || this.isClientReport()? (
                        <div>
                            {errors.create &&
                            errors.create
                                .last_deadline_met ? (
                                <FieldError
                                    message={
                                        errors.create
                                            .last_deadline_met
                                    }
                                />
                            ) : null}
                            {errors.update &&
                            errors.update
                                .last_deadline_met ? (
                                <FieldError
                                    message={
                                        errors.update
                                            .last_deadline_met
                                    }
                                />
                            ) : null}
                            <div className="form-group">
                                <label className="control-label">
                                    Was the last deadline met? *
                                </label>
                                <div>
                                    <ChoiceGroup choices={[[true, 'Yes'], [false, 'No']]}
                                                 selected={typeof this.state.report.last_deadline_met === 'boolean'?this.state.report.last_deadline_met:null}
                                                 onChange={value => this.onChangeValue('last_deadline_met', value)}/>
                                </div>
                            </div>

                            {this.isPMReport() && typeof this.state.report.last_deadline_met === 'boolean' &&
                            !this.state.report.last_deadline_met ? (
                                <div>
                                    {errors.create &&
                                    errors.create
                                        .deadline_report ? (
                                        <FieldError
                                            message={
                                                errors
                                                    .create.deadline_report
                                            }
                                        />
                                    ) : null}
                                    {errors.update &&
                                    errors.update
                                        .deadline_report ? (
                                        <FieldError
                                            message={
                                                errors
                                                    .update.deadline_report
                                            }
                                        />
                                    ) : null}
                                    <div className="form-group">
                                        <label className="control-label">
                                            Why wasn't the last deadline met?
                                            Please provide a detailed
                                            explanation. *
                                        </label>
                                        <TextArea
                                            placeholder="Why wasn't the last deadline met? Please provide a detailed explanation."
                                            onChange={this.onInputChange.bind(
                                                this,
                                                'deadline_report',
                                            )}
                                            required>
                                            {this.state.report.deadline_report}
                                        </TextArea>
                                    </div>
                                </div>
                            ) : null}

                            {typeof this.state.last_deadline_met === 'boolean' &&
                            !this.state.last_deadline_met ? (
                                <div>
                                    {errors.create &&
                                    errors.create
                                        .deadline_miss_communicated ? (
                                        <FieldError
                                            message={
                                                errors
                                                    .create
                                                    .deadline_miss_communicated
                                            }
                                        />
                                    ) : null}
                                    {errors.update &&
                                    errors.update
                                        .deadline_miss_communicated ? (
                                        <FieldError
                                            message={
                                                errors
                                                    .update
                                                    .deadline_miss_communicated
                                            }
                                        />
                                    ) : null}
                                    <div className="form-group">
                                        <label className="control-label">
                                            {this.isPMReport()?'Did you inform the client promptly about not making the deadline? *':'Did the project manager/developer(s) inform you promptly about not making the deadline? *'}
                                        </label>
                                        <div>
                                            <ChoiceGroup choices={[[true, 'Yes'], [false, 'No']]}
                                                         selected={typeof this.state.report.deadline_miss_communicated === 'boolean'?this.state.report.deadline_miss_communicated:null}
                                                         onChange={value => this.onChangeValue('deadline_miss_communicated', value)}/>
                                        </div>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    ):null}

                    {this.isPMReport() ? (
                        <div>

                        </div>
                    ) : null}

                    {this.isDevReport() || this.isPMReport() ? (
                        <div>
                            {errors.create &&
                            errors.create.percentage ? (
                                <FieldError
                                    message={
                                        errors.create
                                            .percentage
                                    }
                                />
                            ) : null}
                            {errors.update &&
                            errors.update.percentage ? (
                                <FieldError
                                    message={
                                        errors.update
                                            .percentage
                                    }
                                />
                            ) : null}
                            <div className="form-group">
                                <label className="control-label">
                                    Percentage completed *
                                </label>
                                <div>
                                    <Input
                                        type="number"
                                        required
                                        placeholder="Percentage completed"
                                        value={
                                            this.state.report.percentage
                                        }
                                        onChange={this.onInputChange.bind(this, 'percentage')}
                                    />
                                </div>
                            </div>

                            {errors.create &&
                            errors.create.accomplished ? (
                                <FieldError
                                    message={
                                        errors.create
                                            .accomplished
                                    }
                                />
                            ) : null}
                            {errors.update &&
                            errors.update.accomplished ? (
                                <FieldError
                                    message={
                                        errors.update
                                            .accomplished
                                    }
                                />
                            ) : null}
                            <div className="form-group">
                                <label className="control-label">
                                    What has been accomplished since the last
                                    update? *
                                </label>
                                <TextArea
                                    placeholder="What has been accomplished since the last update?"
                                    className="form-control"
                                    onChange={this.onInputChange.bind(
                                        this,
                                        'accomplished',
                                    )}
                                    required>
                                    {this.state.report.accomplished}
                                </TextArea>
                            </div>

                            {errors.create &&
                            errors.create.uploads ? (
                                <FieldError
                                    message={
                                        errors.create
                                            .uploads
                                    }
                                />
                            ) : null}
                            {errors.update &&
                            errors.update.uploads ? (
                                <FieldError
                                    message={
                                        errors.update
                                            .uploads
                                    }
                                />
                            ) : null}
                            <div className="form-group">
                                <label className="control-label">Files</label>
                                <Upload variant="button" onChange={uploads => this.onChangeValue('uploads', uploads)}/>
                            </div>
                        </div>
                    ) : null}

                    {this.isClientReport() ? (
                        <div>
                            {errors.create &&
                            errors.create
                                .deliverable_satisfaction ? (
                                <FieldError
                                    message={
                                        errors.create
                                            .deliverable_satisfaction
                                    }
                                />
                            ) : null}
                            {errors.update &&
                            errors.update
                                .deliverable_satisfaction ? (
                                <FieldError
                                    message={
                                        errors.update
                                            .deliverable_satisfaction
                                    }
                                />
                            ) : null}
                            <div className="form-group">
                                <label className="control-label">
                                    Are you satisfied with the deliverables? *
                                </label>
                                <div>
                                    <ChoiceGroup choices={[[true, 'Yes'], [false, 'No']]}
                                                 selected={typeof this.state.report.deliverable_satisfaction === 'boolean'?this.state.report.deliverable_satisfaction:null}
                                                 onChange={value => this.onChangeValue('deliverable_satisfaction', value)}/>
                                </div>
                            </div>
                        </div>
                    ) : null}

                    {this.isDevReport() || this.isClientReport() ? (
                        <div>
                            {errors.create &&
                            errors.create
                                .rate_deliverables ? (
                                <FieldError
                                    message={
                                        errors
                                            .create.rate_deliverables
                                    }
                                />
                            ) : null}
                            {errors.update &&
                            errors.update
                                .rate_deliverables ? (
                                <FieldError
                                    message={
                                        errors
                                            .update.rate_deliverables
                                    }
                                />
                            ) : null}
                            <div className="form-group">
                                <label className="control-label">
                                    {this.isDevReport()?'How do you rate your latest deliverable?*':'How would you rate the deliverables on a scale from 1 to 5? *'}
                                </label>
                                <div>
                                    <ChoiceGroup choices={this.getRatingsMap(6)}
                                                 selected={this.state.report.rate_deliverables}
                                                 onChange={value => this.onChangeValue('rate_deliverables', value)}/>
                                </div>
                            </div>
                        </div>
                    ) : null}

                    {this.isDevReport() || this.isPMReport() ? (
                        <div>
                            {errors.create &&
                            errors.create.todo ? (
                                <FieldError
                                    message={
                                        errors.create.todo
                                    }
                                />
                            ) : null}
                            {errors.update &&
                            errors.update.todo ? (
                                <FieldError
                                    message={
                                        errors.update.todo
                                    }
                                />
                            ) : null}
                            <div className="form-group">
                                <label className="control-label">
                                    {this.isDevReport()
                                        ? 'What do you intend to achieve/complete today?'
                                        : 'What are the next steps?'}{' '}
                                    *
                                </label>
                                <TextArea
                                    placeholder={
                                        this.isDevReport()
                                            ? 'What do you intend to achieve/complete today?'
                                            : 'What are the next steps?'
                                    }
                                    className="form-control"
                                    onChange={this.onInputChange.bind(
                                        this,
                                        'todo',
                                    )}
                                    value={this.state.report.todo}
                                    required>
                                    {this.state.report.todo}
                                </TextArea>
                            </div>

                            {errors.create &&
                            errors.create.next_deadline ? (
                                <FieldError
                                    message={
                                        errors.create.next_deadline
                                    }
                                />
                            ) : null}
                            {errors.update &&
                            errors.update.next_deadline ? (
                                <FieldError
                                    message={
                                        errors.update.next_deadline
                                    }
                                />
                            ) : null}
                            <div className="form-group">
                                <label className="control-label">
                                    When is the next deadline? *
                                </label>
                                <DateTimePicker
                                    onChange={date => this.onChangeValue('next_deadline', moment(date).utc().format())}
                                    value={
                                        this.state.report.next_deadline
                                            ? new Date(moment.utc(this.state.report.next_deadline).format())
                                            : null
                                    }
                                    calendar={true}
                                    time={false}
                                />
                            </div>

                            <div>
                                {errors.create &&
                                errors.create
                                    .next_deadline_meet ? (
                                    <FieldError
                                        message={
                                            errors.create
                                                .next_deadline_meet
                                        }
                                    />
                                ) : null}
                                {errors.update &&
                                errors.update
                                    .next_deadline_meet ? (
                                    <FieldError
                                        message={
                                            errors.update
                                                .next_deadline_meet
                                        }
                                    />
                                ) : null}
                                <div className="form-group">
                                    <label className="control-label">
                                        Do you anticipate to meet this deadline? *
                                    </label>
                                    <div>
                                        <ChoiceGroup choices={[[true, 'Yes'], [false, 'No']]}
                                                     selected={typeof this.state.report.next_deadline_meet === 'boolean'?this.state.report.next_deadline_meet:null}
                                                     onChange={value => this.onChangeValue('next_deadline_meet', value)}/>
                                    </div>
                                </div>

                                {typeof this.state.report.next_deadline_meet ===
                                    'boolean' &&
                                !this.state.report.next_deadline_meet ? (
                                    <div>
                                        {errors.create &&
                                        errors.create
                                            .next_deadline_fail_reason ? (
                                            <FieldError
                                                message={
                                                    errors
                                                        .create
                                                        .next_deadline_fail_reason
                                                }
                                            />
                                        ) : null}
                                        {errors.update &&
                                        errors.update
                                            .next_deadline_fail_reason ? (
                                            <FieldError
                                                message={
                                                    errors
                                                        .update
                                                        .next_deadline_fail_reason
                                                }
                                            />
                                        ) : null}
                                        <div className="form-group">
                                            <label className="control-label">
                                                Why won't you be able to make
                                                the next deadline?
                                            </label>
                                            <TextArea
                                                placeholder="Reasons why you won't be able to make the next deadline"
                                                className="form-control"
                                                onChange={this.onInputChange.bind(
                                                    this,
                                                    'next_deadline_fail_reason',
                                                )}>
                                                {
                                                    this.state.report.next_deadline_fail_reason
                                                }
                                            </TextArea>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        {errors.create &&
                                        errors.create
                                            .obstacles ? (
                                            <FieldError
                                                message={
                                                    errors
                                                        .create.obstacles
                                                }
                                            />
                                        ) : null}
                                        {errors.update &&
                                        errors.update
                                            .obstacles ? (
                                            <FieldError
                                                message={
                                                    errors
                                                        .update.obstacles
                                                }
                                            />
                                        ) : null}

                                        <div className="form-group">
                                            <label className="control-label">
                                                What obstacles are impeding your
                                                progress? *
                                            </label>
                                            <TextArea placeholder="What obstacles are impeding your progress?"
                                                className="form-control"
                                                onChange={this.onInputChange.bind(
                                                    this,
                                                    'obstacles',
                                                )}
                                                required>
                                                {this.state.report.obstacles}
                                            </TextArea>
                                        </div>

                                        {this.state.report.obstacles && !'no|none|non|nope|n/a|nah|false|.|..|...'.split('|').includes((this.state.report.obstacles || '').toLowerCase())? (
                                            <div className="form-group">
                                                <label className="control-label">
                                                    What could have been done to
                                                    prevent this from happening?
                                                    *
                                                </label>
                                                <TextArea
                                                    placeholder="What could have been done to prevent this from happening?"
                                                    className="form-control"
                                                    onChange={this.onInputChange.bind(
                                                        this,
                                                        'obstacles_prevention',
                                                    )}
                                                    required>
                                                    {
                                                        this.state.report.obstacles_prevention
                                                    }
                                                </TextArea>
                                            </div>
                                        ) : null}
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : null}

                    {this.isPMReport() ? (
                        <div>
                            {errors.create &&
                            errors.create
                                .team_appraisal ? (
                                <FieldError
                                    message={
                                        errors.create
                                            .team_appraisal
                                    }
                                />
                            ) : null}
                            {errors.update &&
                            errors.update
                                .team_appraisal ? (
                                <FieldError
                                    message={
                                        errors.update
                                            .team_appraisal
                                    }
                                />
                            ) : null}
                            <div className="form-group">
                                <label className="control-label">
                                    Are you satisfied with the performance of
                                    the developers on this project, please give
                                    details? *
                                </label>
                                <TextArea
                                    placeholder="Are you satisfied with the performance of the developers on this project, please give details?"
                                    className="form-control"
                                    onChange={this.onInputChange.bind(
                                        this,
                                        'team_appraisal',
                                    )}
                                    required>
                                    {this.state.report.team_appraisal}
                                </TextArea>
                            </div>
                        </div>
                    ) : null}

                    {this.isClientMidSprintReport() ? (
                        <div>
                            {errors.create &&
                            errors.create
                                .progress_satisfaction ? (
                                <FieldError
                                    message={
                                        errors.create
                                            .progress_satisfaction
                                    }
                                />
                            ) : null}
                            {errors.update &&
                            errors.update
                                .progress_satisfaction ? (
                                <FieldError
                                    message={
                                        errors.update
                                            .progress_satisfaction
                                    }
                                />
                            ) : null}
                            <div className="form-group">
                                <label className="control-label">
                                    Are you satisfied with how the project is
                                    currently going? *
                                </label>
                                <div>
                                    <ChoiceGroup choices={[['yes', 'Yes'], ['partly', 'Partly'], ['no', 'No']]}
                                                 selected={this.state.report.progress_satisfaction}
                                                 onChange={value => this.onChangeValue('progress_satisfaction', value)}/>
                                </div>
                            </div>

                            {errors.create &&
                            errors.create.rate_workflow ? (
                                <FieldError
                                    message={
                                        errors.create
                                            .rate_workflow
                                    }
                                />
                            ) : null}
                            {errors.update &&
                            errors.update.rate_workflow ? (
                                <FieldError
                                    message={
                                        errors.update
                                            .rate_workflow
                                    }
                                />
                            ) : null}
                            <div className="form-group">
                                <label className="control-label">
                                    How would you rate the current workflow on a
                                    scale from 1 to 5? *
                                </label>
                                <div>
                                    <ChoiceGroup choices={this.getRatingsMap(6)} selected={this.state.report.rate_workflow}
                                                 onChange={value => this.onChangeValue('rate_workflow', value)}/>
                                </div>
                            </div>
                        </div>
                    ) : null}

                    {this.isClientReport() || this.isClientMidSprintReport()?(
                        <div>
                            {errors.create &&
                            errors.create
                                .pm_communication ? (
                                <FieldError
                                    message={
                                        errors.create
                                            .pm_communication
                                    }
                                />
                            ) : null}
                            {errors.update &&
                            errors.update
                                .pm_communication ? (
                                <FieldError
                                    message={
                                        errors.update
                                            .pm_communication
                                    }
                                />
                            ) : null}
                            <div className="form-group">
                                <label className="control-label">
                                    Is the communication between you and the
                                    project manager/developer(s) going well? *
                                </label>
                                <div>
                                    <ChoiceGroup choices={[[true, 'Yes'], [false, 'No']]}
                                                 selected={typeof this.state.report.pm_communication === 'boolean'?this.state.report.pm_communication:null}
                                                 onChange={value => this.onChangeValue('pm_communication', value)}/>
                                </div>
                            </div>
                        </div>
                    ):null}

                    <div>
                        {errors.create &&
                        errors.create.remarks ? (
                            <FieldError
                                message={
                                    errors.create.remarks
                                }
                            />
                        ) : null}
                        {errors.update &&
                        errors.update.remarks ? (
                            <FieldError
                                message={
                                    errors.update.remarks
                                }
                            />
                        ) : null}
                        <div className="form-group">
                            <label className="control-label">
                                Any other remarks or questions
                            </label>
                            <TextArea
                                placeholder="Any other remarks or questions"
                                className="form-control"
                                onChange={this.onInputChange.bind(
                                    this,
                                    'remarks',
                                )}
                                value={this.state.report.remarks}>
                                {this.state.report.remarks}
                            </TextArea>
                        </div>
                    </div>

                    <div>
                        <Button
                            type="submit"
                            disabled={isSaving}>
                            {progress_report.id
                                ? 'Update Report'
                                : 'Save Report'}
                        </Button>
                    </div>
                </form>
            </div>
        );
    }
}
