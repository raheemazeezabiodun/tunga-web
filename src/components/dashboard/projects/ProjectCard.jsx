import PropTypes from 'prop-types';
import React from 'react';
import {Link} from 'react-router-dom';
import moment from "moment";

import Icon from "../../core/Icon";

export default class ProjectCard extends React.Component {
    static propTypes = {
        project: PropTypes.object
    };

    isNextDeadline(currentDeadline, newDate) {
        return newDate && (!currentDeadline || currentDeadline && moment.utc(newDate) < moment.utc(currentDeadline));
    }

    render() {
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
                    <div className="card-title">{project.title}</div>
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
}
