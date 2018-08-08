import React from 'react';
import Progress from "../../core/Progress";

import connect from '../../../connectors/UtilityConnector';

import {getMapKey} from '../../../utils/migration';

class WorkRedirect extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            projectId: null,
            eventId: null,
            hasRetrievedProject: false,
            hasRetrievedEvent: false
        };
    }

    componentDidMount() {
        const {taskId, eventId, UtilityActions} = this.props;

        UtilityActions.findReplacement('task', taskId);

        if(eventId) {
            UtilityActions.findReplacement('event', eventId);
        }
    }

    componentDidUpdate(prevProps, prevState, snapShot) {
        const {taskId, eventId, history} = this.props,
            projectKey = getMapKey('task', taskId);

        let newState = {};
        if(!this.props.Utility.migrate.isRetrieving[projectKey] && prevProps.Utility.migrate.isRetrieving[projectKey]) {
            newState.hasRetrievedProject = true;
            let project = this.props.Utility.migrate.items[projectKey];
            newState.projectId = project?project.id:null;
        }

        if(eventId) {
            const eventKey = getMapKey('event', eventId);
            if(!this.props.Utility.migrate.isRetrieving[eventKey] && prevProps.Utility.migrate.isRetrieving[eventKey]) {
                newState.hasRetrievedEvent = true;
                let event = this.props.Utility.migrate.items[eventKey];
                newState.projectId = event?event.id:null;
            }
        }
        if(Object.keys(newState).length) {
            this.setState(newState);
        }

        if(this.state.hasRetrievedProject && !prevState.hasRetrievedProject || this.state.hasRetrievedEvent && !prevState.hasRetrievedEvent) {
            const {hasRetrievedProject, hasRetrievedEvent} = this.state;
            if(hasRetrievedProject && (hasRetrievedEvent || !eventId)) {
                let project = this.props.Utility.migrate.items[projectKey],
                    url = `/projects/${this.state.projectId || project?project.id:null || `legacy_${taskId}`}`;
                if(eventId) {
                    let eventKey = getMapKey('event', eventId),
                        event = this.props.Utility.migrate.items[eventKey];

                    url += `/events/${this.state.eventId || event?event.id:null || `legacy_${eventId}`}`;
                }
                history.push(url);
            }
        }
    }

    render() {
        return (
            <Progress/>
        );
    }
}

export default connect(WorkRedirect);
