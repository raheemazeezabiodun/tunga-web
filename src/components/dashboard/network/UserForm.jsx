import React from 'react';
import {FormGroup, Row, Col} from 'reactstrap';
import CustomInputGroup from "../../core/CustomInputGroup";
import FieldError from "../../core/FieldError";
import Select from "../../core/Select";
import Button from "../../core/Button";
import Progress from "../../core/Progress";
import Success from "../../core/Success";
import CountrySelector from '../../core/CountrySelector';
import ChoiceGroup from "../../core/ChoiceGroup";
import InputGroup from "../../core/InputGroup";
import Icon from "../../core/Icon";
import Input from "../../core/Input";

import {USER_TYPE_CHOICES, USER_TYPE_PROJECT_OWNER} from "../../../actions/utils/api";
import connect from "../../../connectors/UserConnector";

const TYPE_INVITE = 'invite';
const TYPE_CLIENT = 'client';

class UserForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {user: {}, type: TYPE_INVITE};
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.User.hasInvited && !prevProps.User.hasInvited) {
            if(window) {
                window.scrollTo(0, 0);
            }
            let newUserState = {};
            Object.keys(this.state.user).forEach(key => {
                newUserState[key] = '';
            });
            this.setState({user: newUserState});
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

        const {UserActions} = this.props;
        if(this.state.type === TYPE_CLIENT) {
            let user = {
                username: this.state.user.email,
                type: USER_TYPE_PROJECT_OWNER,
                source: 3,
                company: {...this.state.user},
            };
            ['first_name', 'last_name', 'email'].forEach(key => {
                user[key] = this.state.user[key];
                delete user.company[key];
            });
            if(user.company && user.company.company) {
                user.company.name = user.company.company;
                delete user.company['company'];
            }
            UserActions.createUser(user);
        } else {
            UserActions.invite(this.state.user);
        }
    };

    render() {
        const {User: {errors, hasInvited, isInviting}} = this.props;

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
                        <ChoiceGroup variant="outline-primary"
                                     selected={this.state.type}
                                     choices={[
                                         [TYPE_INVITE, 'Invite User'],
                                         [TYPE_CLIENT, 'Create Client']
                                     ]}
                                     onChange={(type) => { this.setState({type}); }}/>
                    </FormGroup>

                    <FormGroup>
                        <label>Email: *</label>
                        {errors && errors.invite && errors.invite.email ? (
                            <FieldError message={errors.invite.email} />
                        ) : (
                            errors && errors.invite && errors.invite.username ? (
                                <FieldError message={errors.invite.username} />
                            ) : null
                        )}
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
                                          placeholder="First Name"
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
                                          placeholder="Last Name"
                                          required/>
                    </FormGroup>
                    {this.state.type === TYPE_INVITE?(
                        <React.Fragment>
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
                        </React.Fragment>
                    ):(
                        <React.Fragment>
                            <FormGroup>
                                <label>Company: *</label>
                                {errors && errors.invite && errors.invite.company && errors.invite.company.name ? (
                                    <FieldError message={errors.invite.company.name} />
                                ) : null}
                                <Input onChange={this.onChangeField.bind(this, 'company')}
                                       value={this.state.user.company}
                                       placeholder="Company"
                                       required/>
                            </FormGroup>
                            <Row>
                                <Col className="col-main">
                                    <FormGroup>
                                        <label>Street: *</label>
                                        {errors && errors.invite && errors.invite.company && errors.invite.company.street ? (
                                            <FieldError message={errors.invite.company.street} />
                                        ) : null}
                                        <InputGroup prepend={(<Icon name="map-marker"/>)}
                                                    onChange={this.onChangeField.bind(this, 'street')}
                                                    value={this.state.user.street}
                                                    placeholder="Street"
                                                    required/>
                                    </FormGroup>
                                </Col>
                                <Col md={3}>
                                    <FormGroup>
                                        <label>Number/Plot: *</label>
                                        {errors && errors.invite && errors.invite.company && errors.invite.company.plot_number ? (
                                            <FieldError message={errors.invite.company.plot_number} />
                                        ) : null}
                                        <Input onChange={this.onChangeField.bind(this, 'plot_number')}
                                               value={this.state.user.plot_number}
                                               placeholder="Number/Plot"
                                               required/>
                                    </FormGroup>
                                </Col>
                            </Row>

                            <Row>
                                <Col className="col-main">
                                    <FormGroup>
                                        <label>City: *</label>
                                        {errors && errors.invite && errors.invite.company && errors.invite.company.city ? (
                                            <FieldError message={errors.invite.company.city} />
                                        ) : null}
                                        <InputGroup prepend={(<Icon name="map-marker"/>)}
                                                    onChange={this.onChangeField.bind(this, 'city')}
                                                    value={this.state.user.city}
                                                    placeholder="City"
                                                    required/>
                                    </FormGroup>
                                </Col>
                                <Col md={3}>
                                    <FormGroup>
                                        <label>Zip code: *</label>
                                        {errors && errors.invite && errors.invite.company && errors.invite.company.postal_code ? (
                                            <FieldError message={errors.invite.company.postal_code} />
                                        ) : null}
                                        <Input onChange={this.onChangeField.bind(this, 'postal_code')}
                                               value={this.state.user.postal_code}
                                               placeholder="Zip code"
                                               required/>
                                    </FormGroup>
                                </Col>
                            </Row>
                            <FormGroup>
                                <label className="control-label">Country: *</label>
                                {errors && errors.invite && errors.invite.company && errors.invite.company.country ? (
                                    <FieldError message={errors.invite.company.country} />
                                ) : null}
                                <CountrySelector
                                    onChange={(country) => {this.onChangeValue('country', country)}}
                                    selected={this.state.user.country}
                                />
                            </FormGroup>
                            <FormGroup>
                                <label>VAT Number: </label>
                                {errors && errors.invite && errors.invite.company && errors.invite.company.vat_number ? (
                                    <FieldError message={errors.invite.company.vat_number} />
                                ) : null}
                                <Input onChange={this.onChangeField.bind(this, 'vat_number')}
                                       value={this.state.user.vat_number}
                                       placeholder="VAT Number"/>
                            </FormGroup>
                            <FormGroup>
                                <Button type="submit">Create Client</Button>
                            </FormGroup>
                        </React.Fragment>
                    )}
                </form>
            </div>
        );
    }
}

export default connect(UserForm);
