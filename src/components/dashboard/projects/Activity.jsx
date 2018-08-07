import PropTypes from 'prop-types';
import React from 'react';
import randomstring from "randomstring";

import connect from "../../../connectors/ActivityConnector";

import ActivityList from "../../chat/ActivityList";
import IconButton from "../../core/IconButton";
import MessageWidget from "../../core/MessageWidget";

class Activity extends React.Component {
    static propTypes = {
        project: PropTypes.object,
        Activity: PropTypes.object,
        ProjectActions: PropTypes.object,
        ActivityActions: PropTypes.object,
    };

    updateTimer = null;

    constructor(props) {
        super(props);
        this.state = {
            selectionKey: props.selectionKey || randomstring.generate(),
            prevKey: null,
            messages: true,
            notifications: true,
            files: true,
            progress_reports: true,
            showFilter: false,
        };
    }

    componentDidMount() {
        this.getList();

        this.updateTimer = setInterval(this.getNewActivity.bind(this), 5000);
    }

    componentDidUpdate(prevProps, prevState, snapShot) {
        if(!_.isEqual(prevProps.filters, this.props.filters)) {
            this.getList();
        }
    }

    componentWillUnmount() {
        clearInterval(this.updateTimer);
    }

    getList(filters={}) {
        const {project, ActivityActions} = this.props;
        ActivityActions.listActivities(
            {...(this.props.filters || {}), ...(filters || {}), project: project.id},
            this.state.selectionKey, this.state.prevKey
        );
    }

    getNewActivity() {
        const {Activity} = this.props,
            selectionKey = this.state.selectionKey;

        if (!Activity.isFetching[selectionKey]) {
            let since = 0,
                activityIds = [];

            (Activity.ids[selectionKey] || []).forEach(id => {
                if(typeof id === 'number') {
                    activityIds.push(id);
                }
            });

            if (activityIds.length) {
                since = activityIds[0];
            }

            if(since) {
                this.getList({since});
            }
        }
    }

    onToggleFilter(key, e) {
        e.stopPropagation();
        let newState = {};
        newState[key] = !this.state[key];
        this.setState(newState);
    }

    onSendMessage = (message) => {
        const {project, ActivityActions} = this.props;
        let comment = {
            content_type: project.content_type,
            object_id: project.id,
            body: message
        };

        ActivityActions.createComment(comment, this.state.selectionKey);
    };

    onUpload = (file) => {
        const {project, ActivityActions} = this.props;
        let upload = {
            content_type: project.content_type,
            object_id: project.id,
            file: file
        };

        ActivityActions.createUpload(upload, this.state.selectionKey);
    };

    render() {
        const {project, Activity, ActivityActions} = this.props,
            selectionKey = this.state.selectionKey;
        let activities = (Activity.ids[selectionKey] || []).map(id => {
            return Activity.activities[id];
        });

        return (
            <div>
                <div className="hidden-xs">
                    <div className={`clearfix activity-filter ${this.state.showFilter ?'open':''}`}>
                        <div className="float-left">
                            <IconButton name="filter" size="sm"
                                        className="btn-filter" onClick={() => {this.setState({showFilter: !this.state.showFilter})}}/>
                        </div>
                        <div className="switches clearfix">
                            {[
                                ['messages', 'Messages'],
                                ['notifications', 'Notifications'],
                                ['progress_reports', 'Progress Reports'],
                                ['files', 'Files']
                            ].map(filter => {
                                let filterKey = filter[0],
                                    filterName = filter[1];

                                return (
                                    <div key={filterKey} className="switch">
                                        <IconButton name={`toggle-${this.state[filterKey]?'on':'off'}`}
                                                    size="sm" className={`${this.state[filterKey]?'on':'off'}`}
                                                    onClick={this.onToggleFilter.bind(this, filterKey)}/>
                                        <span> {filterName}</span>
                                    </div>
                                );
                            })}

                        </div>
                    </div>
                </div>

                <ActivityList activities={activities.reverse()}
                              onLoadMore={() => {
                                  ActivityActions.listMoreActivities(Activity.next[selectionKey], selectionKey);
                              }}
                              isLoading={Activity.isFetching[selectionKey]}
                              isLoadingMore={Activity.isFetchingMore[selectionKey]}
                              hasMore={!!Activity.next[selectionKey]}
                              showMessages={this.state.messages}
                              showNotifications={this.state.notifications}
                              showProgressReports={this.state.progress_reports}
                              showFiles={this.state.files}/>

                {project.archived?null:(
                    <MessageWidget onSendMessage={this.onSendMessage} onUpload={this.onUpload}/>
                )}
            </div>
        );
    }
}

export default connect(Activity);
