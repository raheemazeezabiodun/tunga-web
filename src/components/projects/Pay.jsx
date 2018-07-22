import PropTypes from 'prop-types';
import React from 'react';
import {Table} from 'react-bootstrap';
import moment from 'moment';

import Button from "../core/Button";
import Icon from "../core/Icon";
import InvoiceForm from "./modals/InvoiceForm";
import IconButton from "../core/IconButton";
import StripeButton from "../core/StripeButton";
import Progress from "../core/Progress";

import {isAdmin, isAdminOrPM, isClient, isDev, isDevOrClient, getUser} from "../utils/auth";
import {openConfirm, openModal} from "../core/utils/modals";
import {ENDPOINT_INVOICES, INVOICE_TYPE_PURCHASE, INVOICE_TYPE_SALE} from "../../actions/utils/api";
import {batchInvoices, sumInvoices, filterInvoices} from "../utils/payments";
import {parsePaymentObject} from "../utils/stripe";

export default class Pay extends React.Component {
    static propTypes = {
        project: PropTypes.object,
        invoices: PropTypes.array,
        InvoiceActions: PropTypes.object,
        selectionKey: PropTypes.string
    };

    constructor(props) {
        super(props);
        this.state = {open: null};
    }

    onCreateInvoice(type) {
        const {project, InvoiceActions} = this.props;
        openModal(<InvoiceForm
            invoice={{type}}/>, `Add ${type === INVOICE_TYPE_SALE ? 'Payment' : 'Payout'}`).then(data => {
            if (data.type === INVOICE_TYPE_SALE) {
                InvoiceActions.createInvoice(
                    {
                        ...data,
                        user: {id: project.owner ? project.owner.id : project.user.id},
                        project: {id: project.id}
                    },
                    this.props.selectionKey
                );
            } else {
                let cleanData = [], invoice = data.invoice, payouts = data.payouts;
                if (payouts && invoice) {
                    Object.keys(payouts).forEach(idx => {
                        let payout = payouts[idx];
                        if (payout.user && payout.amount) {
                            cleanData.push({
                                ...invoice,
                                amount: payout.amount,
                                user: {id: payout.user.id},
                                project: {id: project.id}
                            });
                        }
                    });
                }
                if (cleanData.length) {
                    InvoiceActions.createInvoiceBatch(
                        cleanData,
                        this.props.selectionKey
                    );
                }
            }
        }, error => {

        });
    }

    onUpdateInvoice(invoice) {
        this.onToggleActions(invoice.id);
        let cleanInvoice = {};
        ['id', 'type', 'title', 'due_at', 'amount'].forEach(key => {
            cleanInvoice[key] = invoice[key];
        });
        const {InvoiceActions} = this.props;
        openModal(<InvoiceForm
            invoice={cleanInvoice}/>, `Edit ${invoice.type === INVOICE_TYPE_SALE ? 'Payment' : 'Payout'}`).then(data => {
            if (invoice.type === INVOICE_TYPE_SALE) {
                InvoiceActions.updateInvoice(
                    invoice.id,
                    data,
                    this.props.selectionKey
                );
            }
        }, error => {

        });
    }

    onDeleteInvoice(invoiceId) {
        this.onToggleActions(invoiceId);
        const {InvoiceActions} = this.props;
        openConfirm(
            'Are you sure you want to delete this invoice?', '',
            true, {ok: 'Yes'}
        ).then(response => {
            InvoiceActions.deleteInvoice(invoiceId, this.props.selectionKey);
        }, error => {
            // Nothing
        });
    }

    onMarkPaid(invoiceId) {
        this.onToggleActions(invoiceId);
        const {InvoiceActions} = this.props;
        openConfirm(
            'Are you sure you want to mark this invoice as paid?', '',
            true, {ok: 'Yes'}
        ).then(response => {
            InvoiceActions.updateInvoice(invoiceId, {paid: true}, this.props.selectionKey);
        }, error => {
            // Nothing
        });
    }

    onUpdateInvoiceBatch(ref, invoices) {
        this.onToggleActions(ref);
        let invoice = invoices[0];
        let cleanInvoice = {};
        ['type', 'title', 'due_at'].forEach(key => {
            cleanInvoice[key] = invoice[key];
        });

        let payouts = {};
        invoices.forEach((item, idx) => {
            payouts[idx] = {id: item.id, user: item.user, amount: item.amount};
        });
        const {project, InvoiceActions} = this.props;
        openModal(<InvoiceForm invoice={cleanInvoice}
                               payouts={payouts}/>, `Edit ${invoice.type === INVOICE_TYPE_SALE ? 'Payment' : 'Payout'}`).then(data => {
            if (invoice.type === INVOICE_TYPE_PURCHASE) {
                let cleanData = [],
                    invoice = data.invoice,
                    payouts = data.payouts;

                if (payouts && invoice) {
                    Object.keys(payouts).forEach(idx => {
                        let payout = payouts[idx];
                        if (payout.user && payout.amount) {
                            let payObj = {
                                ...invoice,
                                amount: payout.amount,
                                user: {id: payout.user.id},
                                project: {id: project.id}
                            };
                            if (payout.id) {
                                payObj.id = payout.id;
                            }
                            payObj.batch_ref = ref;
                            cleanData.push(payObj);
                        }
                    });
                }

                let retainedIds = [];
                if (cleanData.length) {
                    cleanData.forEach(item => {
                        if (item.id) {
                            retainedIds.push(item.id);
                            InvoiceActions.updateInvoice(
                                item.id,
                                item,
                                this.props.selectionKey
                            );
                        } else {
                            InvoiceActions.createInvoice(
                                item,
                                this.props.selectionKey
                            );
                        }
                    });
                }

                invoices.forEach(item => {
                    if (!retainedIds.includes(item.id)) {
                        InvoiceActions.deleteInvoice(item.id, this.props.selectionKey);
                    }
                });
            }
        }, error => {

        });
    }

    onDeleteInvoiceBatch(ref, invoices) {
        this.onToggleActions(ref);
        const {InvoiceActions} = this.props;
        openConfirm(
            'Are you sure you want to delete this payout?', '',
            true, {ok: 'Yes'}
        ).then(response => {
            invoices.forEach(invoice => {
                InvoiceActions.deleteInvoice(invoice.id, this.props.selectionKey);
            });
        }, error => {
            // Nothing
        });
    }

    onApprovePayout(ref, invoices) {
        this.onToggleActions(ref);
        const {InvoiceActions} = this.props;
        openConfirm(
            'Are you sure you want to approve this payout?', '',
            true, {ok: 'Yes'}
        ).then(response => {
            invoices.forEach(invoice => {
                InvoiceActions.updateInvoice(invoice.id, {status: 'approved'}, this.props.selectionKey);
            });
        }, error => {
            // Nothing
        });
    }

    onToggleActions(invoiceId) {
        this.setState({open: this.state.open === invoiceId ? null : invoiceId});
    }

    onPay(invoice, token) {
        const {InvoiceActions} = this.props;
        InvoiceActions.payInvoice(invoice.id, parsePaymentObject(invoice, token), this.props.selectionKey);
    }

    render() {
        const {project, invoices, isSaving} = this.props,
            payments = filterInvoices(invoices, INVOICE_TYPE_SALE),
            payouts = filterInvoices(invoices, INVOICE_TYPE_PURCHASE);

        let batchPayouts = batchInvoices(payouts);

        return (
            <div className="project-payments">
                {invoices.length === 0 && isDevOrClient() && !isAdmin() ? (
                    <div className="font-weight-normal">No payment planning yet.</div>
                ) : (
                    <div>
                        {isDev() ? null : (
                            <div className="section">
                                <div className="section-title">Payments</div>

                                {isAdminOrPM() && !project.archived ? (
                                    <div  className="section-action">
                                        <Button size="sm"
                                                onClick={this.onCreateInvoice.bind(this, INVOICE_TYPE_SALE)}>
                                            <Icon name="add"/> Add payment
                                        </Button>
                                    </div>
                                ) : null}

                                <div className="payment-list">
                                    <Table striped>
                                        <thead>
                                        <tr>
                                            <th>Title</th>
                                            <th>Date</th>
                                            <th>Invoice</th>
                                            <th>Amount</th>
                                            <th/>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {payments.map(invoice => {
                                            return (
                                                <tr key={invoice.id}>
                                                    <td>{invoice.title}</td>
                                                    <td>{moment.utc(invoice.due_at).format('DD/MMM/YYYY')}</td>
                                                    <td>
                                                        <a href={`${ENDPOINT_INVOICES}${invoice.id}/download/?format=pdf`} target="_blank">
                                                            {invoice.number}
                                                        </a>
                                                    </td>
                                                    <td>
                                                        €{invoice.amount}
                                                    </td>
                                                    <td>
                                                        {invoice.paid?(
                                                            <div>
                                                                <Icon name="check" className="green"/> Paid
                                                            </div>
                                                        ):isSaving[invoice.id]?(
                                                            <div>
                                                                <Progress message="Processing"/>
                                                            </div>
                                                        ):(
                                                            <div className="clearfix">
                                                                {isClient()?(
                                                                    <StripeButton size="sm"
                                                                                  amount={invoice.amount}
                                                                                  email={getUser().email}
                                                                                  description={invoice.title}
                                                                                  onPay={this.onPay.bind(this, invoice)}/>
                                                                ):null}
                                                                {isAdminOrPM() && !project.archived ? (
                                                                    <div className="float-right">
                                                                        <div className="actions">
                                                                            <IconButton name="colon" size={null}
                                                                                        onClick={this.onToggleActions.bind(this, invoice.id)}/>
                                                                            {this.state.open === invoice.id ? (
                                                                                <div className="dropper">
                                                                                    <Button size="sm"
                                                                                            onClick={this.onUpdateInvoice.bind(this, invoice)}>
                                                                                        Edit payment
                                                                                    </Button>
                                                                                    <Button size="sm"
                                                                                            onClick={this.onDeleteInvoice.bind(this, invoice.id)}>
                                                                                        Delete payment
                                                                                    </Button>
                                                                                    {isAdmin() && !invoice.paid ? (
                                                                                        <Button size="sm"
                                                                                                onClick={this.onMarkPaid.bind(this, invoice.id)}>
                                                                                            Mark as paid
                                                                                        </Button>
                                                                                    ) : null}
                                                                                </div>
                                                                            ) : null}
                                                                        </div>
                                                                    </div>
                                                                ) : null}
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                        </tbody>
                                        {payments.length ? (
                                            <thead className="payment-footer">
                                                <tr>
                                                    <td >Total</td>
                                                    <td/>
                                                    <td/>
                                                    <td>€{sumInvoices(payments)}</td>
                                                    <td/>
                                                </tr>
                                            </thead>
                                        ) : null}
                                    </Table>
                                </div>
                            </div>
                        )}

                        {isClient() && !isAdmin() ? null : (
                            <div className="section">
                                <div className="section-title">Payouts</div>
                                {isAdminOrPM() && !project.archived ? (
                                    <div className="section-action">
                                        <Button size="sm"
                                                onClick={this.onCreateInvoice.bind(this, INVOICE_TYPE_PURCHASE)}>
                                            <Icon name="add"/> Add payout
                                        </Button>
                                    </div>
                                ) : null}

                                <div className="payment-list">
                                    <Table striped>
                                        <thead>
                                        <tr>
                                            <th>Title</th>
                                            <th>Date</th>
                                            <th>Developer</th>
                                            <th>Invoice</th>
                                            <th>Amount</th>
                                            <th/>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {batchPayouts.map(batch => {
                                            return (
                                                <tr key={batch.id}>
                                                    <td>{batch.title}</td>
                                                    <td>
                                                        {batch.invoices.map(item => {
                                                            return (
                                                                <div key={item.id}>{moment.utc(item.due_at).format('DD/MMM/YYYY')}</div>
                                                            );
                                                        })}
                                                    </td>
                                                    <td>
                                                        {batch.invoices.map(item => {
                                                            return (
                                                                <div key={item.id}>{item.user.display_name}</div>
                                                            );
                                                        })}
                                                    </td>
                                                    <td>
                                                        {batch.invoices.map(item => {
                                                            return (
                                                                <div key={item.id}>
                                                                    <a href={`${ENDPOINT_INVOICES}${item.id}/download/?format=pdf`} target="_blank">
                                                                        {item.number}
                                                                    </a>
                                                                </div>
                                                            );
                                                        })}
                                                    </td>
                                                    <td>
                                                        {batch.invoices.map(item => {
                                                            return (
                                                                <div key={item.id}>€{item.amount}</div>
                                                            );
                                                        })}
                                                        <div className="subtotal">€{batch.amount}</div>
                                                    </td>
                                                    <td>
                                                        {isAdminOrPM() && !project.archived && !batch.paid && batch.status !== 'approved'? (
                                                            <div className="actions text-right">
                                                                <IconButton name="colon" size={null}
                                                                            onClick={this.onToggleActions.bind(this, batch.ref)}/>
                                                                {this.state.open === batch.ref ? (
                                                                    <div className="dropper">
                                                                        <Button size="sm"
                                                                                onClick={this.onUpdateInvoiceBatch.bind(this, batch.ref, batch.invoices)}>
                                                                            Edit payout
                                                                        </Button>
                                                                        <Button size="sm"
                                                                                onClick={this.onDeleteInvoiceBatch.bind(this, batch.ref, batch.invoices)}>
                                                                            Delete payout
                                                                        </Button>
                                                                        {isAdmin() && !batch.paid ? (
                                                                            <Button size="sm"
                                                                                    onClick={this.onApprovePayout.bind(this, batch.ref, batch.invoices)}>
                                                                                Approve payout
                                                                            </Button>
                                                                        ) : null}
                                                                    </div>
                                                                ) : null}
                                                            </div>
                                                        ) : batch.paid?(
                                                            <div>
                                                                <Icon name="check" className="green"/> Paid
                                                            </div>
                                                        ): batch.status === 'approved'?(
                                                            <div>Processing</div>
                                                        ):null}
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                        </tbody>
                                        {batchPayouts.length ? (
                                            <thead className="payment-footer">
                                                <tr>
                                                    <th>Total</th>
                                                    <th/>
                                                    <th/>
                                                    <th/>
                                                    <th>€{sumInvoices(batchPayouts)}</th>
                                                    <th/>
                                                </tr>
                                            </thead>
                                        ) : null}
                                    </Table>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }
}
