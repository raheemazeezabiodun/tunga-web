import React from 'react';

export default ({className, children}) => {
    return (
        <div className={`section-heading ${className || ''}`}>
            <div className="">{children}</div>
            <div className="border" />
        </div>
    );
}
