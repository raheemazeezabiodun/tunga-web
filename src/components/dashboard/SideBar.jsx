import React from 'react';
import {Link, NavLink} from 'react-router-dom';

import Icon from '../core/Icon';

export default class SideBar extends React.Component {

    render() {
        return (
            <div id="sidebar" className="sidebar">
                <ul className="nav">
                    {[
                        ['dashboard', 'Dashboard', 'meter'],
                        ['projects', 'Projects', 'projects'],
                        ['network', 'Network', 'tribe'],
                        ['payments', 'Payments', 'wallet'],
                        ['settings', 'Settings', 'tools']
                    ].map((item, idx) => {
                        return (
                            <li key={`dashboard-${idx}`}>
                                <NavLink to={`/${item[0]}`} activeClassName="active">
                                    <Icon name={item[2]} size="sidebar"/>
                                    <span>{item[1]}</span>
                                </NavLink>
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
    }
}

