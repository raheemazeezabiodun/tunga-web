import PropTypes from 'prop-types';
import React from 'react';
import {Row, Col} from 'react-bootstrap';
import moment from 'moment';

import Button from "../core/Button";
import InvoiceForm from "./modals/InvoiceForm";

import {isAdmin, isAdminOrPM, isClient, isDev, isDevOrClient} from "../utils/auth";
import {openConfirm, openModal} from "../core/utils/modals";
import {INVOICE_TYPE_PURCHASE, INVOICE_TYPE_SALE} from "../../actions/utils/api";
import IconButton from "../core/IconButton";

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

    filterInvoices(invoices, type) {
        return invoices.filter(invoice => invoice.type === type)
    }

    sumInvoices(invoices) {
        return invoices.map(invoice => {
            return invoice.amount || 0;
        }).reduce((total, number) => {
            return total + Math.round(number);
        }, 0);
    }

    onCreateInvoice(type) {
        const { project, InvoiceActions } = this.props;
        openModal(<InvoiceForm invoice={{type}}/>, `Add ${type === INVOICE_TYPE_SALE?'Payment':'Payout'}`).then(invoice => {
            if(invoice.type === INVOICE_TYPE_SALE) {
                InvoiceActions.createInvoice(
                    {...invoice, user: {id: project.owner?project.owner.id:project.user.id}, project: {id: project.id}},
                    this.props.selectionKey
                );
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
        const { InvoiceActions } = this.props;
        openModal(<InvoiceForm invoice={cleanInvoice}/>, `Add ${invoice.type === INVOICE_TYPE_SALE?'Payment':'Payout'}`).then(data => {
            if(invoice.type === INVOICE_TYPE_SALE) {
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
        const { InvoiceActions } = this.props;
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

    onToggleActions(invoiceId) {
        this.setState({open: this.state.open === invoiceId?null:invoiceId});
    }

    render() {
        const {project, invoices} = this.props;
        const payments = this.filterInvoices(invoices, INVOICE_TYPE_SALE);

        return (
            <div className="project-payments">
                {invoices.length === 0 && isDevOrClient() && !isAdmin()?(
                    <div className="font-weight-normal">No payment planning yet.</div>
                ):(
                    <div>
                        {isDev()?null:(
                            <div className="section">
                                <div className="clearfix">
                                    {isAdminOrPM()?(
                                        <div className="float-right">
                                            <Button onClick={this.onCreateInvoice.bind(this, INVOICE_TYPE_SALE)}>Add payment</Button>
                                        </div>
                                    ):null}
                                    <div className="float-left">
                                        <div className="font-weight-normal">Payments</div>
                                    </div>
                                </div>

                                <div className="payment-list">
                                    {payments.map(invoice => {
                                        return (
                                            <Row>
                                                <Col sm="6">{invoice.title}</Col>
                                                <Col sm="3">{moment.utc(invoice.due_at).format('DD/MMM/YYYY')}</Col>
                                                <Col sm="3">
                                                    EUR {invoice.amount}
                                                    {isAdminOrPM()?(
                                                        <React.Fragment>
                                                            <div className="actions float-right">
                                                                <IconButton name="colon" size={null} onClick={this.onToggleActions.bind(this, invoice.id)}/>
                                                                {this.state.open === invoice.id?(
                                                                    <div className="dropper">
                                                                        <Button size="sm"
                                                                                onClick={this.onUpdateInvoice.bind(this, invoice)}>
                                                                            Edit payment
                                                                        </Button>
                                                                        <Button size="sm"
                                                                                onClick={this.onDeleteInvoice.bind(this, invoice.id)}>
                                                                            Delete payment
                                                                        </Button>
                                                                        {isAdmin() && !invoice.paid?(
                                                                            <Button size="sm"
                                                                                    onClick={this.onMarkPaid.bind(this, invoice.id)}>
                                                                                Mark as paid
                                                                            </Button>
                                                                        ):null}
                                                                    </div>
                                                                ):null}
                                                            </div>
                                                        </React.Fragment>
                                                    ):null}
                                                </Col>
                                            </Row>
                                        )
                                    })}
                                    {payments.length?(
                                        <Row className="payment-footer">
                                            <Col sm="6">Total</Col>
                                            <Col sm="3"/>
                                            <Col sm="3">EUR {this.sumInvoices(payments)}</Col>
                                        </Row>
                                    ):null}
                                </div>
                            </div>
                        )}

                        {isClient() && !isAdmin()?null:(
                            <div className="section">
                                <div className="clearfix">
                                    {isAdminOrPM()?(
                                        <div className="float-right">
                                            <Button onClick={this.onCreateInvoice.bind(this, INVOICE_TYPE_PURCHASE)}>Add payout</Button>
                                        </div>
                                    ):null}
                                    <div className="float-left">
                                        <div className="font-weight-normal">Payouts</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }
}
