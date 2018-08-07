import PropTypes from 'prop-types';
import React from 'react';

export default class MultiTaskPaymentDetailContainer extends React.Component {
    componentDidMount() {
        this.props.MultiTaskPaymentActions.retrieveMultiTaskPayment(
            this.getMultiTaskPaymentId(),
        );
    }

    getMultiTaskPaymentId() {
        const {batchId, params} = this.props;
        if (batchId) {
            return batchId;
        }
        if (params && params.batchId) {
            return params.batchId;
        }
        return null;
    }

    renderChildren() {
        const {MultiTaskPayment} = this.props;

        return React.Children.map(
            this.props.children,
            function(child) {
                return React.cloneElement(child, {
                    Auth: this.props.Auth,
                    MultiTaskPayment: this.props.MultiTaskPayment,
                    MultiTaskPaymentActions: this.props.MultiTaskPaymentActions,
                    multi_task_payment: this.props.MultiTaskPayment.detail
                        .multi_task_payment,
                    isRetrieving: MultiTaskPayment.detail.isRetrieving,
                    isSaving: MultiTaskPayment.detail.isSaving,
                    isSaved: MultiTaskPayment.detail.isSaved,
                    errors: MultiTaskPayment.detail.error,
                });
            }.bind(this),
        );
    }

    render() {
        const {MultiTaskPayment} = this.props;

        return (
            <div>
                {MultiTaskPayment.detail.isRetrieving
                    ? null
                    : this.renderChildren()}
            </div>
        );
    }
}

MultiTaskPaymentDetailContainer.propTypes = {
    multiTaskPaymentId: PropTypes.number,
};

MultiTaskPaymentDetailContainer.defaultProps = {
    multiTaskPaymentId: null,
};
