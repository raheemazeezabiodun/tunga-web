import React from 'react';
import connect from '../utils/connectors/UserConnector';

class UserPage extends React.Component {
    renderChildren() {
        return React.Children.map(
            this.props.children,
            function(child) {
                return React.cloneElement(child, {
                    Auth: this.props.Auth,
                    User: this.props.User,
                    UserActions: this.props.UserActions,
                });
            }.bind(this),
        );
    }

    render() {
        return <div>{this.renderChildren()}</div>;
    }
}

export default connect(UserPage);
