import React from 'react';
import Progress from './Progress';
import DismissError from './Error';
import Success from './Success';

export default class FormStatus extends React.Component {
    render() {
        return (
            <div>
                {this.props.loading ? <Progress /> : ''}
                {this.props.success ? (
                    <Success message={this.props.message || 'Changes saved'} />
                ) : (
                    ''
                )}
                {this.props.error ? (
                    <DismissError
                        message={
                            this.props.errorMessage ||
                            'Please correct errors below'
                        }
                    />
                ) : (
                    ''
                )}
            </div>
        );
    }
}
