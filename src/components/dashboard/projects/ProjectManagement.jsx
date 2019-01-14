import PropTypes from 'prop-types';
import React from 'react';
import { Switch, Route, Redirect, NavLink } from 'react-router-dom';
import moment from 'moment';
import {withProps} from "recompose";
import Media from "react-media";

import Avatar from '../../core/Avatar';
import Activity from './Activity';
import Docs from './Docs';
import Team from './Team';
import Plan from './Plan';
import PayContainer from './PayContainer';
import Settings from './Settings';
import ProgressEventsContainer from './ProgressEventsContainer';
import Warning from "../../core/Warning";

import {openConfirm} from "../../core/utils/modals";
import {getMyParticipation, hasProjectAccess, isDev, isPendingProjectParticipant} from "../../utils/auth";
import Info from "../../core/Info";

export default class ProjectManagement extends React.Component {

    static propTypes = {
        project: PropTypes.object,
        isSaving: PropTypes.object,
        isSaved: PropTypes.object,
        ProjectActions: PropTypes.object,
        match: PropTypes.object
    };

    constructor(props) {
        super(props);
        this.state = {
            collapsed: false
        }
    }

    componentDidMount() {
        const {project} = this.props, self = this;
        if(isPendingProjectParticipant(project)) {
            openConfirm(
                <div>
                    Accepting this project means you agree to our Code of Conduct.
                    Please read it carefully <a href="https://tunga.io/code-of-conduct" target="_blank">here</a>.
                </div>,
                'Accept Invite?', true,
                {ok: 'Accept', cancel: 'Reject'}
            ).then(response => {
                self.updateParticipationStatus('accepted');
            }, error => {
                self.updateParticipationStatus('rejected');
            });
        }
    }

    updateParticipationStatus(status) {
        const {project, ProjectActions} = this.props;
        const myParticipation = getMyParticipation(project);
        if(myParticipation && myParticipation.id) {
            ProjectActions.updateParticipation(myParticipation.id, {status});
        }
    }

    collapseProjectDetails(collapsed) {
        this.setState({ collapsed })
    }

    render() {
        const {project, isSaving, isSaved, ProjectActions, match} = this.props;
        const projectProps = {project, isSaving, isSaved, ProjectActions};

        return (
            project?(
                <Media query="(min-width: 992px)">
                    {isLargeDevice =>
                        <div className="project-page clearfix">
                            <div className={`${this.state.collapsed && 'collapsed-bar'} project-activity`}>
                                {isLargeDevice?(
                                    <div className="project-filters">
                                        {[
                                            ['activity', 'Meeting room'],
                                            ['docs', 'Documentation'],
                                            ['team', 'Team'],
                                            ['plan', 'Planning'],
                                            ['pay', 'Payments', {exact: false}],
                                            ['settings', isDev()?'Integrations':'Settings', {exact: false}]
                                        ].map(link => {
                                            let url = link[0];
                                            return (
                                                <NavLink key={`project-filters-link--${link[0]}`} exact to={`${match.url}/${url}`} activeClassName="active" {...link[2]}>{link[1]}</NavLink>
                                            )
                                        })}
                                    </div>
                                ):null}

                                <div className="project-activity-wrapper">
                                    {hasProjectAccess(project)?(
                                        <Switch>
                                            <Redirect exact from={`${match.url}`} to={`${match.url}/activity`}/>
                                            {[
                                                ['activity', <Activity {...projectProps}/>],
                                                ...(isLargeDevice?[
                                                    ['docs', <Docs {...projectProps}/>],
                                                    ['team', <Team {...projectProps}/>],
                                                    ['plan', <Plan {...projectProps}/>],
                                                    ['pay', <PayContainer {...projectProps}/>],
                                                ]:[])
                                            ].map(path => {
                                                return (
                                                    <Route key={`project-management-path--${path}`} path={`${match.url}/${path[0]}`} render={props => path[1]}/>
                                                );
                                            })}
                                            <Route key={`project-management-path--settings`}
                                                   path={`${match.url}/settings/:section?`}
                                                   render={props => <Settings {...projectProps} section={props.match.params.section}/>}/>
                                            <Route key={`project-management-path--event`}
                                                   path={`${match.url}/events`}
                                                   render={props => <ProgressEventsContainer project={project} {...props}/>}/>
                                            <Redirect from="*" to={`/projects/${project.id}/activity`}/>
                                        </Switch>
                                    ):(
                                        <Warning message="You don't have permission to access this project's resources"/>
                                    )}
                                </div>
                            </div>

                            {isLargeDevice?(
                                <React.Fragment>
                                {this.state.collapsed ? (
                                    <button className="float-right btn-no-outline" onClick={() => this.collapseProjectDetails(false)}>
                                    <img src={require('../../../assets/images/icons/Menu.svg')} />
                                </button>
                                ) : (
                                    <div className="project-details">
                                    <div className="section">
                                        <div className="font-weight-normal">
                                            Name
                                            <button className="float-right btn-no-outline" onClick={() => this.collapseProjectDetails(true)}>
                                                <img src={require('../../../assets/images/icons/Collapse.svg')} />
                                            </button>
                                        </div>
                                        <div>{project.title}</div>
                                    </div>

                                    <div className="section">
                                        <div className="font-weight-normal">Description</div>
                                        <div>{project.description || 'No description'}</div>
                                    </div>

                                    {project.deadline?(
                                        <div className="section">
                                            <div className="font-weight-normal">Deadline</div>
                                            <div>{project.deadline ? moment(project.deadline).format('Do of MMMM YYYY'): 'Deadline not set'}</div>
                                        </div>
                                    ):null}

                                    <div className="font-weight-normal">Team</div>

                                    <div className="section">
                                        <div>Project Owner</div>
                                        <div>{project.owner ? <Avatar image={project.owner.avatar_url} title={project.owner.display_name} verified/> : null}</div>
                                    </div>

                                    <div className="section">
                                        <div>Project Manager</div>
                                        <div>{project.pm ? <Avatar image={project.pm.avatar_url} title={project.pm.display_name} verified/> : null}</div>
                                    </div>

                                    <div className="section">
                                        <div>Team</div>
                                        <div>{project.participation.map(participation => {
                                            return <Avatar key={`Team ${participation.user.id}`}
                                                           image={participation.user.avatar_url} title={participation.user.display_name}
                                                           verified={participation.status === 'accepted'}/>
                                        })}
                                        </div>
                                    </div>
                                </div>
                                )}
                                
                            </React.Fragment>):null}
                        </div>
                    }
                </Media>
            ):null
        );
    }
}
