import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as CommentActions from '../../actions/CommentActions';

function mapStateToProps(state) {
    return {Auth: state.Auth, Comment: state.Comment};
}

function mapDispatchToProps(dispatch) {
    return {
        CommentActions: bindActionCreators(CommentActions, dispatch),
    };
}

export default function connectToComments(component) {
    return connect(mapStateToProps, mapDispatchToProps)(component);
}
