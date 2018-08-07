import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as SupportSectionActions from '../../actions/SupportSectionActions';
import * as SupportPageActions from '../../actions/SupportPageActions';

function mapStateToProps(state) {
    return {Auth: state.Auth, Support: state.Support};
}

function mapDispatchToProps(dispatch) {
    return {
        SupportActions: {
            ...bindActionCreators(SupportSectionActions, dispatch),
            ...bindActionCreators(SupportPageActions, dispatch),
        },
    };
}

export default function connectToSupport(component) {
    return connect(mapStateToProps, mapDispatchToProps)(component);
}
