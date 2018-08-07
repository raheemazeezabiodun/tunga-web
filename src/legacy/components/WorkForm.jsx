import React from 'react';
import moment from 'moment';

import FormStatus from './status/FormStatus';
import FieldError from './status/FieldError';

export default class WorkForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {details: ''};
    }

    componentDidMount() {
        const work = this.props.work || {};
        if (work.id) {
            const details = work.details || '';
            this.setState({details});
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (
            this.props.Profile.isSaved.work &&
            !prevProps.Profile.isSaved.work
        ) {
            if (!this.props.work) {
                this.refs.work_form.reset();
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
        var company = this.refs.company.value.trim();
        var position = this.refs.position.value.trim();
        var start_year = this.refs.start_year.value.trim();
        var start_month = this.refs.start_month.value.trim();
        var end_year = this.refs.end_year.value.trim() || null;
        var end_month = this.refs.end_month.value.trim() || null;
        var details = this.state.details;

        const {ProfileActions} = this.props;
        const work = this.props.work || {};
        const work_info = {
            company,
            details,
            position,
            start_year,
            start_month,
            end_year,
            end_month,
        };
        if (work.id) {
            ProfileActions.updateWork(work.id, work_info);
        } else {
            ProfileActions.createWork(work_info);
        }
        return;
    };

    render() {
        const {Profile} = this.props;
        const work = this.props.work || {};
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
                    name="work"
                    role="form"
                    ref="work_form">
                    <FormStatus
                        loading={Profile.isSaving.work}
                        success={Profile.isSaved.work}
                        message={'Work experience updated successfully'}
                        error={Profile.error.work}
                    />

                    {Profile.error.work && Profile.error.work.start_year ? (
                        <FieldError message={Profile.error.work.start_year} />
                    ) : null}
                    {Profile.error.work && Profile.error.work.start_month ? (
                        <FieldError message={Profile.error.work.start_month} />
                    ) : null}
                    <div className="form-group">
                        <label className="control-label">Start Date *</label>
                        <div className="row">
                            <div className="col-xs-6 col-md-3">
                                <select
                                    type="text"
                                    className="form-control"
                                    ref="start_month"
                                    defaultValue={work.start_month}
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
                                    defaultValue={work.start_year}
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

                    {Profile.error.work && Profile.error.work.end_year ? (
                        <FieldError message={Profile.error.work.end_year} />
                    ) : null}
                    {Profile.error.work && Profile.error.work.end_month ? (
                        <FieldError message={Profile.error.work.end_month} />
                    ) : null}
                    <div className="form-group">
                        <label className="control-label">End Date</label>
                        <div className="row">
                            <div className="col-xs-6 col-md-3">
                                <select
                                    type="text"
                                    className="form-control"
                                    ref="end_month"
                                    defaultValue={work.end_month}>
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
                                    defaultValue={work.end_year}>
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

                    {Profile.error.work && Profile.error.work.company ? (
                        <FieldError message={Profile.error.work.company} />
                    ) : null}
                    <div className="form-group">
                        <label className="control-label">Company *</label>
                        <div>
                            <input
                                type="text"
                                className="form-control"
                                ref="company"
                                required
                                placeholder="Company"
                                defaultValue={work.company}
                            />
                        </div>
                    </div>

                    {Profile.error.work && Profile.error.work.position ? (
                        <FieldError message={Profile.error.work.position} />
                    ) : null}
                    <div className="form-group">
                        <label className="control-label">Position *</label>
                        <div>
                            <input
                                type="text"
                                className="form-control"
                                ref="position"
                                required
                                placeholder="Position"
                                defaultValue={work.position}
                            />
                        </div>
                    </div>

                    {Profile.error.work && Profile.error.work.details ? (
                        <FieldError message={Profile.error.work.details} />
                    ) : null}
                    <div className="form-group">
                        <label className="control-label">Details *</label>
                        <textarea
                            className="form-control"
                            onChange={this.onInputChange.bind(this, 'details')}
                            defaultValue={work.details}
                            ref="details"
                            placeholder="Details"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn  pull-right"
                        disabled={Profile.isSaving.work}>
                        Save{work.id ? ' Changes' : null}
                    </button>
                    <div className="clearfix" />
                </form>
            </div>
        );
    }
}
