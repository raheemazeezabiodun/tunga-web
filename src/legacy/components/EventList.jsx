import React from 'react';
import {Link, IndexLink} from 'react-router';
import BigCalendar from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import _ from 'lodash';
import {serializeMilestones} from '../utils/helpers';
import LoadMore from './status/LoadMore';

let allViews = Object.keys(BigCalendar.Views).map(k => BigCalendar.Views[k]);

BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment));

export default class EventList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            milestones: [],
        };
    }

    componentDidMount() {
        this.props.MilestoneActions.listMilestones({});
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (
            !_.isEqual(
                this.state.milestones,
                nextProps.Milestone.list.milestones,
            ) &&
            !_.isEqual(nextProps.Milestone.list.milestones, undefined)
        ) {
            var old_milestones = this.state.milestones;
            var new_milestones = old_milestones.concat(
                serializeMilestones(
                    _.values(nextProps.Milestone.list.milestones),
                ),
            );
            this.setState((prevState, props) => {
                return {
                    milestones: new_milestones,
                };
            });
        }
    }

    render() {
        const {Milestone, MilestoneActions} = this.props;

        return (
            <div className="clearfix">
                <div className="row">
                    <h2 className="pull-left">Events</h2>
                    <div className="pull-right">
                        <LoadMore
                            url={Milestone.list.next}
                            callback={MilestoneActions.listMoreMilestones}
                            loading={Milestone.list.isFetchingMore}
                        />
                    </div>
                </div>

                <BigCalendar
                    popup
                    views={allViews}
                    events={this.state.milestones}
                    style={{minHeight: 500}}
                />
            </div>
        );
    }
}
