import React from 'react';
import connect from '../utils/connectors/MultiTaskPaymentConnector';

class MultiTaskPaymentContainer extends React.Component {
    renderChildren() {
        return React.Children.map(
            this.props.children,
            function(child) {
                return React.cloneElement(child, {
                    MultiTaskPayment: this.props.MultiTaskPayment,
                    MultiTaskPaymentActions: this.props.MultiTaskPaymentActions,
                });
            }.bind(this),
        );
    }

    render() {
        return <div>{this.renderChildren()}</div>;
    }
}

export default connect(MultiTaskPaymentContainer);
