import PropTypes from 'prop-types';
import React from 'react';
import { Switch, Route, Redirect, NavLink } from 'react-router-dom';

import OpportunityDetails from './OpportunityDetails';
import InterestList from './InterestList';
import Warning from "../../core/Warning";
import {hasProjectAccess, isDev} from "../../utils/auth";
import {STATUS_INITIAL, STATUS_INTERESTED, STATUS_UNINTERESTED} from "../../../actions/utils/api";


export default class OpportunityManagement extends React.Component {

    static propTypes = {
        project: PropTypes.object,
        isSaving: PropTypes.object,
        isSaved: PropTypes.object,
        ProjectActions: PropTypes.object,
        match: PropTypes.object
    };

    render() {
        const {project, isSaving, isSaved, ProjectActions, match} = this.props,
            interestPolls = project.interest_polls,
            interestedDevs = interestPolls.filter(interest => interest.status === STATUS_INTERESTED).length,
            uninterestedDevs = interestPolls.filter(interest => interest.status === STATUS_UNINTERESTED).length,
            pendingDevs = interestPolls.filter(interest => interest.status === STATUS_INITIAL).length;
        const projectProps = {project, isSaving, isSaved, ProjectActions};

        const sections = isDev()?[]:[
            ['network/interested', `Interested developers (${interestedDevs})`, <InterestList {...projectProps} status={STATUS_INTERESTED} />],
            ['network/uninterested', `Uninterested developers (${uninterestedDevs})`, <InterestList {...projectProps} status={STATUS_UNINTERESTED} />],
            ['network/pending', `Pending invitations (${pendingDevs})`, <InterestList {...projectProps} status={STATUS_INITIAL} />],
        ];

        return (
            project?(
                <div className="project-page clearfix">
                    <div className="project-activity">
                        <div className="project-filters">
                            <NavLink to={match.url} exact
                                     activeClassName="active"
                                     className="opportunity-nav-link">
                                Opportunity details
                            </NavLink>
                            {sections.map((link, index) => {
                                let url = link[0];
                                return (
                                    <NavLink key={`opportunity-filters-link--${url}-${index}`}
                                        exact
                                        to={`${match.url}/${url}`}
                                        activeClassName="active"
                                        className="opportunity-nav-link">
                                        {link[1]}
                                    </NavLink>
                                )
                            })}
                        </div>

                        <div className="project-activity-wrapper">
                            {hasProjectAccess(project) || isDev()?(
                                <Switch>
                                    {sections.map(path => {
                                        return (
                                            <Route key={`opportunity-management-path--${path[0]}`}
                                                    path={`${match.url}/${path[0]}`}
                                                    render={props => path[2]}/>
                                        );
                                    })}
                                    <Route path={match.url}
                                           render={props => <OpportunityDetails {...projectProps} />}/>
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
