import PropTypes from 'prop-types';
import React from 'react';

import Progress from "../../core/Progress";
import InterestCard from './InterestCard';
import Button from '../../core/Button';
import {STATUS_INITIAL} from "../../../actions/utils/api";
import Success from "../../core/Success";
import Error from "../../core/Error";
import {openConfirm} from "../../core/utils/modals";


export default class InterestList extends React.Component {

    static propTypes = {
        project: PropTypes.object,
        interest_polls: PropTypes.array,
        isLoading: PropTypes.bool,
        ProjectActions: PropTypes.func.isRequired,
        status: PropTypes.string.isRequired
    };

    sendReminder = () => {
        const { project, ProjectActions } = this.props;

        openConfirm(
            'Are you sure you want to send a reminder?',
            '', false,
            {ok: 'Yes', cancel: 'No'}
        ).then(response => {
            ProjectActions.sendReminder(project.id);
        }, error => {
            // nothing
        });


    };

    render() {
        const {project, interest_polls, status, isLoading, isSaving, isSaved, errors, ProjectActions} = this.props,
            filteredInterestPolls = interest_polls.filter(interest => interest.status === status);

        return isLoading?(
            <Progress/>
        ):(
            filteredInterestPolls.length?(
                <div className="opportunity">
                    {status === STATUS_INITIAL?(
                        <div className="section">
                            {isSaved['remind']?(
                                <Success message="Reminders have been queued for developers."/>
                            ):null}

                            {errors && errors['remind']?(
                                <Error message="Something went wrong! Please try again."/>
                            ):null}

                            <Button onClick={this.sendReminder} disabled={isSaving['remind'] || isSaved['remind']}>Send Reminder</Button>
                        </div>
                    ):null}
                    {filteredInterestPolls.map(interest => {
                        return (
                            <InterestCard interest={interest}
                                          ProjectActions={ProjectActions}
                                          project={project}
                                          isSaving={isSaving['remind']}
                                          isSaved={isSaved['remind']}/>
                        );
                    })}
                </div>
            ):null
        );
    }
}
