import React from 'react';
import moment from 'moment';
import momentLocalizer from 'react-widgets/lib/localizers/moment';

import NavBar from '../components/NavBar';
import SideBar from './SideBar';
import ChatWindow from '../containers/ChatWindow';

import {
    isAdmin,
    getUser,
} from '../utils/auth';
import confirm from '../utils/confirm';

momentLocalizer(moment);

const AGREEMENT_VERSION = 1.2;

export default class AppWrapper extends React.Component {
    componentDidMount() {
        const {Auth, AuthActions} = this.props;
        if (Auth.isAuthenticated) {
            if (
                Auth.user &&
                parseFloat(Auth.user.agree_version || 0) < AGREEMENT_VERSION
            ) {
                confirm(
                    <div>
                        <p>Hi {getUser().first_name},</p>
                        <p>
                            A change in our User Agreement has taken place as of
                            Monday, 22nd January, 2018. Please read it carefully{' '}
                            <a
                                href="https://tunga.io/agreement"
                                target="_blank">
                                here
                            </a>.
                        </p>
                    </div>,
                    false,
                    {ok: 'I agree', cancel: "I don't agree", mustRespond: true},
                ).then(
                    function() {
                        AuthActions.updateAuthUser({
                            agree_version: AGREEMENT_VERSION,
                            agreed_at: moment.utc().format(),
                        });
                    },
                    function() {
                        AuthActions.updateAuthUser({
                            disagree_version: AGREEMENT_VERSION,
                            disagreed_at: moment.utc().format(),
                        });
                        AuthActions.logout();
                    },
                );
            }
        }
    }

    handleAppClick() {
        const {onAppClick} = this.props;
        if (onAppClick) {
            onAppClick();
        }
    }

    render() {
        const {children, location} = this.props;

        return (
            <div className="app-wrapper dashboard-page"
                onClick={this.handleAppClick.bind(this)}>

                <NavBar location={location} />

                <SideBar location={location} />

                <div className="main-content">
                    <div className="main">{children}</div>
                </div>

                {!isAdmin() ? <ChatWindow /> : null}
            </div>
        );
    }
}
