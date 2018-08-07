import PropTypes from 'prop-types';
import React from 'react';
import {Link} from 'react-router';
import {Breadcrumb} from 'react-bootstrap';

import {render_summary} from '../utils/html';

export default class BreadCrumb extends React.Component {
    render() {
        const {section, parents} = this.props;

        return section ? (
            <Breadcrumb>
                {parents.map(item => {
                    return (
                        <li key={item.name}>
                            <Link to={item.link}>
                                {render_summary(item.name, 30)}
                            </Link>
                        </li>
                    );
                })}
                <Breadcrumb.Item active>{section}</Breadcrumb.Item>
            </Breadcrumb>
        ) : null;
    }
}

BreadCrumb.propTypes = {
    parents: PropTypes.array,
    section: PropTypes.string,
};
