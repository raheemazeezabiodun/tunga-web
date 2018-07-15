import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';
import { Row, Col } from 'reactstrap';

import IconButton from '../core/IconButton';
import Icon from '../core/Icon';
import ProjectPlanningForm from './modals/ProjectPlanningForm';
import { openModal } from '../core/utils/modals';
import {isAdminOrPMOrClient, isDevOrClient} from '../utils/auth';

const isDevClient = isDevOrClient();


export default class Plan extends React.Component {
    static propTypes = {
        project: PropTypes.object,
        ProjectActions: PropTypes.object,
        isSaving: PropTypes.object,
        isSaved: PropTypes.object,
    };

    renderModal = (type, title) => {
        openModal(<ProjectPlanningForm {...this.props} type={type} title={title} />, title);
    };

    editModal = (type, fieldObject, title) => {
        openModal(<ProjectPlanningForm {...this.props} type={type} edit fieldObject={fieldObject} title={title} />, title);
    };

    getLatestPlanningDoc() {
        const {project} = this.props;
        let planningDoc = null;
        (project.documents || []).forEach(doc => {
            if(doc.type === 'planning' && (!planningDoc || moment.utc(planningDoc.created_at) < moment.utc(doc.created_at))) {
                planningDoc = doc;
            }
        });
        return planningDoc;
    }

    getMilestones() {
        const {project} = this.props;
        return (project.progress_events || []).filter(event => event.type === 'milestone');
    }

    renderSection(value, display_value, createModalArgs, editModalArgs) {
        return value?(
            <Row>
                <Col sm="11">
                    {display_value}
                </Col>
                <Col sm="1">
                    {isAdminOrPMOrClient()?(
                        <IconButton name="pencil"
                                    size="main"
                                    onClick={() => this.editModal(...editModalArgs)}/>
                    ):null}
                </Col>
            </Row>
        ):isAdminOrPMOrClient()?(
            <div>
                <IconButton name="add" size="main"
                            onClick={() => this.renderModal(...createModalArgs)} />
            </div>
        ):null;
    }

    render() {
        const {project} = this.props, planningDoc = this.getLatestPlanningDoc();
        return (
            <div>
                {!project.start_date && !project.deadline && isDevOrClient()?(
                    <div className="font-weight-normal">No planning available yet.</div>
                ):(
                    <div>
                        <div className="section">
                            <div className="font-weight-normal">Start Date</div>
                            {this.renderSection(
                                project.start_date, moment(project.start_date).format('DD/MM/YYYY'),
                                ['start_date', 'Start Date'],
                                ['start_date', {previous_value: project.start_date, field: 'start_date'}, 'New Start Date']
                            )}
                        </div>

                        <div className="section">
                            <div className="font-weight-normal">Milestones</div>
                            {[...this.getMilestones(), null].map(milestone => {
                                return this.renderSection(
                                    milestone, (milestone?(
                                        <Row>
                                            <Col sm="3">
                                                <p>{milestone.title}</p>
                                            </Col>
                                            <Col sm="2">
                                                <p>{moment(milestone.due_at).format('DD/MM/YYYY')}</p>
                                            </Col>
                                        </Row>
                                    ):null),
                                    ['mile_stones', 'Add a milestone'],
                                    ['mile_stones', milestone?[
                                        {
                                            previous_value: milestone.title,
                                            field: 'title'
                                        },
                                        {
                                            previous_value: milestone.due_at,
                                            field: 'due_at'
                                        }
                                    ]:[], 'Change milestone']
                                );
                            })}
                        </div>

                        <div className="section">
                            <div className="font-weight-normal">Deadline</div>
                            {this.renderSection(
                                project.deadline, moment(project.deadline).format('DD/MM/YYYY'),
                                ['deadline', 'Deadline'],
                                ['deadline', {previous_value: project.start_date, field: 'start_date'}, 'New Deadline']
                            )}
                        </div>

                        <div className="section">
                            <div className="font-weight-normal">Detailed Planning</div>
                            {this.renderSection(
                                planningDoc, (planningDoc?(
                                    <a href={planningDoc.download_url} className="truncate"
                                       target="_blank" title={planningDoc.title || ''}><Icon name="link" size="main" /> {planningDoc.download_url}</a>
                                ):null),
                                ['detailed_planning', 'Add a Detailed Planning'],
                                ['detailed_planning', planningDoc?[{previous_value: planningDoc.download_url, field: 'url'}, {previous_value: planningDoc.title, field: 'title'}]:[], 'Detailed Planning']
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    }
}
