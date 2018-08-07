import React from 'react';

export default class FieldError extends React.Component {
    render() {
        return (
            <div className="error">{this.props.message || 'Unknown error'}</div>
        );
    }
}
