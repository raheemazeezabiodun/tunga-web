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
            education: props.education || {}
        };
        this.onSave = this.onSave.bind(this);
    }

    onInputChange(key, e) {
        let newState = {};
        newState[key] = e.target.value;
        this.setState({education: {...this.state.education, ...newState}});
    }

    onDateChange(from = true, dateSelected) {
        const momentDate = moment(dateSelected);
        const month = momentDate.month() + 1;
        const year = momentDate.year();
        let newState = {};
        if (from) {
            newState = {start_year: year, start_month: month};
        } else {
            newState = {end_year: year, end_month: month};
        }
        this.setState({education: {...this.state.education, ...newState}});
    }

    onSave(e) {
        e.preventDefault();

        const {proceed} = this.props;
        if(proceed) {
            proceed(this.state.education);
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
                                <label className="control-label">Institution</label>
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
                                <label className="control-label">Award</label>
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
                                                value={this.state.education.start_year ? new Date(moment.utc(start_date).format()) : null}
                                                format="MMM/YYYY"
                                                required/>
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
                                                format="MMM/YYYY"
                                />
                            </FormGroup>
                        </div>
                        <div className="col-sm-12">
                            <FormGroup>
                                <label className="control-label">Details (optional)</label>
                                <TextArea onChange={this.onInputChange.bind(this, 'details')}
                                          value={this.state.education.details}/>
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
