import PropTypes from 'prop-types';
import React from 'react';
import {Link} from 'react-router-dom';

import Icon from '../../core/Icon';


export default class Finish extends React.Component {
    static propTypes = {
        user: PropTypes.object,
        isSaving: PropTypes.object,
        isSaved: PropTypes.object,
        errors: PropTypes.object,
        ProfileActions: PropTypes.object,
    };

    render() {
        return (
            <div className="onboard-intro">
                <span className="onboard-finish-icon">
                    <Icon name="check" size="lg" />
                </span>
                <div className="onboard-finish-button">
                    <Link to="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
                </div>
            </div>
        );
    }
}
