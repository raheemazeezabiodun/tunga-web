import PropTypes from 'prop-types';
import React from 'react';
import {isAdmin, isDevOrClient} from "../utils/auth";
import connect from "../../connectors/ActivityConnector";

class Pay extends React.Component {
    static propTypes = {
        project: PropTypes.object,
    };

    render() {
        return (
            <div className="project-payments">
                {isDevOrClient() && !isAdmin()?(
                    <div className="font-weight-normal">No payment planning yet.</div>
                ):(
                    <div></div>
                )}
            </div>
        );
    }
}

export default connect(Pay);
