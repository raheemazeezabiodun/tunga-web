import PropTypes from 'prop-types';
import React from 'react';

export default class EstimateDetailContainer extends React.Component {
    componentDidMount() {
        this.props.EstimateActions.retrieveEstimate(this.getEstimateId());
    }

    getEstimateId() {
        const {estimateId, params} = this.props;
        if (estimateId) {
            return estimateId;
        }
        if (params && params.estimateId) {
            return params.estimateId;
        }
        return null;
    }

    renderChildren() {
        const {Estimate} = this.props;

        return React.Children.map(
            this.props.children,
            function(child) {
                return React.cloneElement(child, {
                    Auth: this.props.Auth,
                    Estimate: this.props.Estimate,
                    EstimateActions: this.props.EstimateActions,
                    estimate: this.props.Estimate.detail.estimate,
                    isRetrieving: Estimate.detail.isRetrieving,
                    isSaving: Estimate.detail.isSaving,
                    isSaved: Estimate.detail.isSaved,
                    errors: Estimate.detail.error,
                    task: this.props.task,
                });
            }.bind(this),
        );
    }

    render() {
        return <div>{this.renderChildren()}</div>;
    }
}

EstimateDetailContainer.propTypes = {
    estimateId: PropTypes.number,
};

EstimateDetailContainer.defaultProps = {
    estimateId: null,
};
