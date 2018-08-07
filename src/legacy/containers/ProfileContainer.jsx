import React from 'react';
import connect from '../utils/connectors/ProfileConnector';

class ProfileContainer extends React.Component {
    renderChildren() {
        return React.Children.map(
            this.props.children,
            function(child) {
                return React.cloneElement(child, {
                    Auth: this.props.Auth,
                    Profile: this.props.Profile,
                    ProfileActions: this.props.ProfileActions,
                });
            }.bind(this),
        );
    }

    render() {
        return <div>{this.renderChildren()}</div>;
    }
}

export default connect(ProfileContainer);
