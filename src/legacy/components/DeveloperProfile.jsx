import React from 'react';
import {Link} from 'react-router';
import Reveal from 'react-reveal';
import moment from 'moment';
import Linkify from './Linkify';
import {isAdmin, isProjectManager} from '../utils/auth';

import ShowcaseContainer from '../containers/ShowcaseContainer';
import MetaTags from '../components/MetaTags';
import Avatar from '../components/Avatar';
import ShowCaseFooter from '../containers/ShowCaseFooter';

export default class DeveloperProfile extends React.Component {

    componentDidMount(){
        this.props.UserActions.retrieveUser(this.props.params.userId);
        this.initMap();
    }

    onApprove(status) {
        const {User, UserActions} = this.props;
        const {user} = User.detail;

        UserActions.updateUser(user.id, {verified: status});
    }

    flattenSkills(skills) {
        return (skills || []).map(skill => {
            return skill.name;
        });
    }

    initMap() {
        var mapTimer = null;
        function createMap() {
            try {
                if(google && google.maps) {
                    var uluru = {lat: 0.3476, lng: 32.5825};
                    var map = new google.maps.Map(document.getElementById('map'), {
                        zoom: 12,
                        center: uluru
                    });
                    var marker = new google.maps.Marker({
                        position: uluru,
                        map: map
                    });
                    if(mapTimer) {
                        clearInterval(mapTimer);
                    }
                } else {
                    mapTimer = setInterval(createMap, 1000);
                }
            } catch (e) {
                mapTimer = setInterval(createMap, 1000);
            }
        }
        createMap();
    }

    renderHeaderContent() {
        const {User} = this.props;
        const {user} = User.detail;

        return (
            <div className="profile-details">
                <h1>{user.display_name}</h1>
                <h2>{user.profile?user.profile.location:''}</h2>
                <div >
                    <Avatar src={user.image} size="xxl"/>
                </div>
            </div>
        );
    }

    render() {
        let meta_title = 'Tunga | Developer profile';
        let meta_description = 'Developer Awesomeness';

        const {Auth, User} = this.props;
        const {user} = User.detail;
        const profile = user.profile || {};

        return (
            <ShowcaseContainer
                className="developer-profile-page"
                headerContent={this.renderHeaderContent()}>
                <MetaTags title={meta_title} description={meta_description} />

                {(isAdmin() || isProjectManager())?(
                    <div className="text-center" style={{paddingTop: '20px'}}>
                        <button className={`btn ${user.verified?'btn-alt':''}`} onClick={this.onApprove.bind(this, !user.verified)}>
                            <i className={`fa fa-${user.verified?'times':'check-circle'}`}/> {user.verified?'Disa':'A'}pprove
                        </button>
                        {/*
             <span className="verified"><i className="fa fa-check-circle"/> Verified</span>
            */}
                    </div>
                ):null}

                <div className="content">
                    <section>
                        {/*
            <div className="arrow">
            <button type="button" className="btn btn-borderless nav-btn prev-btn pull-left">
              <i className="fa fa-chevron-left"/>
            </button>
            </div>
            <div className="arrow">
            <button type="button" className="btn btn-borderless nav-btn prev-btn pull-right">
              <i className="fa fa-chevron-right"/>
            </button>
            </div>
             */}
                        <div className="container">
                            <div className="col-container">
                                <div className="col developer-card bio-content">
                                    <div className="bio-text">
                                        <Linkify properties={{target: '_blank'}}>
                                            {profile.bio}
                                        </Linkify>
                                    </div>
                                    <div className="bio-languages">
                                        {profile.skills && profile.skills.length?(
                                            <div>
                                                <div>
                                                    {profile.skills.slice(0,3).map(skill => {
                                                        return (
                                                            <Link to={`/people/skill/${skill.slug}`} className="btn btn-bio">{skill.name}</Link>
                                                        );
                                                    })}
                                                </div>
                                                {profile.skills.length > 3?(
                                                    <div>
                                                        {profile.skills.slice(3,6).map(skill => {
                                                            return (
                                                                <Link to={`/people/skill/${skill.slug}`} className="btn btn-bio">{skill.name}</Link>
                                                            );
                                                        })}
                                                    </div>
                                                ):null}
                                            </div>
                                        ):null}
                                    </div>
                                </div>
                                <div className="col developer-card map" id="map"/>
                            </div>

                            <div className="col-container">
                                <div className="col developer-card other-content">
                                    <div className="heading-2 bold">Experience</div>
                                    {(user.work || []).map(work => {
                                        return (
                                            <div className="info-block">
                                                <p className="info-header">{work.company} <span className="period">{work.start_month_display}/{work.start_year} - {!work.end_month && !work.end_year?'Present':`${work.end_month_display}/${work.end_year}`}</span></p>
                                                <p className="info-title">{work.position}</p>
                                                <Linkify properties={{target: '_blank'}}>{work.details}</Linkify>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="col developer-card other-content">
                                    <div className="heading-2 bold">Skillset</div>
                                    {profile.skills_details && profile.skills_details.language?(
                                        <div className="info-block">
                                            <p className="info-header">Languages</p>
                                            <p>{this.flattenSkills(profile.skills_details.language).join(', ')}</p>
                                        </div>
                                    ):null}
                                    {profile.skills_details && profile.skills_details.framework?(
                                        <div className="info-block">
                                            <p className="info-header">Frameworks</p>
                                            <p>{this.flattenSkills(profile.skills_details.framework).join(', ')}</p>
                                        </div>
                                    ):null}
                                    {profile.skills_details && profile.skills_details.platform?(
                                        <div className="info-block">
                                            <p className="info-header">Platforms</p>
                                            <p>{this.flattenSkills(profile.skills_details.platform).join(', ')}</p>
                                        </div>
                                    ):null}
                                    {profile.skills_details && profile.skills_details.library?(
                                        <div className="info-block">
                                            <p className="info-header">Libraries</p>
                                            <p>{this.flattenSkills(profile.skills_details.library).join(', ')}</p>
                                        </div>
                                    ):null}
                                    {profile.skills_details && profile.skills_details.storage?(
                                        <div className="info-block">
                                            <p className="info-header">Storage</p>
                                            <p>{this.flattenSkills(profile.skills_details.storage).join(', ')}</p>
                                        </div>
                                    ):null}
                                    {profile.skills_details && profile.skills_details.api?(
                                        <div className="info-block">
                                            <p className="info-header">3rd party APIs</p>
                                            <p>{this.flattenSkills(profile.skills_details.api).join(', ')}</p>
                                        </div>
                                    ):null}
                                    {profile.skills_details && profile.skills_details.other?(
                                        <div className="info-block">
                                            <p className="info-header">Miscellaneous</p>
                                            <p>{this.flattenSkills(profile.skills_details.other).join(', ')}</p>
                                        </div>
                                    ):null}
                                </div>
                                <div className="col developer-card other-content">
                                    <div className="heading-2 bold">Education</div>
                                    {(user.education || []).map(education => {
                                        return (
                                            <div className="info-block">
                                                <p className="info-header">{education.institution} <span className="period">{education.start_month_display}/{education.start_year} - {!education.end_month && !education.end_year?'Present':`${education.end_month_display}/${education.end_year}`}</span></p>
                                                <p className="info-title">{education.award}</p>
                                                <Linkify properties={{target: '_blank'}}>{education.details}</Linkify>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="text-center">
                                <Link to={Auth.isAuthenticated?"/work/new/":"/start/"} className="btn btn-callout btn-main-cta">
                                    Hire {user.first_name}
                                </Link>
                            </div>

                        </div>
                    </section>
                </div>
                <div className="text-center">
                    <small>
                        &copy; {moment().format('YYYY')} Tunga.io &mdash; All rights
                        reserved.
                    </small>
                </div>
            </ShowcaseContainer>
        );
    }
}
