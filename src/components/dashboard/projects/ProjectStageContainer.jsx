import React from 'react';

import ProjectManagement from './ProjectManagement';
import OpportunityManagement from './Opportunities/OpportunityManagement';


export default ({ project }) => {
    return project.stage === 'opportunity'?(
        <OpportunityManagement {...this.props} />
    ):(
        <ProjectManagement {...this.props}/>
    );
}
