import React from 'react';
import {Link} from 'react-router-dom';
import {Table} from 'reactstrap';
import moment from 'moment';

import Button from "../core/Button";
import {openConfirm} from "../core/utils/modals";
import {isAdmin} from "../utils/auth";
import {batchInvoices} from "../utils/payments";

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

    onApprovePayout(invoices) {
        const { InvoiceActions } = this.props;
        openConfirm(
            'Are you sure you want to approve this payout?', '',
            true, {ok: 'Yes'}
        ).then(response => {
            invoices.forEach(invoice => {
                InvoiceActions.updateInvoice(invoice.id, {paid: true}, this.props.selectionKey);
            });
        }, error => {
            // Nothing
        });
    }

    render() {
        const {filter, invoices} = this.props;

        let invoiceList = invoices;

        if([PENDING_OUT, PAID_OUT].includes(filter)) {
            invoiceList = batchInvoices(invoices);
        }

        return (
            <div className="content-card payments-list-card">
                {invoiceList.length?(
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
                        {invoiceList.map(invoice => {
                            const owner = invoice.project.owner || invoice.project.user;
                            return (
                                <tr key={invoice.id}>
                                    <td>{owner.company?owner.company.name:'' || owner.display_name}</td>
                                    <td><Link to={`/projects/${invoice.project.id}/pay`}>{invoice.project.title}</Link></td>
                                    <td>{invoice.title}</td>
                                    {[PENDING_OUT, PAID_OUT].includes(filter)?(
                                        <td>{invoice.invoices.map(item => {
                                            return (
                                                <div>{item.user.display_name}</div>
                                            );
                                        })}</td>
                                    ):null}
                                    <td>{[PENDING_OUT, PAID_OUT].includes(filter)?(
                                        invoice.invoices.map(item => {
                                            return (
                                                <div>{item.number}</div>
                                            );
                                        })
                                    ):(
                                        invoice.number
                                    )}</td>
                                    {[PENDING_IN, PAID_IN].includes(filter)?(
                                        <td>€{invoice.amount}</td>
                                    ):null}
                                    <td>
                                        {[PENDING_OUT, PAID_OUT].includes(filter)?(
                                            <div>
                                                {invoice.invoices.map(item => {
                                                    return (
                                                        <div>€{item.amount}</div>
                                                    );
                                                })}
                                                <div className="font-weight-normal">Subtotal: €{invoice.amount}</div>
                                            </div>
                                        ):null}
                                    </td>
                                    {filter === PENDING_IN?(
                                        <React.Fragment>
                                            <td>{moment.utc(invoice.due_at).format('DD/MMM/YYYY')}</td>
                                            <td>{moment.utc(invoice.due_at).add('days', 14).format('DD/MMM/YYYY')}</td>
                                            <td>
                                                {isAdmin() && !invoice.paid && !invoice.project.archived?(
                                                    <Button size="sm"
                                                            onClick={this.onMarkPaid.bind(this, invoice.id)}>
                                                        Mark as paid
                                                    </Button>
                                                ):null}
                                            </td>
                                        </React.Fragment>
                                    ):null}
                                    {filter === PAID_IN?(
                                        <td>{moment.utc(invoice.paid_at).format('DD/MMM/YYYY')}</td>
                                    ):null}
                                    {filter === PENDING_OUT?(
                                        <React.Fragment>
                                            <td>{invoice.invoices.map(item => {
                                                return (
                                                    <div>{moment.utc(item.due_at).format('DD/MMM/YYYY')}</div>
                                                );
                                            })}</td>
                                            <td>
                                                {isAdmin() && !invoice.paid && !invoice.project.archived?(
                                                    <Button size="sm"
                                                            onClick={this.onApprovePayout.bind(this, invoice.invoices)}>
                                                        Approve payout
                                                    </Button>
                                                ):null}
                                            </td>
                                        </React.Fragment>
                                    ):null}
                                    {filter === PAID_OUT?(
                                        <td>{invoice.invoices.map(item => {
                                            return (
                                                <div>{moment.utc(item.paid_at).format('DD/MMM/YYYY')}</div>
                                            );
                                        })}</td>
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
