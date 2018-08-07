import React from 'react';

import Icon from './Icon';

const Info = ({message, variant}) => {
    return (
        <div className={`alert alert-${variant || 'info'}`}><Icon name="info-circle"/> {message || ''}</div>
    );
};

export default Info;
