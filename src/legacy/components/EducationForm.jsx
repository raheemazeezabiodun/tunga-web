import React from 'react';
import moment from 'moment';

import FormStatus from './status/FormStatus';
import FieldError from './status/FieldError';

export default class EducationForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {details: ''};
    }

    componentDidMount() {
        const education = this.props.education || {};
        if (education.id) {
            const details = education.details || '';
            this.setState({details});
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (
            this.props.Profile.isSaved.education &&
            !prevProps.Profile.isSaved.education
        ) {
            if (!this.props.education) {
                this.refs.education_form.reset();
                this.setState({details: ''});
            }
        }
    }

    onInputChange(key, e) {
        var new_state = {};
        new_state[key] = e.target.value;
        this.setState(new_state);
    }

    handleSubmit = e => {
        e.preventDefault();
        var institution = this.refs.institution.value.trim();
        var award = this.refs.award.value.trim();
        var start_year = this.refs.start_year.value.trim();
        var start_month = this.refs.start_month.value.trim();
        var end_year = this.refs.end_year.value.trim() || null;
        var end_month = this.refs.end_month.value.trim() || null;
        var details = this.state.details;

        const {ProfileActions} = this.props;
        const education = this.props.education || {};
        const education_info = {
            institution,
            details,
            award,
            start_year,
            start_month,
            end_year,
            end_month,
        };
        if (education.id) {
            ProfileActions.updateEducation(education.id, education_info);
        } else {
            ProfileActions.createEducation(education_info);
        }
        return;
    };

    render() {
        const {Profile} = this.props;
        const education = this.props.education || {};
        var count = 0;
        var months = [];
        while (count <= 12) {
            months.push(
                moment()
                    .month(count++)
                    .format('MMM'),
            );
        }
        var years = [];
        var loop_year = moment().year();
        const min_year = loop_year - 80;
        while (loop_year >= min_year) {
            years.push(loop_year--);
        }
        return (
            <div>
                <form
                    onSubmit={this.handleSubmit}
                    name="education"
                    role="form"
                    ref="education_form">
                    <FormStatus
                        loading={Profile.isSaving.education}
                        success={Profile.isSaved.education}
                        message={'Education details updated successfully'}
                        error={Profile.error.education}
                    />

                    {Profile.error.education &&
                    Profile.error.education.start_year ? (
                        <FieldError
                            message={Profile.error.education.start_year}
                        />
                    ) : null}
                    {Profile.error.education &&
                    Profile.error.education.start_month ? (
                        <FieldError
                            message={Profile.error.education.start_month}
                        />
                    ) : null}
                    <div className="form-group">
                        <label className="control-label">Start Date *</label>
                        <div className="row">
                            <div className="col-xs-6 col-md-3">
                                <select
                                    type="text"
                                    className="form-control"
                                    ref="start_month"
                                    defaultValue={education.start_month}
                                    required>
                                    {months.map((month, idx) => {
                                        return (
                                            <option key={month} value={idx + 1}>
                                                {month}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                            <div className="col-xs-6 col-md-3">
                                <select
                                    type="text"
                                    className="form-control"
                                    ref="start_year"
                                    defaultValue={education.start_year}
                                    required>
                                    {years.map(year => {
                                        return (
                                            <option key={year} value={year}>
                                                {year}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                        </div>
                    </div>

                    {Profile.error.education &&
                    Profile.error.education.end_year ? (
                        <FieldError
                            message={Profile.error.education.end_year}
                        />
                    ) : null}
                    {Profile.error.education &&
                    Profile.error.education.end_month ? (
                        <FieldError
                            message={Profile.error.education.end_month}
                        />
                    ) : null}
                    <div className="form-group">
                        <label className="control-label">End Date</label>
                        <div className="row">
                            <div className="col-xs-6 col-md-3">
                                <select
                                    type="text"
                                    className="form-control"
                                    ref="end_month"
                                    defaultValue={education.end_month}>
                                    <option value="">-- month --</option>
                                    {months.map((month, idx) => {
                                        return (
                                            <option key={month} value={idx + 1}>
                                                {month}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                            <div className="col-xs-6 col-md-3">
                                <select
                                    type="text"
                                    className="form-control"
                                    ref="end_year"
                                    defaultValue={education.end_year}>
                                    <option value="">-- year --</option>
                                    {years.map(year => {
                                        return (
                                            <option key={year} value={year}>
                                                {year}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                        </div>
                    </div>

                    {Profile.error.education &&
                    Profile.error.education.institution ? (
                        <FieldError
                            message={Profile.error.education.institution}
                        />
                    ) : null}
                    <div className="form-group">
                        <label className="control-label">Institution *</label>
                        <div>
                            <input
                                type="text"
                                className="form-control"
                                ref="institution"
                                required
                                placeholder="Institution"
                                defaultValue={education.institution}
                            />
                        </div>
                    </div>

                    {Profile.error.education &&
                    Profile.error.education.award ? (
                        <FieldError message={Profile.error.education.award} />
                    ) : null}
                    <div className="form-group">
                        <label className="control-label">Award *</label>
                        <div>
                            <input
                                type="text"
                                className="form-control"
                                ref="award"
                                required
                                placeholder="Award"
                                defaultValue={education.award}
                            />
                        </div>
                    </div>

                    {Profile.error.education &&
                    Profile.error.education.details ? (
                        <FieldError message={Profile.error.education.details} />
                    ) : null}
                    <div className="form-group">
                        <label className="control-label">Details *</label>
                        <textarea
                            className="form-control"
                            onChange={this.onInputChange.bind(this, 'details')}
                            defaultValue={education.details}
                            ref="details"
                            placeholder="Details"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn  pull-right"
                        disabled={Profile.isSaving.education}>
                        Save{education.id ? ' Changes' : null}
                    </button>
                    <div className="clearfix" />
                </form>
            </div>
        );
    }
}
