import React from 'react';
import {Link} from 'react-router-dom';
import {ProgressBar} from 'react-bootstrap';
import moment from 'moment';
import Linkify from './Linkify';

import Avatar from './Avatar';
import Progress from './status/Progress';
import ProgressReportForm from './ProgressReportForm';
import BreadCrumb from '../containers/BreadCrumb';

import {
  PROGRESS_EVENT_TYPE_MILESTONE,
  PROGRESS_EVENT_TYPE_SUBMIT,
  PROGRESS_EVENT_TYPE_COMPLETE,
  PROGRESS_EVENT_TYPE_CLIENT,
} from '../constants/Api';
import {
  isDeveloper,
  getUser,
  isAdmin,
  isAdminOrProjectOwner,
  isProjectOwner,
} from '../utils/auth';

export default class Milestone extends React.Component {
  constructor(props) {
    super(props);
    this.state = {editReport: false};
  }

  componentDidMount() {
    this.props.MilestoneActions.retrieveMilestone(this.props.params.eventId);
  }

  componentDidUpdate(prevProps, prevState) {
    /*if(this.props.ProgressReport.detail.isSaved && !prevProps.ProgressReport.detail.isSaved) {
            this.setState({editReport: false});
        }*/
  }

  onEditReport() {
    this.setState({editReport: true});
  }

  renderChildren() {
    return React.Children.map(
      this.props.children,
      function(child) {
        return React.cloneElement(child, {
          Milestone: this.props.Milestone,
          milestone: this.props.Milestone.detail,
          MilestoneActions: this.props.MilestoneActions,
          ProgressReport: this.props.ProgressReport,
          ProgressReportActions: this.props.ProgressReportActions,
        });
      }.bind(this),
    );
  }

  render() {
    const {Milestone, ProgressReport, ProgressReportActions} = this.props;
    const {milestone} = Milestone.detail;
    const {reports, my_report} = milestone;
    const report = my_report;

    const timestamp = moment.utc(milestone.due_at).unix();
    const ts_now = moment.utc().unix();
    // 48 hrs for devs to fill and 72 hrs for PMs, forever for clients
    let is_missed = isProjectOwner()
      ? false
      : timestamp + (isDeveloper() ? 24 : 72) * 60 * 60 < ts_now &&
        milestone.type;

    return Milestone.detail.isRetrieving
      ? <Progress />
      : milestone.id
        ? <div>
            <BreadCrumb
              section={milestone.title || 'Scheduled Update'}
              parents={
                milestone.task
                  ? [
                      {
                        name: milestone.details
                          ? milestone.details.task.summary
                          : 'Task',
                        link: `/work/${milestone.task}`,
                      },
                    ]
                  : []
              }
            />

            <div className="milestone-page form-wrapper">
              <div style={{marginBottom: '20px'}}>
                {milestone.due_at
                  ? <div>
                      <strong>Due Date:</strong>{' '}
                      {moment
                        .utc(milestone.due_at)
                        .local()
                        .format('Do, MMMM YYYY')}
                    </div>
                  : null}

                {milestone.description
                  ? <div>
                      <strong>Description</strong>
                      <div className="description">
                        <Linkify properties={{target: '_blank'}}>
                          {milestone.description}
                        </Linkify>
                      </div>
                    </div>
                  : null}
              </div>

              {((!report && !is_missed) || this.state.editReport) &&
              milestone.is_participant
                ? <ProgressReportForm
                    milestone={milestone}
                    progress_report={report}
                    ProgressReport={ProgressReport}
                    ProgressReportActions={ProgressReportActions}
                  />
                : reports && reports.length
                  ? <div>
                      <h4>
                        <i className="fa fa-newspaper-o" />{' '}
                        {milestone.type == PROGRESS_EVENT_TYPE_CLIENT
                          ? 'Weekly Survey'
                          : 'Progress Reports'}
                      </h4>

                      {reports.map(report => {
                        if (
                          report.user &&
                          (report.user.is_project_owner ||
                            report.user.is_project_manager) &&
                          !isAdmin() &&
                          report.user.id != getUser().id
                        ) {
                          return null;
                        }
                        return (
                          <div className="card">
                            {report.user
                              ? <div>
                                  <Avatar src={report.user.avatar_url} />{' '}
                                  <Link to={`/people/${report.user.username}/`}>
                                    {report.user.display_name}
                                  </Link>
                                </div>
                              : null}
                            {/* Status */}
                            {report.user.is_developer ||
                            report.user.is_project_manager
                              ? <div>
                                  <p>
                                    <strong>Status: </strong>
                                    <span>
                                      {report.status_display}
                                    </span>
                                  </p>
                                  <ProgressBar
                                    bsStyle="success"
                                    now={report.percentage || 0}
                                    label={`${report.percentage ||
                                      0}% Completed`}
                                  />
                                </div>
                              : null}
                            {report.stuck_reason
                              ? <div>
                                  <strong>
                                    Select reason why you are stuck
                                  </strong>
                                  <div>
                                    <Linkify properties={{target: '_blank'}}>
                                      {report.stuck_reason_display}
                                    </Linkify>
                                  </div>
                                </div>
                              : null}
                            {report.stuck_details
                              ? <div>
                                  <strong>
                                    Explain Further why you are stuck/what
                                    should be done.
                                  </strong>
                                  <div>
                                    <Linkify properties={{target: '_blank'}}>
                                      {report.stuck_details}
                                    </Linkify>
                                  </div>
                                </div>
                              : null}
                            {report.started_at
                              ? <div>
                                  <div>
                                    <strong>
                                      When did you start this
                                      sprint/task/project?
                                    </strong>
                                  </div>
                                  <div>
                                    {moment
                                      .utc(report.started_at)
                                      .local()
                                      .format('dddd, Do MMMM, YYYY')}
                                  </div>
                                </div>
                              : null}

                            {typeof report.last_deadline_met == 'boolean'
                              ? <div>
                                  <p>
                                    <strong>
                                      Was the last deadline met?:{' '}
                                    </strong>
                                    <span>
                                      {report.last_deadline_met ? 'Yes' : 'No'}
                                    </span>
                                  </p>
                                  {report.deadline_report
                                    ? <div>
                                        <strong>Deadline Report</strong>
                                        <div>
                                          <Linkify
                                            properties={{target: '_blank'}}>
                                            {report.deadline_report}
                                          </Linkify>
                                        </div>
                                      </div>
                                    : null}
                                </div>
                              : null}

                            {typeof report.deadline_miss_communicated ==
                            'boolean'
                              ? <div>
                                  <strong>
                                    {report.user.is_project_owner
                                      ? 'Did the project manager/developer(s) inform you'
                                      : 'Did you inform the client'}{' '}
                                    promptly about not making the deadline?
                                  </strong>
                                  <div>
                                    <span>
                                      {report.deadline_miss_communicated
                                        ? 'Yes'
                                        : 'No'}
                                    </span>
                                  </div>
                                </div>
                              : null}
                            {typeof report.deliverable_satisfaction == 'boolean'
                              ? <div>
                                  <strong>
                                    Are you satisfied with the deliverables?
                                  </strong>
                                  <div>
                                    <span>
                                      {report.deliverable_satisfaction
                                        ? 'Yes'
                                        : 'No'}
                                    </span>
                                  </div>
                                </div>
                              : null}
                            {report.accomplished
                              ? <div>
                                  <strong>
                                    What has been accomplished since the last
                                    update?
                                  </strong>
                                  <div>
                                    <Linkify properties={{target: '_blank'}}>
                                      {report.accomplished}
                                    </Linkify>
                                  </div>
                                </div>
                              : null}
                            {report.rate_deliverables
                              ? <p>
                                  <strong>Rate Deliverables: </strong>
                                  <span>
                                    {report.rate_deliverables}/5
                                  </span>
                                </p>
                              : null}
                            {report.uploads && report.uploads.length
                              ? <div>
                                  <strong>Files</strong>
                                  {report.uploads.map(upload => {
                                    return (
                                      <div key={upload.id} className="file">
                                        <a href={upload.url}>
                                          <i className="fa fa-download" />{' '}
                                          {upload.name}{' '}
                                          <strong>[{upload.display_size}]</strong>
                                        </a>
                                      </div>
                                    );
                                  })}
                                </div>
                              : null}

                            {/* Next */}
                            {report.todo
                              ? <div>
                                  <strong>
                                    {report.user.is_developer
                                      ? 'What do you intend to achieve/complete today?'
                                      : 'Next steps'}
                                  </strong>
                                  <div>
                                    <Linkify properties={{target: '_blank'}}>
                                      {report.todo}
                                    </Linkify>
                                  </div>
                                </div>
                              : null}

                            {report.next_deadline
                              ? <div>
                                  <div>
                                    <strong>Next Deadline:</strong>
                                  </div>
                                  <div>
                                    {moment
                                      .utc(report.next_deadline)
                                      .local()
                                      .format('dddd, Do MMMM, YYYY')}
                                  </div>
                                </div>
                              : null}
                            {typeof report.next_deadline_meet == 'boolean'
                              ? <div>
                                  <strong>
                                    Do you anticipate to meet this deadline?
                                  </strong>
                                  <div>
                                    <span>
                                      {report.next_deadline_meet ? 'Yes' : 'No'}
                                    </span>
                                  </div>
                                </div>
                              : null}
                            {report.next_deadline_fail_reason
                              ? <div>
                                  <strong>
                                    Why won't you be able to make the next
                                    deadline?
                                  </strong>
                                  <div>
                                    <Linkify properties={{target: '_blank'}}>
                                      {report.next_deadline_fail_reason}
                                    </Linkify>
                                  </div>
                                </div>
                              : null}
                            {report.obstacles
                              ? <div>
                                  <strong>Obstacles</strong>
                                  <div>
                                    <Linkify properties={{target: '_blank'}}>
                                      {report.obstacles}
                                    </Linkify>
                                  </div>
                                </div>
                              : null}

                            {/* General */}
                            {typeof report.pm_communication == 'boolean'
                              ? <div>
                                  <strong>
                                    Is the communication between you and the
                                    project manager/developer(s) going well?
                                  </strong>
                                  <div>
                                    <span>
                                      {report.pm_communication ? 'Yes' : 'No'}
                                    </span>
                                  </div>
                                </div>
                              : null}
                            {report.rate_communication
                              ? <p>
                                  <strong>Rate Communication: </strong>
                                  <span>
                                    {report.rate_communication}/10
                                  </span>
                                </p>
                              : null}

                            {report.team_appraisal
                              ? <div>
                                  <strong>Team appraisal</strong>
                                  <div>
                                    <Linkify properties={{target: '_blank'}}>
                                      {report.team_appraisal}
                                    </Linkify>
                                  </div>
                                </div>
                              : null}
                            {report.remarks
                              ? <div>
                                  <strong>Remarks</strong>
                                  <div>
                                    <Linkify properties={{target: '_blank'}}>
                                      {report.remarks}
                                    </Linkify>
                                  </div>
                                </div>
                              : null}
                            {!is_missed && report.user.id == getUser().id
                              ? <button
                                  className="btn "
                                  onClick={this.onEditReport.bind(this)}>
                                  <i className="fa fa-pencil" /> Edit Report
                                </button>
                              : null}
                          </div>
                        );
                      })}
                    </div>
                  : is_missed
                    ? <div>
                        <strong>
                          {[
                            PROGRESS_EVENT_TYPE_MILESTONE,
                            PROGRESS_EVENT_TYPE_SUBMIT,
                            PROGRESS_EVENT_TYPE_COMPLETE,
                          ].indexOf(milestone.type) > -1
                            ? 'Milestone'
                            : 'Update'}{' '}
                          missed
                        </strong>
                      </div>
                    : null}
            </div>
          </div>
        : <div className="alert alert-danger">Milestone not found</div>;
  }
}
