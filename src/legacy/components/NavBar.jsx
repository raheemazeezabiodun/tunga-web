import PropTypes from 'prop-types';
import React from 'react';
import {Link} from 'react-router';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import Avatar from './Avatar';
import SearchBox from './SearchBox';

import * as AuthActions from '../actions/AuthActions';
import * as SearchActions from '../actions/SearchActions';

import {SEARCH_PATH} from '../constants/patterns';
import {initSideBarToggle} from '../utils/ui';

import {isAuthenticated, isAdmin, getUser} from '../utils/auth';

class NavBar extends React.Component {
    componentDidMount() {
        initSideBarToggle();
    }

    onSearch(query) {
        this.props.SearchActions.searchStart(query.search);
        if (!SEARCH_PATH.test(this.props.location.pathname)) {
            const {router} = this.context;
            router.replace('/search');
        }
    }

    handleLogout = e => {
        e.preventDefault();
        this.props.AuthActions.logout();
    };

    render() {
        const {Auth} = this.props;

        return (
            <div className="navbar-wrapper">
                <nav className="navbar navbar-fixed-top">
                    <div className="navbar-header">
                        {isAuthenticated() ? (
                            <button
                                type="button"
                                className="sidebar-toggle navbar-toggle collapsed"
                                data-toggle="sidebar-collapse"
                                data-target="#sidebar"
                                aria-expanded="false"
                                aria-controls="sidebar">
                                <span className="sr-only">Toggle side bar</span>
                                <i className="fa fa-navicon fa-lg" />
                            </button>
                        ) : null}
                        <button
                            type="button"
                            className="navbar-toggle collapsed"
                            data-toggle="collapse"
                            data-target="#navbar"
                            aria-expanded="false"
                            aria-controls="navbar">
                            <span className="sr-only">Toggle navigation</span>
                            <i className="fa fa-ellipsis-v fa-lg" />
                        </button>
                        <Link to="/" className="navbar-brand">
                            <img src={require('../images/logo.png')} />
                        </Link>
                    </div>
                    <div id="navbar" className="navbar-collapse collapse">
                        <ul className="nav navbar-nav navbar-right">
                            <li id="navbar-search">
                                <SearchBox
                                    placeholder="Search"
                                    query={this.props.location.query.q}
                                    hide_results={true}
                                    onSearch={this.onSearch.bind(this)}
                                />
                            </li>
                            {isAuthenticated() && isAdmin() ? (
                                <li className="dropdown">
                                    <a
                                        href="#"
                                        className="dropdown-toggle account-actions-toggle"
                                        data-toggle="dropdown"
                                        role="button"
                                        aria-haspopup="true"
                                        aria-expanded="false">
                                        <i className="nav-icon fa fa-cogs" />{' '}
                                        Manage{' '}
                                        <span
                                            className="caret"
                                            style={{marginLeft: 5 + 'px'}}
                                        />
                                    </a>
                                    <ul className="dropdown-menu">
                                        <li>
                                            <Link to="/help">
                                                <i className="nav-icon fa fa-question-circle fa-lg" />{' '}
                                                Help
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/people/invite">
                                                <i className="nav-icon fa fa-user-plus" />{' '}
                                                Invite Users
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/dashboard/updates">
                                                <i className="nav-icon fa fa-bell" />{' '}
                                                Updates dashboard
                                            </Link>
                                        </li>
                                    </ul>
                                </li>
                            ) : null}
                            <li className="dropdown" id="navbar-account">
                                <a
                                    href="#"
                                    className="dropdown-toggle account-actions-toggle"
                                    data-toggle="dropdown"
                                    role="button"
                                    aria-haspopup="true"
                                    aria-expanded="false">
                                    {Auth.user.display_name}{' '}
                                    <span
                                        className="caret"
                                        style={{marginLeft: '5px'}}
                                    />{' '}
                                    <Avatar src={Auth.user.avatar_url} />
                                </a>
                                <ul className="dropdown-menu">
                                    <li>
                                        <Link to="/profile">
                                            <i className="nav-icon tunga-icon-profile" />{' '}
                                            My Profile
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/settings">
                                            <i className="nav-icon tunga-icon-settings" />{' '}
                                            Settings
                                        </Link>
                                    </li>
                                    <li role="separator" className="divider" />
                                    <li>
                                        <Link to="" onClick={this.handleLogout}>
                                            <i className="nav-icon tunga-icon-sign-out" />{' '}
                                            Sign Out
                                        </Link>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>
        );
    }
}

NavBar.contextTypes = {
    router: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
    return {Auth: state.Auth};
}

function mapDispatchToProps(dispatch) {
    return {
        AuthActions: bindActionCreators(AuthActions, dispatch),
        SearchActions: bindActionCreators(SearchActions, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
