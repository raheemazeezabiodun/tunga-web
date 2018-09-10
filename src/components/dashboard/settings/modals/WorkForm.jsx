import React from 'react';
import {FormGroup} from 'reactstrap';
import moment from 'moment';

import CustomInputGroup from '../../../core/CustomInputGroup';
import TextArea from '../../../core/TextArea';
import FieldError from '../../../core/FieldError';
import Success from '../../../core/Success';
import DateTimePicker from '../../../core/DateTimePicker';
import Button from "../../../core/Button";
import Input from "../../../core/Input";


export default class WorkForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            work: props.work || {}
        };
    }

    onInputChange(key, e) {
        let newState = {};
        newState[key] = e.target.value;
        this.setState({work: {...this.state.work, ...newState}});
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
        this.setState({work: {...this.state.work, ...newState}});
    }

    onSave = (e) => {
        e.preventDefault();

        const {ProfileActions} = this.props;
        const work = this.props.work || {};

        if (work.id) {
            ProfileActions.updateWork(work.id, this.state.work);
        } else {
            ProfileActions.createWork(this.state.work);
        }
        if(this.props.dismiss) {
            this.props.dismiss();
        }
        return;
    };

    render() {
        const {errors} = this.props,
            start_date = `${this.state.work.start_year}-${this.state.work.start_month}`,
            end_date = `${this.state.work.end_year}-${this.state.work.end_month}`;

        return (
            <div>
                {this.props.isSaved.work ? (
                    <Success message="Work Experience saved successfully"/>
                ) : null
                }
                <form
                    onSubmit={this.onSave}
                    name="work"
                    role="form"
                    ref="work_form">
                    <div className="row">
                        <div className="col-sm-12">
                            {errors.work &&
                            errors.work.company ? (
                                <FieldError
                                    message={errors.work.company}
                                />
                            ) : null}
                            <FormGroup>
                                <label className="control-label">Company name</label>
                                <Input onChange={this.onInputChange.bind(this, 'company')}
                                       value={this.state.work.company} required/>
                            </FormGroup>
                        </div>
                        <div className="col-sm-12">
                            {errors.work &&
                            errors.work.position ? (
                                <FieldError
                                    message={errors.work.position}
                                />
                            ) : null}
                            <FormGroup>
                                <label className="control-label">Job title</label>
                                <CustomInputGroup onChange={this.onInputChange.bind(this, 'position')}
                                                  value={this.state.work.position} required/>
                            </FormGroup>
                        </div>
                        <div className="col-sm-12">
                            <label className="control-label">Timespan</label>
                        </div>
                        <div className="col-sm-6">
                            {errors.work &&
                            (errors.work.start_year || errors.work.start_month) ? (
                                <FieldError
                                    message={(errors.work.start_year || errors.work.start_month)}
                                />
                            ) : null}
                            <FormGroup>
                                <div>From</div>
                                <DateTimePicker onChange={this.onDateChange.bind(this, true)}
                                                calendar={true} time={false}
                                                value={this.state.work.start_year ? new Date(moment.utc(start_date).format()) : null}
                                                format="MMM/YYYY"
                                                required/>
                            </FormGroup>
                        </div>
                        <div className="col-sm-6">
                            {errors.work &&
                            (errors.work.end_year || errors.work.end_month) ? (
                                <FieldError
                                    message={(errors.work.end_month || errors.work.end_month)}
                                />
                            ) : null}
                            <FormGroup>
                                <div>To</div>
                                <DateTimePicker onChange={this.onDateChange.bind(this, false)}
                                                calendar={true} time={false}
                                                value={this.state.work.end_year ? new Date(moment.utc(end_date).format()) : null}
                                                format="MMM/YYYY"
                                />
                            </FormGroup>
                        </div>
                        <div className="col-sm-12">
                            <FormGroup>
                                <label className="control-label">Experience</label>
                                <TextArea onChange={this.onInputChange.bind(this, 'details')}
                                          value={this.state.work.details}
                                          required/>
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
                                    disabled={this.props.isSaving.work}>
                                Submit
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}
