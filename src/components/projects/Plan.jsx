import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';
import { Row, Col } from 'reactstrap';

import IconButton from '../core/IconButton';
import Icon from '../core/Icon';
import { openModal } from '../core/utils/modals';
import {isAdmin, isAdminOrPMOrClient, isDevOrClient} from '../utils/auth';
import MilestoneForm from "./modals/MilestoneForm";
import PlanningForm from "./modals/PlanningForm";
import ProjectDateForm from "./modals/ProjectDateForm";


export default class Plan extends React.Component {
    static propTypes = {
        project: PropTypes.object,
        ProjectActions: PropTypes.object,
        isSaving: PropTypes.object,
        isSaved: PropTypes.object,
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

    parseChangeLog(fields, reason, update, original) {
        let changes = [];
        fields.forEach(field => {
            if(update[field] && original && update[field] !== original[field]) {
                changes.push({
                    field: field,
                    reason: reason,
                    previous_value: original?original[field]:null,
                    new_value: update[field]
                });
            }
        });
        return changes;
    }

    onManageDate(dateField, title) {
        const {project, ProjectActions} = this.props;

        let cleanedDateData = {};
        if(project) {
            cleanedDateData.id = project.id || null;
            cleanedDateData.date = project[dateField] || null;
        }

        openModal(<ProjectDateForm project={cleanedDateData}/>, title).then(data => {
            if(data) {
                if(data.reason) {
                    data[dateField] = data.date;
                    delete data['date'];

                    let changes = this.parseChangeLog([dateField], data.reason, data, project);
                    delete data['reason'];

                    if(changes.length) {
                        data.change_log = changes;
                    }
                }

                if(project) {
                    ProjectActions.updateProject(project.id, data);
                } else {
                    ProjectActions.createProject(data);
                }
            }
        }, error => {
            console.log('error: ', error);
        });
    }

    onManageMilestone(milestone) {
        let cleanedMilestone = {}, editFields = ['title', 'due_at'];
        if(milestone) {
            ['id', ...editFields].forEach(key => {
                if(milestone[key]) {
                    cleanedMilestone[key] = milestone[key];
                }
            });
        }

        openModal(<MilestoneForm milestone={cleanedMilestone}/>, milestone?'Add a milestone':'Change milestone').then(data => {
            if(data) {
                if(data.reason) {
                    let changes = this.parseChangeLog(editFields, data.reason, data, milestone);
                    delete data['reason'];
                    if(changes.length) {
                        data.change_log = changes;
                    }
                }
                const {project, ProjectActions} = this.props;

                data.type = 'milestone';
                data.project = {id: project.id};

                if(milestone) {
                    ProjectActions.updateProgressEvent(milestone.id, data);
                } else {
                    ProjectActions.createProgressEvent(data);
                }
            }
        }, error => {
            console.log('error: ', error);
        });
    }

    onManagePlan(plan) {
        let cleanedPlan = {}, editFields = ['title', 'url'];
        if(plan) {
            ['id', ...editFields].forEach(key => {
                if(plan[key]) {
                    cleanedPlan[key] = plan[key];
                }
            });
        }

        if(!cleanedPlan.url && cleanedPlan.download_url) {
            cleanedPlan.url = cleanedPlan.download_url;
        }

        openModal(<PlanningForm plan={cleanedPlan}/>, 'Add a detailed planning').then(data => {
            if(data) {
                if(data.reason) {
                    let changes = this.parseChangeLog(editFields, data.reason, data, plan);
                    delete data['reason'];
                    if(changes.length) {
                        data.change_log = changes;
                    }
                }
                const {project, ProjectActions} = this.props;

                data.type = 'planning';
                data.project = {id: project.id};

                if(plan) {
                    ProjectActions.updateDocument(plan.id, data);
                } else {
                    ProjectActions.createDocument(data);
                }
            }
        }, error => {
            console.log('error: ', error);
        });
    }

    render() {
        const {project} = this.props,
            planningDoc = this.getLatestPlanningDoc(),
            milestones = this.getMilestones() || [];
        return (
            <div className="project-planning">
                {!project.start_date && !project.deadline && milestones.length === 0 && isDevOrClient() && !isAdmin()?(
                    <div className="font-weight-normal">No planning available yet.</div>
                ):(
                    <div>
                        <div className="section">
                            <div className="font-weight-normal">Start Date</div>
                            {project.start_date?(
                                <Row>
                                    <Col sm="11">
                                        {moment(project.start_date).format('DD/MM/YYYY')}
                                    </Col>
                                    <Col sm="1">
                                        {isAdminOrPMOrClient() && !project.archived?(
                                            <IconButton name="pencil"
                                                        size="main"
                                                        className="btn-edit"
                                                        onClick={this.onManageDate.bind(this, 'start_date', 'New Start Date')}/>
                                        ):null}
                                    </Col>
                                </Row>
                            ):isAdminOrPMOrClient() && !project.archived?(
                                <div>
                                    <IconButton name="add" size="main"
                                                onClick={this.onManageDate.bind(this, 'start_date', 'Start Date')} />
                                </div>
                            ):null}
                        </div>

                        <div className="section milestones">
                            <div className="font-weight-normal">Milestones</div>
                            {this.getMilestones().map(milestone => {
                                return (
                                    <Row key={milestone.id}>
                                        <Col sm="3">
                                            {milestone.title}
                                        </Col>
                                        <Col sm="2">
                                            {moment(milestone.due_at).format('DD/MM/YYYY')}
                                        </Col>
                                        {isAdminOrPMOrClient() && !project.archived?(
                                            <Col sm="1">
                                                <IconButton name="pencil"
                                                            size="main"
                                                            className="btn-edit"
                                                            onClick={this.onManageMilestone.bind(this, milestone)}/>
                                            </Col>
                                        ):null}
                                    </Row>
                                );
                            })}

                            {isAdminOrPMOrClient() && !project.archived?(
                                <div>
                                    <IconButton name="add" size="main"
                                                onClick={this.onManageMilestone.bind(this, null)} />
                                </div>
                            ):null}
                        </div>

                        <div className="section">
                            <div className="font-weight-normal">Deadline</div>
                            {project.deadline?(
                                <Row>
                                    <Col sm="11">
                                        {moment.utc(project.deadline).local().format('DD/MM/YYYY')}
                                    </Col>
                                    <Col sm="1">
                                        {isAdminOrPMOrClient() && !project.archived?(
                                            <IconButton name="pencil"
                                                        size="main"
                                                        className="btn-edit"
                                                        onClick={this.onManageDate.bind(this, 'deadline', 'New Deadline')}/>
                                        ):null}
                                    </Col>
                                </Row>
                            ):isAdminOrPMOrClient() && !project.archived?(
                                <div>
                                    <IconButton name="add" size="main"
                                                onClick={this.onManageDate.bind(this, 'deadline', 'Deadline')} />
                                </div>
                            ):null}
                        </div>

                        <div className="section">
                            <div className="font-weight-normal">Detailed Planning</div>

                            {planningDoc?(
                                <Row>
                                    <Col sm="11">
                                        <a href={planningDoc.download_url} className="truncate"
                                           target="_blank" title={planningDoc.title || ''}><Icon name="link" /> {planningDoc.title?`${planningDoc.title} | `:''} {planningDoc.download_url}</a>
                                    </Col>
                                    <Col sm="1">
                                        {isAdminOrPMOrClient() && !project.archived?(
                                            <IconButton name="pencil"
                                                        size="main"
                                                        className="btn-edit"
                                                        onClick={this.onManagePlan.bind(this, planningDoc)}/>
                                        ):null}
                                    </Col>
                                </Row>
                            ):isAdminOrPMOrClient() && !project.archived?(
                                <div>
                                    <IconButton name="add" size="main"
                                                onClick={this.onManagePlan.bind(this, null)} />
                                </div>
                            ):null}
                        </div>
                    </div>
                )}
            </div>
        );
    }
}
