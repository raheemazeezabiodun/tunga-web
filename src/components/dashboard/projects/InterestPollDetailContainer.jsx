import React from 'react';
import PropTypes from 'prop-types';
import randomstring from 'randomstring';

import {addPropsToChildren} from "../../core/utils/children";
import connect from "../../../connectors/ProjectConnector";


class InterestPollDetailContainer extends React.Component  {

    static propTypes = {
        pollId: PropTypes.string,
        selectionKey: PropTypes.string,
    };

    static defaultProps = {
        filters: {},
        selectionKey: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            selectionKey: props.selectionKey || randomstring.generate(),
            prevKey: null,
        };
    }

    componentDidMount() {
        this.getInterestPoll();
    }

    componentDidUpdate(prevProps, prevState, snapShot) {
        if(prevProps.pollId !== this.props.pollId) {
            this.getInterestPoll();
        }
    }

    getInterestPoll() {
        const {pollId, ProjectActions, Project} = this.props;
        if(pollId && !Project.interest_polls[pollId]) {
            ProjectActions.retrieveInterest(pollId);
        }
    }

    renderChildren() {
        const {pollId, Project, ProjectActions, children} = this.props;

        return addPropsToChildren(children, {
            interest_poll: Project.interest_polls[pollId],
            isRetrieving: Project.isRetrieving[pollId],
            isSaving: Project.isSaving,
            isSaved: Project.isSaved,
            errors: Project.errors,
            ProjectActions
        });
    }

    render() {
        return (
            <React.Fragment>
                {this.renderChildren()}
            </React.Fragment>
        );
    }
}

export default connect(InterestPollDetailContainer);
