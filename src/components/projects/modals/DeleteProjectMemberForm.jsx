import React from 'react';
import PropTypes from 'prop-types';

import Button from '../../core/Button';


export default class DeleteUser extends React.Component {
    static propTypes = {
        project: PropTypes.object,
        ProjectActions: PropTypes.object,
        user: PropTypes.shape({
            username: PropTypes.string
        }),
        username: PropTypes.string,
        id: PropTypes.number,
        dismiss: PropTypes.func
    }

    constructor(props) {
        super(props);
        this.deleteUser = this.deleteUser.bind(this);
    }

    componentDidMount() {
        if (this.props.isSaved[this.props.project.id]) {
            this.props.dismiss(); // close the modal
        }
    }

    deleteUser(){
        if (['pm', 'owner'].includes(this.props.type)) {
            let user = {}
            user[this.props.type] = null;
            this.props.ProjectActions.updateProject(this.props.project.id, user);
        } else {
            this.props.ProjectActions.deleteParticipation(this.props.id);
        }
    }
    render() {
        return (
            <div>
                <div className="delete-project-member-modal">
                    <h6>Are you sure you want to delete
                        {this.props.type === 'team' ? ` ${this.props.user.username}` : ` ${this.props.username}`} from project?
                    </h6>
                </div>
                <div>
                    <div className="float-right">
                        <Button  onClick={this.deleteUser} disabled={this.props.isSaving[this.props.project.id]}>Delete user</Button>
                    </div>
                    <div className="float-left">
                        <Button className="float-left"
                            variant='secondary'
                            onClick={() => this.props.dismiss()}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
}
