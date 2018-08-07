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
    ENDPOINT_ESTIMATE,
} from '../constants/Api';
import {
    getPayDetails,
    canEditEstimate,
    canModerateEstimate,
    canReviewEstimate,
} from '../utils/tasks';
import {getUser, isAdminOrProjectOwner} from '../utils/auth';
import confirm from '../utils/confirm';
import {parseNumber} from '../utils/helpers';

momentLocalizer(moment);

export default class EstimateDetail extends React.Component {
    onChangeStatus(status) {
        const {EstimateActions} = this.props;
        const estimate = this.props.estimate || {};

        if ([STATUS_DECLINED, STATUS_REJECTED].indexOf(status) > -1) {
            confirm('Are you sure?', true, {placeholder: 'Reason'}).then(
                function(response) {
                    var estimate_info = {status};
                    if (status == STATUS_DECLINED) {
                        estimate_info.moderator_comment = response;
                    } else {
                        estimate_info.reviewer_comment = response;
                    }
                    EstimateActions.updateEstimate(estimate.id, {
                        status,
                        moderator_comment: response,
                    });
                },
            );
        } else {
            confirm('Are you sure?').then(function() {
                EstimateActions.updateEstimate(estimate.id, {status});
            });
        }
        return;
    }

    render() {
        const {Estimate} = this.props;
        const task = this.props.task || {};
        const estimate = this.props.estimate || {};

        let payDetails = getPayDetails(
            estimate.activities,
            task.dev_rate,
            task.pm_rate,
            task.pm_time_ratio,
        );

        return (
            <div className="estimate-presentation">
                <FormStatus
                    loading={Estimate.detail.isSaving}
                    success={Estimate.detail.isSaved}
                    message={'Estimate saved successfully'}
                    error={Estimate.detail.error.create}
                />

                <div className="pull-right">
                    <a
                        href={`${
                            estimate.task && false
                                ? `${ENDPOINT_TASK}${
                                      estimate.task
                                  }/download/estimate`
                                : `${ENDPOINT_ESTIMATE}${estimate.id}/download`
                        }?format=pdf`}
                        className="btn btn-primary"
                        target="_blank">
                        <i className="fa fa-file-pdf-o" /> Download Pdf
                    </a>
                </div>

                <div className="form-group">
                    <h4>Title:</h4>
                    <div>
                        {estimate.task
                            ? estimate.details.task.summary
                            : estimate.title}
                    </div>
                </div>

                <div className="form-group">
                    <h4>Introduction:</h4>
                    <div>{estimate.introduction}</div>
                </div>

                <div className="form-group">
                    <h4>Activities:</h4>
                    {estimate.activities && estimate.activities.length ? (
                        <Table>
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Hours</th>
                                    {isAdminOrProjectOwner() ? (
                                        <th>Fee</th>
                                    ) : null}
                                    <th>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                {estimate.activities.map((activity, idx) => {
                                    return (
                                        <tr>
                                            <td>{activity.title}</td>
                                            <td>{activity.hours} hrs</td>
                                            {isAdminOrProjectOwner() ? (
                                                <td>
                                                    €{parseNumber(
                                                        (task.dev_rate ||
                                                            DEVELOPER_FEE) *
                                                            activity.hours,
                                                    )}
                                                </td>
                                            ) : null}
                                            <td>{activity.description}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th colSpan="4">Sub Totals</th>
                                </tr>
                                <tr>
                                    <th>Development</th>
                                    <th>{payDetails.dev.hours} hrs</th>
                                    {isAdminOrProjectOwner() ? (
                                        <th>€{payDetails.dev.fee}</th>
                                    ) : null}
                                    <th />
                                </tr>
                                <tr>
                                    <th>Project Management</th>
                                    <th>{payDetails.pm.hours} hrs</th>
                                    {isAdminOrProjectOwner() ? (
                                        <th>€{payDetails.pm.fee}</th>
                                    ) : null}
                                    <th />
                                </tr>
                                <tr>
                                    <th>Total</th>
                                    <th>{payDetails.total.hours} hrs</th>
                                    {isAdminOrProjectOwner() ? (
                                        <th>€{payDetails.total.fee}</th>
                                    ) : null}
                                    <th />
                                </tr>
                            </tfoot>
                        </Table>
                    ) : null}
                </div>

                <div className="form-group">
                    <h4>Planning:</h4>
                    <div className="row">
                        <div className="col-md-6">
                            <h5>Start Date</h5>
                            {moment
                                .utc(estimate.start_date)
                                .local()
                                .format('Do, MMMM YYYY')}
                        </div>
                        <div className="col-md-6">
                            <h5>End Date</h5>
                            {moment
                                .utc(estimate.end_date)
                                .local()
                                .format('Do, MMMM YYYY')}
                        </div>
                    </div>
                </div>

                <div className="disclaimer">
                    <strong>Disclaimer</strong>
                    <p>This proposal does not include payment fees</p>
                    <p>Tunga has the following 4 payment options:</p>

                    <p>
                        <ol>
                            <li>
                                Payment by card (via Stripe) - 2.9% + €0.25
                                payment fees
                            </li>
                            <li>
                                Payment through iDeal (for the Netherlands and
                                Belgium) - 3% payment fees
                            </li>
                            <li>Pay with BitCoins - no payment fees</li>
                            <li>Payment by bank transfer - 5% payment fees</li>
                        </ol>
                    </p>

                    <p>
                        The first 3 options are self service. For these 3
                        options, you pay directly from the platform.
                    </p>

                    <p>
                        The 4<sup>th</sup> option is manual: you will receive an
                        invoice by email and/or on your Tunga account on the
                        platform.<br />
                        The term for payment is 2 weeks for invoicing.
                    </p>
                </div>

                <div className="text-center clearfix">
                    {canEditEstimate(task) ? (
                        <div>
                            <Link
                                to={`/work/${estimate.task}/estimate/${
                                    estimate.id
                                }/edit`}
                                className="btn">
                                Edit Estimate
                            </Link>
                            {estimate.user &&
                            estimate.user.id == getUser().id ? (
                                <button
                                    type="submit"
                                    className="btn"
                                    disabled={Estimate.detail.isSaving}
                                    onClick={this.onChangeStatus.bind(
                                        this,
                                        STATUS_SUBMITTED,
                                    )}>
                                    Submit for Review
                                </button>
                            ) : null}
                        </div>
                    ) : canModerateEstimate(task) ? (
                        <div>
                            <button
                                type="submit"
                                className="btn"
                                disabled={Estimate.detail.isSaving}
                                onClick={this.onChangeStatus.bind(
                                    this,
                                    STATUS_APPROVED,
                                )}>
                                Approve
                            </button>
                            <button
                                type="submit"
                                className="btn"
                                disabled={Estimate.detail.isSaving}
                                onClick={this.onChangeStatus.bind(
                                    this,
                                    STATUS_DECLINED,
                                )}>
                                Decline
                            </button>
                        </div>
                    ) : canReviewEstimate(task) ? (
                        <div>
                            <button
                                type="submit"
                                className="btn"
                                disabled={Estimate.detail.isSaving}
                                onClick={this.onChangeStatus.bind(
                                    this,
                                    STATUS_ACCEPTED,
                                )}>
                                Accept
                            </button>
                            <button
                                type="submit"
                                className="btn"
                                disabled={Estimate.detail.isSaving}
                                onClick={this.onChangeStatus.bind(
                                    this,
                                    STATUS_REJECTED,
                                )}>
                                Reject
                            </button>
                        </div>
                    ) : null}
                </div>
            </div>
        );
    }
}
