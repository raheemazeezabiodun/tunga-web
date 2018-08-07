import React from 'react';

export default class SectionHeading extends React.Component {
    render() {
        return (
            <div>
                <div className="section-heading">{this.props.children}</div>
                <div className="section-heading-hr" />
            </div>
        );
    }
}
