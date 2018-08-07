import PropTypes from 'prop-types';
import React from 'react';
import {FormGroup} from 'reactstrap';
import moment from 'moment';

import CustomInputGroup from '../../../core/CustomInputGroup';
import TextArea from '../../../core/TextArea';
import FieldError from '../../../core/FieldError';
import Success from '../../../core/Success';
import DateTimePicker from '../../../core/DateTimePicker';
import Button from "../../../core/Button";


export default class EducationForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            details: props.education.details,
            institution: props.education.institution,
            award: props.education.award,
            start_year: props.education.start_year,
            end_year: props.education.end_year,
            start_month: props.education.start_month,
            end_month: props.education.end_month,
            education: props.education || {}
        };
        this.onSave = this.onSave.bind(this);
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
            this.props.isSaved.education &&
            !prevProps.isSaved.education
        ) {
            if (!this.props.education) {
                this.refs.education_form.reset();
                this.setState({details: ''});
            }
        }
    }

    onInputChange(key, e) {
        const new_state = {};
        new_state[key] = e.target.value;
        this.setState(new_state);
    }

    onDateChange(from = true, dateSelected) {
        const momentDate = moment(dateSelected);
        const month = momentDate.month();
        const year = momentDate.year();
        if (from) {
            this.setState({start_year: year, start_month: month});
        } else {
            this.setState({end_year: year, end_month: month});
        }
    }

    onSave(e) {
        e.preventDefault();
        const institution = this.state.institution;
        const award = this.state.award;
        const start_year = this.state.start_year;
        const start_month = this.state.start_month;
        const end_year = this.state.end_year || null;
        const end_month = this.state.end_month || null;
        const details = this.state.details;

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
        if(this.props.dismiss) {
            this.props.dismiss();
        }
        return;
    }

    render() {
        const {errors} = this.props;
        const start_date = `${this.state.education.start_year}-${this.state.education.start_month}`;
        const end_date = `${this.state.education.end_year}-${this.state.education.end_month}`;
        return (
            <div>
                {this.props.isSaved.education ? (
                    <Success message="Education saved successfully"/>
                ) : null
                }
                <form
                    onSubmit={this.onSave}
                    name="education"
                    role="form"
                    ref="education_form">
                    <div className="row">
                        <div className="col-sm-12">
                            {errors.education &&
                            errors.education.institute ? (
                                <FieldError
                                    message={errors.education.institute}
                                />
                            ) : null}
                            <FormGroup>
                                <label className="control-label">Educational Institute</label>
                                <CustomInputGroup onChange={this.onInputChange.bind(this, 'institution')}
                                                  value={this.state.education.institution} required/>
                            </FormGroup>
                        </div>
                        <div className="col-sm-12">
                            {errors.education &&
                            errors.education.award ? (
                                <FieldError
                                    message={errors.education.award}
                                />
                            ) : null}
                            <FormGroup>
                                <label className="control-label">Degree</label>
                                <CustomInputGroup onChange={this.onInputChange.bind(this, 'award')}
                                                  value={this.state.education.award} required/>
                            </FormGroup>
                        </div>
                        <div className="col-sm-12">
                            <label className="control-label">Timespan</label>
                        </div>
                        <div className="col-sm-6">
                            {errors.education &&
                            (errors.education.start_year || errors.education.start_month) ? (
                                <FieldError
                                    message={(errors.education.start_year || errors.education.start_month)}
                                />
                            ) : null}
                            <FormGroup>
                                <div>From</div>
                                <DateTimePicker onChange={this.onDateChange.bind(this, true)}
                                                calendar={true} time={false}
                                                value={this.state.education.start_year ? new Date(moment.utc(start_date).format()) : null} required/>
                            </FormGroup>
                        </div>
                        <div className="col-sm-6">
                            {errors.education &&
                            (errors.education.end_year || errors.education.end_month) ? (
                                <FieldError
                                    message={(errors.education.end_month || errors.education.end_month)}
                                />
                            ) : null}
                            <FormGroup>
                                <div>To</div>
                                <DateTimePicker onChange={this.onDateChange.bind(this, false)}
                                                calendar={true} time={false}
                                                value={this.state.education.end_year ? new Date(moment.utc(end_date).format()) : null}
                                />
                            </FormGroup>
                        </div>
                        <div className="col-sm-12">
                            <FormGroup>
                                <label className="control-label">Details (optional)</label>
                                <TextArea onChange={this.onInputChange.bind(this, 'details')}
                                          value={this.state.education.details} required/>
                            </FormGroup>
                        </div>
                    </div>
                    <div>
                        <div className="float-left">
                            <Button type="button"
                                    variant="secondary"
                                    onClick={() => this.props.dismiss()}>
                                Cancel
                            </Button>
                        </div>
                        <div className="float-right">
                            <Button type="submit"
                                    disabled={this.props.isSaving.education}>
                                Submit
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}
