import PropTypes from 'prop-types';
import React from 'react';
import {Row, Col} from 'reactstrap';

import Progress from "../../../core/Progress";
import OpportunityCard from './OpportunityListCard';
import Button from '../../../core/Button';


export default class ProjectList extends React.Component {
    static propTypes = {
        projects: PropTypes.array,
        isLoading: PropTypes.bool,
        ProjectActions: PropTypes.func.isRequired,
        status: PropTypes.string.isRequired
    };

    renderSendReminder() {
        // only show send reminder in the pending tab if there are still interest polls that are pending
        const { status, project } = this.props;
        let content = null;
        if (status === 'initial') {
            project.interest_polls.map(interest => {
                if (interest.status === 'initial') {
                    content = (
                        <div className="button-wrapper">
                            <Button>Send Reminder</Button>
                        </div>
                    );
                }
            })
        }
        return content;
    }

    render() {
        const {project, isLoading, status, ProjectActions} = this.props;

        return isLoading?(
            <Progress/>
        ):(
            project.interest_polls.length?(
                <div>
                    <Row className="card-list opportunity">
                        {this.renderSendReminder()}
                        {project.interest_polls.map(interest => {
                            if (interest.status === status) {
                                return (
                                    <Col key={`project-card--${interest.id}`} sm="8">
                                        <OpportunityCard interest={interest}
                                            status={status}
                                            ProjectActions={ProjectActions} 
                                            project={project}/>
                                    </Col>
                                );
                            }
                        })}
                    </Row>
                </div>
            ):null
        );
    }
}
