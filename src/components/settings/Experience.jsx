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
            skills_details: profile.skills_details || {}
        }
    }

    onChangeField(key, e) {
        let newState = {};
        newState[key] = e.target.value;
        this.setState(newState);
    }

    onSkillChange(category, skills) {
        let new_state = {};
        new_state[category] = skills;
        this.setState({
            skills_details: {...this.state.skills_details, ...new_state},
        });
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

        let all_skills = [];
        const skills_details = this.state.skills_details;
        if (skills_details) {
            Object.keys(skills_details).forEach(category => {
                all_skills = all_skills.concat(skills_details[category]);
            });
        }

        ProfileActions.updateProfile(user.profile.id, {
            bio: this.state.bio,
            skills: cleanSkills(all_skills)
        });
        return;
    };

    render() {
        const { errors, user } = this.props;

        return (
            <div>
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
                        ].map(skill => {
                            return (
                                <FormGroup key={skill.id}>
                                    <label className="control-label">{skill.name} you master</label>
                                    <SkillSelector
                                            filter={{filter: null}}
                                            onChange={this.onSkillChange.bind(
                                                this,
                                                skill.id,
                                            )}
                                            selected={
                                                this.state.skills_details?(this.state.skills_details[skill.id] || []): []
                                            }
                                            placeholder={`Type here to add ${skill.name}`}
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
                                            <p>Position: {work.position}</p>
                                            <p>Company: {work.company}</p>
                                            <p>Period: {work.start_month_display}/{work.start_year} - {work.end_month_display}/{work.end_year}</p>
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
                                            <p>Educational Institute: {education.institution}</p>
                                            <p>Degree: {education.award}</p>
                                            <p>Period: {education.start_month_display}/{education.start_year} - {education.end_month_display}/{education.end_year}</p>
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
