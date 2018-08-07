import React from 'react';
import connect from '../utils/connectors/SupportConnector';

class SupportPage extends React.Component {
    renderChildren() {
        return React.Children.map(
            this.props.children,
            function(child) {
                return React.cloneElement(child, {
                    Support: this.props.Support,
                    SupportActions: this.props.SupportActions,
                });
            }.bind(this),
        );
    }

    render() {
        return <div>{this.renderChildren()}</div>;
    }
}

export default connect(SupportPage);
