import PropTypes from 'prop-types';
import React from 'react';
import {FormGroup} from 'reactstrap';

import CustomInputGroup from '../core/CustomInputGroup';
import Upload from '../core/Upload';
import Icon from '../core/Icon';
import CountrySelector from '../core/CountrySelector';
import Avatar from '../core/Avatar';
import FieldError from '../core/FieldError';
import Success from '../core/Success';


export default class Profile extends React.Component {
    static propTypes = {
        user: PropTypes.object,
        isSaving: PropTypes.object,
        isSaved: PropTypes.object,
        errors: PropTypes.object,
        ProfileActions: PropTypes.object,
    };

    constructor(props) {
        super(props);
        const {user} = props;
        this.state = {
            profile: {
                first_name: user.first_name,
                last_name: user.last_name,
                //image: user.image || '',
                phone_number: user.profile.phone_number || '',
                street: user.profile.street || '',
                plot_number: user.profile.plot_number || '',
                city: user.profile.city || '',
                postal_code: user.profile.postal_code || '',
                country: user.profile.country || '',
                //id_document: user.profile.id_document || ''
            }
        }
    }

    onChangeValue(key, value) {
        let newState = {};
        newState[key] = value;
        this.setState({profile: {...this.state.profile, ...newState}});
    }

    onChangeField(key, e) {
        this.onChangeValue(key, e.target.value);
    }

    onChangeFile(key, files) {
        this.onChangeValue(key, files[0]);
    }

    onSave = (e) => {
        e.preventDefault();
        const {user, ProfileActions} = this.props;

        let profile = this.state.profile, nestedUser = {};

        ['first_name', 'last_name', 'image'].forEach(key => {
            if(profile[key]) {
                nestedUser[key] = profile[key] || '';
            }
            delete profile[key];
        });

        ProfileActions.updateProfile(user.profile.id, {...profile, user: {id: user.id, nestedUser}});
        return;
    };

    render() {
        const {user, errors} = this.props;
        return (
            <div>
                {this.props.isSaved.profile ? (
                    <Success message="Profile saved successfully" />
                    ): null
                }
                <form method="post" onSubmit={this.onSave}>
                    <div className="row">
                        <div className="col-sm-8">
                        {errors.profile &&
                            errors.profile.first_name ? (
                                <FieldError
                                    message={errors.profile.first_name}
                                />
                            ) : null}
                            <FormGroup>
                                <label className="control-label">First Name</label>
                                <CustomInputGroup variant="personal"
                                                  onChange={this.onChangeField.bind(this, 'first_name')}
                                                  value={this.state.profile.first_name}
                                />
                            </FormGroup>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-8">
                        {errors.profile &&
                            errors.profile.last_name ? (
                                <FieldError
                                    message={errors.profile.last_name}
                                />
                            ) : null}
                            <FormGroup>
                                <label className="control-label">Last Name</label>
                                <CustomInputGroup variant="personal"
                                                  onChange={this.onChangeField.bind(this, 'last_name')}
                                                  value={this.state.profile.last_name}
                                />
                            </FormGroup>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-8">
                        {errors.profile &&
                            errors.profile.phone_number ? (
                                <FieldError
                                    message={errors.profile.phone_number}
                                />
                            ) : null}
                            <FormGroup>
                                <label className="control-label">Phone Number</label>
                                <CustomInputGroup variant="tel"
                                                  onChange={this.onChangeField.bind(this, 'phone_number')}
                                                  value={this.state.profile.phone_number}
                                />
                            </FormGroup>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-8">
                        {errors.profile &&
                            errors.profile.image ? (
                                <FieldError
                                    message={errors.profile.image}
                                />
                            ) : null}
                            <FormGroup>
                                <label className="control-label">Picture</label>
                                <Upload
                                    type='image'
                                    placeholder={user.avatar_url?<Avatar image={user.avatar_url} size="lg"/>:<Icon name='avatar' size='xl' />}
                                    onChange={this.onChangeFile.bind(this, 'image')}
                                />
                            </FormGroup>
                        </div>
                    </div>

                    {user.is_project_owner?null:(
                        <div>
                            {/* Clients don't get this section */}
                            <div className="row">
                                <div className="col-sm-8">
                                    {errors.profile &&
                                    errors.profile.street ? (
                                        <FieldError
                                            message={errors.profile.street}
                                        />
                                    ) : null}
                                    <FormGroup>
                                        <label className="control-label">Street</label>
                                        <CustomInputGroup variant="address"
                                                          onChange={this.onChangeField.bind(this, 'street')}
                                                          value={this.state.profile.street}
                                        />
                                    </FormGroup>
                                </div>
                                <div className="col-sm-4">
                                    {errors.profile &&
                                    errors.profile.plot_number ? (
                                        <FieldError
                                            message={errors.profile.plot_number}
                                        />
                                    ) : null}
                                    <FormGroup>
                                        <label className="control-label">Number/Plot</label>
                                        <CustomInputGroup onChange={this.onChangeField.bind(this, 'plot_number')}
                                                          value={this.state.profile.plot_number}
                                        />
                                    </FormGroup>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-8">
                                    {errors.profile &&
                                    errors.profile.city ? (
                                        <FieldError
                                            message={errors.profile.city}
                                        />
                                    ) : null}
                                    <FormGroup>
                                        <label className="control-label">City</label>
                                        <CustomInputGroup variant="address"
                                                          onChange={this.onChangeField.bind(this, 'city')}
                                                          value={this.state.profile.city}
                                        />
                                    </FormGroup>
                                </div>
                                <div className="col-sm-4">
                                    {errors.profile &&
                                    errors.profile.postal_code ? (
                                        <FieldError
                                            message={errors.profile.postal_code}
                                        />
                                    ) : null}
                                    <FormGroup>
                                        <label className="control-label">Zip code</label>
                                        <CustomInputGroup onChange={this.onChangeField.bind(this, 'postal_code')}
                                                          value={this.state.profile.postal_code}/>
                                    </FormGroup>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-8">
                                    {errors.profile &&
                                    errors.profile.country ? (
                                        <FieldError
                                            message={errors.profile.country}
                                        />
                                    ) : null}
                                    <FormGroup>
                                        <label className="control-label">Country</label>
                                        <CountrySelector
                                            onChange={(country) => {this.onChangeValue('country', country)}}
                                            selected={this.state.profile.country}
                                        />
                                    </FormGroup>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-8">
                                    {errors.profile &&
                                    errors.profile.id_document ? (
                                        <FieldError
                                            message={errors.profile.id_document}
                                        />
                                    ) : null}
                                    <FormGroup>
                                        <label className="control-label">Upload ID (passport or national ID card)</label>
                                        <Upload
                                            type='image'
                                            placeholder={user.profile.id_document?<img src={user.profile.id_document} height="150px" title="ID document"/>:<Icon name='id' size='xl' />}
                                            onChange={this.onChangeFile.bind(this, 'id_document')}
                                        />
                                    </FormGroup>
                                </div>
                            </div>
                        </div>
                    )}
                    <button
                        type="submit"
                        className="btn btn-primary float-right"
                        disabled={this.props.isSaving.profile}
                        >
                        Save
                    </button>
                </form>
            </div>
        );
    }
}
