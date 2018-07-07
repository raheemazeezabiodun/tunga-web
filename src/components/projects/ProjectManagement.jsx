import PropTypes from 'prop-types';
import React from 'react';
import { Switch, Route, Redirect, NavLink } from 'react-router-dom';
import moment from 'moment';

import Activity from './Activity';
import Docs from './Docs';
import Team from './Team';
import Plan from './Plan';
import Pay from './Pay';
import Settings from './Settings';
import Avatar from '../core/Avatar';

export default class ProjectManagement extends React.Component {
    static propTypes = {
        project: PropTypes.object,
        isSaving: PropTypes.object,
        isSaved: PropTypes.object,
        ProjectActions: PropTypes.object,
        match: PropTypes.object
    };

    render() {
        const {project, isSaving, isSaved, ProjectActions, match} = this.props;
        const settingsProps = {project, isSaving, isSaved, ProjectActions};

        return (
            project?(
                <div className="project-page">
                    <div className="project-activity float-left">
                        <div className="project-filters">
                            {[
                                ['activity', 'Meeting room'],
                                ['docs', 'Documentation'],
                                ['team', 'Team'],
                                ['plan', 'Planning'],
                                ['pay', 'Payments'],
                                ['settings', 'Settings']
                            ].map(link => {
                                let url = link[0];
                                return (
                                    <NavLink key={`project-filters-link--${url}`} exact to={`${match.url}/${url}`} activeClassName="active">{link[1]}</NavLink>
                                )
                            })}
                        </div>

                        <div className="project-activity-wrapper">
                            <Switch>
                                <Redirect exact from={`${match.url}`} to={`${match.url}/activity`}/>
                                {[
                                    ['activity', <Activity {...settingsProps}/>],
                                    ['docs', <Docs {...settingsProps}/>],
                                    ['team', <Team {...settingsProps}/>],
                                    ['plan', <Plan {...settingsProps}/>],
                                    ['pay', <Pay {...settingsProps}/>],
                                    ['settings', <Settings {...settingsProps}/>],
                                ].map(path => {
                                    return (
                                        <Route key={`project-management-path--${path}`} path={`${match.url}/${path[0]}`} render={props => path[1]}/>
                                    );
                                })}
                            </Switch>
                        </div>
                    </div>
                    <div className="project-details float-right">
                        <div className="section font-weight-normal">{project.title}</div>

                        <div className="section">
                            <div className="font-weight-normal">Description</div>
                            <div>{project.description || 'No description'}</div>
                        </div>

                        {project.deadline?(
                            <div className="section">
                                <div className="font-weight-normal">Deadline</div>
                                <div>{project.deadline ? moment.utc(project.deadline).format('Do of MMMM YYYY'): 'Deadline not set'}</div>
                            </div>
                        ):null}

                        <div className="font-weight-normal">Team</div>

                        <div className="section">
                            <div>Project Owner</div>
                            <div>{project.owner ? <Avatar image={project.owner.avatar_url} verified/> : null}</div>
                        </div>

                        <div className="section">
                            <div>Project Manager</div>
                            <div>{project.pm ? <Avatar image={project.pm.avatar_url} verified/> : null}</div>
                        </div>

                        <div className="section">
                            <div>Team</div>
                            <div>{project.participation.map(participation => {
                                return <Avatar key={`Team ${participation.user.id}`} image={participation.user.avatar_url} verified={participation.status === 'accepted'}/>
                            })}
                            </div>
                        </div>
                    </div>
                </div>
            ):null
        );
    }
}
