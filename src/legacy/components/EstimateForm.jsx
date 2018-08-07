import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';
import _ from 'lodash';
import momentLocalizer from 'react-widgets/lib/localizers/moment';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import {Table} from 'react-bootstrap';

import FormStatus from './status/FormStatus';
import FieldError from './status/FieldError';
import ComponentWithModal from './ComponentWithModal';
import LargeModal from './LargeModal';
import ActivityForm from './ActivityForm';

import {DEVELOPER_FEE, STATUS_SUBMITTED} from '../constants/Api';
import {getUser, isAdminOrProjectOwner} from '../utils/auth';
import {getPayDetails, canEditEstimate, canAddEstimate} from '../utils/tasks';
import {parseNumber} from '../utils/helpers';

momentLocalizer(moment);

export default class EstimateForm extends ComponentWithModal {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            introduction: '',
            activities: [],
            modalActivity: null,
            modalContent: null,
            modalTitle: '',
            submitted: false,
            start_date: null,
            end_date: null,
        };
    }

    componentDidMount() {
        const estimate = this.props.estimate || {};
        this.setState({...estimate});
    }

    componentDidUpdate(prevProps, prevState) {
        const {Estimate} = this.props;
        const estimate = this.props.estimate || {};

        if (
            this.props.Estimate.detail.isSaved &&
            !prevProps.Estimate.detail.isSaved
        ) {
            if (!this.props.estimate) {
                if (this.refs.estimate_form) {
                    this.refs.estimate_form.reset();
                }
            }

            if (
                !this.props.estimate ||
                this.props.estimate != Estimate.detail.estimate.id
            ) {
                const {router} = this.context;
                router.replace(
                    `/work/${Estimate.detail.estimate.task}/proposal/${
                        Estimate.detail.estimate.id
                    }`,
                );
            }

            this.setState({...Estimate.detail.estimate, submitted: false});
        }

        if (
            this.props.Estimate.detail.estimate.id &&
            !prevProps.Estimate.detail.estimate.id
        ) {
            this.setState({...this.props.Estimate.detail.estimate});
        }
    }

    onInputChange(key, e) {
        var new_state = {};
        new_state[key] = e.target.value;
        this.setState(new_state);
    }

    onStateValueChange(key, value) {
        var new_state = {};
        new_state[key] = value;
        this.setState(new_state);
    }

    onStartDateChange(date) {
        this.setState({
            start_date: moment(date)
                .utc()
                .format(),
        });
    }

    onEndDateChange(date) {
        this.setState({
            end_date: moment(date)
                .utc()
                .format(),
        });
    }

    onComposeActivity(activity) {
        this.setState({
            modalActivity: activity,
            modalContent: 'activity',
            modalTitle: 'Add activity',
        });
        this.open();
    }

    onAddActivity(activity) {
        var new_activities = this.state.activities;
        if (activity.idx > -1) {
            new_activities[activity.idx] = activity;
        } else {
            new_activities = [...new_activities, activity];
        }
        this.setState({activities: new_activities});
    }

    onDelete(idx) {
        if (idx > -1) {
            let activities = Array.from(
                new Set([
                    ...this.state.activities.slice(0, idx),
                    ...this.state.activities.slice(idx + 1),
                ]),
            );
            this.setState({activities});
        }
    }

    handleSubmit = e => {
        e.preventDefault();
        var title = this.state.title;
        var introduction = this.state.introduction;
        var activities = this.state.activities;
        var start_date = this.state.start_date;
        var end_date = this.state.end_date;

        const {EstimateActions} = this.props;
        const estimate = this.props.estimate || {};
        const task = this.props.task || {};

        let estimate_info = {task: estimate.task, introduction, activities};

        if (!estimate.id) {
            estimate_info.task = task.id;
        }

        if (title) {
            estimate_info.title = title;
        }

        if (this.state.submitted) {
            estimate_info.status = STATUS_SUBMITTED;
        }

        if (start_date) {
            estimate_info.start_date = start_date;
        }

        if (end_date) {
            estimate_info.end_date = end_date;
        }

        if (estimate.id) {
            EstimateActions.updateEstimate(estimate.id, estimate_info);
        } else {
            EstimateActions.createEstimate(estimate_info);
        }
        return;
    };

    renderModalContent() {
        return (
            <div>
                <LargeModal
                    title={this.state.modalTitle}
                    show={this.state.showModal}
                    onHide={this.close.bind(this)}>
                    {this.state.modalContent == 'activity' ? (
                        <ActivityForm
                            activity={this.state.modalActivity}
                            onSave={this.onAddActivity.bind(this)}
                            close={this.close.bind(this)}
                        />
                    ) : null}
                </LargeModal>
            </div>
        );
    }

    render() {
        const {Estimate} = this.props;
        const task = this.props.task || {};
        const estimate = this.props.estimate || {};

        let payDetails = getPayDetails(
            this.state.activities,
            task.dev_rate,
            task.pm_rate,
            task.pm_time_ratio,
        );

        return (
            <div className="form-wrapper">
                {this.renderModalContent()}
                <form
                    onSubmit={this.handleSubmit}
                    name="estimate-form"
                    role="form"
                    ref="estimate_form">
                    <FormStatus
                        loading={Estimate.detail.isSaving}
                        success={Estimate.detail.isSaved}
                        message={`Proposal ${
                            estimate.status == STATUS_SUBMITTED
                                ? 'submitted'
                                : 'saved'
                        } successfully`}
                        error={Estimate.detail.error.create}
                    />

                    {Estimate.detail.error.create &&
                    Estimate.detail.error.create.message ? (
                        <FieldError
                            message={Estimate.detail.error.create.message}
                        />
                    ) : null}
                    {Estimate.detail.error.update &&
                    Estimate.detail.error.update.message ? (
                        <FieldError
                            message={Estimate.detail.error.update.message}
                        />
                    ) : null}

                    {task.id ? null : (
                        <div>
                            <h4>Title:</h4>
                            {Estimate.detail.error.create &&
                            Estimate.detail.error.create.title ? (
                                <FieldError
                                    message={Estimate.detail.error.create.title}
                                />
                            ) : null}
                            {Estimate.detail.error.update &&
                            Estimate.detail.error.update.title ? (
                                <FieldError
                                    message={Estimate.detail.error.update.title}
                                />
                            ) : null}
                            <div className="form-group">
                                {/*<label className="control-label">Title *</label>*/}
                                <textarea
                                    className="form-control"
                                    onChange={this.onInputChange.bind(
                                        this,
                                        'title',
                                    )}
                                    value={this.state.title}
                                    ref="title"
                                    placeholder="Title"
                                />
                            </div>
                        </div>
                    )}

                    <h4>Introduction:</h4>
                    {Estimate.detail.error.create &&
                    Estimate.detail.error.create.introduction ? (
                        <FieldError
                            message={Estimate.detail.error.create.introduction}
                        />
                    ) : null}
                    {Estimate.detail.error.update &&
                    Estimate.detail.error.update.introduction ? (
                        <FieldError
                            message={Estimate.detail.error.update.introduction}
                        />
                    ) : null}
                    <div className="form-group">
                        {/*<label className="control-label">Introduction *</label>*/}
                        <textarea
                            className="form-control"
                            onChange={this.onInputChange.bind(
                                this,
                                'introduction',
                            )}
                            value={this.state.introduction}
                            ref="introduction"
                            placeholder="Introduction"
                        />
                    </div>

                    <h4>Activities:</h4>
                    {Estimate.detail.error.create &&
                    Estimate.detail.error.create.activities ? (
                        <FieldError
                            message={Estimate.detail.error.create.activities}
                        />
                    ) : null}
                    {Estimate.detail.error.update &&
                    Estimate.detail.error.update.activities ? (
                        <FieldError
                            message={Estimate.detail.error.update.activities}
                        />
                    ) : null}
                    <div className="form-group">
                        {/*<label className="control-label">Activities *</label>*/}

                        <button
                            type="button"
                            className="btn"
                            onClick={this.onComposeActivity.bind(this, null)}>
                            Add
                        </button>

                        {this.state.activities &&
                        this.state.activities.length ? (
                            <Table>
                                <thead>
                                    <tr>
                                        <th>Activity</th>
                                        <th>Hours</th>
                                        <th>Fee</th>
                                        {isAdminOrProjectOwner() ? (
                                            <th>Description</th>
                                        ) : null}
                                        <th />
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.activities.map(
                                        (activity, idx) => {
                                            return (
                                                <tr>
                                                    <td>
                                                        <a
                                                            href="#"
                                                            onClick={this.onComposeActivity.bind(
                                                                this,
                                                                {
                                                                    ...activity,
                                                                    idx,
                                                                },
                                                            )}>
                                                            {_.truncate(
                                                                activity.title,
                                                                {length: 25},
                                                            )}
                                                        </a>
                                                    </td>
                                                    <td>
                                                        {activity.hours} hrs
                                                    </td>
                                                    {isAdminOrProjectOwner() ? (
                                                        <td>
                                                            €{parseNumber(
                                                                (task.dev_rate ||
                                                                    DEVELOPER_FEE) *
                                                                    activity.hours,
                                                            )}
                                                        </td>
                                                    ) : null}
                                                    <td>
                                                        {activity.description}
                                                    </td>
                                                    <td>
                                                        <button
                                                            className="btn"
                                                            onClick={this.onDelete.bind(
                                                                this,
                                                                idx,
                                                            )}>
                                                            <i className="fa fa-trash-o" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        },
                                    )}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <th colSpan="5">Sub Totals</th>
                                    </tr>
                                    <tr>
                                        <th>Development</th>
                                        <th>{payDetails.dev.hours} hrs</th>
                                        {isAdminOrProjectOwner() ? (
                                            <th>€{payDetails.dev.fee}</th>
                                        ) : null}
                                        <th />
                                        <th />
                                    </tr>
                                    <tr>
                                        <th>Project Management</th>
                                        <th>{payDetails.pm.hours} hrs</th>
                                        {isAdminOrProjectOwner() ? (
                                            <th>€{payDetails.pm.fee}</th>
                                        ) : null}
                                        <th />
                                        <th />
                                    </tr>
                                    <tr>
                                        <th>Total</th>
                                        <th>{payDetails.total.hours} hrs</th>
                                        {isAdminOrProjectOwner() ? (
                                            <th>€{payDetails.total.fee}</th>
                                        ) : null}
                                        <th />
                                        <th />
                                    </tr>
                                </tfoot>
                            </Table>
                        ) : null}
                    </div>

                    <h4>Planning:</h4>

                    <div className="row">
                        <div className="col-md-6">
                            {Estimate.detail.error.create &&
                            Estimate.detail.error.create.start_date ? (
                                <FieldError
                                    message={
                                        Estimate.detail.error.create.start_date
                                    }
                                />
                            ) : null}
                            {Estimate.detail.error.update &&
                            Estimate.detail.error.update.start_date ? (
                                <FieldError
                                    message={
                                        Estimate.detail.error.update.start_date
                                    }
                                />
                            ) : null}
                            <div className="form-group">
                                <label className="control-label">
                                    Start Date *
                                </label>
                                <DateTimePicker
                                    ref="due_at"
                                    onChange={this.onStartDateChange.bind(this)}
                                    value={
                                        this.state.start_date
                                            ? new Date(
                                                  moment
                                                      .utc(
                                                          this.state.start_date,
                                                      )
                                                      .format(),
                                              )
                                            : null
                                    }
                                    time={false}
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            {Estimate.detail.error.create &&
                            Estimate.detail.error.create.end_date ? (
                                <FieldError
                                    message={
                                        Estimate.detail.error.create.end_date
                                    }
                                />
                            ) : null}
                            {Estimate.detail.error.update &&
                            Estimate.detail.error.update.end_date ? (
                                <FieldError
                                    message={
                                        Estimate.detail.error.update.end_date
                                    }
                                />
                            ) : null}
                            <div className="form-group">
                                <label className="control-label">
                                    End Date *
                                </label>
                                <DateTimePicker
                                    ref="due_at"
                                    onChange={this.onEndDateChange.bind(this)}
                                    value={
                                        this.state.end_date
                                            ? new Date(
                                                  moment
                                                      .utc(this.state.end_date)
                                                      .format(),
                                              )
                                            : null
                                    }
                                    time={false}
                                />
                            </div>
                        </div>
                    </div>

                    {(!estimate.id && canAddEstimate(task)) ||
                    (estimate.id && canEditEstimate(task)) ? (
                        <div className="text-center clearfix">
                            <button
                                type="submit"
                                className="btn"
                                disabled={Estimate.detail.isSaving}>
                                Save
                            </button>
                            {!estimate.user ||
                            estimate.user.id == getUser().id ? (
                                <button
                                    type="submit"
                                    value={STATUS_SUBMITTED}
                                    className="btn"
                                    onClick={e => {
                                        this.setState({submitted: true});
                                        return true;
                                    }}
                                    disabled={Estimate.detail.isSaving}>
                                    Submit for Review
                                </button>
                            ) : null}
                        </div>
                    ) : null}
                </form>
            </div>
        );
    }
}

EstimateForm.propTypes = {
    estimate: PropTypes.object,
    task: PropTypes.object,
};

EstimateForm.defaultProps = {
    estimate: null,
    task: null,
};

EstimateForm.contextTypes = {
    router: PropTypes.object.isRequired,
};
