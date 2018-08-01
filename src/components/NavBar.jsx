import PropTypes from 'prop-types';
import React from 'react';
import {Link} from 'react-router-dom';

import Avatar from './core/Avatar';
import Icon from './core/Icon';
import SearchBox from './core/SearchBox';


export default class NavBar extends React.Component {
    static defaultProps = {
        breakpoint: 'md',
    };

    static propTypes = {
        className: PropTypes.string,
        user: PropTypes.object,
        onSignOut: PropTypes.func,
        breakpoint: PropTypes.string,
    };

    onSignOut(e) {
        if(e) {
            e.preventDefault();
        }
        if(this.props.onSignOut) {
            this.props.onSignOut();
        }
    }

    render() {
        let {user} = this.props;

        return (
            <nav className={`navbar navbar-expand-${this.props.breakpoint || 'md'} fixed-top navbar-dark bg-primary ${this.props.className || ''}`}>
                <Link to="/dashboard" className="navbar-brand">
                    <img src={require('../images/logo.png')} />
                </Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbar" aria-controls="navbar" aria-expanded="false" aria-label="Toggle navigation">
                    <i className="tg-ic-bars"/>
                </button>
                {user?(
                    <div className="collapse navbar-collapse" id="navbar">
                        <ul className="navbar-nav ml-auto">
                            <li>
                                <SearchBox variant="search"/>
                            </li>
                            <li className="nav-item dropdown">
                                <a
                                    href="#"
                                    className="dropdown-toggle"
                                    data-toggle="dropdown"
                                    role="button"
                                    aria-haspopup="true"
                                    aria-expanded="false">
                                    {user.display_name} <span className="caret"/> <Avatar image={user.avatar_url} />
                                </a>
                                <ul className="dropdown-menu dropdown-menu-account">
                                    <li>
                                        <Link to="#" onClick={this.onSignOut.bind(this)}>
                                            <Icon name="logout" size="navbar"/> Sign Out
                                        </Link>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                ):null}
            </nav>
        );
    }
}
