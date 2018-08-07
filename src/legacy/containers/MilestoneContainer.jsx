import React from 'react';
import connect from '../utils/connectors/MilestoneConnector';

class MilestoneContainer extends React.Component {
    renderChildren() {
        return React.Children.map(
            this.props.children,
            function(child) {
                return React.cloneElement(child, {
                    Milestone: this.props.Milestone,
                    ProgressReport: this.props.ProgressReport,
                    MilestoneActions: this.props.MilestoneActions,
                    ProgressReportActions: this.props.ProgressReportActions,
                });
            }.bind(this),
        );
    }

    render() {
        return <div>{this.renderChildren()}</div>;
    }
}

export default connect(MilestoneContainer);
