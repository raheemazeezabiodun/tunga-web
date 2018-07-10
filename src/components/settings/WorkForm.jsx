import React from 'react';
import {FormGroup} from 'reactstrap';
import moment from 'moment';

import CustomInputGroup from '../core/CustomInputGroup';
import TextArea from '../core/TextArea';
import FieldError from '../core/FieldError';
import Success from '../core/Success';
import DateTimePicker from '../core/DateTimePicker';
import Button from "../core/Button";


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
        this.handleSubmit = this.handleSubmit.bind(this);
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

    handleSubmit(e) {
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
                    onSubmit={this.handleSubmit}
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
                                <CustomInputGroup
                                    variant=' '
                                    placeholder=' '
                                    onChange={this.onInputChange.bind(this, 'company')}
                                    defaultValue={this.state.work.company}
                                />
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
                                <CustomInputGroup
                                    variant=' '
                                    placeholder=' '
                                    onChange={this.onInputChange.bind(this, 'position')}
                                    defaultValue={this.state.work.position}
                                />
                            </FormGroup>
                        </div>
                        <div className="col-sm-12">
                            <strong>Timespan</strong>
                        </div>
                        <div className="col-sm-6">
                            {errors.work &&
                            (errors.work.start_year || errors.work.start_month) ? (
                                <FieldError
                                    message={(errors.work.start_year || errors.work.start_month)}
                                />
                            ) : null}
                            <FormGroup>
                                <label className="control-label">From</label>
                                <DateTimePicker
                                    onChange={this.onDateChange.bind(this, true)}
                                    calendar={true}
                                    time={false}
                                    defaultValue={this.state.work.start_year ? new Date(moment.utc(start_date).format()) : null}
                                />
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
                                <label className="control-label">To</label>
                                <DateTimePicker
                                    onChange={this.onDateChange.bind(this, false)}
                                    calendar={true}
                                    time={false}
                                    defaultValue={this.state.work.end_year ? new Date(moment.utc(end_date).format()) : null}
                                />
                            </FormGroup>
                        </div>
                        <div className="col-sm-12">
                            <FormGroup>
                                <label className="control-label">Experience</label>
                                <TextArea
                                    placeholder=' '
                                    onChange={this.onInputChange.bind(this, 'details')}
                                    defaultValue={this.state.work.details}
                                />
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
