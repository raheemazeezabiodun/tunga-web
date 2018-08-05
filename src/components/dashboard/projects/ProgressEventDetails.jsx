import React from 'react';
import PropTypes from "prop-types";
import {Link, Switch, Route} from 'react-router-dom';
import moment from "moment";

import Linkify from '../core/Linkify';

import {isDev, isClient, getUser} from "../utils/auth";
import Icon from "../core/Icon";
import ProgressReportForm from "./ProgressReportForm";
import ProgressReport from "./ProgressReport";

export default class ProgressEventDetails extends React.Component {

    static propTypes = {
        progress_event: PropTypes.object,
        isSaving: PropTypes.object,
        isSaved: PropTypes.object,
        ProgressEventActions: PropTypes.object,
        match: PropTypes.object
    };

    getMyReport() {
        const {progress_event} = this.props;
        const {progress_reports} = progress_event;

        let myReport = null;
        if(progress_reports) {
            progress_reports.forEach(report => {
                if(report.user.id === getUser().id) {
                    myReport = report;
                }
            });
        }
        return myReport;
    }

    render() {
        const {match, project, progress_event, ProgressEventActions, Report, errors} = this.props;
        const {progress_reports} = progress_event,
            myReport = this.getMyReport();

        // 24 hrs for devs, 72 hrs for PMs and forever for clients
        let isMissed = isClient()
            ? false
            : moment.utc(progress_event.due_at).add(isDev()?1:3, 'day') < moment.utc();

        return (
            <div>
                <div className="section">
                    <div className="font-weight-medium"><Icon name="flag-checkered"/> {progress_event.title}</div>
                    {progress_event.due_at ? (
                        <div>
                            <strong>Due Date:</strong>{' '}
                            {moment
                                .utc(progress_event.due_at)
                                .local()
                                .format('Do, MMMM YYYY')}
                        </div>
                    ) : null}

                    {progress_event.description ? (
                        <div>
                            <strong>Description:</strong>
                            <div>
                                <Linkify>
                                    {progress_event.description}
                                </Linkify>
                            </div>
                        </div>
                    ) : null}
                </div>

                <Switch>
                    <Route path={`${match.url}/report`}
                           render={props => (
                               <div>
                                   <div className="section">
                                       <Link to={match.url}
                                             className="btn btn-outline-primary">
                                           <Icon name="arrow-left"/> Back to Event
                                       </Link>
                                   </div>
                                   <ProgressReportForm progress_report={myReport || {}}
                                                       progress_event={progress_event}
                                                       project={project || progress_event.project || {}}
                                                       ProgressReportActions={ProgressEventActions}
                                                       {...Report}
                                                       errors={errors.report || {}}/>
                               </div>
                           )}
                    />
                    <Route path={`${match.url}`} exact render={props => (
                        <div>
                            {isMissed || myReport || project.archived?null:(
                                <div className="section">
                                    <Link to={`/projects/${progress_event.project.id}/events/${progress_event.id}/report`}
                                          className="btn btn-primary">
                                        <Icon name="add"/> Add Report
                                    </Link>
                                </div>
                            )}
                            {progress_reports.map(report => {
                                return (
                                    <ProgressReport key={report.id} progress_report={report} progress_event={progress_event}/>
                                );
                            })}
                        </div>
                    )}/>
                </Switch>
            </div>
        );
    }
}
