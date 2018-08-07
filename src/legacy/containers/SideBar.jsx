import PropTypes from 'prop-types';
import React from 'react';
import {Link} from 'react-router';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as AuthActions from '../actions/AuthActions';

import * as NotificationActions from '../actions/NotificationActions';

import * as SupportSectionActions from '../actions/SupportSectionActions';

import * as SupportPageActions from '../actions/SupportPageActions';

import {
    isAuthenticated,
    isAdmin,
    isProjectOwner,
    isProjectManager,
} from '../utils/auth';

import {resizeSideBar} from '../utils/ui';

class SideBar extends React.Component {
    componentDidMount() {
        $(document).ready(resizeSideBar);
        $(window).resize(resizeSideBar);
        if (isAuthenticated()) {
            this.props.NotificationActions.getNotifications();
            setInterval(this.props.NotificationActions.getNotifications, 15000);
        }

        const {SupportActions} = this.props;
        SupportActions.listSupportSections();
    }

    getActiveClass(routes, index_only = true) {
        return this.isActive(routes, index_only) ? 'active' : '';
    }

    isActive(routes, index_only = true) {
        var results = routes.map(route => {
            return this.context.router.isActive(route, index_only);
        });
        return results.indexOf(true) > -1 ? true : false;
    }

    render() {
        const {Notification, Support} = this.props;
        const messages = Notification.notifications
            ? Notification.notifications.messages
            : 0;
        const tasks = Notification.notifications
            ? Notification.notifications.tasks
            : 0;
        const requests = Notification.notifications
            ? Notification.notifications.requests
            : 0;

        return (
            <div id="sidebar" className="sidebar collapse">
                <div className="wrapper" onClick={resizeSideBar()}>
                    <ul className="nav nav-sidebar">
                        <li id="sidebar-home">
                            <Link to="/home" activeClassName="active">
                                <i className="menu-icon tunga-icon-home" />{' '}
                                <span>Home</span>
                            </Link>
                        </li>
                        <li id="sidebar-work">
                            <Link
                                to="/work"
                                activeClassName={
                                    /\/work\/new\/?/.test(
                                        this.props.location.pathname,
                                    )
                                        ? ''
                                        : 'active'
                                }>
                                <i className="menu-icon tunga-icon-search" />{' '}
                                <span>Find work</span>
                            </Link>
                        </li>
                        {isProjectOwner() || isProjectManager() || isAdmin() ? (
                            <li id="sidebar-post-work">
                                <Link to="/work/new" activeClassName="active">
                                    <i className="menu-icon tunga-icon-task" />{' '}
                                    <span>Post work</span>
                                </Link>
                            </li>
                        ) : null}
                        {/*<li id="sidebar-messages">
              <Link to="/conversation" activeClassName="active">
                <i className="menu-icon tunga-icon-message" />{' '}
                <span>Messages</span>{' '}
                {messages
                  ? <span className="badge">
                      {messages}
                    </span>
                  : null}
              </Link>
            </li>*/}
                        <li id="sidebar-tribe">
                            <Link
                                to="/people/filter/developers"
                                activeClassName="active">
                                <i className="menu-icon tunga-icon-tribe" />{' '}
                                <span>Tribe</span>{' '}
                                {requests ? (
                                    <span className="badge">{requests}</span>
                                ) : null}
                            </Link>
                        </li>
                        <li id="sidebar-payments">
                            <Link to="/payments" activeClassName="active">
                                <i className="menu-icon tunga-icon-wallet" />{' '}
                                <span>Payments</span>
                            </Link>
                        </li>
                        {isProjectManager() || isAdmin() ? (
                            <li id="sidebar-estimate">
                                <Link to="/proposal" activeClassName="active">
                                    <i className="menu-icon fa fa-pie-chart" />{' '}
                                    <span>Proposals</span>
                                </Link>
                            </li>
                        ) : null}
                        {isProjectManager() || isAdmin() ? (
                            <li id="sidebar-estimate">
                                <Link to="/events" activeClassName="active">
                                    <i className="menu-icon fa fa-calendar" />{' '}
                                    <span>Events</span>
                                </Link>
                            </li>
                        ) : null}
                        {isAdmin() ? (
                            <li id="sidebar-estimate">
                                <Link to="/blog/admin" activeClassName="active">
                                    <i className="menu-icon fa fa-newspaper-o" />{' '}
                                    <span>Blog</span>
                                </Link>
                            </li>
                        ) : null}

                        {Support.Section.list.sections.length && false ? (
                            <li
                                className={this.getActiveClass(
                                    ['/support'],
                                    false,
                                )}
                                id="sidebar-support">
                                <a
                                    href="#"
                                    data-toggle="collapse"
                                    data-target="#support-menu"
                                    className={
                                        this.isActive(['/support'], false)
                                            ? ''
                                            : 'collapsed'
                                    }>
                                    <i className="menu-icon tunga-icon-support" />{' '}
                                    <span>Support</span>
                                </a>
                                <ul
                                    id="support-menu"
                                    className={
                                        'nav collapse ' +
                                        (this.isActive(['/support'], false)
                                            ? 'in'
                                            : '')
                                    }>
                                    {Support.Section.list.sections.map(
                                        section => {
                                            return (
                                                <li key={section.id}>
                                                    <Link
                                                        to={`/support/${
                                                            section.slug
                                                        }`}
                                                        activeClassName="active">
                                                        {section.title}
                                                    </Link>
                                                </li>
                                            );
                                        },
                                    )}
                                </ul>
                            </li>
                        ) : null}
                    </ul>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {Support: state.Support, Notification: state.Notification};
}

function mapDispatchToProps(dispatch) {
    return {
        AuthActions: bindActionCreators(AuthActions, dispatch),

        NotificationActions: bindActionCreators(NotificationActions, dispatch),

        SupportActions: {
            ...bindActionCreators(SupportSectionActions, dispatch),

            ...bindActionCreators(SupportPageActions, dispatch),
        },
    };
}

SideBar.contextTypes = {
    router: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(SideBar);
