import React from 'react';
import {Link, NavLink} from 'react-router-dom';

import Icon from '../core/Icon';

const TitleBarContent = ({match, title, subTitle, actionLink, sectionLinks}) => {

    return (
        <div>
            <div className="page-title">{title}</div>
            {subTitle?(
                <div className="page-sub-title">{subTitle}</div>
            ):null}
            {actionLink?(
                <Link to={actionLink} className="btn btn-icon title-action">
                    <Icon name="add" size="topbar"/>
                </Link>
            ):null}
            {sectionLinks?(
                <div className="title-filters">
                    {sectionLinks.map(link => {
                        let url = link[0],
                            urlText = link[1],
                            urlProps = link[2] || {};
                        return (
                            <NavLink key={`title-filters-link--${link[0]}`} exact
                                     to={typeof url === 'function'?url(match):url}
                                     activeClassName="active" {...urlProps}>
                                {typeof urlText === 'function'?urlText(match):urlText}
                            </NavLink>
                        )
                    })}
                </div>
            ):null}
        </div>
    )
};

export default TitleBarContent;
