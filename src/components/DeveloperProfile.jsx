import React from 'react';
import {Link} from 'react-router-dom';
import Reveal from 'react-reveal';
import moment from 'moment';

import ShowcaseContainer from '../containers/ShowcaseContainer';
import MetaTags from '../components/MetaTags';
import ShowCaseFooter from '../containers/ShowCaseFooter';

export default class DeveloperProfile extends React.Component {

  componentDidMount(){
    this.initMap();
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
    return (
      <div>
        <h1>Elijah Atuhaire</h1>
        <h2>Kampala, Uganda</h2>
        <div className="profile-div">
          <img className="profile-image" src={require('../images/chat/elijah.jpg')} />
        </div>
      </div>
    );
  }

  render() {
    let meta_title = 'Tunga | Developer profile';
    let meta_description = 'Developer Awesomeness';

    return (
      <ShowcaseContainer
        className="developer-profile-page"
        headerContent={this.renderHeaderContent()}>
        <MetaTags title={meta_title} description={meta_description} />

        {/*<div className="">
          <img className="profile-image" src={require('../images/devs/Adeline.jpg')} />
        </div>*/}

        <div className="content">
          <section>
            <div className="arrow">
            <button type="button" className="btn btn-borderless nav-btn prev-btn pull-left">
              <i className="fa fa-chevron-left"></i>
            </button>
            </div>
            <div className="arrow">
            <button type="button" className="btn btn-borderless nav-btn prev-btn pull-right">
              <i className="fa fa-chevron-right"></i>
            </button>
            </div>
            <div className="container">
              <div className="col-container">
                <div className="col developer-card bio-content">
                  <div className="bio-text">
                    Bio of developers Lorem ipsum dolor sit amet,
                    libris dolorem quo no, ei sed clita repudiandae,
                    quo ridens instructior ad. Ius libris deleniti ea,
                    cu mutat detraxit vis, cum iudico oratio tamquam ad.
                    Ei ubique invidunt expetendis ius, ea pro quis detraxit iudicabit.
                    Quo corpora molestiae an. Te duo novum
                  </div>
                  <div className="bio-languages">
                    <div className="">
                      <Link to="/start/" className="btn btn-bio">iOS</Link>
                      <Link to="/start/" className="btn btn-bio">Swift</Link>
                      <Link to="/start/" className="btn btn-bio">Cordova</Link>
                    </div>
                    <div className="">
                      <Link to="/start/" className="btn btn-bio">Android</Link>
                      <Link to="/start/" className="btn btn-bio">PHP</Link>
                    </div>
                  </div>
                </div>
                <div className="col developer-card map" id="map">
                  <div>
                    Bio of developers Lorem ipsum dolor sit amet,
                    libris dolorem quo no, ei sed clita repudiandae,
                    quo ridens instructior ad. Ius libris deleniti ea,
                    cu mutat detraxit vis, cum iudico oratio tamquam ad.
                    Ei ubique invidunt expetendis ius, ea pro quis detraxit iudicabit.
                    Quo corpora molestiae an. Te duo novum
                  </div>
                </div>
              </div>

              <div className="col-container">
                <div className="col developer-card other-content">
                  <div className="heading-2 bold">Experience</div>
                  <div className="info-block">
                    <p className="info-header">Company / Project <span className="period">20XX - 20XX</span></p>
                    <p className="info-title">Title</p>
                    <ul>
                      <li>Responsibility 1</li>
                      <li>Responsibility 2</li>
                      <li>Responsibility 3</li>
                      <li>Responsibility 4</li>
                      <li>Responsibility 5</li>
                    </ul>
                  </div>
                  <div className="info-block">
                    <p className="info-header">Company</p>
                    <p className="info-title">Title</p>
                    <ul>
                      <li>Responsibility 1</li>
                      <li>Responsibility 2</li>
                      <li>Responsibility 3</li>
                    </ul>
                  </div>
                  <div className="info-block">
                    <p className="info-header">Company</p>
                    <p className="info-title">Title</p>
                    <ul>
                      <li>Responsibility 1</li>
                      <li>Responsibility 2</li>
                      <li>Responsibility 3</li>
                    </ul>
                  </div>
                </div>
                <div className="col developer-card other-content">
                  <div className="heading-2 bold">Skillset</div>
                  <div className="info-block">
                    <p className="info-header">Languages</p>
                    <p>PHP, Python, Java, Ruby</p>
                  </div>
                  <div className="info-block">
                    <p className="info-header">Frameworks</p>
                    <p>Rails, Python, Wordpress, React.js</p>
                  </div>
                  <div className="info-block">
                    <p className="info-header">Platforms</p>
                    <p>Ubuntu, AWS, Heroku</p>
                  </div>
                  <div className="info-block">
                    <p className="info-header">Libraries</p>
                    <p>Rails, Python, Wordpress, React.js</p>
                  </div>
                  <div className="info-block">
                    <p className="info-header">Storage</p>
                    <p>MySQL, Postgres</p>
                  </div>
                  <div className="info-block">
                    <p className="info-header">3rd party APIs</p>
                    <p>Slack, Facebook</p>
                  </div>
                  <div className="info-block">
                    <p className="info-header">Miscellaneous</p>
                    <p>Example 1, Example 2</p>
                  </div>
                </div>
                <div className="col developer-card other-content">
                  <div className="heading-2 bold">Education</div>
                  <div className="info-block">
                    <p className="info-header">University name</p>
                    <p className="info-title">Degree</p>
                    <p>mon/20XX - Mon/20XX</p>
                  </div>
                  <div className="info-block">
                    <p className="info-header">3rd party APIs</p>
                    <p className="info-title">Degree</p>
                    <p>mon/20XX - Mon/20XX</p>
                  </div>
                  <div className="info-block">
                    <p className="info-header">Vocational training 2</p>
                    <p className="info-title">Degree</p>
                    <p>mon/20XX - Mon/20XX</p>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <Link to="/start/" className="btn btn-callout btn-main-cta">
                  Hire Elijah
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
