import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';
import { Row, Col } from 'reactstrap';

import IconButton from '../core/IconButton';
import Icon from '../core/Icon';
import ProjectPlanningForm from './ProjectPlanningForm';
import { openModal } from '../core/utils/modals';
import { isDevOrClient } from '../utils/auth';

const isDevClient = isDevOrClient();


export default class Plan extends React.Component {
    static propTypes = {
        project: PropTypes.object,
        ProjectActions: PropTypes.object,
        isSaving: PropTypes.object,
        isSaved: PropTypes.object,
    };

    renderModal = (type, title) => {
        openModal(<ProjectPlanningForm {...this.props} type={type} title={title} />, '');
    }

    editModal = (type, fieldObject, title) => {
        openModal(<ProjectPlanningForm {...this.props} type={type} edit fieldObject={fieldObject} title={title} />, '');
    }

    renderStartDate = () => {
        let content = null;
        const startDate = this.props.project.start_date;
        if (startDate) {
            const editObject = [
                {
                    previous_value: startDate,
                    field: 'start_date'
                }
            ];
            content = (
                <Row className="project-plan">
                    <Col sm="11">
                        <h6>Start Date</h6>
                        <p>{moment(startDate).format('DD/MM/YYYY')}</p>
                    </Col>
                    {!isDevClient ? (
                        <Col sm="1">
                            <IconButton name="pencil"
                                size="main"
                                onClick={() => this.editModal('start_date', editObject, 'New Start Date')}
                            />
                        </Col>
                    ) : null}
                </Row>
            );
        } else {
            if (!isDevClient) {
                content = (
                    <Row className="project-plan">
                        <div>
                            <h6>Start Date</h6>
                            <IconButton name="add" onClick={() => this.renderModal('start_date', 'Start Date')} />
                        </div>
                    </Row>
                );
            } else {
                content = null;
            }
        }
        return content;
    }

    renderMileStone = () => {
        const { progress_events } = this.props.project;
        let content = null;
        if (progress_events.length) {
            content = (
                <div className="project-plan">
                    <Col sm="12">
                        <h6 style={{ marginLeft: '-18px'  }}>Milestones</h6>
                    </Col>
                    {progress_events.map((events) => {
                        let editObject = [
                            {
                                previous_value: events.title,
                                field: 'title'
                            },
                            {
                                previous_value: events.due_at,
                                field: 'due_at'
                            }
                        ]
                        return (
                            <Row key={events.id}>
                                <Col sm="3">
                                    <p>{events.title}</p>
                                </Col>
                                <Col sm="2">
                                    <p>{moment(events.due_at).format('DD/MM/YYYY')}</p>
                                </Col>
                                {!isDevClient ? (
                                    <Col sm="1">
                                        <IconButton name="pencil"
                                            size="main"
                                            onClick={() => this.editModal('mile_stones', editObject, 'Change milestone')}
                                        />
                                </Col>
                                ) : null}
                            </Row>
                        )
                    })}
                    {!isDevClient ? (
                        <div>
                            <IconButton name="add"
                                onClick={() => this.renderModal('mile_stones', 'Add a milestone')}
                            />
                        </div>
                    ) : null}
                </div>
            );
        } else {
            if (!isDevClient) {
                content = (
                    <Row className="project-plan">
                        <div>
                            <h6>Milestones</h6>
                            <IconButton name="add" onClick={() => this.renderModal('mile_stones', 'Add a milestone')} />
                        </div>
                    </Row>
                )
            } else {
                content = null;
            }
        }
        return content;
    }

    renderEndDate = () => {
        let content = null;
        const deadline = this.props.project.deadline;
        if (deadline) {
            const editObject = [
                {
                    previous_value: deadline,
                    field: 'deadline'
                }
            ]
            content = (
                <Row className="project-plan">
                    <Col sm="11">
                        <h6>Deadline</h6>
                        <p>{moment(deadline).format('DD/MM/YYYY')}</p>
                    </Col>
                    {!isDevClient ? (
                        <Col sm="1">
                            <IconButton name="pencil"
                                size="main"
                                onClick={() => this.editModal('deadline', editObject, 'New Deadline')}
                            />
                    </Col>
                    ) : null}
                </Row>
            )
        } else {
            if (!isDevClient) {
                content = (
                    <Row className="project-plan">
                        <div>
                            <h6>Deadline</h6>
                            <IconButton name="add" onClick={() => this.renderModal('deadline', 'Deadline')} />
                        </div>
                    </Row>
                )
            } else {
                content = null;
            }
        }
        return content;
    }

    renderDetailedPlanning = () => {
        let content = null;
        const planning = this.props.project.documents.filter((doc) => doc.type === 'planning');
        if (planning.length) {
            content = (
                <div className="project-plan">
                    {planning.map((doc) => {
                        let fieldObject = [
                            {
                                previous_value: doc.download_url,
                                field: 'url'
                            },
                            {
                                previous_value: doc.title,
                                field: 'title'
                            }
                        ]
                        return (
                            <Row key={`planning-doc-${doc.id}`}>
                                <Col sm="11">
                                    <h6>Detailed Planning</h6>
                                        <Icon name="link" size="main" />
                                        <a href={doc.download_url}
                                            className="truncate"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            title={doc.title}
                                        >
                                            {doc.download_url}
                                        </a>
                                </Col>
                                {!isDevClient ? (
                                <Col sm="1">
                                    <IconButton name="pencil"
                                        size="main"
                                        onClick={() => this.editModal('detailed_planning', fieldObject, 'Detailed Planning')}
                                    />
                                </Col>
                                ) : null}
                            </Row>
                        )
                    })}
                </div>
            )
        } else {
            if (!isDevClient) {
                content = (
                    <Row className="project-plan">
                        <div>
                            <h6>Detailed Planning</h6>
                            <IconButton name="add"
                                onClick={() => this.renderModal('detailed_planning', 'Add a Detailed Planning')}
                            />
                        </div>
                    </Row>
                )
            } else {
                content = null;
            }
        }
        return content;
    }

    renderPlanning = () => {
        let content = null;
        if (!this.renderStartDate() && !this.renderMileStone() && !this.renderEndDate() && !this.renderDetailedPlanning()) {
            content = <h6>No planning available yet.</h6>
        } else {
            content = (
                <div>
                    {this.renderStartDate()}
                    {this.renderMileStone()}
                    {this.renderEndDate()}
                    {this.renderDetailedPlanning()}
                </div>
            );
        }
        return content;
    }

    render() {
        return this.renderPlanning();
    }
}
