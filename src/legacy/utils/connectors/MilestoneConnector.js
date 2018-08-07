import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as MilestoneActions from '../../actions/MilestoneActions';
import * as ProgressReportActions from '../../actions/ProgressReportActions';

function mapStateToProps(state) {
    return {
        Auth: state.Auth,
        Task: state.Task,
        Milestone: state.Milestone,
        ProgressReport: state.ProgressReport,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        MilestoneActions: bindActionCreators(MilestoneActions, dispatch),
        ProgressReportActions: bindActionCreators(
            ProgressReportActions,
            dispatch,
        ),
    };
}

export default function connectToMilestones(component) {
    return connect(mapStateToProps, mapDispatchToProps)(component);
}
