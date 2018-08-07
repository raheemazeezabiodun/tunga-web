import React from 'react';
import _ from 'lodash';
import connect from '../utils/connectors/MilestoneConnector';

class MilestoneListContainer extends React.Component {
    UNSAFE_componentWillMount() {
        const {Milestone, MilestoneActions, params: {taskId}} = this.props;
        MilestoneActions.listMilestones({
            type: 3,
            task_id: taskId,
        });
    }

    renderChildren() {
        const {Milestone: {list: {isFetching, milestones}}} = this.props;
        return React.Children.map(
            this.props.children,
            function(child) {
                return React.cloneElement(child, {
                    milestones: _.values(milestones),
                    isFetching: isFetching,
                });
            }.bind(this),
        );
    }
    render() {
        return <div>{this.renderChildren()}</div>;
    }
}

export default connect(MilestoneListContainer);
