import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import Button from '../../../core/Button';
import { displayExpectedReturn } from '../../../utils/helpers';
import { isDev, getUser, isAdminOrPM } from '../../../utils/auth';
import Success from '../../../core/Success';
import { openConfirm } from '../../../core/utils/modals';


export default class OpportunityDetails extends Component {

    static propTypes = {
        project: PropTypes.object.isRequired,
        isSaved: PropTypes.bool.isRequired,
        ProjectActions: PropTypes.func.isRequired
    };

    handleInterestUpdate(status, interest_id) {
        const { ProjectActions, project } = this.props;
        ProjectActions.updateInterest(interest_id, {
            status,
            user: {
                id: getUser().id
            },
            project: {
                id: project.id
            }
        })
    }

    renderUserAvailability = () => {
        const {project} = this.props;
        let content = null;
        if (isDev()) {
            const authUserResponse = project.interest_polls.filter(interest => interest.user.id === getUser().id);
            content = (
                <div className="float-right interests-btn-wrapper">
                    <Button onClick={() => this.handleInterestUpdate('interested', authUserResponse[0].id)}>
                        I'm available and interested
                    </Button>
                    <Button variant='secondary' onClick={() => his.handleInterestUpdate('uninterested', authUserResponse[0].id)}>
                        I'm not available for this project
                    </Button>
                </div>
            );
            
            if (authUserResponse[0].status === 'interested') {
                content = (
                    <div className="float-right interests-btn-wrapper">
                        <Button variant='secondary' onClick={() => this.handleInterestUpdate('uninterested', authUserResponse[0].id)}>
                            I'm not available anymore
                        </Button>
                    </div>
                )
            } else if (authUserResponse[0].status === 'uninterested') {
                content = (
                    <div className="float-right interests-btn-wrapper">
                        <Button onClick={() => this.handleInterest('interested', authUserResponse[0].id)}>
                            I'm available again
                        </Button>
                    </div>
                )
            }
        }
        
        return content;
    }

    updateOpportunityToProject() {
        const { ProjectActions, project } = this.props;
        openConfirm('Are you sure you want to make this opportunity an active project?').then((result) => { 
            ProjectActions.updateProject(project.id, { stage: 'active' })
        })
    }

    renderAdminOrPmButton() {
        let content = null;
        if (isAdminOrPM()) {
            content = (
                <div className="float-right interests-btn-wrapper">
                    <Button onClick={() => this.updateOpportunityToProject()}>
                        Active as project
                    </Button>
                </div>
            )
        }
        return content;
    }

    render() {
        const { project, isSaved } = this.props;
        return (
            <Container className="opportunity">
                {isSaved && isSaved.interest ? <Success message="Successfully submitted your availability"/> : null}
                <div className="button-wrapper">
                    <Link to={'/projects/filter/opportuntiy'}>
                        <Button>Go back to overview</Button>
                    </Link>
                </div>
                <div className="content-card">
                    <div>
                        <h6>Opportunity title</h6>
                        <p>{project.title}</p>
                    </div>
                    <div>
                        <h6>Expected duration of the project</h6>
                        <p>{displayExpectedReturn(project.expected_duration)}</p>
                    </div>
                    <div>
                        <h6>Skills required for this project</h6>
                        {project.skills && project.skills.length ? (
                            <div>
                                {project.skills.map(skill => {
                                    return (
                                        <p key={`skills-${skill.name}`}>{skill.name}</p>
                                    );
                                })}
                            </div>
                        ): null}
                    </div>
                    <div>
                        <h6>Short Description of the project *</h6>
                        <p>{project.description}</p>
                    </div>
                    <div>
                        <h6>Files</h6>
                        {project.documents && project.documents.length ? (
                            <ul className="opportunity-files">
                                {project.documents.map(doc => {
                                    return (
                                        <li key={`doc-${doc.id}`}><a href={doc.download_url} target="_blank" rel="noreferrer">{doc.download_url}</a></li>
                                    );
                                })}
                            </ul>
                        ): null}
                    </div>
                </div>
                {this.renderUserAvailability()}
                {this.renderAdminOrPmButton()}
            </Container>
        );
    }
}
