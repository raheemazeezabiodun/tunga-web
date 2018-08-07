import React from 'react';
import {Link} from 'react-router';
import Helmet from 'react-helmet';

import ShowcaseContainer from './ShowcaseContainer';

class AccountType extends React.Component {
    renderHeaderContent() {
        return (
            <div className="account-choices">
                <h2 className="crt-acc-heading">
                    How do you want to use Tunga?
                </h2>
                <Link to="/signup/project-owner" className="btn">
                    I am looking for developers
                </Link>
                <br />
                <Link to="/signup/developer" className="btn">
                    I'm an African developer looking for work
                </Link>
            </div>
        );
    }

    render() {
        return (
            <ShowcaseContainer
                className="auth-page"
                headerContent={this.renderHeaderContent()}>
                <Helmet title="Tunga | Sign Up" />
            </ShowcaseContainer>
        );
    }
}

export default AccountType;
