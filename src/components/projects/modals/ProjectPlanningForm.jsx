import React from 'react';
import { FormGroup, Row, Col } from 'reactstrap';
import moment from 'moment';

import DateTimePicker from '../../core/DateTimePicker';
import Button from '../../core/Button';
import CustomInputGroup from '../../core/CustomInputGroup';
import Input from '../../core/Input';
import TextArea from '../../core/TextArea';


export default class ProjectPlanningForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    onDateChange(key, date) {
        let newState = {};
        newState[key] = moment.utc(date).format();
        this.setState(newState);
    }

    onInputChange(key, e) {
        const new_state = {};
        new_state[key] = e.target.value;
        this.setState(new_state);
    }

    renderForm = () => {
        let content = null;
        if (['start_date', 'deadline'].includes(this.props.type)) {
            content = (
                <Col sm="12">
                    <FormGroup>
                        <label>{this.props.title}</label>
                        <DateTimePicker calendar={true}
                            time={false}
                            onChange={this.onDateChange.bind(this, this.props.type)}
                        />
                    </FormGroup>
                </Col>
            )
        } else if (this.props.type === 'detailed_planning') {
            content = (
                <Col sm="12">
                    <label>{this.props.title}</label>
                    <FormGroup>
                        <CustomInputGroup variant='url'
                            onChange={this.onInputChange.bind(this, 'url')}
                            defaultValue={this.props.edit ? this.props.fieldObject[0].previous_value : ''}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Input placeholder="Name file"
                            onChange={this.onInputChange.bind(this, 'title')}
                            defaultValue={this.props.edit ? this.props.fieldObject[1].previous_value : ''}
                        />
                    </FormGroup>
                </Col>
            )
        } else {
            content = (
                <Col sm="12">
                    <label>{this.props.title}</label>
                    <FormGroup>
                        <Input placeholder="Title of milestone (e.g, End of sprint 1)"
                            onChange={this.onInputChange.bind(this, 'title')}
                            defaultValue={this.props.edit ? this.props.fieldObject[0].previous_value : ''}
                        />
                    </FormGroup>
                    <FormGroup>
                        <DateTimePicker calendar={true}
                            time={false}
                            onChange={this.onDateChange.bind(this, 'due_at')}
                        />
                    </FormGroup>
                </Col>
            )
        }
        return content;
    };

    handleSubmit(e) {
        e.preventDefault();
        const { ProjectActions, project } = this.props;
        if (this.props.edit) {
            let change_log = [];
            this.props.fieldObject.map(field => {
                let fields = {
                    field: field.field,
                    reason: this.state.reason,
                    previous_value: field.previous_value,
                    new_value: this.state[field.field] || field.previous_value  // use the default value
                };
                change_log.push(fields);
            })
        } else {
            if (['start_date', 'deadline'].includes(this.props.type)) {
                let post_data = {};
                post_data[this.props.type] = this.state[this.props.type];
                ProjectActions.updateProject(project.id, { ...post_data });
            } else if (this.props.type === 'detailed_planning') {
                ProjectActions.createDocument({
                    type: 'planning',
                    title: this.state.title,
                    url: this.state.url,
                    project: {id: project.id}
                })
            } else {
                ProjectActions.createProgressEvent({
                    type: 'milestone',
                    title: this.state.title,
                    due_at: this.state.due_at,
                    project: {id: project.id}
                })
            }
        }
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <Row>
                    {this.renderForm()}
                    {this.props.edit ? (
                        <Col sm="12">
                            <FormGroup>
                                <label>Reason for changing date</label>
                                <TextArea onChange={this.onInputChange.bind(this, 'reason')}/>
                            </FormGroup>
                        </Col>
                    ) : null}
                    <div className="modal-button">
                        <Button type="submit" className="float-right">
                            Submit
                        </Button>
                        <Button className="float-left" variant='secondary' onClick={() => this.props.dismiss() }>
                            Cancel
                        </Button>
                    </div>
                </Row>
            </form>
        )
    }
}
