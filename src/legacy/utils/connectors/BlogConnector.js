import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as BlogActions from '../../actions/BlogActions';

function mapStateToProps(state) {
    return {Auth: state.Auth, Blog: state.Blog};
}

function mapDispatchToProps(dispatch) {
    return {
        BlogActions: bindActionCreators(BlogActions, dispatch),
    };
}

export default function connectToBlogs(component) {
    return connect(mapStateToProps, mapDispatchToProps)(component);
}
