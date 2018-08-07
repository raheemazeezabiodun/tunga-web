import React from 'react';
import moment from 'moment';
import momentLocalizer from 'react-widgets/lib/localizers/moment';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';

import Progress from './status/Progress';
import FormStatus from './status/FormStatus';
import FieldError from './status/FieldError';
import Success from './status/Success';

import {getDevFee} from '../utils/tasks';
import {parseNumber} from '../utils/helpers';

momentLocalizer(moment);

export default class ApplicationForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            deliver_at: null,
            pitch: '',
            agree_schedule: false,
            agree_deadline: false,
            remarks: '',
        };
    }

    componentDidMount() {
        const task = this.props.task || {};
        var deliver_at = task.deadline
            ? new Date(moment.utc(task.deadline).format())
            : null;
        this.setState({deliver_at: deliver_at});
    }

    componentDidUpdate(prevProps, prevState) {
        if (
            this.props.Task.detail.applications.isSaved &&
            !prevProps.Task.detail.applications.isSaved
        ) {
            if (this.refs.application_form) {
                this.refs.application_form.reset();
            }
            const task = this.props.task || {};
            var deliver_at = task.deadline
                ? new Date(moment.utc(task.deadline).format())
                : null;
            this.setState({deliver_at: deliver_at, pitch: '', remarks: ''});
        }
    }

    onAgreeDeadlineChange(e) {
        this.setState({agree_deadline: !this.state.agree_deadline});
    }

    onAgreeScheduleChange(e) {
        this.setState({agree_schedule: !this.state.agree_schedule});
    }

    onDeliveryDateChange(date) {
        this.setState({
            deliver_at: moment(date)
                .utc()
                .format(),
        });
    }

    onInputChange(key, e) {
        var new_state = {};
        new_state[key] = e.target.value;
        this.setState(new_state);
    }

    onPitchChange(e) {
        this.setState({pitch: e.target.getContent()});
    }

    onRemarksChange(e) {
        this.setState({remarks: e.target.getContent()});
    }

    onStateValueChange(key, value) {
        var new_state = {};
        new_state[key] = value;
        this.setState(new_state);
    }

    handleSubmit = e => {
        e.preventDefault();
        var pitch = this.state.pitch;
        var hours_needed = this.refs.hours_needed.value.trim() || null;
        var days_available = this.refs.days_available.value.trim() || null;
        var deliver_at = this.state.deliver_at;
        var remarks = this.state.remarks;

        const task = this.props.task || {};
        var errors = null;
        if (
            !this.state.agree_schedule &&
            task.update_interval &&
            task.update_interval_units
        ) {
            errors = {
                ...errors,
                agree_schedule: `You must agree to the update schedule to apply for this ${work_type}`,
            };
        }

        if (!this.state.agree_deadline && task.deadline) {
            errors = {
                ...errors,
                agree_deadline: `You must agree to the milestone deadlines to apply for this ${work_type}`,
            };
        }

        const {TaskActions} = this.props;

        TaskActions.createApplication(
            {
                task: task.id,
                pitch,
                hours_needed,
                days_available,
                deliver_at,
                remarks,
            },
            errors,
        );
        return;
    };

    render() {
        const {Task} = this.props;
        const task = this.props.task || {};
        const work_type = task.is_task ? 'task' : 'project';
        return (
            <div className="form-wrapper">
                {Task.detail.applications.isSaved ? (
                    <Success message="Application sent successfully" />
                ) : (
                    <form
                        onSubmit={this.handleSubmit}
                        name="application_form"
                        role="form"
                        ref="application_form">
                        <FormStatus
                            loading={Task.detail.applications.isSaving}
                            success={Task.detail.applications.isSaved}
                            message={'Application sent successfully'}
                            error={Task.detail.applications.error.create}
                        />

                        {Task.detail.applications.error.create &&
                        Task.detail.applications.error.create.pitch ? (
                            <FieldError
                                message={
                                    Task.detail.applications.error.create.pitch
                                }
                            />
                        ) : null}
                        <div className="form-group">
                            <label className="control-label">
                                What makes you qualified for this {work_type} *
                            </label>
                            <textarea
                                placeholder={`What makes you qualified for this ${work_type}`}
                                className="form-control"
                                ref="pitch"
                                onChange={this.onInputChange.bind(
                                    this,
                                    'pitch',
                                )}
                                value={this.state.pitch}
                            />
                        </div>

                        {Task.detail.applications.error.create &&
                        Task.detail.applications.error.create.hours_needed ? (
                            <FieldError
                                message={
                                    Task.detail.applications.error.create
                                        .hours_needed
                                }
                            />
                        ) : null}
                        {Task.detail.applications.error.update &&
                        Task.detail.applications.error.update.hours_needed ? (
                            <FieldError
                                message={
                                    Task.detail.applications.error.update
                                        .hours_needed
                                }
                            />
                        ) : null}
                        <div className="form-group">
                            <label className="control-label">
                                Development hours needed to complete {work_type}{' '}
                                *
                            </label>
                            <div>
                                <input
                                    type="text"
                                    className="form-control"
                                    ref="hours_needed"
                                    placeholder={`Development hours needed to complete ${work_type}`}
                                    onChange={this.onInputChange.bind(
                                        this,
                                        'hours_needed',
                                    )}
                                    required
                                />
                            </div>
                            {task.is_task ? (
                                <div>
                                    <div className="alert alert-info">
                                        You will be paid €12.5/hour
                                    </div>
                                    {task.fee ? (
                                        <div>
                                            Client's proposal: €{parseNumber(
                                                task.amount.developer,
                                            )}
                                        </div>
                                    ) : null}
                                    {this.state.hours_needed ? (
                                        <div className="bold">
                                            Your Estimate: €{getDevFee(
                                                this.state.hours_needed,
                                                task.dev_rate,
                                                task.tunga_ratio_dev,
                                            )}
                                        </div>
                                    ) : null}
                                </div>
                            ) : (
                                <div />
                            )}
                        </div>

                        {Task.detail.applications.error.create &&
                        Task.detail.applications.error.create.days_available ? (
                            <FieldError
                                message={
                                    Task.detail.applications.error.create
                                        .days_available
                                }
                            />
                        ) : null}
                        {Task.detail.applications.error.update &&
                        Task.detail.applications.error.update.days_available ? (
                            <FieldError
                                message={
                                    Task.detail.applications.error.update
                                        .days_available
                                }
                            />
                        ) : null}
                        <div className="form-group">
                            <label className="control-label">
                                Days available to work on {work_type}
                            </label>
                            <div>
                                <input
                                    type="text"
                                    className="form-control"
                                    ref="days_available"
                                    placeholder={`Days available to work on ${work_type}`}
                                />
                            </div>
                        </div>

                        {Task.detail.applications.error.create &&
                        Task.detail.applications.error.create.deliver_at ? (
                            <FieldError
                                message={
                                    Task.detail.applications.error.create
                                        .deliver_at
                                }
                            />
                        ) : null}
                        <div className="form-group">
                            <label className="control-label">
                                Delivery Date *
                            </label>
                            <DateTimePicker
                                ref="deliver_at"
                                onChange={this.onDeliveryDateChange.bind(this)}
                                defaultValue={
                                    task.deadline
                                        ? new Date(
                                              moment
                                                  .utc(task.deadline)
                                                  .format(),
                                          )
                                        : null
                                }
                                time={false}
                            />
                        </div>

                        {Task.detail.applications.error.create &&
                        Task.detail.applications.error.create.agree_schedule ? (
                            <FieldError
                                message={
                                    Task.detail.applications.error.create
                                        .agree_schedule
                                }
                            />
                        ) : null}
                        {task.update_interval && task.update_interval_units ? (
                            <div className="form-group">
                                <div>
                                    Update schedule:{' '}
                                    {task.update_schedule_display}
                                </div>
                                <div className="checkbox">
                                    <label className="control-label">
                                        <input
                                            type="checkbox"
                                            ref="agree_schedule"
                                            checked={this.state.agree_schedule}
                                            onChange={this.onAgreeScheduleChange.bind(
                                                this,
                                            )}
                                        />
                                        I agree to the update schedule for this{' '}
                                        {work_type}
                                    </label>
                                </div>
                            </div>
                        ) : null}

                        {Task.detail.applications.error.create &&
                        Task.detail.applications.error.create.agree_deadline ? (
                            <FieldError
                                message={
                                    Task.detail.applications.error.create
                                        .agree_deadline
                                }
                            />
                        ) : null}
                        {task.deadline ? (
                            <div className="form-group">
                                <div>
                                    Deadline:{' '}
                                    {moment
                                        .utc(task.deadline)
                                        .local()
                                        .format('Do, MMMM YYYY')}
                                </div>
                                <div className="checkbox">
                                    <label className="control-label">
                                        <input
                                            type="checkbox"
                                            ref="agree_deadline"
                                            checked={this.state.agree_deadline}
                                            onChange={this.onAgreeDeadlineChange.bind(
                                                this,
                                            )}
                                        />
                                        I agree to the milestone deadlines for
                                        this {work_type}.
                                    </label>
                                </div>
                            </div>
                        ) : null}

                        {Task.detail.applications.error.create &&
                        Task.detail.applications.error.create.remarks ? (
                            <FieldError
                                message={
                                    Task.detail.applications.error.create
                                        .remarks
                                }
                            />
                        ) : null}
                        <div className="form-group">
                            <label className="control-label">
                                Do you have a question or remark for the client?
                            </label>
                            <textarea
                                placeholder="Question or remark for the client"
                                className="form-control"
                                ref="remarks"
                                onChange={this.onInputChange.bind(
                                    this,
                                    'remarks',
                                )}
                                value={this.state.remarks}
                            />
                            <div
                                className="alert alert-info"
                                style={{marginTop: '10px'}}>
                                Any question or remark will be sent to the
                                client as a direct message
                            </div>
                        </div>

                        <div className="text-center">
                            <button
                                type="submit"
                                className="btn"
                                disabled={Task.detail.applications.isSaving}>
                                Apply
                            </button>
                        </div>
                        <div className="clearfix" />
                    </form>
                )}
            </div>
        );
    }
}
