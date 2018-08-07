import PropTypes from 'prop-types';
import React from 'react';
import {FormGroup} from 'reactstrap';

import CustomInputGroup from '../../core/CustomInputGroup';
import TextArea from '../../core/TextArea';
import FieldError from '../../core/FieldError';
import Success from '../../core/Success';
import SkillSelector from '../../core/SkillSelector';
import {cleanSkills} from "../../../actions/utils/api";


export default class CompanyProfile extends React.Component {
    static propTypes = {
        user: PropTypes.object,
        isSaving: PropTypes.object,
        isSaved: PropTypes.object,
        errors: PropTypes.object,
        ProfileActions: PropTypes.object,
    };

    constructor(props) {
        super(props);
        const { company } = props.user;
        this.state = {
            company: {
                name: company.name || '',
                website: company.website || '',
                bio: company.bio || '',
                skills: company.skills || ''
            }
        }
    }

    onChangeValue(key, value) {
        let newState = {};
        newState[key] = value;
        this.setState({company: {...this.state.profile, ...newState}});
    }

    onChangeField(key, e) {
        this.onChangeValue(key, e.target.value);
    }

    onChangeSkills(skills) {
        this.onChangeValue('skills', cleanSkills(skills));
    }

    onSave(e) {
        e.preventDefault();
        const {user, ProfileActions} = this.props;
        ProfileActions.updateCompany(user.company.id, this.state.company);
        return;
    }

    render() {
        const { errors } = this.props;
        return (
            <div>
                {this.props.isSaved.company ? (
                    <Success message="Company profile saved successfully" />
                    ): null
                }
                <form onSubmit={this.onSave.bind(this)}>
                    <div className="row">
                        <div className="col-sm-8">
                        {errors.company &&
                            errors.company.name ? (
                                <FieldError
                                    message={errors.company.name}
                                />
                            ) : null}
                            <FormGroup>
                                <label className="control-label">Your Company Name</label>
                                <CustomInputGroup
                                    onChange={this.onChangeField.bind(this, 'name')}
                                    value={this.state.company.name}
                                />
                            </FormGroup>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-8">
                        {errors.company &&
                            errors.company.website ? (
                                <FieldError
                                    message={errors.company.website}
                                />
                            ) : null}
                            <FormGroup>
                                <label className="control-label">Company Website</label>
                                <CustomInputGroup variant="url" onChange={this.onChangeField.bind(this, 'website')}
                                                  value={this.state.company.website}
                                />
                            </FormGroup>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-8">
                        {errors.company &&
                            errors.company.bio ? (
                                <FieldError
                                    message={errors.company.bio}
                                />
                            ) : null}
                            <FormGroup>
                                <label className="control-label">Company Bio</label>
                                <TextArea onChange={this.onChangeField.bind(this, 'bio')}
                                    value={this.state.company.bio}
                                />
                            </FormGroup>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-8">
                        {errors.company &&
                            errors.company.skills ? (
                                <FieldError
                                    message={errors.company.skills}
                                />
                            ) : null}
                            <FormGroup>
                                <label className="control-label">Technologies used by my company</label>
                                <SkillSelector
                                    placeholder="Type here to add a technology, e.g Python, Android or Rails"
                                    onChange={this.onChangeSkills.bind(this)}
                                    value={this.state.company.skills}
                                    selected={this.state.skills}
                                />
                            </FormGroup>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary float-right"
                        disabled={this.props.isSaving.company}
                        >
                        Save
                    </button>
                </form>
            </div>
        );
    }
}
