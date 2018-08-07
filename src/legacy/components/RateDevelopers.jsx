import React from 'react';
import {Link} from 'react-router';
import Rating from 'react-rating';

import Avatar from './Avatar';

import {RATING_CRITERIA_CHOICES} from '../constants/Api';
import {getUser} from '../utils/auth';

export default class RateDevelopers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {ratings_map: null};
    }

    onRatingChange(criteria, rating) {
        const {TaskActions, task} = this.props;
        TaskActions.updateTask(task.id, {
            ratings: [{criteria, score: rating}],
        });
    }

    UNSAFE_componentWillMount() {
        this.mapUserRatings(this.props);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.Task.detail.isSaved && !this.props.Task.detail.isSaved) {
            this.mapUserRatings(nextProps);
        }
    }

    handleSubmit(e) {
        e.preventDefault();

        return;
    }

    mapUserRatings(props) {
        const {task} = props;
        if (task && task.ratings && task.ratings.length) {
            var ratings_map = {};
            task.ratings.forEach(rating => {
                if (rating.created_by.id == getUser().id) {
                    ratings_map[rating.criteria] = rating.score;
                }
            });
            this.setState({ratings_map});
        }
    }

    render() {
        const {task} = this.props;

        return (
            <div className="form-wrapper">
                <form
                    onSubmit={this.handleSubmit.bind(this)}
                    name="rate"
                    role="form"
                    ref="rate_form">
                    <h4 className="title">
                        Rate Developer{task.details &&
                        task.details.active_participants &&
                        task.details.active_participants.length == 1
                            ? ''
                            : 's'}
                    </h4>

                    <div className="card">
                        Rating developers helps the Tunga developer community a
                        great deal. We would appreciate it if you could take a
                        moment to rate our developer(s).<br />
                        It only takes 10 seconds. Thank you!
                    </div>
                    <div className="clearfix">
                        {task.details && task.details.active_participants ? (
                            <div>
                                <div>
                                    <strong>You've worked with:</strong>
                                </div>
                                {task.details.active_participants.map(
                                    participation => {
                                        const participant =
                                            participation.user || participation;
                                        return (
                                            <div
                                                className="pull-left"
                                                style={{marginRight: '10px'}}
                                                key={participant.id}>
                                                <Avatar
                                                    src={participant.avatar_url}
                                                />
                                                <Link
                                                    to={`/people/${
                                                        participant.username
                                                    }/`}>
                                                    {participant.display_name}
                                                </Link>
                                            </div>
                                        );
                                    },
                                )}
                            </div>
                        ) : null}
                    </div>
                    {RATING_CRITERIA_CHOICES.map(criteria => {
                        return (
                            <div key={criteria.id} style={{margin: '15px 0'}}>
                                <h5>{criteria.name}</h5>
                                <div className="rating large">
                                    <Rating
                                        start={0}
                                        stop={10}
                                        step={2}
                                        fractions={2}
                                        initialRate={
                                            this.state.ratings_map
                                                ? this.state.ratings_map[
                                                      criteria.id
                                                  ]
                                                : 0
                                        }
                                        empty={'fa fa-star-o'}
                                        full={'fa fa-star'}
                                        onChange={this.onRatingChange.bind(
                                            this,
                                            criteria.id,
                                        )}
                                    />
                                </div>
                            </div>
                        );
                    })}
                    <Link to="/" className="btn">
                        Done
                    </Link>
                </form>
            </div>
        );
    }
}
