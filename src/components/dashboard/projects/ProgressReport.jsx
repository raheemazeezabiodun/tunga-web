import React from 'react';
import {Link} from 'react-router-dom';
import {ProgressBar} from 'react-bootstrap';
import moment from 'moment';

import Avatar from '../../core/Avatar';
import Linkify from '../../core/Linkify';
import Icon from "../../core/Icon";

import {getUser, isAdmin} from '../../utils/auth';

export default class ProgressReport extends React.Component {

    canEdit() {
        const {progress_report, progress_event} = this.props;
        return progress_report.user.id === getUser().id && !progress_event.project.archived;
    }

    render() {
        const {progress_report, progress_event} = this.props;

        if (
            progress_report.user &&
            (progress_report.user.is_project_owner ||
                progress_report.user.is_project_manager) &&
            !isAdmin() &&
            progress_report.user.id !== getUser().id
        ) {
            return null;
        }

        return (
            <div>
                <div className="report-card">
                    {progress_report.user ? (
                        <div>
                            <Avatar
                                src={progress_report.user.avatar_url}
                            />{' '}
                            <Link
                                to={`/people/${
                                    progress_report.user.username
                                    }/`}>
                                {progress_report.user.display_name}
                            </Link>
                        </div>
                    ) : null}
                    {/* Status */}
                    {progress_report.user.is_developer ||
                    progress_report.user.is_project_manager ? (
                        <div>
                            <p>
                                <strong>Status: </strong>
                                <span>
                                    {progress_report.status_display}
                                </span>
                            </p>
                            <ProgressBar
                                bsStyle="success"
                                now={progress_report.percentage || 0}
                                label={`${progress_report.percentage || 0}% Completed`}
                            />
                        </div>
                    ) : null}
                    {progress_report.stuck_reason ? (
                        <div>
                            <strong>
                                Select reason why you are stuck
                            </strong>
                            <div>
                                <Linkify>
                                    {
                                        progress_report.stuck_reason_display
                                    }
                                </Linkify>
                            </div>
                        </div>
                    ) : null}
                    {progress_report.stuck_details ? (
                        <div>
                            <strong>
                                Explain Further why you are
                                stuck/what should be done.
                            </strong>
                            <div>
                                <Linkify>
                                    {progress_report.stuck_details}
                                </Linkify>
                            </div>
                        </div>
                    ) : null}
                    {progress_report.started_at ? (
                        <div>
                            <div>
                                <strong>
                                    When did you start this
                                    sprint/task/project?
                                </strong>
                            </div>
                            <div>
                                {moment
                                    .utc(progress_report.started_at)
                                    .local()
                                    .format(
                                        'dddd, Do MMMM, YYYY',
                                    )}
                            </div>
                        </div>
                    ) : null}

                    {typeof progress_report.last_deadline_met ===
                    'boolean' ? (
                        <div>
                            <p>
                                <strong>
                                    Was the last deadline
                                    met?:{' '}
                                </strong>
                                <span>
                                    {progress_report.last_deadline_met
                                        ? 'Yes'
                                        : 'No'}
                                </span>
                            </p>
                            {progress_report.deadline_progress_report ? (
                                <div>
                                    <strong>
                                        Deadline Report
                                    </strong>
                                    <div>
                                        <Linkify>
                                            {
                                                progress_report.deadline_progress_report
                                            }
                                        </Linkify>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    ) : null}

                    {typeof progress_report.deadline_miss_communicated ===
                    'boolean' ? (
                        <div>
                            <strong>
                                {progress_report.user
                                    .is_project_owner
                                    ? 'Did the project manager/developer(s) inform you'
                                    : 'Did you inform the client'}{' '}
                                promptly about not making
                                the deadline?
                            </strong>
                            <div>
                                <span>
                                    {progress_report.deadline_miss_communicated
                                        ? 'Yes'
                                        : 'No'}
                                </span>
                            </div>
                        </div>
                    ) : null}
                    {typeof progress_report.deliverable_satisfaction ===
                    'boolean' ? (
                        <div>
                            <strong>
                                Are you satisfied with the
                                deliverables?
                            </strong>
                            <div>
                                <span>
                                    {progress_report.deliverable_satisfaction
                                        ? 'Yes'
                                        : 'No'}
                                </span>
                            </div>
                        </div>
                    ) : null}
                    {typeof progress_report.progress_satisfaction === 'boolean' ? (
                        <div>
                            <strong>
                                Are you satisfied with how
                                the project is currently
                                going?
                            </strong>
                            <div>
                                <span>
                                    {
                                        progress_report.progress_satisfaction
                                    }
                                </span>
                            </div>
                        </div>
                    ) : null}
                    {progress_report.accomplished ? (
                        <div>
                            <strong>
                                What has been accomplished
                                since the last update?
                            </strong>
                            <div>
                                <Linkify>
                                    {progress_report.accomplished}
                                </Linkify>
                            </div>
                        </div>
                    ) : null}
                    {progress_report.rate_deliverables ? (
                        <p>
                            <strong>
                                Rate Deliverables:{' '}
                            </strong>
                            <span>
                                {progress_report.rate_deliverables}/5
                            </span>
                        </p>
                    ) : null}
                    {progress_report.rate_workflow ? (
                        <p>
                            <strong>Rate Workflow: </strong>
                            <span>
                                {progress_report.rate_workflow}/5
                            </span>
                        </p>
                    ) : null}
                    {progress_report.uploads &&
                    progress_report.uploads.length ? (
                        <div>
                            <strong>Files</strong>
                            {progress_report.uploads.map(upload => {
                                return (
                                    <div
                                        key={upload.id}
                                        className="file">
                                        <a
                                            href={
                                                upload.url
                                            }>
                                            <i className="fa fa-download"/>{' '}
                                            {upload.name}{' '}
                                            <strong>
                                                [{
                                                upload.display_size
                                            }]
                                            </strong>
                                        </a>
                                    </div>
                                );
                            })}
                        </div>
                    ) : null}

                    {/* Next */}
                    {progress_report.todo ? (
                        <div>
                            <strong>
                                {progress_report.user.is_developer
                                    ? 'What do you intend to achieve/complete today?'
                                    : 'Next steps'}
                            </strong>
                            <div>
                                <Linkify>
                                    {progress_report.todo}
                                </Linkify>
                            </div>
                        </div>
                    ) : null}

                    {progress_report.next_deadline ? (
                        <div>
                            <div>
                                <strong>
                                    Next Deadline:
                                </strong>
                            </div>
                            <div>
                                {moment
                                    .utc(
                                        progress_report.next_deadline,
                                    )
                                    .local()
                                    .format(
                                        'dddd, Do MMMM, YYYY',
                                    )}
                            </div>
                        </div>
                    ) : null}
                    {typeof progress_report.next_deadline_meet ===
                    'boolean' ? (
                        <div>
                            <strong>
                                Do you anticipate to meet
                                this deadline?
                            </strong>
                            <div>
                                <span>
                                    {progress_report.next_deadline_meet
                                        ? 'Yes'
                                        : 'No'}
                                </span>
                            </div>
                        </div>
                    ) : null}
                    {progress_report.next_deadline_fail_reason ? (
                        <div>
                            <strong>
                                Why won't you be able to
                                make the next deadline?
                            </strong>
                            <div>
                                <Linkify>
                                    {
                                        progress_report.next_deadline_fail_reason
                                    }
                                </Linkify>
                            </div>
                        </div>
                    ) : null}
                    {progress_report.obstacles ? (
                        <div>
                            <strong>Obstacles</strong>
                            <div>
                                <Linkify>
                                    {progress_report.obstacles}
                                </Linkify>
                            </div>
                        </div>
                    ) : null}

                    {progress_report.obstacles_prevention ? (
                        <div>
                            <strong>
                                What could have been done to
                                prevent this from happening?
                            </strong>
                            <div>
                                <Linkify>
                                    {
                                        progress_report.obstacles_prevention
                                    }
                                </Linkify>
                            </div>
                        </div>
                    ) : null}

                    {/* General */}
                    {typeof progress_report.pm_communication ===
                    'boolean' ? (
                        <div>
                            <strong>
                                Is the communication between
                                you and the project
                                manager/developer(s) going
                                well?
                            </strong>
                            <div>
                                <span>
                                    {progress_report.pm_communication
                                        ? 'Yes'
                                        : 'No'}
                                </span>
                            </div>
                        </div>
                    ) : null}
                    {progress_report.rate_communication ? (
                        <p>
                            <strong>
                                Rate Communication:{' '}
                            </strong>
                            <span>
                                {progress_report.rate_communication}/10
                            </span>
                        </p>
                    ) : null}

                    {progress_report.team_appraisal ? (
                        <div>
                            <strong>Team appraisal</strong>
                            <div>
                                <Linkify>
                                    {progress_report.team_appraisal}
                                </Linkify>
                            </div>
                        </div>
                    ) : null}
                    {progress_report.remarks ? (
                        <div>
                            <strong>Remarks</strong>
                            <div>
                                <Linkify>
                                    {progress_report.remarks}
                                </Linkify>
                            </div>
                        </div>
                    ) : null}

                    {this.canEdit()?(
                        <Link to={`/projects/${progress_event.project.id}/events/${progress_event.id}/report`}
                              className="btn btn-primary">
                            <Icon name="pencil"/> Edit Report
                        </Link>
                    ):null}
                </div>
            </div>
        );
    }
}
