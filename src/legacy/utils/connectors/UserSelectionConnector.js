import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as UserSelectionActions from '../../actions/UserSelectionActions';

function mapStateToProps(state) {
    return {Auth: state.Auth, UserSelection: state.UserSelection};
}

function mapDispatchToProps(dispatch) {
    return {
        UserSelectionActions: bindActionCreators(
            UserSelectionActions,
            dispatch,
        ),
    };
}

export default function connectToUserSelections(component) {
    return connect(mapStateToProps, mapDispatchToProps)(component);
}
