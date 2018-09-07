import PropTypes from 'prop-types';
import React from 'react';
import {Link} from 'react-router-dom';
import moment from "moment";
import _ from 'lodash';

import Icon from "../../core/Icon";
import { isDev } from '../../utils/auth';

export default class ProjectCard extends React.Component {
    static propTypes = {
        project: PropTypes.object
    };

    isNextDeadline(currentDeadline, newDate) {
        return newDate && (!currentDeadline || currentDeadline && moment.utc(newDate) < moment.utc(currentDeadline));
    }

    renderOpportunity() {
        const { project } = this.props;
        const interestPolls = project.interest_polls;
        const interestedDevs = interestPolls.filter(interest => interest.status == 'interested').length
        return (
            <Link to={`/projects/${project.id}`} className="project-card">
                <div className="card-title">{_.truncate(project.title, {length: 30})}</div>
                {isDev() ? (
                    <div>
                        <div>Skills required: {project.skills.map(skill => {
                            return `${skill.name} `
                        })}</div>
                    </div>
                ) : (
                <div>
                    <div>Send out to {interestPolls.length} developer{interestPolls.length === 1 ? '' : 's'}</div>
                    <div>{interestedDevs} developer{interestedDevs === 1 ? '' : 's'} are interested</div>
                </div>
                )}
            </Link>
        )
    }

    renderProjects() {
        const {project} = this.props;
        let nextDeadline = '',
            nextEvent = '';

        if(project.deadline && this.isNextDeadline(nextDeadline, project.deadline)) {
            nextDeadline = project.deadline;
            nextEvent = 'Project Deadline';
        }

        if(project.progress_events) {
            project.progress_events.forEach(event => {
                if(this.isNextDeadline(nextDeadline, event.due_at)) {
                    nextDeadline = event.due_at;
                    nextEvent = event.title;
                }
            });
        }
        return (
            project?(
                <Link to={`/projects/${project.id}`} className="project-card">
                    <Icon name="circle" size="card" className={`status-icon ${project.archived?'red':'green'}`}/>
                    <div className="card-title">{_.truncate(project.title, {length: 30})}</div>
                    {nextDeadline?(
                        <div>Next deadline: {moment.utc(nextDeadline).local().format('DD/MMM/YYYY')}</div>
                    ):null}
                    {nextEvent?(
                        <div>{nextEvent}</div>
                    ):null}
                </Link>
            ):null
        );
    }

    render() {
        const {project} = this.props;
        return project.stage === 'opportunity' ? this.renderOpportunity() : this.renderProjects()
    }
}
