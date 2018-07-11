import PropTypes from 'prop-types';
import React from 'react';

import IconButton from '../core/IconButton'
import { openModal } from '../core/utils/modals';
import ProjectMemberForm from './modals/ProjectMemberForm';
import DeleteUser from './modals/DeleteProjectMemberForm';
import Avatar from '../core/Avatar';


export default class Team extends React.Component {
    static propTypes = {
        project: PropTypes.object,
        ProjectActions: PropTypes.object,
    };

    renderModal(type, user, title, max) {
        openModal(<ProjectMemberForm type={type} user={user} {...this.props} max={max} />, title);
    }

    deleteUser(user, type){
        openModal(<DeleteUser {...this.props} {...user} type={type} />, '');
    }

    render() {
        const { project } = this.props;
        return (
            <div>
                <div className="project-member">
                    <h6>Project Owner</h6>
                    {project.owner ? (
                        <button className="project-team-member-icon-button"
                            onClick={this.deleteUser.bind(this, project.owner, 'owner')}
                        >
                            <Avatar image={project.owner.avatar_url} remove/>
                        </button>
                    ) : null }
                    <IconButton name="add"
                        size="main"
                        onClick={this.renderModal.bind(this, 'project_owner', 'owner', 'Add project Owner', 1)} />
                </div>
                <div className="project-member">
                    <h6>Project Manager</h6>
                    {project.pm ? (
                        <button className="project-team-member-icon-button"
                            onClick={this.deleteUser.bind(this, project.pm, 'pm')}
                        >
                            <Avatar image={project.pm.avatar_url} remove />
                        </button>
                    ) : null }
                    <IconButton name="add"
                        size="main"
                        onClick={this.renderModal.bind(this, 'project_manager', 'pm', 'Add project Manager', 1)} />
                </div>
                <div className="project-member">
                    <h6>Team</h6>
                    {project.participation.map(team => {
                        return (
                            <button key={`Avatar ${team.id}`} className="project-team-member-icon-button"
                                onClick={this.deleteUser.bind(this, team, 'team')}
                            >
                                <Avatar image={team.user.avatar_url} remove />
                            </button>
                        )
                    })}
                    <IconButton name="add"
                        size="main"
                        onClick={this.renderModal.bind(this, 'developer', 'participation', 'Add team members', 10)} />
                </div>
            </div>
        );
    }
}
