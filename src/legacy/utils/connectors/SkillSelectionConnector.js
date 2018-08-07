import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as SkillSelectionActions from '../../actions/SkillSelectionActions';

function mapStateToProps(state) {
    return {Auth: state.Auth, SkillSelection: state.SkillSelection};
}

function mapDispatchToProps(dispatch) {
    return {
        SkillSelectionActions: bindActionCreators(
            SkillSelectionActions,
            dispatch,
        ),
    };
}

export default function connectToSkillSelections(component) {
    return connect(mapStateToProps, mapDispatchToProps)(component);
}
