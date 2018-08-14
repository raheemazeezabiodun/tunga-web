import React from 'react';

import Icon from './Icon';

const Success = ({message, variant, size}) => {
    return (
        variant === 'icon'?(
            <div className="success">
                <Icon name="check" size={size || "lg"} className='status-icon'/>
                <div>{message || 'Changes saved succesfully!'}</div>
            </div>
        ):(
            <div className={`alert alert-success${variant === 'light'?'-light':''}`}><Icon name="check" className="status-icon"/> {message || ''}</div>
        )
    );
};

export default Success;
