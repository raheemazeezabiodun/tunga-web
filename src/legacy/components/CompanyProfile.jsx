import React from 'react';

import Progress from './status/Progress';
import FormStatus from './status/FormStatus';
import FieldError from './status/FieldError';
import SkillSelector from '../containers/SkillSelector';

export default class CompanyProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {bio: '', skills: []};
    }

    componentDidMount() {
        this.props.ProfileActions.getCountries();
        this.props.ProfileActions.retrieveProfile();
    }

    componentDidUpdate(prevProps, prevState) {
        if (
            this.props.Profile.profile.skills !=
            prevProps.Profile.profile.skills
        ) {
            this.addSkillsToState();
        }
    }

    onInputChange(key, e) {
        var new_state = {};
        new_state[key] = e.target.value;
        this.setState(new_state);
    }

    onSkillChange(skills) {
        this.setState({skills});
    }

    UNSAFE_componentWillMount() {
        this.addSkillsToState();
    }

    addSkillsToState() {
        const {Profile} = this.props;
        this.setState({
            skills:
                Profile.profile && Profile.profile.skills
                    ? Profile.profile.skills.map(skill => {
                          return skill.name;
                      })
                    : [],
        });
    }

    handleSubmit(e) {
        e.preventDefault();

        var company = this.refs.company.value.trim() || null;
        var bio = this.state.bio;
        var website = this.refs.website.value.trim() || null;
        var vat_number = this.refs.vat_number.value.trim() || null;
        var company_reg_no = this.refs.company_reg_no.value.trim() || null;

        const selected_skills = this.state.skills;
        const skills = selected_skills.join(',') || null;

        const {Profile, ProfileActions} = this.props;
        ProfileActions.updateProfile(Profile.profile.id, {
            company,
            bio,
            website,
            skills,
            vat_number,
            company_reg_no,
        });
        return;
    }

    render() {
        const {Auth, Profile} = this.props;
        const {profile} = Profile;

        return (
            <div>
                {Profile.isRetrieving ? (
                    <Progress />
                ) : (
                    <form
                        onSubmit={this.handleSubmit.bind(this)}
                        name="company_profile"
                        role="form"
                        ref="profile_form">
                        <FormStatus
                            loading={Profile.isSaving.profile}
                            success={Profile.isSaved.profile}
                            message={'Company profile saved'}
                            error={Profile.error.profile}
                        />

                        {Profile.error.profile &&
                        Profile.error.profile.company ? (
                            <FieldError
                                message={Profile.error.profile.company}
                            />
                        ) : null}
                        <div className="form-group">
                            <label className="control-label">Company</label>
                            <div>
                                <input
                                    type="text"
                                    className="form-control"
                                    ref="company"
                                    placeholder="Company"
                                    defaultValue={Profile.profile.company}
                                />
                            </div>
                        </div>

                        {Profile.error.profile && Profile.error.profile.bio ? (
                            <FieldError message={Profile.error.profile.bio} />
                        ) : null}
                        <div className="form-group">
                            <label className="control-label">Company Bio</label>
                            <textarea
                                className="form-control"
                                onChange={this.onInputChange.bind(this, 'bio')}
                                defaultValue={profile.bio}
                                ref="bio"
                                placeholder="Company Bio"
                            />
                        </div>

                        {Profile.error.profile &&
                        Profile.error.profile.website ? (
                            <FieldError
                                message={Profile.error.profile.website}
                            />
                        ) : null}
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

                        {Profile.error.profile &&
                        Profile.error.profile.skills ? (
                            <FieldError
                                message={Profile.error.profile.skills}
                            />
                        ) : null}
                        <div className="form-group">
                            <label className="control-label">
                                Tag skills and products *
                            </label>
                            <SkillSelector
                                filter={{filter: null}}
                                onChange={this.onSkillChange.bind(this)}
                                skills={
                                    this.state.skills ? this.state.skills : []
                                }
                            />
                        </div>

                        {Profile.error.profile &&
                        Profile.error.profile.vat_number ? (
                            <FieldError
                                message={Profile.error.profile.vat_number}
                            />
                        ) : null}
                        <div className="form-group">
                            <label className="control-label">VAT number</label>
                            <div>
                                <input
                                    type="text"
                                    className="form-control"
                                    ref="vat_number"
                                    placeholder="VAT number"
                                    defaultValue={Profile.profile.vat_number}
                                />
                            </div>
                        </div>

                        {Profile.error.profile &&
                        Profile.error.profile.company_reg_no ? (
                            <FieldError
                                message={Profile.error.profile.company_reg_no}
                            />
                        ) : null}
                        <div className="form-group">
                            <label className="control-label">
                                Company Registration Number
                            </label>
                            <div>
                                <input
                                    type="text"
                                    className="form-control"
                                    ref="company_reg_no"
                                    placeholder="Company Registration Number"
                                    defaultValue={
                                        Profile.profile.company_reg_no
                                    }
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn  pull-right"
                            disabled={Profile.isSaving.profile}>
                            Save
                        </button>
                        <div className="clearfix" />
                    </form>
                )}
            </div>
        );
    }
}
