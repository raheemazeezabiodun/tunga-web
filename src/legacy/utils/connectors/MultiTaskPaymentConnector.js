import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as MultiTaskPaymentActions from '../../actions/MultiTaskPaymentActions';

function mapStateToProps(state) {
    return {Auth: state.Auth, MultiTaskPayment: state.MultiTaskPayment};
}

function mapDispatchToProps(dispatch) {
    return {
        MultiTaskPaymentActions: bindActionCreators(
            MultiTaskPaymentActions,
            dispatch,
        ),
    };
}

export default function connectToMultiTaskPayments(component) {
    return connect(mapStateToProps, mapDispatchToProps)(component);
}
