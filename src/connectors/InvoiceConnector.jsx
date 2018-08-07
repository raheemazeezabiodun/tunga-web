import {bindActionCreators} from "redux";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";

import * as InvoiceActions from "../actions/InvoiceActions";
import * as ProgressReportActions from "../actions/ProgressReportActions";

function mapStateToProps(state) {
    return {
        Invoice: state.Invoice
    };
}

function mapDispatchToProps(dispatch) {
    return {
        InvoiceActions: {
            ...bindActionCreators(InvoiceActions, dispatch),
            ...bindActionCreators(ProgressReportActions, dispatch),
        }
    };
}

export default function connectToStore(component) {
    return withRouter(connect(mapStateToProps, mapDispatchToProps)(component))
};
