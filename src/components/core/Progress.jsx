import React from 'react';

const Progress = ({message}) => {
    return (
        <div className="loading">
            <img src={require('../../images/rolling.gif')}/> {message || ''}
        </div>
    );
};

export default Progress;
