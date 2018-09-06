import PropTypes from 'prop-types';
import React from 'react';
import { Row, Col, Label, FormGroup } from "reactstrap";

import TextArea from '../../../core/TextArea';
import Input from '../../../core/Input';
import SkillSelector from '../../../core/SkillSelector';
import ChoiceGroup from "../../../core/ChoiceGroup";
import Button from '../../../core/Button';
import DocumentPicker from "../../../core/DocumentPicker";
import FieldError from '../../../core/FieldError';
import { cleanSkills, DOCUMENT_TYPES_CLIENTS } from "../../../../actions/utils/api";


export default class CreateOpportunities extends React.Component {
    static propTypes = {
        isSaving: PropTypes.bool.isRequired,
        isSaved: PropTypes.bool.isRequired,
        errors: PropTypes.object,
        ProjectActions: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            opportunity: {stage: 'opportunity'}
        };
    }

    onChangeValue(key, value) {
        let newState = {};
        newState[key] = value;
        this.setState({opportunity: {...this.state.opportunity, ...newState}});
    }

    onSend = (e) => {
        e.preventDefault();
        const {ProjectActions} = this.props;
        ProjectActions.createProject(this.state.opportunity);
    };

    render() {
        const { errors } = this.props;
        return (
            <div className="content-card project-form-card">
                <form onSubmit={this.onSend}>
                    <Row>
                        <Col lg={6}>
                            <FormGroup>
                                <Label for="opportunityTitle">
                                    Opportunity title*
                                </Label>
                                {errors.title ? (
                                    <FieldError message={errors.title} />
                                ) : null}
                                <Input placeholder="Opportunity Title" id="opportunityTitle"
                                    onChange={(e) => { this.onChangeValue('title', e.target.value)}}
                                    required/>
                            </FormGroup>
                            <FormGroup>
                                <Label for="opportunityExpectedDuration">
                                    What is the expected duration for the project*
                                </Label>
                                {errors.expected_duration ? (
                                    <FieldError message={errors.expected_duration} />
                                ) : null}
                                <div className="text text-sm font-weight-thin">
                                    Please select one of the options below
                                </div>
                                <ChoiceGroup
                                    id="opportunityExpectedDuration"
                                    onChange={(expected_duration) => { this.onChangeValue('expected_duration', expected_duration) }}
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
                                    for="opportunityTechnology">
                                    Which skill tags are relevant for this opportunity?
                                </Label>
                                {errors.skills ? (
                                    <FieldError message={errors.skills} />
                                ) : null}
                                <SkillSelector
                                    id="opportunityTechnology"
                                    onChange={(skills) => { this.onChangeValue('skills', cleanSkills(skills)) }}
                                    placeholder="Type here to add a technology"
                                />
                            </FormGroup>
                        </Col>
                        <Col lg={6}>
                            <FormGroup>
                                <Label for="opportunityDescription">
                                    Short Description of the project*
                                </Label>
                                {errors.description ? (
                                    <FieldError message={errors.description} />
                                ) : null}
                                <TextArea placeholder="Short Description" required
                                    onChange={(e) => { this.onChangeValue('description', e.target.value)}}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="opportunityDocuments">
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
                            <Button type="submit" disabled={this.props.isSaving}
                                    className="float-right">
                                Send
                            </Button>
                        </Col>
                    </Row>
                </form>
            </div>
        );
    }
}
