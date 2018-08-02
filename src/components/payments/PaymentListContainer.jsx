import PropTypes from 'prop-types';
import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import InvoiceListContainer from "../payments/InvoiceListContainer";
import PaymentList from "./PaymentList";

import connect from "../../connectors/InvoiceConnector";
import {INVOICE_TYPE_PURCHASE, INVOICE_TYPE_SALE} from "../../actions/utils/api";
import {isDev} from "../utils/auth";

class PaymentListContainer extends React.Component {
    static propTypes = {
        project: PropTypes.object,
        match: PropTypes.object,
    };

    render() {
        const {project, match, Invoice, InvoiceActions} = this.props;
        return (
            <React.Fragment>
                <Switch>
                    <Route path={`${match.url}/filter/:filter`}
                           exact
                           render={props => <InvoiceListContainer {...props}
                                                                  filters={{
                                                                      paid: ['paid-in', 'paid-out'].includes(props.match.params.filter)?'True':'False',
                                                                      type: ['paid-in', 'pending-in'].includes(props.match.params.filter)?INVOICE_TYPE_SALE:INVOICE_TYPE_PURCHASE
                                                                  }}
                                                                  Invoice={Invoice}
                                                                  InvoiceActions={InvoiceActions}>
                               <PaymentList project={project} {...props} filter={props.match.params.filter}/>
                           </InvoiceListContainer>}
                    />
                    <Redirect from="*" to={`${match.url}/filter/${isDev()?'pending-out':'pending-in'}`}/>
                </Switch>
            </React.Fragment>
        );
    }
}

export default connect(PaymentListContainer);
