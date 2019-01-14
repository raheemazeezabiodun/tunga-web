import PropTypes from 'prop-types';
import React from 'react';
import {Link} from 'react-router-dom';
import {Row, Col} from 'reactstrap';
import _ from 'lodash';

import Linkify from '../../core/Linkify';
import Avatar from "../../core/Avatar";
import Button from "../../core/Button";
import Success from "../../core/Success";
import {isAuthenticated, isClient} from "../../utils/auth";
import Progress from "../../core/Progress";
import Error from "../../core/Error";

export default class UserProfile extends React.Component {
    static defaultProps = {
        showHeader: true,
        canRequest: false,
    };

    static propTypes = {
        user: PropTypes.object,
        User: PropTypes.object,
        UserActions: PropTypes.object,
        showHeader: PropTypes.bool,
        canRequest: PropTypes.bool,
    };

    componentDidMount(){
        this.initMap();
    }

    componentDidUpdate(prevProps, prevState, snapShot){
        if(!_.isEqual(prevProps.user, this.props.user)) {
            this.initMap();
        }
    }

    initMap() {
        const {user} = this.props;

        let mapTimer = null;
        function createMap() {
            try {
                if(google && google.maps) {
                    let geocoder = new google.maps.Geocoder();

                    geocoder.geocode({
                        'address': user.profile.location
                    }, function (results, status) {
                        if (status === google.maps.GeocoderStatus.OK) {

                            let latLng = results[0].geometry.location,
                                map = new google.maps.Map(document.getElementById('map'), {
                                zoom: 12,
                                center: latLng
                            }),
                                marker = new google.maps.Marker({
                                position: latLng,
                                map: map
                            });

                            if(mapTimer) {
                                clearTimeout(mapTimer);
                            }
                        } else {
                            console.log('Geocode error: ', status);
                        }
                    });
                } else {
                    mapTimer = setTimeout(createMap, 500);
                }
            } catch (e) {
                mapTimer = setTimeout(createMap, 500);
            }
        }

        if(user.profile.location) {
            createMap();
        }
    }

    sendRequest = () => {
        window.scrollTo(0, 0);

        const { user, UserActions } = this.props;
        UserActions.requestUser(user.id);
    };

    render() {
        const {user, showHeader, User: {isRequesting, hasRequested, errors}, canRequest} = this.props,
            {profile} = user;

        return (
            user?(
                <div className="user-profile">
                    {showHeader?(
                        <Link to="/network" className="btn btn-primary back-link">Go back to overview</Link>
                    ):null}

                    {canRequest && isClient() && user.is_developer?(
                        <div>
                            {isRequesting?(
                                <Progress message="Requesting developer ..."/>
                            ):null}
                            {hasRequested?(
                                <Success message="Your request has been successfully sent to Tunga. We will get back to you shortly."/>
                            ):null}
                            {errors && errors.request?(
                                <Error message="Something went wrong! Please try again."/>
                            ):null}
                        </div>
                    ):null}

                    {showHeader?(
                        <div className="basic-profile">
                            <Avatar image={user.avatar_url} size="xl"/>
                            <div className="font-weight-medium">{user.display_name}</div>
                            <div className="text text-sm">{user.profile.location}</div>
                        </div>
                    ):null}

                    <Row>
                        <Col>
                            <div className="profile-card map-side">
                                <p>
                                    <Linkify properties={{target: '_blank'}}>
                                        {profile.bio}
                                    </Linkify>
                                </p>
                                {profile.skills && profile.skills.length?(
                                    <div>
                                        {profile.skills.slice(0, 6).map(skill => {
                                            return (
                                                <Button key={skill.id} variant="skill">{skill.name}</Button>
                                            );
                                        })}
                                    </div>
                                ):null}
                            </div>
                        </Col>
                        <Col>
                            <div className="map" id="map">
                                <div>
                                </div>
                            </div>
                        </Col>
                    </Row>

                    <Row className="profile-details">
                        <Col xs={12} sm={4}>
                            <div className="profile-card">
                                <div className="section-title">Experience</div>
                                {(user.work || []).map(work => {
                                    return (
                                        <div key={work.id} className="info-block">
                                            <div className="info-header">{work.company}</div>
                                            <div className="info-title">{work.position}</div>
                                            <div className="period">{work.start_month_display}/{work.start_year} - {work.end_year?`${work.end_month_display}/${work.end_year}`:'Present'}</div>
                                            <Linkify properties={{target: '_blank'}}>{work.details}</Linkify>
                                        </div>
                                    );
                                })}
                            </div>
                        </Col>
                        <Col xs={12} sm={4}>
                            <div className="profile-card">
                                <div className="section-title">Skillset</div>
                                {[
                                    ['language', 'Languages'],
                                    ['framework', 'Frameworks'],
                                    ['platform', 'Platforms'],
                                    ['library', 'Libraries'],
                                    ['storage', 'Storage Engines'],
                                    ['other', 'Miscellaneous']
                                ].map(item => {
                                    let categoryId = item[0],
                                        categoryName = item[1];
                                    return (
                                        <div key={categoryId} className="info-block">
                                            <div className="info-header">{categoryName}</div>
                                            <div>{profile.skills_details && (profile.skills_details[categoryId] || []).map(skill => { return skill.name }).join(', ')}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </Col>
                        <Col xs={12} sm={4}>
                            <div className="profile-card">
                                <div className="section-title">Education</div>
                                {(user.education || []).map(education => {
                                    return (
                                        <div key={education.id} className="info-block">
                                            <div className="info-header">{education.institution}</div>
                                            <div className="info-title">{education.award}</div>
                                            <div className="period">{education.start_month_display}/{education.start_year} - {education.end_year?`${education.end_month_display}/${education.end_year}`:'Present'}</div>
                                            <Linkify properties={{target: '_blank'}}>{education.details}</Linkify>
                                        </div>
                                    );
                                })}
                            </div>
                        </Col>
                    </Row>

                    {canRequest && isClient() && user.is_developer?(
                        <div className="text-center">
                            <Button size="xl" onClick={this.sendRequest} disabled={isRequesting || hasRequested}>Work with {user.first_name}</Button>
                        </div>
                    ):null}
                </div>
            ):null
        );
    }
}
