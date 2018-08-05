import PropTypes from "prop-types";
import React from "react";
import { Row, Col, Label, FormGroup } from "reactstrap";

import ChoiceGroup from "../../core/ChoiceGroup";
import SkillSelector from "../../core/SkillSelector";
import TextArea from "../../core/TextArea";
import DateTimePicker from "../../core/DateTimePicker";
import Input from "../../core/Input";
import Button from "../../core/Button";
import DocumentPicker from "../../core/DocumentPicker";
import FieldError from '../../core/FieldError';

import {cleanSkills, DOCUMENT_TYPES_CLIENTS} from "../../../actions/utils/api";

export default class ProjectForm extends React.Component {
    static propTypes = {
        project: PropTypes.number,
        onCreate: PropTypes.func,
        isSaving: PropTypes.bool,
        isSaved: PropTypes.bool,
        errors: PropTypes.object
    };

    constructor(props) {
        super(props);
        this.state = {
            project: {}
        };
    }

    componentDidUpdate(prevProps, prevState, snapShot) {
        if (this.props.project) {
            this.props.history.push(`/projects/${this.props.project}`);
        }
    }

    onChangeValue(key, value) {
        let newState = {};
        newState[key] = value;
        this.setState({project: {...this.state.project, ...newState}});
    }

    onSave = (e) => {
        e.preventDefault();
        this.props.onCreate(this.state.project);
    };

    render() {
        const {errors} = this.props;

        return (
            <div className="content-card project-form-card">
                <form onSubmit={this.onSave}>
                    <Row>
                        <Col lg={6}>
                            <FormGroup>
                                <Label for="projectTitle">
                                    Project Title*
                                </Label>
                                {errors.title ? (
                                    <FieldError message={errors.title} />
                                ) : null}
                                <Input placeholder="Project title" id="projectTitle"
                                       onChange={(e) => { this.onChangeValue('title', e.target.value)}}
                                       required/>
                            </FormGroup>
                            <FormGroup>
                                <Label for="projectType">
                                    Which type of project do you have?*
                                </Label>
                                {errors.type ? (
                                    <FieldError message={errors.type} />
                                ) : null}
                                <div className="text text-sm font-weight-thin">
                                    Please select one of the options below
                                </div>
                                <ChoiceGroup
                                    id="projectType"
                                    onChange={(type) => { this.onChangeValue('type', type) }}
                                    choices={[
                                        ["web", "Web"],
                                        ["mobile", "Mobile"],
                                        ["other", "Other"]
                                    ]}
                                    size="sm"
                                />
                            </FormGroup>

                            <FormGroup>
                                <Label for="projectExpectedDuration">
                                    What is the expected duration of the project?*
                                </Label>
                                {errors.duration ? (
                                    <FieldError message={errors.duration} />
                                ) : null}
                                <div className="text text-sm font-weight-thin">
                                    Please select one of the options below
                                </div>
                                <ChoiceGroup
                                    id="projectExpectedDuration"
                                    onChange={(duration) => { this.onChangeValue('duration', duration) }}
                                    choices={[
                                        ["2w", "Less than 2 weeks"],
                                        ["6m", "Less than 6 months"],
                                        ["permanent", "Permanent basis"]
                                    ]}
                                    size="sm"
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label
                                    for="projectTechnology">
                                    Which technology do you want to use? (Optional)
                                </Label>
                                {errors.skills ? (
                                    <FieldError message={errors.skills} />
                                ) : null}
                                <SkillSelector
                                    id="projectTechnology"
                                    onChange={(skills) => { this.onChangeValue('skills', cleanSkills(skills)) }}
                                    placeholder="Type here to add a technology"
                                />
                            </FormGroup>
                        </Col>
                        <Col lg={6}>
                            <FormGroup>
                                <Label for="projectDescription">
                                    Short Description of the project*
                                </Label>
                                {errors.description ? (
                                    <FieldError message={errors.description} />
                                ) : null}
                                <TextArea placeholder="Short Description"
                                          onChange={(e) => { this.onChangeValue('description', e.target.value)}}
                                          required
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="projectDeadline">
                                    Add a preferred deadline (optional)
                                </Label>
                                {errors.deadline ? (
                                    <FieldError message={errors.deadline} />
                                ) : null}
                                <DateTimePicker
                                    calendar={true}
                                    time={false}
                                    id="projectDeadline"
                                    onChange={(deadline) => { this.onChangeValue('deadline', deadline) }}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="projectDocuments">
                                    Add documents
                                </Label>
                                {errors.documents ? (
                                    <FieldError message={errors.documents} />
                                ) : null}
                                <DocumentPicker documentTypes={DOCUMENT_TYPES_CLIENTS}
                                           onChange={(docs) => { this.onChangeValue('documents', docs)}}/>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Button type="submit"
                                    className="float-right">
                                Submit
                            </Button>
                        </Col>
                    </Row>
                </form>
            </div>
        );
    }
}
