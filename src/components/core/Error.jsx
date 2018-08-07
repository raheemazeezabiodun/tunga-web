import React from 'react';

import Icon from './Icon';

const Error = ({message}) => {
    return (
        <div className="alert alert-danger"><Icon name="attention"/> {message || ''}</div>
    );
};

export default Error;
