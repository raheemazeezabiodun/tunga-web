import React from 'react';
import connect from '../utils/connectors/QuoteConnector';

class QuoteContainer extends React.Component {
    renderChildren() {
        return React.Children.map(
            this.props.children,
            function(child) {
                return React.cloneElement(child, {
                    Quote: this.props.Quote,
                    QuoteActions: this.props.QuoteActions,
                    task: this.props.task,
                });
            }.bind(this),
        );
    }

    render() {
        return <div>{this.renderChildren()}</div>;
    }
}

export default connect(QuoteContainer);
