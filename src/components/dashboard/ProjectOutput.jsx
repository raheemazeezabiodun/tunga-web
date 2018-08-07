import React from 'react';
import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom';

import PropTypes from "prop-types";

class ProjectOutput extends React.Component {

    static propTypes = {
        id: PropTypes.string,
        field: PropTypes.string,
    };

    render() {
        const {Project: {projects}, id, field} = this.props;

        return (
            <React.Fragment>
                {projects[id]?projects[id][field]:null}
            </React.Fragment>
        )
    }
}

function mapStateToProps(state) {
    return {
        Project: state.Project
    };
}

export default withRouter(connect(mapStateToProps)(ProjectOutput));
