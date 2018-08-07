import React from 'react';
import Linkify from './Linkify';
import _ from 'lodash';

import Progress from './status/Progress';
import FormStatus from './status/FormStatus';
import FieldError from './status/FieldError';
import SkillSelector from '../containers/SkillSelector';
import LargeModal from './LargeModal';
import WorkForm from './WorkForm';
import EducationForm from './EducationForm';

export default class Stack extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bio: '',
            skills_details: {},
            editWork: null,
            editEducation: null,
            reset: false,
            skill_categories: {},
        };
    }

    componentDidMount() {
        this.props.ProfileActions.retrieveProfile();
    }

    componentDidUpdate(prevProps, prevState) {
        if (
            !_.isEqual(
                this.props.Profile.profile.skills,
                prevProps.Profile.profile.skills,
            ) ||
            (this.props.Profile.isSaved.profile &&
                !prevProps.Profile.isSaved.profile)
        ) {
            this.addSkillsToState();
        }
    }

    onInputChange(key, e) {
        var new_state = {};
        new_state[key] = e.target.value;
        this.setState(new_state);
    }

    onSkillChange(category, skills) {
        let new_state = {};
        new_state[category] = skills;
        this.setState({
            skill_categories: {...this.state.skill_categories, ...new_state},
        });
    }

    UNSAFE_componentWillMount() {
        this.addSkillsToState();
    }

    addSkillsToState() {
        const {Profile} = this.props;
        var skill_categories = {},
            skills_details = Profile.profile.skills_details || {};
        Object.keys(skills_details).forEach(category => {
            skill_categories[category] = this.flattenSkills(
                skills_details[category],
            );
        });
        this.setState({
            skill_categories,
            skills_details: skills_details,
            reset: true,
        });

        let stack = this;
        setTimeout(function() {
            stack.setState({reset: false});
        }, 500);
    }

    close() {
        this.setState({showModal: false});
    }

    flattenSkills(skills) {
        return (skills || []).map(skill => {
            return skill.name;
        });
    }

    handleAddEducation(education = null) {
        this.setState({
            modalContent: 'education',
            modalTitle: 'Education',
            editEducation: education,
        });
        this.open();
    }

    handleAddWork(work = null) {
        this.setState({
            modalContent: 'work',
            modalTitle: 'Work Experience',
            editWork: work,
        });
        this.open();
    }

    handleSubmit = e => {
        e.preventDefault();
        var website = this.refs.website ? this.refs.website.value.trim() : null;
        var bio = this.state.bio;
        var all_skills = [];
        const skill_categories = this.state.skill_categories;
        if (skill_categories) {
            Object.keys(skill_categories).forEach(category => {
                all_skills = all_skills.concat(skill_categories[category]);
            });
        }
        const skills = all_skills.join(',') || '';

        const {Profile, ProfileActions} = this.props;
        var profile_info = {website, bio, skills, skill_categories};
        ProfileActions.updateProfile(Profile.profile.id, profile_info);
        return;
    };

    open() {
        this.setState({showModal: true});
    }

    renderModalContent() {
        const {ProfileActions, Profile, Auth} = this.props;
        return (
            <LargeModal
                title={this.state.modalTitle}
                show={this.state.showModal}
                onHide={this.close.bind(this)}>
                {this.state.modalContent == 'work' ? (
                    <WorkForm
                        Auth={Auth}
                        Profile={Profile}
                        ProfileActions={ProfileActions}
                        work={this.state.editWork}
                    />
                ) : null}
                {this.state.modalContent == 'education' ? (
                    <EducationForm
                        Auth={Auth}
                        Profile={Profile}
                        ProfileActions={ProfileActions}
                        education={this.state.editEducation}
                    />
                ) : null}
            </LargeModal>
        );
    }

    render() {
        const {Profile, Auth} = this.props;
        const {profile} = Profile;

        return (
            <div>
                {Profile.isRetrieving ? (
                    <Progress />
                ) : (
                    <form
                        onSubmit={this.handleSubmit}
                        name="profile"
                        role="form"
                        ref="profile_form"
                        className="clearfix">
                        <FormStatus
                            loading={Profile.isSaving.profile}
                            success={Profile.isSaved.profile}
                            message={'Profile Saved'}
                            error={Profile.error.profile}
                        />

                        {Profile.error.profile && Profile.error.profile.bio ? (
                            <FieldError message={Profile.error.profile.bio} />
                        ) : null}
                        <div className="form-group">
                            <label className="control-label">Bio</label>
                            <textarea
                                className="form-control"
                                onChange={this.onInputChange.bind(this, 'bio')}
                                defaultValue={profile.bio}
                                ref="bio"
                                placeholder="Bio"
                            />
                        </div>

                        {Auth.user.is_project_owner &&
                        Profile.error.profile &&
                        Profile.error.profile.website ? (
                            <FieldError
                                message={Profile.error.profile.website}
                            />
                        ) : null}
                        {Auth.user.is_project_owner ? (
                            <div className="form-group">
                                <label className="control-label">Website</label>
                                <div>
                                    <input
                                        type="text"
                                        className="form-control"
                                        ref="website"
                                        placeholder="Website"
                                        defaultValue={Profile.profile.website}
                                    />
                                </div>
                            </div>
                        ) : null}

                        {Profile.error.profile &&
                        Profile.error.profile.skills &&
                        Profile.error.profile.skills.languages ? (
                            <FieldError
                                message={Profile.error.profile.skills.languages}
                            />
                        ) : null}

                        {[
                            {id: 'language', name: 'Languages'},
                            {id: 'framework', name: 'Frameworks'},
                            {id: 'platform', name: 'Platforms'},
                            {id: 'library', name: 'Libraries'},
                            {id: 'storage', name: 'Storage Engines'},
                            {id: 'other', name: 'Miscellaneous', tag: 'skill'},
                        ].map(category => {
                            return (
                                <div className="form-group">
                                    <label className="control-label">
                                        {category.name}
                                    </label>
                                    <SkillSelector
                                        filter={{filter: null}}
                                        onChange={this.onSkillChange.bind(
                                            this,
                                            category.id,
                                        )}
                                        skills={
                                            this.state.skills_details
                                                ? this.flattenSkills(
                                                      this.state.skills_details[
                                                          category.id
                                                      ],
                                                  ) || []
                                                : []
                                        }
                                        reset={this.state.reset}
                                        tagName={category.tag || category.id}
                                    />
                                </div>
                            );
                        })}

                        {Auth.user.is_developer ? (
                            <div>
                                <div className="form-group">
                                    <label className="control-label">
                                        Work Experience
                                    </label>
                                    <div className="pull-right clearfix">
                                        <button
                                            type="button"
                                            className="btn"
                                            onClick={this.handleAddWork.bind(
                                                this,
                                            )}>
                                            <i className="fa fa-plus-circle" />{' '}
                                            Add Entry
                                        </button>
                                    </div>
                                    <div className="clearfix" />
                                    <div>
                                        {Profile.work.ids.map(id => {
                                            var item = Profile.work.items[id];
                                            return (
                                                <div
                                                    key={item.id}
                                                    className="card"
                                                    style={{margin: '5px 0'}}>
                                                    <div>
                                                        <strong>
                                                            Position:{' '}
                                                            {item.position}
                                                        </strong>
                                                    </div>
                                                    <div>
                                                        <strong>
                                                            Company:{' '}
                                                            {item.company}
                                                        </strong>
                                                    </div>
                                                    <div>
                                                        Period:{' '}
                                                        {
                                                            item.start_month_display
                                                        }/{item.start_year} -{' '}
                                                        {item.end_year
                                                            ? `${
                                                                  item.end_month_display
                                                              }/${
                                                                  item.end_year
                                                              }`
                                                            : 'Present'}
                                                    </div>
                                                    <div className="short-description">
                                                        <Linkify
                                                            properties={{
                                                                target:
                                                                    '_blank',
                                                            }}>
                                                            {item.details}
                                                        </Linkify>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        className="btn"
                                                        onClick={this.handleAddWork.bind(
                                                            this,
                                                            item,
                                                        )}>
                                                        <i className="fa fa-pencil" />{' '}
                                                        Edit
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="control-label">
                                        Education
                                    </label>
                                    <div className="pull-right clearfix">
                                        <button
                                            type="button"
                                            className="btn"
                                            onClick={this.handleAddEducation.bind(
                                                this,
                                            )}>
                                            <i className="fa fa-plus-circle" />{' '}
                                            Add Entry
                                        </button>
                                    </div>
                                    <div className="clearfix" />
                                    <div>
                                        {Profile.education.ids.map(id => {
                                            var item =
                                                Profile.education.items[id];
                                            return (
                                                <div
                                                    key={item.id}
                                                    className="card"
                                                    style={{margin: '5px 0'}}>
                                                    <div>
                                                        <strong>
                                                            Institution:{' '}
                                                            {item.institution}
                                                        </strong>
                                                    </div>
                                                    <div>
                                                        <strong>
                                                            Award: {item.award}
                                                        </strong>
                                                    </div>
                                                    <div>
                                                        Period:{' '}
                                                        {
                                                            item.start_month_display
                                                        }/{item.start_year} -{' '}
                                                        {item.end_year
                                                            ? `${
                                                                  item.end_month_display
                                                              }/${
                                                                  item.end_year
                                                              }`
                                                            : 'Present'}
                                                    </div>
                                                    <div className="short-description">
                                                        <Linkify
                                                            properties={{
                                                                target:
                                                                    '_blank',
                                                            }}>
                                                            {item.details}
                                                        </Linkify>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        className="btn"
                                                        onClick={this.handleAddEducation.bind(
                                                            this,
                                                            item,
                                                        )}>
                                                        <i className="fa fa-pencil" />{' '}
                                                        Edit
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        ) : null}

                        <button
                            type="submit"
                            className="btn  pull-right"
                            disabled={Profile.isSaving.profile}>
                            Save
                        </button>
                    </form>
                )}
                {this.renderModalContent()}
            </div>
        );
    }
}
