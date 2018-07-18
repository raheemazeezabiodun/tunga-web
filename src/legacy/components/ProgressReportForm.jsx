import React from 'react';
import moment from 'moment';
import momentLocalizer from 'react-widgets/lib/localizers/moment';
import Dropzone from 'react-dropzone';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import _ from 'lodash';

import FormStatus from './status/FormStatus';
import FieldError from './status/FieldError';
import FormComponent from './FormComponent';
import confirm from '../utils/confirm';

import {
    LEGACY_PROGRESS_REPORT_STATUS_CHOICES,
    LEGACY_PROGRESS_REPORT_STATUS_BEHIND_AND_STUCK,
    LEGACY_PROGRESS_EVENT_TYPE_CLIENT,
    LEGACY_PROGRESS_EVENT_TYPE_PM,
    LEGACY_PROGRESS_EVENT_TYPE_CLIENT_MID_SPRINT,
} from '../constants/Api';
import {getUser} from '../utils/auth';

momentLocalizer(moment);

let defaultState = {
    status: null,
    accomplished: '',
    todo: '',
    obstacles: '',
    obstacles_prevention: '',
    remarks: '',
    last_deadline_met: null,
    deadline_report: '',
    next_deadline: null,
    team_appraisal: '',
    attachments: [],
    started_at: null,
    next_deadline_meet: null,
    today_to_dos: '',
    deadline_miss_communicated: null,
    deliverable_satisfaction: null,
    pm_communication: null,
    stuck_details: '',
    next_deadline_fail_reason: '',
};

export default class ProgressReportForm extends FormComponent {
    constructor(props) {
        super(props);
        this.state = defaultState;
    }

    componentDidMount() {
        const progress_report = this.props.progress_report || {};
        if (progress_report.id) {
            this.setState({...progress_report});
        }

        if (this.isDevReport()) {
            confirm(
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

    componentDidUpdate(prevProps, prevState) {
        if (
            this.props.ProgressReport.detail.isSaved &&
            !prevProps.ProgressReport.detail.isSaved
        ) {
            if (!this.props.progress_report) {
                if (this.refs.progress_report_form) {
                    this.refs.progress_report_form.reset();
                }
                this.setState(defaultState);
            }
        }
    }

    isDevReport() {
        const {milestone} = this.props;
        return (
            milestone &&
            [LEGACY_PROGRESS_EVENT_TYPE_CLIENT, LEGACY_PROGRESS_EVENT_TYPE_PM].indexOf(
                milestone.type,
            ) == -1
        );
    }

    isPMReport() {
        const {milestone} = this.props;
        return milestone && milestone.type == LEGACY_PROGRESS_EVENT_TYPE_PM;
    }

    isClientReport() {
        const {milestone} = this.props;
        return milestone && milestone.type == LEGACY_PROGRESS_EVENT_TYPE_CLIENT;
    }

    isClientMidSprintReport() {
        const {milestone} = this.props;
        return (
            milestone && milestone.type == LEGACY_PROGRESS_EVENT_TYPE_CLIENT_MID_SPRINT
        );
    }

    onInputChange(key, e) {
        var new_state = {};
        new_state[key] = e.target.value;
        this.setState(new_state);
    }

    onProgressStatusChange(status) {
        this.setState({status});
    }

    onLastDeadlineStatusChange(last_deadline_met) {
        this.setState({last_deadline_met});
    }

    onNextDeadlineChange(date) {
        this.setState({
            next_deadline: moment(date)
                .utc()
                .format(),
        });
    }

    onDrop(attachments) {
        var current = this.state.attachments;
        console.log('attachments: ', attachments);
        this.setState({attachments: current.concat(attachments)});
    }

    onAddAttachment() {
        this.refs.dropzone.open();
    }

    onClearAttachments(attachments) {
        this.setState({attachments: []});
    }

    onTaskStartChange(date) {
        this.setState({
            started_at: moment(date)
                .utc()
                .format(),
        });
    }

    onNextDeadlineMeetChange(next_deadline_meet) {
        this.setState({next_deadline_meet});
    }

    onDeliverableSatisfactionChange(deliverable_satisfaction) {
        this.setState({deliverable_satisfaction});
    }

    onPmCommunicationChange(pm_communication) {
        this.setState({pm_communication});
    }

    onStateValueChange(key, value) {
        var new_state = {};
        new_state[key] = value;
        this.setState(new_state);
    }

    getRatingsMap(to) {
        return _.range(1, to).map(x => {
            return {id: x, name: x};
        });
    }

    handleSubmit = e => {
        e.preventDefault();
        var status = this.state.status;
        var percentage = this.refs.percentage
            ? this.refs.percentage.value.trim()
            : null;
        var accomplished = this.state.accomplished;
        var todo = this.state.todo;
        var obstacles = this.state.obstacles;
        var obstacles_prevention = this.state.obstacles_prevention;
        var remarks = this.state.remarks;
        const attachments = this.state.attachments;
        var last_deadline_met = this.state.last_deadline_met;
        var deadline_report = this.state.deadline_report;
        var next_deadline = this.state.next_deadline;
        var team_appraisal = this.state.team_appraisal;
        var started_at = this.state.started_at;
        var next_deadline_meet = this.state.next_deadline_meet;
        var today_to_dos = this.state.today_to_dos;
        var deadline_miss_communicated = this.state.deadline_miss_communicated;
        var deliverable_satisfaction = this.state.deliverable_satisfaction;
        var rate_deliverables = this.state.rate_deliverables;
        var stuck_reason = this.state.stuck_reason;
        var pm_communication = this.state.pm_communication;
        var stuck_details = this.state.stuck_details;
        var next_deadline_fail_reason = this.state.next_deadline_fail_reason;
        var progress_satisfaction = this.state.next_deadline_fail_reason;
        var rate_workflow = this.state.next_deadline_fail_reason;

        const {ProgressReportActions} = this.props;
        const progress_report = this.props.progress_report || {};
        const milestone = this.props.milestone || {};

        const progress_report_info = {
            event: milestone.id,
            status,
            percentage,
            accomplished,
            todo,
            obstacles,
            obstacles_prevention,
            remarks,
            last_deadline_met,
            deadline_report,
            next_deadline,
            team_appraisal,
            started_at,
            next_deadline_meet,
            today_to_dos,
            deadline_miss_communicated,
            deliverable_satisfaction,
            pm_communication,
            stuck_details,
            next_deadline_fail_reason,
            stuck_reason,
            rate_deliverables,
            progress_satisfaction,
            rate_workflow,
        };
        if (progress_report.id) {
            ProgressReportActions.updateProgressReport(
                progress_report.id,
                progress_report_info,
                attachments,
            );
        } else {
            ProgressReportActions.createProgressReport(
                progress_report_info,
                attachments,
            );
        }
        return;
    };

    render() {
        const {ProgressReport} = this.props;
        const progress_report = this.props.progress_report || {};

        if (ProgressReport.detail.isSaved) {
            return (
                <div className="thank-you">
                    Thank you for{' '}
                    {this.isClientReport()
                        ? 'responding to the survey!'
                        : 'filling in your progress report!'}
                    <br />
                    <i className="fa fa-check-circle status-icon" />
                </div>
            );
        }

        return (
            <div>
                <form
                    onSubmit={this.handleSubmit}
                    name="progress_report"
                    role="form"
                    ref="progress_report_form">
                    <h4>
                        {this.isClientReport() || this.isClientMidSprintReport()
                            ? 'Weekly Survey'
                            : 'Progress Report'}
                    </h4>
                    <FormStatus
                        loading={ProgressReport.detail.isSaving}
                        success={ProgressReport.detail.isSaved}
                        message={`${
                            this.isClientReport() ||
                            this.isClientMidSprintReport()
                                ? 'Weekly Survey'
                                : 'Progress Report'
                        } saved successfully`}
                        error={
                            ProgressReport.detail.error.create ||
                            ProgressReport.detail.error.update
                        }
                    />

                    {this.isDevReport() || this.isPMReport() ? (
                        <div>
                            {ProgressReport.detail.error.create &&
                            ProgressReport.detail.error.create.status ? (
                                <FieldError
                                    message={
                                        ProgressReport.detail.error.create
                                            .status
                                    }
                                />
                            ) : null}
                            {ProgressReport.detail.error.update &&
                            ProgressReport.detail.error.update.status ? (
                                <FieldError
                                    message={
                                        ProgressReport.detail.error.update
                                            .status
                                    }
                                />
                            ) : null}
                            <div className="form-group">
                                <label className="control-label">
                                    Task status *
                                </label>
                                <div>
                                    <div
                                        className="btn-group btn-choices select"
                                        role="group"
                                        aria-label="task ststus">
                                        {LEGACY_PROGRESS_REPORT_STATUS_CHOICES.map(
                                            status => {
                                                return (
                                                    <button
                                                        key={status.id}
                                                        type="button"
                                                        className={
                                                            'btn ' +
                                                            (this.state
                                                                .status ==
                                                            status.id
                                                                ? ' active'
                                                                : '')
                                                        }
                                                        onClick={this.onProgressStatusChange.bind(
                                                            this,
                                                            status.id,
                                                        )}>
                                                        {status.name}
                                                    </button>
                                                );
                                            },
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : null}

                    {(this.isDevReport() || this.isPMReport()) &&
                    this.state.status ==
                        LEGACY_PROGRESS_REPORT_STATUS_BEHIND_AND_STUCK ? (
                        <div>
                            {/* check status if stuck and is developer for this */}

                            {ProgressReport.detail.error.create &&
                            ProgressReport.detail.error.create.stuck_reason ? (
                                <FieldError
                                    message={
                                        ProgressReport.detail.error.create
                                            .stuck_reason
                                    }
                                />
                            ) : null}
                            {ProgressReport.detail.error.update &&
                            ProgressReport.detail.error.update.stuck_reason ? (
                                <FieldError
                                    message={
                                        ProgressReport.detail.error.update
                                            .stuck_reason
                                    }
                                />
                            ) : null}
                            <div className="form-group">
                                <label className="control-label">
                                    Select reason why you are stuck
                                </label>
                                <select
                                    className="form-control"
                                    value={this.state.stuck_reason}
                                    onChange={this.onInputChange.bind(
                                        this,
                                        'stuck_reason',
                                    )}>
                                    <option value="1">
                                        Resolving an Error
                                    </option>
                                    <option value="2">
                                        Poor Documenatation
                                    </option>
                                    <option value="3">Hardware problem</option>
                                    <option value="4">
                                        Unclear specifications
                                    </option>
                                    <option value="5">
                                        Personal Circumstances
                                    </option>
                                    <option value="6">Other</option>
                                </select>
                            </div>

                            {ProgressReport.detail.error.create &&
                            ProgressReport.detail.error.create.stuck_details ? (
                                <FieldError
                                    message={
                                        ProgressReport.detail.error.create
                                            .stuck_details
                                    }
                                />
                            ) : null}
                            {ProgressReport.detail.error.update &&
                            ProgressReport.detail.error.update.stuck_details ? (
                                <FieldError
                                    message={
                                        ProgressReport.detail.error.update
                                            .stuck_details
                                    }
                                />
                            ) : null}
                            <div className="form-group">
                                <label className="control-label">
                                    Explain Further why you are stuck/what
                                    should be done.
                                </label>
                                <textarea
                                    placeholder="More details"
                                    className="form-control"
                                    ref="stuck_details"
                                    onChange={this.onInputChange.bind(
                                        this,
                                        'stuck_details',
                                    )}
                                    value={this.state.stuck_details}>
                                    {this.state.stuck_details}
                                </textarea>
                            </div>
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
                                        ref="started_at"
                                        onChange={this.onTaskStartChange.bind(
                                            this,
                                        )}
                                        value={
                                            this.state.started_at
                                                ? new Date(
                                                      moment
                                                          .utc(
                                                              this.state
                                                                  .started_at,
                                                          )
                                                          .format(),
                                                  )
                                                : null
                                        }
                                        time={false}
                                    />
                                </div>
                            </div>
                        </div>
                    ) : null}

                    {this.isPMReport() ? (
                        <div>
                            {ProgressReport.detail.error.create &&
                            ProgressReport.detail.error.create
                                .last_deadline_met ? (
                                <FieldError
                                    message={
                                        ProgressReport.detail.error.create
                                            .last_deadline_met
                                    }
                                />
                            ) : null}
                            {ProgressReport.detail.error.update &&
                            ProgressReport.detail.error.update
                                .last_deadline_met ? (
                                <FieldError
                                    message={
                                        ProgressReport.detail.error.update
                                            .last_deadline_met
                                    }
                                />
                            ) : null}
                            <div className="form-group">
                                <label className="control-label">
                                    Was the last deadline met? *
                                </label>
                                <div>
                                    <div
                                        className="btn-group btn-choices select"
                                        role="group"
                                        aria-label="task ststus">
                                        {[
                                            {id: true, name: 'Yes'},
                                            {id: false, name: 'No'},
                                        ].map(status => {
                                            return (
                                                <button
                                                    key={status.id}
                                                    type="button"
                                                    className={
                                                        'btn ' +
                                                        (typeof this.state
                                                            .last_deadline_met ==
                                                            'boolean' &&
                                                        this.state
                                                            .last_deadline_met ==
                                                            status.id
                                                            ? ' active'
                                                            : '')
                                                    }
                                                    onClick={this.onLastDeadlineStatusChange.bind(
                                                        this,
                                                        status.id,
                                                    )}>
                                                    {status.name}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {typeof this.state.last_deadline_met == 'boolean' &&
                            !this.state.last_deadline_met ? (
                                <div>
                                    {ProgressReport.detail.error.create &&
                                    ProgressReport.detail.error.create
                                        .deadline_report ? (
                                        <FieldError
                                            message={
                                                ProgressReport.detail.error
                                                    .create.deadline_report
                                            }
                                        />
                                    ) : null}
                                    {ProgressReport.detail.error.update &&
                                    ProgressReport.detail.error.update
                                        .deadline_report ? (
                                        <FieldError
                                            message={
                                                ProgressReport.detail.error
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
                                        <textarea
                                            placeholder="Why wasn't the last deadline met? Please provide a detailed explanation."
                                            className="form-control"
                                            ref="deadline_report"
                                            onChange={this.onInputChange.bind(
                                                this,
                                                'deadline_report',
                                            )}
                                            value={this.state.deadline_report}
                                            required>
                                            {this.state.deadline_report}
                                        </textarea>
                                    </div>
                                </div>
                            ) : null}

                            {typeof this.state.last_deadline_met == 'boolean' &&
                            !this.state.last_deadline_met ? (
                                <div>
                                    {ProgressReport.detail.error.create &&
                                    ProgressReport.detail.error.create
                                        .deadline_miss_communicated ? (
                                        <FieldError
                                            message={
                                                ProgressReport.detail.error
                                                    .create
                                                    .deadline_miss_communicated
                                            }
                                        />
                                    ) : null}
                                    {ProgressReport.detail.error.update &&
                                    ProgressReport.detail.error.update
                                        .deadline_miss_communicated ? (
                                        <FieldError
                                            message={
                                                ProgressReport.detail.error
                                                    .update
                                                    .deadline_miss_communicated
                                            }
                                        />
                                    ) : null}
                                    <div className="form-group">
                                        <label className="control-label">
                                            Did you inform the client promptly
                                            about not making the deadline? *
                                        </label>
                                        <div>
                                            <div
                                                className="btn-group btn-choices select"
                                                role="group"
                                                aria-label="PM deadline info">
                                                {[
                                                    {id: true, name: 'Yes'},
                                                    {id: false, name: 'No'},
                                                ].map(status => {
                                                    return (
                                                        <button
                                                            key={status.id}
                                                            type="button"
                                                            className={
                                                                'btn ' +
                                                                (typeof this
                                                                    .state
                                                                    .deadline_miss_communicated ==
                                                                    'boolean' &&
                                                                this.state
                                                                    .deadline_miss_communicated ==
                                                                    status.id
                                                                    ? ' active'
                                                                    : '')
                                                            }
                                                            onClick={this.onStateValueChange.bind(
                                                                this,
                                                                'deadline_miss_communicated',
                                                                status.id,
                                                            )}>
                                                            {status.name}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    ) : null}

                    {this.isDevReport() || this.isPMReport() ? (
                        <div>
                            {ProgressReport.detail.error.create &&
                            ProgressReport.detail.error.create.percentage ? (
                                <FieldError
                                    message={
                                        ProgressReport.detail.error.create
                                            .percentage
                                    }
                                />
                            ) : null}
                            {ProgressReport.detail.error.update &&
                            ProgressReport.detail.error.update.percentage ? (
                                <FieldError
                                    message={
                                        ProgressReport.detail.error.update
                                            .percentage
                                    }
                                />
                            ) : null}
                            <div className="form-group">
                                <label className="control-label">
                                    Percentage completed *
                                </label>
                                <div>
                                    <input
                                        type="number"
                                        className="form-control"
                                        ref="percentage"
                                        required
                                        placeholder="Percentage completed"
                                        defaultValue={
                                            progress_report.percentage
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    ) : null}

                    {this.isDevReport() || this.isPMReport() ? (
                        <div>
                            {ProgressReport.detail.error.create &&
                            ProgressReport.detail.error.create.accomplished ? (
                                <FieldError
                                    message={
                                        ProgressReport.detail.error.create
                                            .accomplished
                                    }
                                />
                            ) : null}
                            {ProgressReport.detail.error.update &&
                            ProgressReport.detail.error.update.accomplished ? (
                                <FieldError
                                    message={
                                        ProgressReport.detail.error.update
                                            .accomplished
                                    }
                                />
                            ) : null}
                            <div className="form-group">
                                <label className="control-label">
                                    What has been accomplished since the last
                                    update? *
                                </label>
                                <textarea
                                    placeholder="What has been accomplished since the last update?"
                                    className="form-control"
                                    ref="accomplished"
                                    onChange={this.onInputChange.bind(
                                        this,
                                        'accomplished',
                                    )}
                                    value={this.state.accomplished}
                                    required>
                                    {this.state.accomplished}
                                </textarea>
                            </div>

                            {ProgressReport.detail.error.create &&
                            ProgressReport.detail.error.create.uploads ? (
                                <FieldError
                                    message={
                                        ProgressReport.detail.error.create
                                            .uploads
                                    }
                                />
                            ) : null}
                            {ProgressReport.detail.error.update &&
                            ProgressReport.detail.error.update.uploads ? (
                                <FieldError
                                    message={
                                        ProgressReport.detail.error.update
                                            .uploads
                                    }
                                />
                            ) : null}
                            <div className="form-group">
                                <label className="control-label">Files</label>
                                <div>
                                    <Dropzone
                                        ref="dropzone"
                                        onDrop={this.onDrop.bind(this)}
                                        style={{display: 'none'}}>
                                        <div>
                                            Try dropping some files here, or
                                            click to select files to upload.
                                        </div>
                                    </Dropzone>
                                    {this.state.attachments ? (
                                        <div>
                                            {this.state.attachments.map(
                                                file => {
                                                    return (
                                                        <div>
                                                            <i className="fa fa-file-text-o" />{' '}
                                                            {file.name}
                                                        </div>
                                                    );
                                                },
                                            )}
                                        </div>
                                    ) : null}
                                    <button
                                        type="button"
                                        className="btn "
                                        style={{marginRight: '5px'}}
                                        onClick={this.onAddAttachment.bind(
                                            this,
                                        )}>
                                        <i className="fa fa-upload" /> Upload
                                        files
                                    </button>
                                    {this.state.attachments && this.state.attachments.length?(
                                        <button
                                            type="button"
                                            className="btn btn-alt"
                                            onClick={this.onClearAttachments.bind(
                                                this,
                                            )}>
                                            <i className="fa fa-trash-o" /> Clear files
                                        </button>
                                    ):null}
                                </div>
                            </div>

                            {this.isDevReport() ? (
                                <div>
                                    {ProgressReport.detail.error.create &&
                                    ProgressReport.detail.error.create
                                        .rate_deliverables ? (
                                        <FieldError
                                            message={
                                                ProgressReport.detail.error
                                                    .create.rate_deliverables
                                            }
                                        />
                                    ) : null}
                                    {ProgressReport.detail.error.update &&
                                    ProgressReport.detail.error.update
                                        .rate_deliverables ? (
                                        <FieldError
                                            message={
                                                ProgressReport.detail.error
                                                    .update.rate_deliverables
                                            }
                                        />
                                    ) : null}
                                    <div className="form-group">
                                        <label className="control-label">
                                            How do you rate your latest
                                            deliverable?*
                                        </label>
                                        <div>
                                            <div
                                                className="btn-group btn-choices select"
                                                role="group">
                                                {this.getRatingsMap(6).map(
                                                    status => {
                                                        return (
                                                            <button
                                                                key={status.id}
                                                                type="button"
                                                                className={
                                                                    'btn ' +
                                                                    (this.state
                                                                        .rate_deliverables ==
                                                                    status.id
                                                                        ? ' active'
                                                                        : '')
                                                                }
                                                                onClick={this.onStateValueChange.bind(
                                                                    this,
                                                                    'rate_deliverables',
                                                                    status.id,
                                                                )}>
                                                                {status.name}
                                                            </button>
                                                        );
                                                    },
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : null}

                            {ProgressReport.detail.error.create &&
                            ProgressReport.detail.error.create.todo ? (
                                <FieldError
                                    message={
                                        ProgressReport.detail.error.create.todo
                                    }
                                />
                            ) : null}
                            {ProgressReport.detail.error.update &&
                            ProgressReport.detail.error.update.todo ? (
                                <FieldError
                                    message={
                                        ProgressReport.detail.error.update.todo
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
                                <textarea
                                    placeholder={
                                        this.isDevReport()
                                            ? 'What do you intend to achieve/complete today?'
                                            : 'What are the next steps?'
                                    }
                                    className="form-control"
                                    ref="todo"
                                    onChange={this.onInputChange.bind(
                                        this,
                                        'todo',
                                    )}
                                    value={this.state.todo}
                                    required>
                                    {this.state.todo}
                                </textarea>
                            </div>

                            <div className="form-group">
                                <label className="control-label">
                                    When is the next deadline? *
                                </label>
                                <DateTimePicker
                                    ref="due_at"
                                    onChange={this.onNextDeadlineChange.bind(
                                        this,
                                    )}
                                    value={
                                        this.state.next_deadline
                                            ? new Date(
                                                  moment
                                                      .utc(
                                                          this.state
                                                              .next_deadline,
                                                      )
                                                      .format(),
                                              )
                                            : null
                                    }
                                    time={false}
                                />
                            </div>

                            <div>
                                {ProgressReport.detail.error.create &&
                                ProgressReport.detail.error.create
                                    .next_deadline_meet ? (
                                    <FieldError
                                        message={
                                            ProgressReport.detail.error.create
                                                .next_deadline_meet
                                        }
                                    />
                                ) : null}
                                {ProgressReport.detail.error.update &&
                                ProgressReport.detail.error.update
                                    .next_deadline_meet ? (
                                    <FieldError
                                        message={
                                            ProgressReport.detail.error.update
                                                .next_deadline_meet
                                        }
                                    />
                                ) : null}
                                <div className="form-group">
                                    <label className="control-label">
                                        Do you anticipate to meet this deadline?
                                        *
                                    </label>
                                    <div>
                                        <div
                                            className="btn-group btn-choices select"
                                            role="group"
                                            aria-label="task deadline meet">
                                            {[
                                                {id: true, name: 'Yes'},
                                                {id: false, name: 'No'},
                                            ].map(status => {
                                                return (
                                                    <button
                                                        key={status.id}
                                                        type="button"
                                                        className={
                                                            'btn ' +
                                                            (typeof this.state
                                                                .next_deadline_meet ==
                                                                'boolean' &&
                                                            this.state
                                                                .next_deadline_meet ==
                                                                status.id
                                                                ? ' active'
                                                                : '')
                                                        }
                                                        onClick={this.onNextDeadlineMeetChange.bind(
                                                            this,
                                                            status.id,
                                                        )}>
                                                        {status.name}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>

                                {typeof this.state.next_deadline_meet ==
                                    'boolean' &&
                                !this.state.next_deadline_meet ? (
                                    <div>
                                        {ProgressReport.detail.error.create &&
                                        ProgressReport.detail.error.create
                                            .next_deadline_fail_reason ? (
                                            <FieldError
                                                message={
                                                    ProgressReport.detail.error
                                                        .create
                                                        .next_deadline_fail_reason
                                                }
                                            />
                                        ) : null}
                                        {ProgressReport.detail.error.update &&
                                        ProgressReport.detail.error.update
                                            .next_deadline_fail_reason ? (
                                            <FieldError
                                                message={
                                                    ProgressReport.detail.error
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
                                            <textarea
                                                placeholder="Reasons why you won't be able to make the next deadline"
                                                className="form-control"
                                                ref="next_deadline_fail_reason"
                                                onChange={this.onInputChange.bind(
                                                    this,
                                                    'next_deadline_fail_reason',
                                                )}
                                                value={
                                                    this.state
                                                        .next_deadline_fail_reason
                                                }>
                                                {
                                                    this.state
                                                        .next_deadline_fail_reason
                                                }
                                            </textarea>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        {ProgressReport.detail.error.create &&
                                        ProgressReport.detail.error.create
                                            .obstacles ? (
                                            <FieldError
                                                message={
                                                    ProgressReport.detail.error
                                                        .create.obstacles
                                                }
                                            />
                                        ) : null}
                                        {ProgressReport.detail.error.update &&
                                        ProgressReport.detail.error.update
                                            .obstacles ? (
                                            <FieldError
                                                message={
                                                    ProgressReport.detail.error
                                                        .update.obstacles
                                                }
                                            />
                                        ) : null}

                                        <div className="form-group">
                                            <label className="control-label">
                                                What obstacles are impeding your
                                                progress? *
                                            </label>
                                            <textarea
                                                placeholder="What obstacles are impeding your progress?"
                                                className="form-control"
                                                ref="obstacles"
                                                onChange={this.onInputChange.bind(
                                                    this,
                                                    'obstacles',
                                                )}
                                                value={this.state.obstacles}
                                                required>
                                                {this.state.obstacles}
                                            </textarea>
                                        </div>

                                        {this.state.obstacles &&
                                        [
                                            'none',
                                            'no',
                                            'non',
                                            'n/a',
                                            'na',
                                            'false',
                                        ].indexOf(
                                            this.state.obstacles
                                                .toLocaleLowerCase()
                                                .trim(),
                                        ) == -1 ? (
                                            <div className="form-group">
                                                <label className="control-label">
                                                    What could have been done to
                                                    prevent this from happening?
                                                    *
                                                </label>
                                                <textarea
                                                    placeholder="What could have been done to prevent this from happening?"
                                                    className="form-control"
                                                    ref="obstacles_prevention"
                                                    onChange={this.onInputChange.bind(
                                                        this,
                                                        'obstacles_prevention',
                                                    )}
                                                    value={
                                                        this.state
                                                            .obstacles_prevention
                                                    }
                                                    required>
                                                    {
                                                        this.state
                                                            .obstacles_prevention
                                                    }
                                                </textarea>
                                            </div>
                                        ) : null}
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : null}

                    {this.isPMReport() ? (
                        <div>
                            {ProgressReport.detail.error.create &&
                            ProgressReport.detail.error.create
                                .team_appraisal ? (
                                <FieldError
                                    message={
                                        ProgressReport.detail.error.create
                                            .team_appraisal
                                    }
                                />
                            ) : null}
                            {ProgressReport.detail.error.update &&
                            ProgressReport.detail.error.update
                                .team_appraisal ? (
                                <FieldError
                                    message={
                                        ProgressReport.detail.error.update
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
                                <textarea
                                    placeholder="Are you satisfied with the performance of the developers on this project, please give details?"
                                    className="form-control"
                                    ref="team_appraisal"
                                    onChange={this.onInputChange.bind(
                                        this,
                                        'team_appraisal',
                                    )}
                                    value={this.state.team_appraisal}
                                    required>
                                    {this.state.team_appraisal}
                                </textarea>
                            </div>
                        </div>
                    ) : null}

                    {this.isClientReport() ? (
                        <div>
                            {ProgressReport.detail.error.create &&
                            ProgressReport.detail.error.create
                                .last_deadline_met ? (
                                <FieldError
                                    message={
                                        ProgressReport.detail.error.create
                                            .last_deadline_met
                                    }
                                />
                            ) : null}
                            {ProgressReport.detail.error.update &&
                            ProgressReport.detail.error.update
                                .last_deadline_met ? (
                                <FieldError
                                    message={
                                        ProgressReport.detail.error.update
                                            .last_deadline_met
                                    }
                                />
                            ) : null}
                            <div className="form-group">
                                <label className="control-label">
                                    Was the last deadline met? *
                                </label>
                                <div>
                                    <div
                                        className="btn-group btn-choices select"
                                        role="group"
                                        aria-label="this week deadline met">
                                        {[
                                            {id: true, name: 'Yes'},
                                            {id: false, name: 'No'},
                                        ].map(status => {
                                            return (
                                                <button
                                                    key={status.id}
                                                    type="button"
                                                    className={
                                                        'btn ' +
                                                        (typeof this.state
                                                            .last_deadline_met ==
                                                            'boolean' &&
                                                        this.state
                                                            .last_deadline_met ==
                                                            status.id
                                                            ? ' active'
                                                            : '')
                                                    }
                                                    onClick={this.onStateValueChange.bind(
                                                        this,
                                                        'last_deadline_met',
                                                        status.id,
                                                    )}>
                                                    {status.name}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {typeof this.state.last_deadline_met == 'boolean' &&
                            !this.state.last_deadline_met ? (
                                <div>
                                    {ProgressReport.detail.error.create &&
                                    ProgressReport.detail.error.create
                                        .deadline_miss_communicated ? (
                                        <FieldError
                                            message={
                                                ProgressReport.detail.error
                                                    .create
                                                    .deadline_miss_communicated
                                            }
                                        />
                                    ) : null}
                                    {ProgressReport.detail.error.update &&
                                    ProgressReport.detail.error.update
                                        .deadline_miss_communicated ? (
                                        <FieldError
                                            message={
                                                ProgressReport.detail.error
                                                    .update
                                                    .deadline_miss_communicated
                                            }
                                        />
                                    ) : null}
                                    <div className="form-group">
                                        <label className="control-label">
                                            Did the project manager/developer(s)
                                            inform you promptly about not making
                                            the deadline? *
                                        </label>
                                        <div>
                                            <div
                                                className="btn-group btn-choices select"
                                                role="group"
                                                aria-label="PM deadline info">
                                                {[
                                                    {id: true, name: 'Yes'},
                                                    {id: false, name: 'No'},
                                                ].map(status => {
                                                    return (
                                                        <button
                                                            key={status.id}
                                                            type="button"
                                                            className={
                                                                'btn ' +
                                                                (typeof this
                                                                    .state
                                                                    .deadline_miss_communicated ==
                                                                    'boolean' &&
                                                                this.state
                                                                    .deadline_miss_communicated ==
                                                                    status.id
                                                                    ? ' active'
                                                                    : '')
                                                            }
                                                            onClick={this.onStateValueChange.bind(
                                                                this,
                                                                'deadline_miss_communicated',
                                                                status.id,
                                                            )}>
                                                            {status.name}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : null}

                            {ProgressReport.detail.error.create &&
                            ProgressReport.detail.error.create
                                .deliverable_satisfaction ? (
                                <FieldError
                                    message={
                                        ProgressReport.detail.error.create
                                            .deliverable_satisfaction
                                    }
                                />
                            ) : null}
                            {ProgressReport.detail.error.update &&
                            ProgressReport.detail.error.update
                                .deliverable_satisfaction ? (
                                <FieldError
                                    message={
                                        ProgressReport.detail.error.update
                                            .deliverable_satisfaction
                                    }
                                />
                            ) : null}
                            <div className="form-group">
                                <label className="control-label">
                                    Are you satisfied with the deliverables? *
                                </label>
                                <div>
                                    <div
                                        className="btn-group btn-choices select"
                                        role="group"
                                        aria-label="deliverable satisfaction">
                                        {[
                                            {id: true, name: 'Yes'},
                                            {id: false, name: 'No'},
                                        ].map(status => {
                                            return (
                                                <button
                                                    key={status.id}
                                                    type="button"
                                                    className={
                                                        'btn ' +
                                                        (typeof this.state
                                                            .deliverable_satisfaction ==
                                                            'boolean' &&
                                                        this.state
                                                            .deliverable_satisfaction ==
                                                            status.id
                                                            ? ' active'
                                                            : '')
                                                    }
                                                    onClick={this.onDeliverableSatisfactionChange.bind(
                                                        this,
                                                        status.id,
                                                    )}>
                                                    {status.name}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {ProgressReport.detail.error.create &&
                            ProgressReport.detail.error.create
                                .rate_deliverables ? (
                                <FieldError
                                    message={
                                        ProgressReport.detail.error.create
                                            .rate_deliverables
                                    }
                                />
                            ) : null}
                            {ProgressReport.detail.error.update &&
                            ProgressReport.detail.error.update
                                .rate_deliverables ? (
                                <FieldError
                                    message={
                                        ProgressReport.detail.error.update
                                            .rate_deliverables
                                    }
                                />
                            ) : null}
                            <div className="form-group">
                                <label className="control-label">
                                    How would you rate the deliverables on a
                                    scale from 1 to 5? *
                                </label>
                                <div>
                                    <div
                                        className="btn-group btn-choices select"
                                        role="group">
                                        {this.getRatingsMap(6).map(status => {
                                            return (
                                                <button
                                                    key={status.id}
                                                    type="button"
                                                    className={
                                                        'btn ' +
                                                        (this.state
                                                            .rate_deliverables ==
                                                        status.id
                                                            ? ' active'
                                                            : '')
                                                    }
                                                    onClick={this.onStateValueChange.bind(
                                                        this,
                                                        'rate_deliverables',
                                                        status.id,
                                                    )}>
                                                    {status.name}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {ProgressReport.detail.error.create &&
                            ProgressReport.detail.error.create
                                .pm_communication ? (
                                <FieldError
                                    message={
                                        ProgressReport.detail.error.create
                                            .pm_communication
                                    }
                                />
                            ) : null}
                            {ProgressReport.detail.error.update &&
                            ProgressReport.detail.error.update
                                .pm_communication ? (
                                <FieldError
                                    message={
                                        ProgressReport.detail.error.update
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
                                    <div
                                        className="btn-group btn-choices select"
                                        role="group"
                                        aria-label="PM communication">
                                        {[
                                            {id: true, name: 'Yes'},
                                            {id: false, name: 'No'},
                                        ].map(status => {
                                            return (
                                                <button
                                                    key={status.id}
                                                    type="button"
                                                    className={
                                                        'btn ' +
                                                        (typeof this.state
                                                            .pm_communication ==
                                                            'boolean' &&
                                                        this.state
                                                            .pm_communication ==
                                                            status.id
                                                            ? ' active'
                                                            : '')
                                                    }
                                                    onClick={this.onPmCommunicationChange.bind(
                                                        this,
                                                        status.id,
                                                    )}>
                                                    {status.name}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : null}

                    {this.isClientMidSprintReport() ? (
                        <div>
                            {ProgressReport.detail.error.create &&
                            ProgressReport.detail.error.create
                                .progress_satisfaction ? (
                                <FieldError
                                    message={
                                        ProgressReport.detail.error.create
                                            .progress_satisfaction
                                    }
                                />
                            ) : null}
                            {ProgressReport.detail.error.update &&
                            ProgressReport.detail.error.update
                                .progress_satisfaction ? (
                                <FieldError
                                    message={
                                        ProgressReport.detail.error.update
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
                                    <div
                                        className="btn-group btn-choices select"
                                        role="group"
                                        aria-label="progress satisfaction">
                                        {[
                                            {id: 'yes', name: 'Yes'},
                                            {id: 'partly', name: 'Partly'},
                                            {id: 'no', name: 'No'},
                                        ].map(status => {
                                            return (
                                                <button
                                                    key={status.id}
                                                    type="button"
                                                    className={
                                                        'btn ' +
                                                        (this.state
                                                            .progress_satisfaction ==
                                                        status.id
                                                            ? ' active'
                                                            : '')
                                                    }
                                                    onClick={this.onStateValueChange.bind(
                                                        this,
                                                        'progress_satisfaction',
                                                        status.id,
                                                    )}>
                                                    {status.name}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {ProgressReport.detail.error.create &&
                            ProgressReport.detail.error.create.rate_workflow ? (
                                <FieldError
                                    message={
                                        ProgressReport.detail.error.create
                                            .rate_workflow
                                    }
                                />
                            ) : null}
                            {ProgressReport.detail.error.update &&
                            ProgressReport.detail.error.update.rate_workflow ? (
                                <FieldError
                                    message={
                                        ProgressReport.detail.error.update
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
                                    <div
                                        className="btn-group btn-choices select"
                                        role="group">
                                        {this.getRatingsMap(6).map(status => {
                                            return (
                                                <button
                                                    key={status.id}
                                                    type="button"
                                                    className={
                                                        'btn ' +
                                                        (this.state
                                                            .rate_workflow ==
                                                        status.id
                                                            ? ' active'
                                                            : '')
                                                    }
                                                    onClick={this.onStateValueChange.bind(
                                                        this,
                                                        'rate_workflow',
                                                        status.id,
                                                    )}>
                                                    {status.name}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {ProgressReport.detail.error.create &&
                            ProgressReport.detail.error.create
                                .pm_communication ? (
                                <FieldError
                                    message={
                                        ProgressReport.detail.error.create
                                            .pm_communication
                                    }
                                />
                            ) : null}
                            {ProgressReport.detail.error.update &&
                            ProgressReport.detail.error.update
                                .pm_communication ? (
                                <FieldError
                                    message={
                                        ProgressReport.detail.error.update
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
                                    <div
                                        className="btn-group btn-choices select"
                                        role="group"
                                        aria-label="PM communication">
                                        {[
                                            {id: true, name: 'Yes'},
                                            {id: false, name: 'No'},
                                        ].map(status => {
                                            return (
                                                <button
                                                    key={status.id}
                                                    type="button"
                                                    className={
                                                        'btn ' +
                                                        (typeof this.state
                                                            .pm_communication ==
                                                            'boolean' &&
                                                        this.state
                                                            .pm_communication ==
                                                            status.id
                                                            ? ' active'
                                                            : '')
                                                    }
                                                    onClick={this.onPmCommunicationChange.bind(
                                                        this,
                                                        status.id,
                                                    )}>
                                                    {status.name}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : null}

                    <div>
                        {ProgressReport.detail.error.create &&
                        ProgressReport.detail.error.create.remarks ? (
                            <FieldError
                                message={
                                    ProgressReport.detail.error.create.remarks
                                }
                            />
                        ) : null}
                        {ProgressReport.detail.error.update &&
                        ProgressReport.detail.error.update.remarks ? (
                            <FieldError
                                message={
                                    ProgressReport.detail.error.update.remarks
                                }
                            />
                        ) : null}
                        <div className="form-group">
                            <label className="control-label">
                                Any other remarks or questions
                            </label>
                            <textarea
                                placeholder="Any other remarks or questions"
                                className="form-control"
                                ref="remarks"
                                onChange={this.onInputChange.bind(
                                    this,
                                    'remarks',
                                )}
                                value={this.state.remarks}>
                                {this.state.remarks}
                            </textarea>
                        </div>
                    </div>

                    <div className="text-center">
                        <button
                            type="submit"
                            className="btn  "
                            disabled={ProgressReport.detail.isSaving}>
                            {progress_report.id
                                ? 'Update Report'
                                : 'Save Report'}
                        </button>
                    </div>
                    <div className="clearfix" />
                </form>
            </div>
        );
    }
}
