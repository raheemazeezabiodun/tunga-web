import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as TaskActions from '../../actions/TaskActions';
import * as AuthActions from '../../actions/AuthActions';
import * as ApplicationActions from '../../actions/ApplicationActions';
import * as SavedTaskActions from '../../actions/SavedTaskActions';
import * as CommentActions from '../../actions/CommentActions';
import {clearValidations} from '../../actions/UtilityActions';
import * as EstimateActions from '../../actions/EstimateActions';
import * as QuoteActions from '../../actions/QuoteActions';
import * as MultiTaskPaymentActions from '../../actions/MultiTaskPaymentActions';

function mapStateToProps(state) {
    return {
        Auth: state.Auth,
        Task: state.Task,
        Estimate: state.Estimate,
        Quote: state.Quote,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        TaskActions: {
            ...bindActionCreators(
                {
                    listRunningTasks: AuthActions.listRunningTasks,
                    listRepos: AuthActions.listRepos,
                    listIssues: AuthActions.listIssues,
                    getSlackApp: AuthActions.getSlackApp,
                    listSlackChannels: AuthActions.listSlackChannels,
                    clearValidations: clearValidations,
                },
                dispatch,
            ),
            ...bindActionCreators(TaskActions, dispatch),
            ...bindActionCreators(ApplicationActions, dispatch),
            ...bindActionCreators(SavedTaskActions, dispatch),
            ...bindActionCreators(CommentActions, dispatch),
            ...bindActionCreators(MultiTaskPaymentActions, dispatch),
        },
        EstimateActions: bindActionCreators(EstimateActions, dispatch),
        QuoteActions: bindActionCreators(QuoteActions, dispatch),
    };
}

export default function connectToTasks(component) {
    return connect(mapStateToProps, mapDispatchToProps)(component);
}
