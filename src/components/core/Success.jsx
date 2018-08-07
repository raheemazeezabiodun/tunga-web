import React from 'react';

import Icon from './Icon';

const Success = ({message, variant, size}) => {
    return (
        variant === 'icon'?(
            <div className="success">
                <Icon name="check" size={size || "lg"} className='success-icon'/>
                <div>{message || 'Changes saved succesfully!'}</div>
            </div>
        ):(
            <div className="alert alert-success"><Icon name="check"/> {message || ''}</div>
        )
    );
};

export default Success;
