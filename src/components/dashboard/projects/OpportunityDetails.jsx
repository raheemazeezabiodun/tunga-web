import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import Button from '../../core/Button';
import { displayExpectedReturn } from '../../utils/helpers';
import { isDev, getUser, isAdminOrPM } from '../../utils/auth';
import Success from '../../core/Success';
import { openConfirm } from '../../core/utils/modals';
import {PROJECT_STAGE_ACTIVE, STATUS_INTERESTED, STATUS_UNINTERESTED} from "../../../actions/utils/api";


export default class OpportunityDetails extends Component {

    static propTypes = {
        project: PropTypes.object.isRequired,
        isSaved: PropTypes.bool.isRequired,
        ProjectActions: PropTypes.func.isRequired
    };

    onInterestUpdate(interest, status) {
        const { ProjectActions, } = this.props;
        if(interest && interest.id) {
            ProjectActions.updateInterest(interest.id, {status})
        } else {
            const {project} = this.props;
            ProjectActions.createInterest({project: {id: project.id}, user: {id: getUser().id}, status})
        }
    }

    getMyInterest() {
        if(isDev()) {
            const {project} = this.props,
                filteredList  = project.interest_polls.filter(interest => interest.user.id === getUser().id);
            if(filteredList && filteredList.length) {
                return filteredList[0];
            }
        }
        return null;
    }

    activateProject() {
        const { ProjectActions, project } = this.props;
        openConfirm('Are you sure you want to make this opportunity an active project?').then((result) => {
            ProjectActions.updateProject(project.id, { stage: PROJECT_STAGE_ACTIVE })
        })
    }

    render() {
        const { project, isSaved } = this.props,
            myInterest = this.getMyInterest();
        return (
            <div className="opportunity">
                {isSaved && isSaved.interest ? <Success message="Successfully submitted your availability"/> : null}
                <div className="section">
                    <Link to={'/projects/filter/opportunity'}>
                        <Button>Go back to overview</Button>
                    </Link>
                </div>

                <div className="section">
                    <div className="content-card">
                        <div>
                            <div className="font-weight-medium">Opportunity title</div>
                            <p>{project.title}</p>
                        </div>
                        <div>
                            <div className="font-weight-medium">Expected duration of the project</div>
                            <p>{displayExpectedReturn(project.expected_duration)}</p>
                        </div>
                        <div>
                            <div className="font-weight-medium">Skills required for this project</div>
                            {project.skills && project.skills.length ? (
                                <p>
                                    {project.skills.map(skill => {
                                        return skill.name;
                                    }).join(', ')}
                                </p>
                            ): null}
                        </div>
                        <div>
                            <div className="font-weight-medium">Short Description of the project *</div>
                            <p>{project.description}</p>
                        </div>
                        {project.documents && project.documents.length ? (
                            <div>
                                <div className="font-weight-medium">Files</div>
                                <ul className="opportunity-files">
                                    {project.documents.map(doc => {
                                        return (
                                            <li key={`doc-${doc.id}`}><a href={doc.download_url} target="_blank" rel="noreferrer">{doc.download_url}</a></li>
                                        );
                                    })}
                                </ul>
                            </div>
                        ): null}
                    </div>
                </div>

                <div className="clearfix opportunity-actions">
                    {isDev()?
                        myInterest ? (
                            <div className="float-right">
                            {myInterest.status !== STATUS_INTERESTED?(
                                <Button onClick={() => this.onInterestUpdate(myInterest, STATUS_INTERESTED)}>
                                    I'm available {myInterest.status === STATUS_UNINTERESTED?'again':'and interested'}
                                </Button>
                            ):null}
                            {myInterest.status !== STATUS_UNINTERESTED?(
                                <Button variant='secondary' onClick={() => this.onInterestUpdate(myInterest, STATUS_UNINTERESTED)}>
                                    I'm not available {myInterest.status === STATUS_INTERESTED?'anymore':'for this project'}
                                </Button>
                            ):null}
                        </div>
                        )
                    :(
                        <React.Fragment>
                            <Button onClick={() => this.onInterestUpdate(myInterest, STATUS_INTERESTED)}>
                                I'm available and interested
                            </Button>
                            <Button variant='secondary' onClick={() => this.onInterestUpdate(myInterest, STATUS_UNINTERESTED)}>
                                I'm not available for this project
                            </Button>
                        </React.Fragment>
                    ) : null}

                    {isAdminOrPM()?(
                        <div className="float-right interests-btn-wrapper">
                            <Button onClick={() => this.activateProject()}>
                                Active as project
                            </Button>
                        </div>
                    ):null}
                </div>
            </div>
        );
    }
}
