import React from 'react';

const FieldError = ({message}) => {
    return (
        <div className="error">{message?(Array.isArray(message)?message.map((item, idx) => {return <div key={idx}>{item}</div>}):message):''}</div>
    );
};

export default FieldError;
