import React from 'react';
import {Link} from 'react-router';

import EmailVisitorWidget from '../components/EmailVisitorWidget';

import connect from '../utils/connectors/AuthConnector';

class EmailLoginWidget extends React.Component {
    onEmailReceived(email) {
        const {AuthActions} = this.props;
        AuthActions.authenticateEmailVisitor({email});
    }

    render() {
        const {Auth, AuthActions} = this.props;

        return Auth.isEmailVisitor ? (
            <Link to="/people" className="btn btn-lg">
                <i className="fa fa-search" /> Browse developers
            </Link>
        ) : (
            <EmailVisitorWidget
                btnText="Browse Developers"
                onSubmit={this.onEmailReceived.bind(this)}
                disabled={AuthActions.isVerifying}
            />
        );
    }
}

export default connect(EmailLoginWidget);
