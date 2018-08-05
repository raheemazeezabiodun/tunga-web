import React from 'react';
import {FormGroup} from 'reactstrap';
import moment from 'moment';

import CustomInputGroup from '../../core/CustomInputGroup';
import TextArea from '../../core/TextArea';
import FieldError from '../../core/FieldError';
import Success from '../../core/Success';
import DateTimePicker from '../../core/DateTimePicker';
import Button from "../../core/Button";
import Input from "../../core/Input";


export default class WorkForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            details: props.work.details,
            company: props.work.company,
            position: props.work.position,
            start_year: props.work.start_year,
            end_year: props.work.end_year,
            start_month: props.work.start_month,
            end_month: props.work.end_month,
            work: props.work || {}
        };
        this.onSave = this.onSave.bind(this);
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
            this.props.isSaved.work &&
            !prevProps.isSaved.work
        ) {
            if (!this.props.work) {
                this.refs.work_form.reset();
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
        const company = this.state.company;
        const position = this.state.position;
        const start_year = this.state.start_year;
        const start_month = this.state.start_month;
        const end_year = this.state.end_year || null;
        const end_month = this.state.end_month || null;
        const details = this.state.details;

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
        if(this.props.dismiss) {
            this.props.dismiss();
        }
        return;
    }

    render() {
        const {errors} = this.props;
        const start_date = `${this.state.work.start_year}-${this.state.work.start_month}`;
        const end_date = `${this.state.work.end_year}-${this.state.work.end_month}`;
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
