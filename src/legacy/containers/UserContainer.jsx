import React from 'react';
import connect from '../utils/connectors/UserConnector';

class UserContainer extends React.Component {
    renderChildren() {
        return React.Children.map(
            this.props.children,
            function(child) {
                return React.cloneElement(child, {
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

export default connect(UserContainer);
