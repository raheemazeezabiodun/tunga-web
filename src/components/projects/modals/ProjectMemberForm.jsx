import React from 'react';
import {FormGroup, Row} from 'reactstrap';
import PropTypes from 'prop-types';

import UserSelector from '../../core/UserSelector';
import Button from '../../core/Button';


export default class ProjectMemberForm extends React.Component {
    static propTypes = {
        project: PropTypes.object,
        ProjectActions: PropTypes.object,
        user: PropTypes.string,
        dismiss: PropTypes.func
    };

    constructor(props) {
        super(props);
        this.state = {
            user: []
        };
    }

    componentDidMount() {
        if (this.props.isSaved[this.props.project.id]) {
            this.props.dismiss(); // close the modal
        }
    }

    onSelectUser = (selected) => {
        if (this.props.user === 'participation') {
            this.setState({ user: selected });
        } else {
            this.setState({ user: selected[0].id })
        }
    };

    onSave = (e) => {
        e.preventDefault();
        const {ProjectActions, project, user} = this.props;
        const user_type = {};
        if (user === 'participation') {
            let users = [];
            this.state.user.map((data) => {
                let user = {id: data.id}
                users.push({user});
            });
            user_type[user] = users;
        } else {
            user_type[user] = {id: this.state.user}
        }
        ProjectActions.updateProject(project.id, {
            ...user_type
        });
    }

    render() {
        return (
            <div className="project-team">
                <form onSubmit={this.onSave}>
                    <FormGroup>
                        <UserSelector account_type={this.props.type}
                            onChange={this.onSelectUser.bind(this)}
                            variant='bottom'
                            max={this.props.max}
                        />
                    </FormGroup>
                    <div className="float-right add-button">
                        <Button onClick={this.onSave} disabled={this.props.isSaving[this.props.project.id]}>Save</Button>
                    </div>
                </form>
            </div>
        );
    }
}
