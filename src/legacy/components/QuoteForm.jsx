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

import {
    DEVELOPER_FEE,
    STATUS_SUBMITTED,
    STATUS_ACCEPTED,
} from '../constants/Api';
import {getPayDetails, canAddQuote, canEditQuote} from '../utils/tasks';
import {getUser, isAdminOrProjectOwner} from '../utils/auth';
import {parseNumber} from '../utils/helpers';

momentLocalizer(moment);

export default class QuoteForm extends ComponentWithModal {
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
        const quote = this.props.quote || {};
        var estimate = {};
        if (!quote.id) {
            const task = this.props.task || {};
            estimate = task.estimate;
        }
        this.setState({...estimate, ...quote});
    }

    componentDidUpdate(prevProps, prevState) {
        const {Quote} = this.props;

        const quote = this.props.quote || {};

        if (
            this.props.Quote.detail.isSaved &&
            !prevProps.Quote.detail.isSaved
        ) {
            //if (!this.props.quote) {
            const {router} = this.context;
            router.replace(
                `/work/${Quote.detail.quote.task}/planning/${
                    Quote.detail.quote.id
                }`,
            );
            //}

            if (this.props.quote.id != Quote.detail.quote.id) {
                const {router} = this.context;
                window.location.href = `/work/${
                    Quote.detail.quote.task
                }/planning/${Quote.detail.quote.id}`;
            }

            this.setState({...Quote.detail.quote, submitted: false});
        }

        if (
            this.props.Quote.detail.quote.id &&
            !prevProps.Quote.detail.quote.id
        ) {
            this.setState({...this.props.Quote.detail.quote});
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

    onComposeActivity(activity) {
        this.setState({
            modalActivity: activity,
            modalContent: 'activity',
            modalTitle: 'Add activity',
        });
        this.open();
    }

    onComposePlan(milestone) {
        this.setState({
            modalActivity: milestone,
            modalContent: 'plan',
            modalTitle: 'Add milestone',
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

    onAddMilestone(milestone) {
        var new_plans = this.state.plan;
        if (milestone.idx > -1) {
            new_plans[milestone.idx] = milestone;
        } else {
            new_plans = [...new_plans, milestone];
        }
        this.setState({plan: new_plans});
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

    onDeletePlan(idx) {
        if (idx > -1) {
            let plan = Array.from(
                new Set([
                    ...this.state.plan.slice(0, idx),
                    ...this.state.plan.slice(idx + 1),
                ]),
            );
            this.setState({plan});
        }
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

    handleSubmit = e => {
        e.preventDefault();
        var title = this.state.title;
        var introduction = this.state.introduction;
        var activities = this.state.activities;
        var start_date = this.state.start_date;
        var end_date = this.state.end_date;

        const {QuoteActions} = this.props;
        const quote = this.props.quote || {};
        const task = this.props.task || {};

        let quote_info = {
            title,
            introduction,
            activities,
            start_date,
            end_date,
        };

        if (!quote.id) {
            quote_info.task = task.id;
        }

        if (this.state.submitted) {
            quote_info.status = STATUS_SUBMITTED;
        }

        if (quote.id) {
            QuoteActions.updateQuote(quote.id, quote_info);
        } else {
            QuoteActions.createQuote(quote_info);
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
                            selectUser={true}
                            setStatus={true}
                        />
                    ) : null}
                </LargeModal>
            </div>
        );
    }

    render() {
        const {Quote} = this.props;
        const task = this.props.task || {};
        const quote = this.props.quote || {};

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
                    name="quote-form"
                    role="form"
                    ref="quote_form">
                    <FormStatus
                        loading={Quote.detail.isSaving}
                        success={Quote.detail.isSaved}
                        message="Sprint saved successfully"
                        error={Quote.detail.error.create}
                    />

                    {Quote.detail.error.create &&
                    Quote.detail.error.create.message ? (
                        <FieldError
                            message={Quote.detail.error.create.message}
                        />
                    ) : null}
                    {Quote.detail.error.update &&
                    Quote.detail.error.update.message ? (
                        <FieldError
                            message={Quote.detail.error.update.message}
                        />
                    ) : null}

                    {Quote.detail.error.create &&
                    Quote.detail.error.create.title ? (
                        <FieldError message={Quote.detail.error.create.title} />
                    ) : null}
                    {Quote.detail.error.update &&
                    Quote.detail.error.update.title ? (
                        <FieldError message={Quote.detail.error.update.title} />
                    ) : null}
                    <div className="form-group">
                        <label className="control-label">Sprint Name *</label>
                        <textarea
                            className="form-control"
                            onChange={this.onInputChange.bind(this, 'title')}
                            value={this.state.title}
                            ref="title"
                            placeholder="Sprint Name"
                        />
                    </div>

                    <div className="row">
                        <div className="col-md-6">
                            {Quote.detail.error.create &&
                            Quote.detail.error.create.start_date ? (
                                <FieldError
                                    message={
                                        Quote.detail.error.create.start_date
                                    }
                                />
                            ) : null}
                            {Quote.detail.error.update &&
                            Quote.detail.error.update.start_date ? (
                                <FieldError
                                    message={
                                        Quote.detail.error.update.start_date
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
                            {Quote.detail.error.create &&
                            Quote.detail.error.create.end_date ? (
                                <FieldError
                                    message={Quote.detail.error.create.end_date}
                                />
                            ) : null}
                            {Quote.detail.error.update &&
                            Quote.detail.error.update.end_date ? (
                                <FieldError
                                    message={Quote.detail.error.update.end_date}
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

                    {Quote.detail.error.create &&
                    Quote.detail.error.create.introduction ? (
                        <FieldError
                            message={Quote.detail.error.create.introduction}
                        />
                    ) : null}
                    {Quote.detail.error.update &&
                    Quote.detail.error.update.introduction ? (
                        <FieldError
                            message={Quote.detail.error.update.introduction}
                        />
                    ) : null}
                    <div className="form-group">
                        <label className="control-label">Introduction *</label>
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

                    {Quote.detail.error.create &&
                    Quote.detail.error.create.activities ? (
                        <FieldError
                            message={Quote.detail.error.create.activities}
                        />
                    ) : null}
                    {Quote.detail.error.update &&
                    Quote.detail.error.update.activities ? (
                        <FieldError
                            message={Quote.detail.error.update.activities}
                        />
                    ) : null}
                    <div className="form-group">
                        <label className="control-label">Activities *</label>

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
                                        {isAdminOrProjectOwner() ? (
                                            <th>Fee</th>
                                        ) : null}
                                        <th>Description</th>
                                        <th>Assignee</th>
                                        <th>Status</th>
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
                                                        {activity.assignee
                                                            ? activity.assignee
                                                                  .display_name
                                                            : ''}
                                                    </td>
                                                    <td>
                                                        <i
                                                            className={`fa ${
                                                                activity.completed
                                                                    ? 'fa-check-square-o'
                                                                    : ''
                                                            }`}
                                                        />
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
                                        <th colSpan="7">Sub Totals</th>
                                    </tr>
                                    <tr>
                                        <th>Development</th>
                                        <th>{payDetails.dev.hours} hrs</th>
                                        {isAdminOrProjectOwner() ? (
                                            <th>€{payDetails.dev.fee}</th>
                                        ) : null}
                                        <th />
                                        <th />
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
                                        <th />
                                        <th />
                                    </tr>
                                </tfoot>
                            </Table>
                        ) : null}
                    </div>

                    {(!quote.id && canAddQuote(task)) ||
                    (quote.id && canEditQuote(task)) ? (
                        <div className="text-center clearfix">
                            <button
                                type="submit"
                                className="btn"
                                disabled={Quote.detail.isSaving}>
                                Save
                            </button>
                        </div>
                    ) : null}
                </form>
            </div>
        );
    }
}

QuoteForm.propTypes = {
    quote: PropTypes.object,
    task: PropTypes.object,
};

QuoteForm.defaultProps = {
    quote: null,
    task: null,
};

QuoteForm.contextTypes = {
    router: PropTypes.object.isRequired,
};
