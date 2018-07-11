import PropTypes from 'prop-types';
import React from 'react';
import {FormGroup} from 'reactstrap';

import TextArea from '../core/TextArea';
import FieldError from '../core/FieldError';
import SkillSelector from '../core/SkillSelector';
import { openModal } from '../core/utils/modals';
import Icon from '../core/Icon';
import WorkForm from './WorkForm';
import EducationForm from './EducationForm';
import Button from "../core/Button";

import {cleanSkills} from "../../actions/utils/api";
import Success from "../core/Success";

export default class Experience extends React.Component {
    static propTypes = {
        user: PropTypes.object,
        isSaving: PropTypes.object,
        isSaved: PropTypes.object,
        errors: PropTypes.object,
        ProfileActions: PropTypes.object,
    };

    constructor(props) {
        super(props);
        const { profile } = props.user;
        this.state = {
            bio: profile.bio,
            skills: profile.skills || []
        }
    }

    filterSkills(category) {
        let filteredSkills = [];
        cleanSkills(this.state.skills).map(skill => {
            if(skill.type === category) {
                filteredSkills.push(skill);
            }
        });
        return filteredSkills;
    }

    onChangeField(key, e) {
        let newState = {};
        newState[key] = e.target.value;
        this.setState(newState);
    }

    onSkillChange(category, skills) {
        let newSkills = cleanSkills(skills).map(skill => {
            return {...skill, type: category};
        });

        let flattenedSkills = newSkills.map(skill => {
            return skill.name;
        });

        let updatedCurrentSkills = [];
        cleanSkills(this.state.skills).forEach(skill => {
            if(flattenedSkills.indexOf(skill.name) === -1) {
                updatedCurrentSkills.push(skill);
            }
        });

        this.setState({skills: [...updatedCurrentSkills, ...newSkills]});
    }

    onAddWork(work = {}, e) {
        e.preventDefault();

        const {ProfileActions, isSaved, errors, isSaving} = this.props;

        openModal(<WorkForm
            ProfileActions={ProfileActions}
            work={work}
            isSaved={isSaved}
            isSaving={isSaving}
            errors={errors}
        />, 'Add work experience');
    }

    onAddEducation(education = {}, e) {
        e.preventDefault();

        const {ProfileActions, isSaved, errors, isSaving} = this.props;

        openModal(<EducationForm
            ProfileActions={ProfileActions}
            education={education}
            isSaved={isSaved}
            isSaving={isSaving}
            errors={errors}
        />, 'Add education');
    }

    onSave = (e) => {
        e.preventDefault();
        const {user, ProfileActions} = this.props;

        ProfileActions.updateProfile(user.profile.id, {
            bio: this.state.bio,
            skills: cleanSkills(this.state.skills)
        });
        return;
    };

    render() {
        const { errors, user } = this.props;

        return (
            <div>
                {this.props.isSaved.profile ? (
                    <Success message="Profile saved successfully" />
                ): null
                }

                <form onSubmit={this.onSave}>
                    <div className="row">
                        <div className="col-sm-8">
                        {errors.profile &&
                            errors.profile.bio ? (
                                <FieldError
                                    message={errors.profile.bio}
                                />
                            ) : null}
                            <FormGroup>
                                <label className="control-label">Your bio</label>
                                <TextArea
                                    placeholder='Type here something about yourself'
                                    onChange={this.onChangeField.bind(this, 'bio')}
                                    defaultValue={this.state.bio}
                                />
                            </FormGroup>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-8">
                        {[
                                {id: 'language', name: 'Languages'},
                                {id: 'framework', name: 'Frameworks'},
                                {id: 'platform', name: 'Platforms'},
                                {id: 'library', name: 'Libraries'},
                                {id: 'storage', name: 'Storage Engines'},
                                {id: 'other', name: 'Miscellaneous'},
                        ].map(category => {
                            return (
                                <FormGroup key={category.id}>
                                    <label className="control-label">{category.name} you master</label>
                                    <SkillSelector
                                            filter={{filter: null}}
                                            onChange={this.onSkillChange.bind(
                                                this,
                                                category.id,
                                            )}
                                            selected={
                                                this.filterSkills(category.id) || []
                                            }
                                            placeholder={`Type here to add ${category.name}`}
                                        />
                                </FormGroup>
                            )
                        })}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-8">
                            <FormGroup>
                                <label className="control-label">Work</label>
                                <div>
                                    <Button onClick={this.onAddWork.bind(this, {})}>
                                        add entry
                                    </Button>
                                </div>
                            </FormGroup>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-8">
                            {user.work.length ? user.work.map((work) => {
                                return (
                                    <div className="card work-education-wrapper">
                                        <div className="card-body">
                                            <div>Position: {work.position}</div>
                                            <div>Company: {work.company}</div>
                                            <div>Period: {work.start_month_display}/{work.start_year} - {work.end_year?`${work.end_month_display}/${work.end_year}`:'Present'}</div>
                                            <br />
                                            <p>{work.details}</p>
                                            <Button
                                                onClick={this.onAddWork.bind(
                                                    this,
                                                    work,
                                                )}>
                                                <Icon name="pencil2" /> Edit
                                            </Button>
                                        </div>
                                    </div>
                                )
                            }): ''}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-8">
                            <FormGroup>
                                <label className="control-label">Education</label>
                                <div>
                                    <Button
                                        className="btn btn-primary"
                                        onClick={this.onAddEducation.bind(this, {})}>
                                        add entry
                                    </Button>
                                </div>
                            </FormGroup>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-8">
                            {user.education.length ? user.education.map((education) => {
                                return (
                                    <div className="card work-education-wrapper">
                                        <div className="card-body">
                                            <div>Educational Institute: {education.institution}</div>
                                            <div>Degree: {education.award}</div>
                                            <div>Period: {education.start_month_display}/{education.start_year} - {education.end_year?`${education.end_month_display}/${education.end_year}`:'Present'}</div>
                                            <br />
                                            <p>{education.details}</p>
                                            <Button
                                                onClick={this.onAddEducation.bind(
                                                    this,
                                                    education,
                                                )}>
                                                <Icon name="pencil2" /> Edit
                                            </Button>
                                        </div>
                                    </div>
                                )
                            }): ''}
                        </div>
                    </div>
                    <Button
                        type="submit"
                        className="float-right"
                        disabled={this.props.isSaving.profile}>
                        Save
                    </Button>
                </form>
            </div>
        );
    }
}
