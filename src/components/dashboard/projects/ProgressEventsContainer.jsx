import PropTypes from 'prop-types';
import React from 'react';
import { Switch, Route } from 'react-router-dom';

import ProgressEventDetailContainer from './ProgressEventDetailContainer';
import ProgressEventDetails from './ProgressEventDetails';

import connect from '../../../connectors/ProgressEventConnector';


class ProgressEventsContainer extends React.Component {

    static propTypes = {
        project: PropTypes.object
    };

    render() {
        const {project, ProgressEvent, ProgressEventActions, match} = this.props;

        return (
            <React.Fragment>
                <Switch>
                    <Route path={`${match.url}/:eventId`}
                           render={props => <ProgressEventDetailContainer {...props}
                                                                          eventId={props.match.params.eventId}
                                                                          ProgressEvent={ProgressEvent}
                                                                          ProgressEventActions={ProgressEventActions}>
                               <ProgressEventDetails project={project} {...props}/>
                           </ProgressEventDetailContainer>}
                    />
                </Switch>
            </React.Fragment>
        );
    }
}

export default connect(ProgressEventsContainer);
