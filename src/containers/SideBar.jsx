import React from 'react';
import {Link, NavLink} from 'react-router-dom';
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

  isActive(routes, index_only = true) {
    var results = routes.map(route => {
      return this.context.router.isActive(route, index_only);
    });
    return results.indexOf(true) > -1 ? true : false;
  }

  getActiveClass(routes, index_only = true) {
    return this.isActive(routes, index_only) ? 'active' : '';
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
              <NavLink to="/home" activeClassName="active">
                <i className="menu-icon tunga-icon-home" /> <span>Home</span>
              </NavLink>
            </li>
            <li id="sidebar-work">
              <NavLink
                to="/work"
                activeClassName={
                  /\/work\/new\/?/.test(this.props.location.pathname)
                    ? ''
                    : 'active'
                }>
                <i className="menu-icon tunga-icon-search" />{' '}
                <span>Find work</span>
              </NavLink>
            </li>
            {isProjectOwner() || isProjectManager() || isAdmin()
              ? <li id="sidebar-post-work">
                  <NavLink to="/work/new" activeClassName="active">
                    <i className="menu-icon tunga-icon-task" />{' '}
                    <span>Post work</span>
                  </NavLink>
                </li>
              : null}
            <li id="sidebar-messages">
              <NavLink to="/conversation" activeClassName="active">
                <i className="menu-icon tunga-icon-message" />{' '}
                <span>Messages</span>{' '}
                {messages
                  ? <span className="badge">
                      {messages}
                    </span>
                  : null}
              </NavLink>
            </li>
            <li id="sidebar-tribe">
              <NavLink to="/people/filter/developers" activeClassName="active">
                <i className="menu-icon tunga-icon-tribe" /> <span>Tribe</span>{' '}
                {requests
                  ? <span className="badge">
                      {requests}
                    </span>
                  : null}
              </NavLink>
            </li>
            <li id="sidebar-payments">
              <NavLink to="/payments" activeClassName="active">
                <i className="menu-icon tunga-icon-wallet" />{' '}
                <span>Payments</span>
              </NavLink>
            </li>
            {isProjectManager() || isAdmin()
              ? <li id="sidebar-estimate">
                  <NavLink to="/proposal" activeClassName="active">
                    <i className="menu-icon fa fa-pie-chart" />{' '}
                    <span>Proposals</span>
                  </NavLink>
                </li>
              : null}

            {Support.Section.list.sections.length && false
              ? <li
                  className={this.getActiveClass(['/support'], false)}
                  id="sidebar-support">
                  <a
                    href="#"
                    data-toggle="collapse"
                    data-target="#support-menu"
                    className={
                      this.isActive(['/support'], false) ? '' : 'collapsed'
                    }>
                    <i className="menu-icon tunga-icon-support" />{' '}
                    <span>Support</span>
                  </a>
                  <ul
                    id="support-menu"
                    className={
                      'nav collapse ' +
                      (this.isActive(['/support'], false) ? 'in' : '')
                    }>
                    {Support.Section.list.sections.map(section => {
                      return (
                        <li key={section.id}>
                          <NavLink
                            to={`/support/${section.slug}`}
                            activeClassName="active">
                            {section.title}
                          </NavLink>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              : null}
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
  router: React.PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(SideBar);
