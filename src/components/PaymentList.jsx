import React from 'react'
import { Link, IndexLink } from 'react-router'
import { Table } from 'react-bootstrap'
import moment from 'moment'
import Progress from './status/Progress'
import LoadMore from './status/LoadMore'

import { ENDPOINT_TASK } from '../constants/Api'

export default class PaymentList extends React.Component {

    componentDidMount() {
        var payment_status = this.props.params.filter || null;
        this.props.TaskActions.listTasks({payment_status, filter: 'payments'});
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.location.pathname != this.props.location.pathname) {
            var payment_status = this.props.params.filter || null;
            this.props.TaskActions.listTasks({payment_status, filter: 'payments'});
        }
    }

    render() {
        const { Auth, Task, TaskActions } = this.props;
        return (
            <div>
                <h2>Payments</h2>

                <ul className="nav nav-pills nav-top-filter">
                    <li role="presentation"><IndexLink to="/payments" activeClassName="active">All</IndexLink></li>
                    <li role="presentation"><Link to="/payments/pending" activeClassName="active">Pending</Link></li>
                    <li role="presentation"><Link to="/payments/processing" activeClassName="active">Processing</Link></li>
                    <li role="presentation"><Link to="/payments/paid" activeClassName="active">Paid</Link></li>
                </ul>
                {Task.list.isFetching?
                    (<Progress/>)
                    :
                    (<div>
                        {Task.list.ids.length?(
                            <Table>
                                <thead>
                                <tr>
                                    <th>Task</th>
                                    <th>Date</th>
                                    {Auth.user.is_developer?(
                                        [
                                            <th>Pledge</th>,
                                            <th>Payment fee</th>,
                                            <th>Tunga fee</th>,
                                            <th>To Receive</th>
                                        ]
                                    ):(
                                        [<th>Pledge</th>,<th>Invoice</th>]
                                    )}
                                    <th>Status</th>
                                </tr>
                                </thead>
                                <tbody>
                                {Task.list.ids.map((id) => {
                                    const task = Task.list.tasks[id];
                                    return(
                                        <tr>
                                            <td><Link to={`/task/${task.id}/`}>{task.title}</Link></td>
                                            <td>{moment.utc(task.invoice_date || task.closed_at).local().format('Do, MMMM YYYY')}</td>
                                            {Auth.user.is_developer?(
                                                [
                                                    <td>{task.amount.currency}{task.amount.pledge}</td>,
                                                    <td>{task.amount.currency}{task.amount.processing}</td>,
                                                    <td>{task.amount.currency}{task.amount.tunga}</td>,
                                                    <td>{task.amount.currency}{task.amount.developer}</td>
                                                ]
                                            ):(
                                                [<td>{task.display_fee}</td>,<td>{task.invoice_number?(
                                                    <a href={`${ENDPOINT_TASK}${task.id}/download/invoice/?format=pdf`} target="_blank">{task.invoice_number}</a>
                                                ):null}</td>]
                                            )}
                                            <td>{task.payment_status}</td>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </Table>
                        ):(
                        <div className="alert alert-info">No payments to display</div>
                            )}
                        <LoadMore url={Task.list.next} callback={TaskActions.listMoreTasks} loading={Task.list.isFetchingMore}/>
                    </div>)
                    }
            </div>
        );
    }
}
