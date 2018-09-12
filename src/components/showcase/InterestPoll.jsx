import React from 'react';
import PropTypes from "prop-types";
import querystring from "querystring";

import Error from '../core/Error';
import Success from '../core/Success';
import Button from "../core/Button";
import Progress from "../core/Progress";

import connect from '../../connectors/AuthConnector';
import {displayExpectedReturn} from "../utils/helpers";
import {STATUS_INTERESTED, STATUS_UNINTERESTED} from "../../actions/utils/api";
import {getUser} from "../utils/auth";
import {openConfirm} from "../core/utils/modals";

class InterestPoll extends React.Component {

    static defaultProps = {
        newUser: false
    };

    static propTypes = {
        uid: PropTypes.string.required,
        token: PropTypes.string.required,
        newUser: PropTypes.bool,
    };

    constructor(props) {
        super(props);
        const queryParams = querystring.parse((location.search || '').replace('?', ''));
        this.state = {status: queryParams.status};
    }

    componentDidUpdate(prevProps, prevState, snapShot) {
        if (this.props.interest_poll && !prevProps.interest_poll && [STATUS_INTERESTED, STATUS_UNINTERESTED].includes(this.state.status)) {
            this.setState({status: null});
            let self = this, status = this.state.status;
            openConfirm(
                status === STATUS_INTERESTED?
                    'Confirm your interest in this project.':(
                        <div>Are you sure you are <strong>NOT</strong> interested in this project?</div>
                    )
            ).then(response => {
                self.onInterestUpdate(this.props.interest_poll, status);
            }, error => {

            });
        }
    }

    onInterestUpdate(interest, status) {
        const { ProjectActions, } = this.props;
        if(interest && interest.id) {
            ProjectActions.updateInterest(interest.id, {status})
        } else {
            const {project} = this.props;
            ProjectActions.createInterest({project: {id: project.id}, user: {id: getUser().id}, status})
        }
    }

    render() {
        const {interest_poll, isRetrieving, isSaved, isSaving} = this.props;

        return (
            <div className="action-page">
                <header className="height-100">
                    <div className="container">
                        {isRetrieving?(
                            <div className="content-card">
                                <Progress message="Loading ..."/>
                            </div>
                        ):(
                            interest_poll?(
                                <div className="content-card">
                                    {isSaved && isSaved.interest?(
                                        <div className="form-group">
                                            <Success message="Successfully submitted your availability"/>
                                        </div>
                                    ):null}

                                    <h2>{interest_poll.project.title}</h2>
                                    <p>{interest_poll.project.description}</p>

                                    <div>
                                        <span className="font-weight-medium">Expected duration: </span>
                                        {displayExpectedReturn(interest_poll.project.expected_duration)}
                                     </div>

                                    {interest_poll.project.skills && interest_poll.project.skills.length ? (
                                        <p>
                                            <span className="font-weight-medium">Skills: </span>
                                            {interest_poll.project.skills.map(skill => {
                                                return skill.name;
                                            }).join(', ')}
                                        </p>
                                    ): null}

                                    <div className="interest-actions clearfix">
                                        <div className="float-right">
                                            {interest_poll.status !== STATUS_INTERESTED?(
                                                <Button onClick={() => this.onInterestUpdate(interest_poll, STATUS_INTERESTED)}>
                                                    I'm available {interest_poll.status === STATUS_UNINTERESTED?'again':'and interested'}
                                                </Button>
                                            ):null}
                                            {interest_poll.status !== STATUS_UNINTERESTED?(
                                                <Button variant='secondary' onClick={() => this.onInterestUpdate(interest_poll, STATUS_UNINTERESTED)}>
                                                    I'm not available {interest_poll.status === STATUS_INTERESTED?'anymore':'for this project'}
                                                </Button>
                                            ):null}
                                        </div>
                                    </div>
                                </div>
                            ):(
                                <Error message="Something went wrong! Please try again later."/>
                            )
                        )}
                    </div>
                </header>
            </div>
        );
    }
}

export default connect(InterestPoll);
