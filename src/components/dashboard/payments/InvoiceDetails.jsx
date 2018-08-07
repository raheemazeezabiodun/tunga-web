import React from 'react';
import PropTypes from "prop-types";
import {Table} from 'reactstrap';

import Icon from "../../core/Icon";

import {ENDPOINT_INVOICES} from "../../../actions/utils/api";

export default class InvoiceDetails extends React.Component {
    static propTypes = {
        invoice: PropTypes.object,
    };

    onDownload = (e) => {
        const {proceed} = this.props;
        if(proceed) {
            proceed();
        }
    };

    render() {
        const {invoice} = this.props;

        return (
            <div className="invoice-details">
                <Table striped>
                    <thead>
                    <tr>
                        <th colspan="2">Payment breakdown</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>{invoice.title}</td>
                        <td>€{invoice.amount}</td>
                    </tr>
                    {Math.round(invoice.processing_fee)?(
                        <tr>
                            <td>Processing fee</td>
                            <td>€{invoice.processing_fee}</td>
                        </tr>
                    ):null}
                    <tr>
                        <td>Subtotal</td>
                        <td>€{invoice.subtotal}</td>
                    </tr>
                    <tr>
                        <td>VAT {Math.round(invoice.tax_rate) || 0}%</td>
                        <td>€{invoice.tax_amount}</td>
                    </tr>
                    </tbody>
                    <thead>
                    <tr>
                        <th>Total</th>
                        <th>€{invoice.total_amount}</th>
                    </tr>
                    </thead>
                </Table>

                <a href={`${ENDPOINT_INVOICES}${invoice.id}/download/?format=pdf`}
                   target="_blank"
                   className="btn btn-primary" onClick={this.onDownload}>
                    <Icon name="download"/> Download invoice
                </a>
            </div>
        );
    }
}
