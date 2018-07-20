import React from 'react';
import {Link} from 'react-router-dom';
import {Table} from 'reactstrap';
import moment from 'moment';

import Button from "../core/Button";
import {openConfirm} from "../core/utils/modals";
import {isAdmin} from "../utils/auth";

const PAID_IN = 'paid-in';
const PENDING_IN = 'pending-in';
const PAID_OUT = 'paid-out';
const PENDING_OUT = 'pending-out';

export default class PaymentList extends React.Component {

    onMarkPaid(invoiceId) {
        const { InvoiceActions } = this.props;
        openConfirm(
            'Are you sure you want to mark this invoice as paid?', '',
            true, {ok: 'Yes'}
        ).then(response => {
            InvoiceActions.updateInvoice(invoiceId, {paid: true}, this.props.selectionKey);
        }, error => {
            // Nothing
        });
    }

    render() {
        const {filter, invoices} = this.props;

        return (
            <div className="content-card payments-list-card">
                {invoices.length?(
                    <Table striped>
                        <thead>
                        <tr>
                            <th>Client</th>
                            <th>Project</th>
                            <th>Invoice</th>
                            {[PENDING_OUT, PAID_OUT].includes(filter)?(
                                <th>Developer</th>
                            ):null}
                            <th>Invoice Number</th>
                            {[PENDING_IN, PAID_IN].includes(filter)?(
                                <th>Sum</th>
                            ):null}
                            <th>Payout</th>
                            {filter === PENDING_IN?(
                                <React.Fragment>
                                    <th>Invoice Date</th>
                                    <th>Due Date</th>
                                    <th>Status</th>
                                </React.Fragment>
                            ):null}
                            {filter === PAID_IN?(
                                <th>Payment Date</th>
                            ):null}
                            {filter === PENDING_OUT?(
                                <React.Fragment>
                                    <th>Payout Date</th>
                                    <th></th>
                                </React.Fragment>
                            ):null}
                            {filter === PAID_OUT?(
                                <th>Payment Date</th>
                            ):null}
                        </tr>
                        </thead>
                        <tbody>
                        {invoices.map(invoice => {
                            const owner = invoice.project.owner || invoice.project.user;
                            return (
                                <tr key={invoice.id}>
                                    <td>{owner.company?owner.company.name:'' || owner.display_name}</td>
                                    <td><Link to={`/projects/${invoice.project.id}/pay`}>{invoice.project.title}</Link></td>
                                    <td>{invoice.title}</td>
                                    {[PENDING_OUT, PAID_OUT].includes(filter)?(
                                        <td>Developer</td>
                                    ):null}
                                    <td>{invoice.number}</td>
                                    {[PENDING_IN, PAID_IN].includes(filter)?(
                                        <td>€{invoice.amount}</td>
                                    ):null}
                                    <td>{/*Payout*/}</td>
                                    {filter === PENDING_IN?(
                                        <React.Fragment>
                                            <td>{moment.utc(invoice.due_at).format('DD/MMM/YYYY')}</td>
                                            <td>{moment.utc(invoice.due_at).add('days', 14).format('DD/MMM/YYYY')}</td>
                                            <td>
                                                {isAdmin() && !invoice.paid?(
                                                    <Button size="sm"
                                                            onClick={this.onMarkPaid.bind(this, invoice.id)}>Mark as paid</Button>
                                                ):null}
                                            </td>
                                        </React.Fragment>
                                    ):null}
                                    {filter === PAID_IN?(
                                        <td>{moment.utc(invoice.paid_at).format('DD/MMM/YYYY')}</td>
                                    ):null}
                                    {filter === PENDING_OUT?(
                                        <React.Fragment>
                                            <td>Payout Date</td>
                                            <td/>
                                        </React.Fragment>
                                    ):null}
                                    {filter === PAID_OUT?(
                                        <td>Payment Date</td>
                                    ):null}
                                </tr>
                            );
                        })}
                        </tbody>
                    </Table>
                ):(
                    <div className="empty-list">You have no payments yet.</div>
                )}
            </div>
        );
    }
}
