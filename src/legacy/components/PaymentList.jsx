import PropTypes from 'prop-types';
import React from 'react';
import {Link, IndexLink} from 'react-router';
import moment from 'moment';
import _ from 'lodash';

import Progress from './status/Progress';
import LoadMore from './status/LoadMore';
import GenericListContainer from '../containers/GenericListContainer';
import SearchBox from './SearchBox';

import {ENDPOINT_TASK} from '../constants/Api';

import {
    isAdmin,
    isDeveloper,
    isProjectManager,
    isProjectOwner,
} from '../utils/auth';

let paySelectionKeyBase = 'search-pay';

export default class PaymentList extends GenericListContainer {
    constructor(props) {
        super(props);
        this.state = {
            ...this.state,
            toPay: [],
            toDistribute: [],
            selection_key: paySelectionKeyBase,
            status_filter: this.getPaymentStatusFilter(),
            search: '',
        };
    }

    componentDidUpdate(prevProps, prevState) {
        super.componentDidUpdate(prevProps, prevState);

        if (
            this.props.Task.MultiTaskPayment.detail.isSaved &&
            !prevProps.Task.MultiTaskPayment.detail.isSaved
        ) {
            const {router} = this.context;
            router.replace(
                `/payments/bulk/${
                    this.props.Task.MultiTaskPayment.detail.multi_task_payment
                        .id
                }`,
            );
        }

        var newState = {};
        if (
            this.props.params &&
            (!prevProps.params ||
                this.props.params.filter != prevProps.params.filter)
        ) {
            newState = {
                ...newState,
                selection_key: this.composeSearchKey(
                    `${this.state.search}--${this.getPaymentStatusFilter()}`,
                ),
                prev_key: this.state.selection_key,
                status_filter: this.getPaymentStatusFilter(),
            };
        }

        if (prevState.search != this.state.search) {
            newState = {
                ...newState,
                selection_key: this.composeSearchKey(
                    `${this.state.search}--${this.getPaymentStatusFilter()}`,
                ),
                prev_key: this.state.selection_key,
                search: this.state.search,
            };
        }

        if (Object.keys(newState).length > 0) {
            this.setState(newState);
        } else if (
            this.state.status_filter != prevState.status_filter ||
            this.state.search != prevState.search ||
            this.state.selection_key != prevState.selection_key
        ) {
            this.getList();
        }
    }

    getList(filters) {
        this.props.TaskActions.listTasks(
            {
                ...(filters || {}),
                search: this.state.search,
                payment_status: this.getPaymentStatusFilter(),
                filter: 'payments',
            },
            this.state.selection_key,
            this.state.prev_key,
        );
    }

    composeSearchKey(search) {
        let searchKey = search
            ? `${paySelectionKeyBase}--${search}`
            : this.state.selection_key;
        return (searchKey || '').replace(/[^\w]/gi, '-');
    }

    onSearch(filters) {
        console.log('search filters: ', filters);
        this.setState({
            ...filters /*, selection_key: this.composeSearchKey(filters.search)*/,
        });
    }

    getPaymentStatusFilter() {
        return this.props.params ? this.props.params.filter || '' : '';
    }

    isDistributionMode() {
        return this.getPaymentStatusFilter() == 'distribute';
    }

    onSelectTask(task, e) {
        let targetState = this.isDistributionMode()
            ? this.state.toDistribute
            : this.state.toPay;
        let tasks = [...targetState];
        if (e.target.checked) {
            tasks = [...targetState, task];
        } else {
            _.remove(tasks, content => {
                return task.id == content.id;
            });
        }
        let new_state = {},
            stateKey = this.isDistributionMode() ? 'toDistribute' : 'toPay';
        new_state[stateKey] = tasks;
        this.setState(new_state);
    }

    totalPayAmount() {
        return _.reduce(
            this.isDistributionMode()
                ? this.state.toDistribute
                : this.state.toPay,
            function(sum, task) {
                return sum + parseFloat(task.pay);
            },
            0,
        );
    }

    isTaskSelected(task) {
        let idx = _.findIndex(
            this.isDistributionMode()
                ? this.state.toDistribute
                : this.state.toPay,
            ['id', task.id],
        );
        return idx > -1;
    }

    onPay() {
        const {Task, TaskActions} = this.props;
        let task_info = {
                //amount: this.totalPayAmount(),
                distribute_only: this.isDistributionMode(),
            },
            tasks = (this.isDistributionMode()
                ? this.state.toDistribute
                : this.state.toPay
            ).map(task => {
                return task.id;
            });
        if (this.isDistributionMode()) {
            task_info.distribute_tasks = tasks;
            task_info.withhold_tunga_fee = true;
        } else {
            task_info.tasks = tasks;
        }
        TaskActions.createMultiTaskPayment(task_info);
    }

    render() {
        const {Task, TaskActions} = this.props;

        const all_tasks = Task.list.ids[this.state.selection_key] || [],
            totalPay = this.totalPayAmount();

        return (
            <div>
                <div className="clearfix">
                    <h2 className="pull-left">Payments</h2>
                    <div className="pull-right">
                        <SearchBox
                            placeholder="Search payments"
                            onSearch={this.onSearch.bind(this)}
                            count={Task.list.count}
                        />
                    </div>
                </div>

                <ul className="nav nav-pills nav-top-filter">
                    <li role="presentation">
                        <IndexLink to="/payments" activeClassName="active">
                            All
                        </IndexLink>
                    </li>
                    <li role="presentation">
                        <Link
                            to="/payments/filter/pending"
                            activeClassName="active">
                            Pending
                        </Link>
                    </li>
                    <li role="presentation">
                        <Link
                            to="/payments/filter/processing"
                            activeClassName="active">
                            Processing
                        </Link>
                    </li>
                    <li role="presentation">
                        <Link
                            to="/payments/filter/paid"
                            activeClassName="active">
                            Paid
                        </Link>
                    </li>
                    {isAdmin() && false ? (
                        <li role="presentation">
                            <Link
                                to="/payments/filter/distribute"
                                activeClassName="active">
                                Payout
                            </Link>
                        </li>
                    ) : null}
                </ul>

                {totalPay ? (
                    <div className="form-group clearfix">
                        <button
                            className="btn pull-right"
                            onClick={this.onPay.bind(this)}>
                            {this.isDistributionMode() ? 'Distribute' : 'Pay'} €{
                                totalPay
                            }
                        </button>
                    </div>
                ) : null}

                {Task.list.isFetching ||
                Task.MultiTaskPayment.detail.isSaving ? (
                    <Progress />
                ) : (
                    <div>
                        {all_tasks.length ? (
                            <table className="table table-striped table-responsive">
                                <thead>
                                    <tr>
                                        <th>Task</th>
                                        <th>Date</th>
                                        {isDeveloper()
                                            ? [
                                                  <th>Pledge</th>,
                                                  <th>Payment fee</th>,
                                                  <th>Tunga fee</th>,
                                                  <th>Developer(s) fee</th>,
                                              ]
                                            : [
                                                  <th>Pledge</th>,
                                                  <th>Developers</th>,
                                              ]}
                                        <th>Invoice</th>
                                        <th>Status</th>
                                        {isAdmin() || isProjectOwner() ? (
                                            <th>Select To Pay</th>
                                        ) : null}
                                    </tr>
                                </thead>
                                <tbody>
                                    {all_tasks.map(id => {
                                        const task = Task.list.tasks[id];
                                        if (!task) {
                                            return null;
                                        }
                                        const invoice = task.invoice || {
                                            amount: task.amount,
                                            developer_amount: {
                                                developer: task.amount
                                                    ? task.amount.developer
                                                    : 0,
                                                tunga: task.amount
                                                    ? task.amount.tunga
                                                    : 0,
                                            },
                                            created_at: task.invoice_date,
                                        };
                                        return (
                                            <tr key={task.id}>
                                                <td>
                                                    <Link
                                                        to={`/work/${
                                                            task.id
                                                        }/`}>
                                                        {task.summary}
                                                    </Link>
                                                </td>
                                                <td>
                                                    {moment
                                                        .utc(
                                                            invoice.created_at ||
                                                                task.closed_at,
                                                        )
                                                        .local()
                                                        .format('D/MMM/YYYY')}
                                                </td>
                                                {isDeveloper() && invoice.amount
                                                    ? [
                                                          <td>
                                                              {
                                                                  invoice.amount
                                                                      .currency
                                                              }
                                                              {parseFloat(
                                                                  invoice.amount
                                                                      .pledge,
                                                              ).toFixed(2)}
                                                          </td>,
                                                          <td>
                                                              {
                                                                  invoice.amount
                                                                      .currency
                                                              }
                                                              {parseFloat(
                                                                  invoice
                                                                      .developer_amount
                                                                      .processing ||
                                                                      0,
                                                              ).toFixed(2)}
                                                          </td>,
                                                          <td>
                                                              {
                                                                  invoice.amount
                                                                      .currency
                                                              }
                                                              {parseFloat(
                                                                  invoice
                                                                      .developer_amount
                                                                      .tunga ||
                                                                      0,
                                                              ).toFixed(2)}
                                                          </td>,
                                                          <td>
                                                              {
                                                                  invoice.amount
                                                                      .currency
                                                              }
                                                              {parseFloat(
                                                                  invoice
                                                                      .developer_amount
                                                                      .developer ||
                                                                      0,
                                                              ).toFixed(2)}
                                                          </td>,
                                                      ]
                                                    : [
                                                          <td>
                                                              {task.display_fee}
                                                          </td>,
                                                          <td>
                                                              {task.details &&
                                                              task.details
                                                                  .active_participants ? (
                                                                  <div>
                                                                      {task.details.active_participants.map(
                                                                          participant => {
                                                                              let dev =
                                                                                  participant.user ||
                                                                                  participant;
                                                                              return (
                                                                                  <div>
                                                                                      <a
                                                                                          href={`/people/${
                                                                                              dev.username
                                                                                          }`}
                                                                                          target="_blank">
                                                                                          {
                                                                                              dev.display_name
                                                                                          }
                                                                                      </a>
                                                                                  </div>
                                                                              );
                                                                          },
                                                                      )}
                                                                  </div>
                                                              ) : null}
                                                          </td>,
                                                      ]}
                                                <td>
                                                    {task.invoice ? (
                                                        <div>
                                                            <a
                                                                href={`${ENDPOINT_TASK}${
                                                                    task.id
                                                                }/download/invoice/?format=pdf&type=client`}
                                                                target="_blank">
                                                                <span>
                                                                    <i className="fa fa-download" />{' '}
                                                                    {isDeveloper() ||
                                                                    isProjectManager() ||
                                                                    isAdmin()
                                                                        ? 'Client'
                                                                        : 'Download'}{' '}
                                                                    Invoice(s)
                                                                </span>
                                                            </a>
                                                            <br />
                                                            {(isDeveloper() ||
                                                                isAdmin()) &&
                                                            task.participation &&
                                                            task.participation
                                                                .length ? (
                                                                <div>
                                                                    {task
                                                                        .invoice
                                                                        .version >
                                                                    1 ? null : (
                                                                        <span>
                                                                            <a
                                                                                href={`${ENDPOINT_TASK}${
                                                                                    task.id
                                                                                }/download/invoice/?format=pdf&type=developer`}
                                                                                target="_blank">
                                                                                <span>
                                                                                    <i className="fa fa-download" />{' '}
                                                                                    Developer
                                                                                    Invoice(s)
                                                                                </span>
                                                                            </a>
                                                                            <br />
                                                                        </span>
                                                                    )}
                                                                    <a
                                                                        href={`${ENDPOINT_TASK}${
                                                                            task.id
                                                                        }/download/invoice/?format=pdf&type=tunga`}
                                                                        target="_blank">
                                                                        <span>
                                                                            <i className="fa fa-download" />{' '}
                                                                            Tunga
                                                                            Invoice(s)
                                                                        </span>
                                                                    </a>
                                                                </div>
                                                            ) : null}
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            {task.paid ||
                                                            isDeveloper() ? (
                                                                <div>
                                                                    Contact{' '}
                                                                    <a href="mailto:hello@tunga.io">
                                                                        hello@tunga.io
                                                                    </a>
                                                                </div>
                                                            ) : (
                                                                <div>
                                                                    <Link
                                                                        to={`/work/${
                                                                            task.id
                                                                        }/invoice`}>
                                                                        Generate
                                                                        Invoice
                                                                    </Link>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </td>
                                                <td>
                                                    {isProjectOwner() &&
                                                    !isAdmin() &&
                                                    task.payment_status ==
                                                        'Processing'
                                                        ? 'Paid'
                                                        : task.payment_status}
                                                </td>
                                                <td>
                                                    {(task.payment_status ==
                                                        'Pending' &&
                                                        (isProjectOwner() ||
                                                            isAdmin())) ||
                                                    (isAdmin() &&
                                                        this.isDistributionMode()) ? (
                                                        <input
                                                            type="checkbox"
                                                            className="tasks_to_pay"
                                                            value={task.id}
                                                            checked={this.isTaskSelected(
                                                                task,
                                                            )}
                                                            onChange={this.onSelectTask.bind(
                                                                this,
                                                                task,
                                                            )}
                                                        />
                                                    ) : null}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        ) : (
                            <div className="alert alert-info">
                                No payments to display
                            </div>
                        )}
                        {all_tasks.length && Task.list.next ? (
                            <LoadMore
                                url={Task.list.next}
                                callback={x => {
                                    TaskActions.listMoreTasks(
                                        x,
                                        this.state.selection_key,
                                    );
                                }}
                                loading={Task.list.isFetchingMore}
                            />
                        ) : null}
                    </div>
                )}
                {totalPay ? (
                    <div className="form-group clearfix">
                        <button
                            className="btn pull-right"
                            onClick={this.onPay.bind(this)}>
                            {this.isDistributionMode() ? 'Distribute' : 'Pay'} €{
                                totalPay
                            }
                        </button>
                    </div>
                ) : null}
            </div>
        );
    }
}

PaymentList.contextTypes = {
    router: PropTypes.object.isRequired,
};
