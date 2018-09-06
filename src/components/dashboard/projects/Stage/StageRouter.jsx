import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ProjectManagement from '../ProjectManagement';
import ProjectList from '../ProjectList';
import OpportuntiyList from '../Opportunities/OpportunityList';
import OpportunityManagement from '../Opportunities/OpportunityManagement';


export default class StageRouter extends Component {
    static propTypes = {
        project: PropTypes.object.isRequired,
        projectFilter: PropTypes.bool.isRequired
    }

    render() {
        const { project, projectFilter } = this.props;
        let content = null;
        if (project.stage === 'opportunity') {
            if (projectFilter) {
                content = (<OpportuntiyList {...this.props} />);
            } else {
                content = (<OpportunityManagement {...this.props} />);
            }
        } else {
            if (projectFilter) {
                content = (<ProjectList {...this.props}/>);
            } else {
                content = (<ProjectManagement {...this.props}/>);
            }
        }
        return content;
    }
}
