import React from 'react';

export default class Error extends React.Component {
    render() {
        return (
            <div className="alert alert-warning" role="alert">
                {this.props.message || 'Unknown error'}
            </div>
        );
    }
}
