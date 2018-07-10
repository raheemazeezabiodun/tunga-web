import PropTypes from 'prop-types';
import React from 'react';

export default class Privacy extends React.Component {
    static propTypes = {
        user: PropTypes.object,
        isSaving: PropTypes.object,
        isSaved: PropTypes.object,
        errors: PropTypes.object,
        ProfileActions: PropTypes.object,
    };

    componentDidMount() {
        const {ProfileActions} = this.props;
        ProfileActions.retrieveSettings();
    }

    render() {
        return (
            <div>
                // TODO: {this.constructor.name} form goes here
            </div>
        );
    }
}
