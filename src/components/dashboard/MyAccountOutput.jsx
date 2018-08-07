import React from 'react';
import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom';

import PropTypes from "prop-types";

class MyAccountOutput extends React.Component {

    static propTypes = {
        field: PropTypes.string,
    };

    render() {
        const {Auth: {user}, field} = this.props;

        return (
            <React.Fragment>
                {user[field] || null}
            </React.Fragment>
        )
    }
}

function mapStateToProps(state) {
    return {
        Auth: state.Auth
    };
}

export default withRouter(connect(mapStateToProps)(MyAccountOutput));
