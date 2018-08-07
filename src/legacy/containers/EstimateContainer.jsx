import React from 'react';
import connect from '../utils/connectors/EstimateConnector';

class EstimateContainer extends React.Component {
    renderChildren() {
        return React.Children.map(
            this.props.children,
            function(child) {
                return React.cloneElement(child, {
                    Estimate: this.props.Estimate,
                    EstimateActions: this.props.EstimateActions,
                    task: this.props.task,
                });
            }.bind(this),
        );
    }

    render() {
        return <div>{this.renderChildren()}</div>;
    }
}

export default connect(EstimateContainer);
