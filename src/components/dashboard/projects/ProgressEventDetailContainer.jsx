import React from 'react';
import PropTypes from 'prop-types';
import randomstring from 'randomstring';
import {addPropsToChildren} from '../core/utils/children';
import Progress from "../core/Progress";

export default class ProgressEventDetailContainer extends React.Component  {

    static propTypes = {
        eventId: PropTypes.string,
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
        this.getProgressEvent();
    }

    componentDidUpdate(prevProps, prevState, snapShot) {
        if(prevProps.eventId !== this.props.eventId) {
            this.getProgressEvent();
        }
    }

    getProgressEvent() {
        const {eventId, ProgressEventActions, ProgressEvent} = this.props;
        if(eventId && !ProgressEvent.progress_events[eventId]) {
            ProgressEventActions.retrieveProgressEvent(eventId);
        }
    }

    renderChildren() {
        const {eventId, ProgressEvent, ProgressEventActions, children} = this.props;

        return addPropsToChildren(children, {
            progress_event: ProgressEvent.progress_events[eventId],
            isSaving: ProgressEvent.isSaving[eventId],
            isSaved: ProgressEvent.isSaved[eventId],
            isRetrieving: ProgressEvent.isRetrieving[eventId],
            Report: {
                isSaving: ProgressEvent.isSaving.report,
                isSaved: ProgressEvent.isSaved.report
            },
            errors: ProgressEvent.errors,
            ProgressEventActions
        });
    }

    render() {
        const {eventId, ProgressEvent} = this.props;
        let progress_event = ProgressEvent.progress_events[eventId];

        return (
            <React.Fragment>
                {ProgressEvent.isRetrieving[eventId]?(
                    <Progress/>
                ):progress_event?(
                    this.renderChildren()
                ):null}
            </React.Fragment>
        );
    }
}
