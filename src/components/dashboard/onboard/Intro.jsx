import PropTypes from 'prop-types';
import React from 'react';
import {Link} from 'react-router-dom';


export default class Intro extends React.Component {
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
                <Link className="btn btn-primary" to="/onboard/step-one">Go to my profile</Link>
            </div>
        );
    }
}
