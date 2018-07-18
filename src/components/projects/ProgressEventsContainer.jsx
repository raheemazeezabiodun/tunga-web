import PropTypes from 'prop-types';
import React from 'react';
import { Switch, Route } from 'react-router-dom';

import connect from '../../connectors/ProgressEventConnector';

import ProgressEventDetailContainer from './ProgressEventDetailContainer';
import ProgressEventDetails from './ProgressEventDetails';


class ProgressEventsContainer extends React.Component {

    static propTypes = {
        project: PropTypes.object
    };

    render() {
        const {ProgressEvent, ProgressEventActions, match} = this.props;

        return (
            <React.Fragment>
                <Switch>
                    <Route path={`${match.url}/:eventId`}
                           render={props => <ProgressEventDetailContainer {...props}
                                                                          eventId={props.match.params.eventId}
                                                                          ProgressEvent={ProgressEvent}
                                                                          ProgressEventActions={ProgressEventActions}>
                               <ProgressEventDetails {...props}/>
                           </ProgressEventDetailContainer>}
                    />
                </Switch>
            </React.Fragment>
        );
    }
}

export default connect(ProgressEventsContainer);
