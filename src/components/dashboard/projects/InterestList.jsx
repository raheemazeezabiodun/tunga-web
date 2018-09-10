import PropTypes from 'prop-types';
import React from 'react';
import {Row, Col} from 'reactstrap';

import Progress from "../../core/Progress";
import InterestCard from './InterestCard';
import Button from '../../core/Button';
import {STATUS_INITIAL} from "../../../actions/utils/api";


export default class OpportunityList extends React.Component {
    static propTypes = {
        projects: PropTypes.array,
        isLoading: PropTypes.bool,
        ProjectActions: PropTypes.func.isRequired,
        status: PropTypes.string.isRequired
    };

    render() {
        const {project, status, isLoading, ProjectActions} = this.props,
            filteredInterestPolls = project.interest_polls.filter(interest => interest.status === status);

        return isLoading?(
            <Progress/>
        ):(
            filteredInterestPolls.length?(
                <div>
                    <div className="opportunity">
                        {status === STATUS_INITIAL?(
                            <div className="section">
                                <Button>Send Reminder</Button>
                            </div>
                        ):null}
                        {filteredInterestPolls.map(interest => {
                            return (
                                <InterestCard interest={interest}
                                              ProjectActions={ProjectActions}
                                              project={project}/>
                            );
                        })}
                    </div>
                </div>
            ):null
        );
    }
}
