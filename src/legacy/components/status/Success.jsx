import React from 'react';

export default class Success extends React.Component {
    render() {
        return (
            <div className="alert alert-success" role="alert">
                {this.props.message || 'Success'}
            </div>
        );
    }
}
