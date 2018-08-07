import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as EstimateActions from '../../actions/EstimateActions';

function mapStateToProps(state) {
    return {Auth: state.Auth, Estimate: state.Estimate};
}

function mapDispatchToProps(dispatch) {
    return {
        EstimateActions: bindActionCreators(EstimateActions, dispatch),
    };
}

export default function connectToEstimates(component) {
    return connect(mapStateToProps, mapDispatchToProps)(component);
}
