import PropTypes from 'prop-types';
import React from 'react';

import IconButton from '../core/IconButton'
import {openConfirm, openModal} from '../core/utils/modals';
import ProjectMemberForm from './modals/ProjectMemberForm';
import Avatar from '../core/Avatar';

import {isAdminOrClient, isAdminOrPM, isAdminOrPMOrClient} from '../utils/auth';

export default class Team extends React.Component {
    static propTypes = {
        project: PropTypes.object,
        ProjectActions: PropTypes.object,
    };

    onAddUsers(type, title, max) {
        const typeMap = {
            'pm': 'project_manager',
            'owner': 'project_owner',
            'dev': 'developer'
        };

        openModal(
            <ProjectMemberForm type={typeMap[type]} max={max} />, title, true, {size: 'sm'}
        ).then(users => {
            if(users && users.length) {
                const {project, ProjectActions} = this.props,
                    reqData = {};

                if (type === 'dev') {
                    reqData.participation = users.map(user => {
                        return {user: {id: user.id}};
                    });
                } else {
                    reqData[type] = {id: users[0].id};
                }

                ProjectActions.updateProject(project.id, reqData);
            }
        }, error => {
            console.log('error: ', error);
        });
    }

    onDeleteUser(user, type, participation){
        openConfirm(
            <div className="font-weight-medium">Are you sure you want to delete<br/>{user.display_name} from the project?</div>,
            '', false, {ok: 'Delete user'}
        ).then(response => {
            const {project, ProjectActions} = this.props;
            if (['pm', 'owner'].includes(type)) {
                let reqData = {};
                reqData[type] = null;
                ProjectActions.updateProject(project.id, reqData);
            } else if(participation) {
                ProjectActions.deleteParticipation(participation.id);
            }
        }, error => {

        });
    }

    render() {
        const { project } = this.props;
        return (
            <div>
                <div className="project-member">
                    <div className="font-weight-normal">Project Owner</div>
                    {project.owner ? (
                        <Avatar image={project.owner.avatar_url}
                                title={project.owner.display_name}
                                onRemove={this.onDeleteUser.bind(this, project.owner, 'owner')}
                                remove={isAdminOrPM() && !project.archived}/>
                    ) : null }
                    {isAdminOrPM() && !project.archived?(
                        <IconButton name="add"
                                    size="main"
                                    onClick={this.onAddUsers.bind(this, 'owner', 'Add project Owner', 1)} />
                    ):null}
                </div>
                <div className="project-member">
                    <div className="font-weight-normal">Project Manager</div>
                    {project.pm ? (
                        <Avatar image={project.pm.avatar_url}
                                title={project.pm.display_name}
                                onRemove={this.onDeleteUser.bind(this, project.pm, 'pm')}
                                remove={isAdminOrClient() && !project.archived} />
                    ) : null }
                    {isAdminOrClient() && !project.archived?(
                        <IconButton name="add"
                                    size="main"
                                    onClick={this.onAddUsers.bind(this, 'pm', 'Add project Manager', 1)} />
                    ):null}
                </div>
                <div className="project-member">
                    <div className="font-weight-normal">Team</div>
                    {project.participation.map(participation => {
                        return (
                            <Avatar key={participation.id}
                                    image={participation.user.avatar_url}
                                    title={participation.user.display_name}
                                    onRemove={this.onDeleteUser.bind(this, participation.user, 'dev', participation)}
                                    remove={isAdminOrPMOrClient() && !project.archived} />
                        )
                    })}
                    {isAdminOrPMOrClient() && !project.archived?(
                        <IconButton name="add"
                                    size="main"
                                    onClick={this.onAddUsers.bind(this, 'dev', 'Add team members', 0)} />
                    ):null}
                </div>
            </div>
        );
    }
}
