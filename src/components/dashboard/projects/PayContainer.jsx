import PropTypes from 'prop-types';
import React from 'react';
import { Switch, Route } from 'react-router-dom';

import InvoiceListContainer from "../dashboard/payments/InvoiceListContainer";
import Pay from "./Pay";

import connect from "../../connectors/InvoiceConnector";

class PayContainer extends React.Component {
    static propTypes = {
        project: PropTypes.object,
        match: PropTypes.object,
    };

    render() {
        const {project, match, Invoice, InvoiceActions} = this.props;
        return (
            <React.Fragment>
                <Switch>
                    <Route path={match.url}
                           exact
                           render={props => <InvoiceListContainer {...props}
                                                                  filters={{project: project.id}}
                                                                  Invoice={Invoice}
                                                                  InvoiceActions={InvoiceActions}>
                               <Pay project={project} {...props}/>
                           </InvoiceListContainer>}
                    />
                </Switch>
            </React.Fragment>
        );
    }
}

export default connect(PayContainer);
