import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as SettingsActions from '../../actions/SettingsActions';

function mapStateToProps(state) {
    return {Auth: state.Auth, Settings: state.Settings};
}

function mapDispatchToProps(dispatch) {
    return {
        SettingsActions: bindActionCreators(SettingsActions, dispatch),
    };
}

export default function connectToSettings(component) {
    return connect(mapStateToProps, mapDispatchToProps)(component);
}
