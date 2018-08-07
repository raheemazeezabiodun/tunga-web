import React from 'react';
import {Link, IndexLink} from 'react-router';
import moment from 'moment';

import Progress from './status/Progress';
import LoadMore from './status/LoadMore';
import GenericListContainer from '../containers/GenericListContainer';

import {getPayDetails} from '../utils/tasks';

export default class EstimateList extends GenericListContainer {
    componentDidUpdate(prevProps, prevState) {
        super.componentDidUpdate(prevProps, prevState);

        if (
            prevProps.location &&
            this.props.location &&
            prevProps.location.pathname != this.props.location.pathname
        ) {
            this.getList();
        }

        if (prevProps.search != this.props.search) {
            this.setState({
                selection_key:
                    this.state.selection_key + (this.props.search || ''),
                prev_key: this.state.selection_key,
            });
        }
    }

    getList(filters) {
        this.props.EstimateActions.listEstimates(
            {status: this.getFilter()},
            this.state.selection_key,
            this.state.prev_key,
        );
    }

    getFilter() {
        if (this.props.params && this.props.params.filter) {
            return this.props.params.filter;
        }
        return null;
    }

    render() {
        const {Estimate, EstimateActions} = this.props;
        const all_estimates = Estimate.list.ids[this.state.selection_key] || [];

        return (
            <div>
                <h2 className="clearfix">
                    <div className="pull-left">Proposals</div>
                    <Link
                        to="/proposal/new"
                        className="btn btn-grey btn-create pull-right">
                        <i className="fa fa-plus" /> Create a new proposal
                    </Link>
                </h2>

                <ul className="nav nav-pills nav-top-filter">
                    <li role="presentation">
                        <IndexLink to="/proposal" activeClassName="active">
                            All
                        </IndexLink>
                    </li>
                    <li role="presentation">
                        <Link
                            to="/proposal/filter/submitted"
                            activeClassName="active">
                            Submitted
                        </Link>
                    </li>
                    <li role="presentation">
                        <Link
                            to="/proposal/filter/approved"
                            activeClassName="active">
                            Approved
                        </Link>
                    </li>
                    <li role="presentation">
                        <Link
                            to="/proposal/filter/declined"
                            activeClassName="active">
                            Declined
                        </Link>
                    </li>
                    <li role="presentation">
                        <Link
                            to="/proposal/filter/accepted"
                            activeClassName="active">
                            Accepted
                        </Link>
                    </li>
                    <li role="presentation">
                        <Link
                            to="/proposal/filter/rejected"
                            activeClassName="active">
                            Rejected
                        </Link>
                    </li>
                </ul>
                {Estimate.list.isFetching ? (
                    <Progress />
                ) : (
                    <div>
                        {all_estimates.length ? (
                            <table className="table table-striped table-responsive">
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Project</th>
                                        <th>Total Hours</th>
                                        <th>Total Fee</th>
                                        <th>Dev Hours</th>
                                        <th>Dev Fee</th>
                                        <th>PM Hours</th>
                                        <th>PM Fee</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {all_estimates.map(id => {
                                        const estimate =
                                            Estimate.list.estimates[id];
                                        const task = estimate.details
                                            ? estimate.details.task || {}
                                            : {};
                                        let payDetails = getPayDetails(
                                            estimate.activities,
                                            task.dev_rate,
                                            task.pm_rate,
                                            task.pm_time_ratio,
                                        );

                                        return (
                                            <tr key={estimate.id}>
                                                <td>
                                                    {estimate.task ? (
                                                        <Link
                                                            to={`/work/${
                                                                estimate.task
                                                            }/proposal/${
                                                                estimate.id
                                                            }/`}>
                                                            {
                                                                estimate.details
                                                                    .task
                                                                    .summary
                                                            }
                                                        </Link>
                                                    ) : (
                                                        <Link
                                                            to={`/proposal/${
                                                                estimate.id
                                                            }/`}>
                                                            {estimate.title}
                                                        </Link>
                                                    )}
                                                </td>
                                                <td>
                                                    {estimate.task ? (
                                                        <Link
                                                            to={`/work/${
                                                                estimate.task
                                                            }/`}>
                                                            {
                                                                estimate.details
                                                                    .task
                                                                    .summary
                                                            }
                                                        </Link>
                                                    ) : null}
                                                </td>
                                                <th>
                                                    {payDetails.total.hours}
                                                </th>
                                                <th>€{payDetails.total.fee}</th>
                                                <th>{payDetails.dev.hours}</th>
                                                <th>€{payDetails.dev.fee}</th>
                                                <th>{payDetails.pm.hours}</th>
                                                <th>€{payDetails.pm.fee}</th>
                                                <td>{estimate.status}</td>
                                                <td>
                                                    {moment
                                                        .utc(
                                                            estimate.created_at,
                                                        )
                                                        .local()
                                                        .format('D/MMM/YYYY')}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        ) : (
                            <div className="alert alert-info">
                                No proposals to display
                            </div>
                        )}
                        {all_estimates.length && Estimate.list.next ? (
                            <LoadMore
                                url={Estimate.list.next}
                                callback={x => {
                                    EstimateActions.listMoreEstimates(
                                        x,
                                        this.state.selection_key,
                                    );
                                }}
                                loading={Estimate.list.isFetchingMore}
                            />
                        ) : null}
                    </div>
                )}
            </div>
        );
    }
}
