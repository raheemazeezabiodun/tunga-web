import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as QuoteActions from '../../actions/QuoteActions';

function mapStateToProps(state) {
    return {Auth: state.Auth, Quote: state.Quote};
}

function mapDispatchToProps(dispatch) {
    return {
        QuoteActions: bindActionCreators(QuoteActions, dispatch),
    };
}

export default function connectToQuotes(component) {
    return connect(mapStateToProps, mapDispatchToProps)(component);
}
