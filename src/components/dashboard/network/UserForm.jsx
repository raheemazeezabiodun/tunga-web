import React from 'react';
import {FormGroup} from 'reactstrap';
import CustomInputGroup from "../../core/CustomInputGroup";
import FieldError from "../../core/FieldError";
import Select from "../../core/Select";
import Button from "../../core/Button";
import Progress from "../../core/Progress";
import Success from "../../core/Success";

import {USER_TYPE_CHOICES} from "../../../actions/utils/api";
import connect from "../../../connectors/AuthConnector";

class UserForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {user: {}};
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.Auth.hasInvited && !prevProps.Auth.hasInvited) {
            this.setState({user: {}});
        }
    }

    onChangeValue(key, value) {
        let newState = {};
        newState[key] = value;
        this.setState({user: {...this.state.user, ...newState}});
    }

    onChangeField(key, e) {
        this.onChangeValue(key, e.target.value);
    }

    onSave = (e) => {
        e.preventDefault();

        const {AuthActions} = this.props;
        AuthActions.invite(this.state.user);
    };

    render() {
        const {Auth: {errors, hasInvited, isInviting}} = this.props;

        return (
            <div className="content-card invite-user-card">
                <form onSubmit={this.onSave}>
                    {hasInvited?(
                        <Success message="Invitation sent successfully!"/>
                    ):null}

                    {isInviting?(
                        <Progress/>
                    ):null}

                    <FormGroup>
                        <label>Email: *</label>
                        {errors && errors.invite && errors.invite.email ? (
                            <FieldError message={errors.invite.email} />
                        ) : null}
                        <CustomInputGroup variant="email"
                                          onChange={this.onChangeField.bind(this, 'email')}
                                          value={this.state.user.email}
                                          required/>
                    </FormGroup>
                    <FormGroup>
                        <label>First Name: *</label>
                        {errors && errors.invite && errors.invite.first_name ? (
                            <FieldError message={errors.invite.first_name} />
                        ) : null}
                        <CustomInputGroup variant="personal"
                                          onChange={this.onChangeField.bind(this, 'first_name')}
                                          value={this.state.user.first_name}
                                          required/>
                    </FormGroup>
                    <FormGroup>
                        <label>Last Name: *</label>
                        {errors && errors.invite && errors.invite.last_name ? (
                            <FieldError message={errors.invite.last_name} />
                        ) : null}
                        <CustomInputGroup variant="personal"
                                          onChange={this.onChangeField.bind(this, 'last_name')}
                                          value={this.state.user.last_name}
                                          required/>
                    </FormGroup>
                    <FormGroup>
                        <label>User Type: *</label>
                        {errors && errors.invite && errors.invite.type ? (
                            <FieldError message={errors.invite.type} />
                        ) : null}
                        <Select options={USER_TYPE_CHOICES.map(item => {return [item.id, item.name]})}
                                onChange={value => this.onChangeValue('type', value)}
                                selected={this.state.user.type}
                                required/>
                    </FormGroup>
                    <FormGroup>
                        {errors && errors.invite && errors.invite.resend ? (
                            <FieldError message={errors.invite.resend} />
                        ) : null}
                        <div className="form-check">
                            <input className="form-check-input"
                                   id="resend-user-invite"
                                   type="checkbox"
                                   checked={this.state.resend}
                                   onChange={e => this.onChangeValue('resend', e.target.checked)}
                            />
                            <label className="form-check-label" htmlFor="resend-user-invite">
                                Resend Invite if user is already invited
                            </label>
                        </div>
                    </FormGroup>
                    <FormGroup>
                        <Button type="submit">Invite User</Button>
                    </FormGroup>
                </form>
            </div>
        );
    }
}

export default connect(UserForm);
