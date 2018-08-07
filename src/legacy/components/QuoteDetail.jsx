import React from 'react';
import {Link} from 'react-router';
import moment from 'moment';
import momentLocalizer from 'react-widgets/lib/localizers/moment';
import {Table} from 'react-bootstrap';

import FormStatus from './status/FormStatus';

import {
    DEVELOPER_FEE,
    STATUS_SUBMITTED,
    STATUS_APPROVED,
    STATUS_DECLINED,
    STATUS_ACCEPTED,
    STATUS_REJECTED,
    ENDPOINT_TASK,
} from '../constants/Api';
import {
    getPayDetails,
    canEditQuote,
    canModerateQuote,
    canReviewQuote,
} from '../utils/tasks';
import {getUser, isAdminOrProjectOwner} from '../utils/auth';
import confirm from '../utils/confirm';
import {parseNumber} from '../utils/helpers';

momentLocalizer(moment);

export default class QuoteDetail extends React.Component {
    componentDidUpdate(prevProps, prevState) {
        const {Quote} = this.props;

        const quote = this.props.quote || {};

        if (
            this.props.Quote.detail.isSaved &&
            !prevProps.Quote.detail.isSaved
        ) {
            if (Quote.detail.quote.status == STATUS_ACCEPTED) {
                const {router} = this.context;
                window.location.href = `/work/${
                    Quote.detail.quote.task
                }/planning/${Quote.detail.quote.id}`;
            }
        }
    }

    onChangeStatus(status) {
        const {QuoteActions} = this.props;
        const quote = this.props.quote || {};

        if ([STATUS_DECLINED, STATUS_REJECTED].indexOf(status) > -1) {
            confirm('Are you sure?', true, {placeholder: 'Reason'}).then(
                function(response) {
                    var quote_info = {status};
                    if (status == STATUS_DECLINED) {
                        quote_info.moderator_comment = response;
                    } else {
                        quote_info.reviewer_comment = response;
                    }
                    QuoteActions.updateQuote(quote.id, {
                        status,
                        moderator_comment: response,
                    });
                },
            );
        } else {
            confirm('Are you sure?').then(function() {
                QuoteActions.updateQuote(quote.id, {status});
            });
        }

        return;
    }

    getTotalHours() {
        const quote = this.props.quote || {};
        if (!quote.activities || !quote.activities.length) {
            return 0;
        }
        return quote.activities
            .map(function(activity) {
                return activity.hours;
            })
            .reduce((a, b) => {
                return parseInt(a) + parseInt(b);
            });
    }

    render() {
        const {Quote} = this.props;
        const task = this.props.task || {};
        const quote = this.props.quote || {};

        let payDetails = getPayDetails(
            quote.activities,
            task.dev_rate,
            task.pm_rate,
            task.pm_time_ratio,
        );

        return (
            <div>
                <div className="estimate-presentation">
                    <FormStatus
                        loading={Quote.detail.isSaving}
                        success={Quote.detail.isSaved}
                        message={'Sprint saved successfully'}
                        error={Quote.detail.error.create}
                    />

                    <div className="sprint-card">
                        <div className="title">{quote.title}</div>

                        <div className="content">
                            <div className="form-group">
                                <div className="row">
                                    <div className="col-md-6">
                                        <h5>Start Date</h5>
                                        {moment
                                            .utc(quote.start_date)
                                            .local()
                                            .format('Do, MMMM YYYY')}
                                    </div>
                                    <div className="col-md-6">
                                        <h5>End Date</h5>
                                        {moment
                                            .utc(quote.end_date)
                                            .local()
                                            .format('Do, MMMM YYYY')}
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <h5>Introduction</h5>
                                <p>{quote.introduction}</p>
                            </div>

                            <div className="form-group">
                                <h5>Activities:</h5>
                                {quote.activities && quote.activities.length ? (
                                    <Table>
                                        <thead>
                                            <tr>
                                                <th>Title</th>
                                                <th>Hours</th>
                                                {isAdminOrProjectOwner() ? (
                                                    <th>Fee</th>
                                                ) : null}
                                                <th>Description</th>
                                                <th>Assignee</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {quote.activities.map(
                                                (activity, idx) => {
                                                    return (
                                                        <tr>
                                                            <td>
                                                                {activity.title}
                                                            </td>
                                                            <td>
                                                                {activity.hours}{' '}
                                                                hrs
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
                                                                {
                                                                    activity.description
                                                                }
                                                            </td>
                                                            <td>
                                                                {activity.assignee
                                                                    ? activity
                                                                          .assignee
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
                                                        </tr>
                                                    );
                                                },
                                            )}
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <th colSpan="6">Sub Totals</th>
                                            </tr>
                                            <tr>
                                                <th>Development</th>
                                                <th>
                                                    {payDetails.dev.hours} hrs
                                                </th>
                                                {isAdminOrProjectOwner() ? (
                                                    <th>
                                                        €{payDetails.dev.fee}
                                                    </th>
                                                ) : null}
                                                <th />
                                                <th />
                                                <th />
                                            </tr>
                                            <tr>
                                                <th>Project Management</th>
                                                <th>
                                                    {payDetails.pm.hours} hrs
                                                </th>
                                                {isAdminOrProjectOwner() ? (
                                                    <th>
                                                        €{payDetails.pm.fee}
                                                    </th>
                                                ) : null}
                                                <th />
                                                <th />
                                                <th />
                                            </tr>
                                            <tr>
                                                <th>Total</th>
                                                <th>
                                                    {payDetails.total.hours} hrs
                                                </th>
                                                {isAdminOrProjectOwner() ? (
                                                    <th>
                                                        €{payDetails.total.fee}
                                                    </th>
                                                ) : null}
                                                <th />
                                                <th />
                                                <th />
                                            </tr>
                                        </tfoot>
                                    </Table>
                                ) : null}
                            </div>
                        </div>
                    </div>

                    <div className="text-center clearfix">
                        {canEditQuote(task) ? (
                            <div>
                                <Link
                                    to={`/work/${quote.task}/planning/${
                                        quote.id
                                    }/edit`}
                                    className="btn">
                                    Edit Sprint
                                </Link>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        );
    }
}
