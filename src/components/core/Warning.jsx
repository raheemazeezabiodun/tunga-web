import React from 'react';

import Icon from './Icon';

const Warning = ({message}) => {
    return (
        <div className="alert alert-warning"><Icon name="warning"/> {message || ''}</div>
    );
};

export default Warning;
