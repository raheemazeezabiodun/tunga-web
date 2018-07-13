import PropTypes from 'prop-types';
import React from 'react';
import {Row, Col} from 'reactstrap';
import randomstring from "randomstring";

import connect from "../../connectors/ActivityConnector";

import ActivityList from "../ActivityList";
import IconButton from "../core/IconButton";
import CustomInputGroup from "../core/CustomInputGroup";
import Upload from "../core/Upload";

class Activity extends React.Component {
    static propTypes = {
        project: PropTypes.object,
        Activity: PropTypes.object,
        ProjectActions: PropTypes.object,
        ActivityActions: PropTypes.object,
    };

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
    }

    componentDidUpdate(prevProps, prevState, snapShot) {
        if(!_.isEqual(prevProps.filters, this.props.filters)) {
            this.getList();
        }
    }

    getList() {
        const {project, ActivityActions} = this.props;
        ActivityActions.listActivities({project: project.id, ...(this.props.filters || {})}, this.state.selectionKey, this.state.prevKey);
    }

    onToggleFilter(key, e) {
        e.stopPropagation();
        let newState = {};
        newState[key] = !this.state[key];
        this.setState(newState);
    }

    onSendMessage = (e) => {
        // TODO: Send Message
    };

    onUpload = (files) => {
        // TODO: Upload file
    };

    render() {
        const {Activity, ActivityActions} = this.props,
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

                <Row>
                    <Col className="col-add-docs">
                        <Upload variant="icon" size="md" showSelected={false} onChange={this.onUpload}/>
                    </Col>
                    <Col>
                        <CustomInputGroup variant="message" onChange={this.onSendMessage}/>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default connect(Activity);
