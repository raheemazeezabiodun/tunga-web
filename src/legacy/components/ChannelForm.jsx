import PropTypes from 'prop-types';
import React from 'react';
import FormStatus from './status/FormStatus';
import FieldError from './status/FieldError';
import UserSelector from '../containers/UserSelector';
import {CHANNEL_TYPES} from '../constants/Api';

import {isAdmin, getUser} from '../utils/auth';

export default class ChannelForm extends React.Component {
    render() {
        return <div className="new-channel" />;
    }
}

ChannelForm.contextTypes = {
    router: PropTypes.object.isRequired,
};
