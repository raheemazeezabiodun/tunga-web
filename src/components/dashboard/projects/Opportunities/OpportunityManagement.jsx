import PropTypes from 'prop-types';
import React from 'react';
import { Switch, Route, Redirect, NavLink } from 'react-router-dom';

import OpportunityDetails from './OpportunityDetails';
import OpportunityList from './OpportunityList';
import Warning from "../../../core/Warning";
import {hasProjectAccess, isDev} from "../../../utils/auth";


export default class OpportunityManagement extends React.Component {

    static propTypes = {
        project: PropTypes.object,
        isSaving: PropTypes.object,
        isSaved: PropTypes.object,
        ProjectActions: PropTypes.object,
        match: PropTypes.object
    };

    render() {
        const {project, isSaving, isSaved, ProjectActions, match} = this.props;
        const interestPolls = project.interest_polls;
        const interestedDevs = interestPolls.filter(interest => interest.status == 'interested').length
        const uninterestedDevs = interestPolls.filter(interest => interest.status == 'uninterested').length
        const pendingDevs = interestPolls.filter(interest => interest.status == 'initial').length
        const projectProps = {project, isSaving, isSaved, ProjectActions};
        const devTab = [
            ['opportunity-details', 'Opportunity details', <OpportunityDetails {...projectProps} />]
        ]
        const adminTabs = [
            ['opportunity-details', 'Opportunity details', <OpportunityDetails {...projectProps} />],
            ['opportunity-interested', `Interested developers (${interestedDevs})`, <OpportunityList {...projectProps} status={'interested'} />],
            ['opportunity-uninterested', `Uninterested developers (${uninterestedDevs})`, <OpportunityList {...projectProps} status={'uninterested'} />],
            ['opportunity-pending', `Pending invitations (${pendingDevs})`, <OpportunityList {...projectProps} status={'initial'} />],
        ]
        const showTabs = isDev() ? devTab : adminTabs;
        return (
            project?(
                <div className="project-page clearfix">
                    <div className="project-activity">
                        <div className="project-filters">
                            {showTabs.map((link, index) => {
                                let url = link[0];
                                return (
                                    <NavLink key={`opportunity-filters-link--${url}-${index}`}
                                        exact
                                        to={`${match.url}/${url}`}
                                        activeClassName="active"
                                        className="opportunity-nav-link"
                                        {...link[2]}
                                    >
                                        {link[1]}
                                    </NavLink>
                                )
                            })}
                        </div>

                        <div className="project-activity-wrapper">
                            {hasProjectAccess(project) || isDev()?(
                                <Switch>
                                    <Redirect exact from={`${match.url}`} to={`${match.url}/opportunity-details`}/>
                                    {showTabs.map(path => {
                                        return (
                                            <Route key={`opportunity-management-path--${path[0]}`}
                                                    path={`${match.url}/${path[0]}`}
                                                    render={props => path[2]}/>
                                        );
                                    })}
                                </Switch>
                            ):(
                                <Warning message="You don't have permission to access this project's resources"/>
                            )}
                        </div>
                    </div>    
                </div>
            ):null
        );
    }
}
