import React from 'react';
import {Link, NavLink} from 'react-router-dom';
import {Affix} from 'react-overlays';

import {openCalendlyWidget} from '../utils/router';
import {isTungaDomain} from '../utils/router';

import ChatWindow from '../containers/ChatWindow';

import connect from '../utils/connectors/AuthConnector';

class ShowcaseContainer extends React.Component {

  componentDidMount() {

    let updateTopBar = function () {
      let windowWidth = $(window).innerWidth();
      if(windowWidth >= 992) {
        if($(document).scrollTop() >= 20) {
          $('.navbar').removeClass('navbar-glass');
        } else if(!__PRODUCTION__) {
          $('.navbar').addClass('navbar-glass');
        }
      }
    };

    $(document).ready(updateTopBar);
    $(document).scroll(updateTopBar);
    $(window).resize(updateTopBar);
  }

  render() {
    const pathPrefix =
      !isTungaDomain() &&
      /^\/tunga((\/|\?).*)?/gi.test(window.location.pathname)
        ? '/tunga'
        : '';
    const {Auth} = this.props;

    return (
      <div className={'showcase ' + this.props.className}>
        <header
          style={
            this.props.headerVideo
              ? {overflow: 'hidden', position: 'relative'}
              : null
          }>
          {this.props.headerVideo
            ? <video
                autoPlay
                loop
                style={{
                  position: 'absolute',
                  top: '0',
                  left: 0,
                  width: '100%',
                  minHeight: '100%',
                }}
                muted>
                <source
                  src={require('../video/homepagetunga.mp4')}
                  type="video/mp4"
                />
              </video>
            : null}
          {this.props.headerVideo ? <div className="video-overlay" /> : null}
          {this.props.hasArrow
            ? <div className="arrow-overlay">
                <div className="ribbon" />
                <div
                  className="pointer text-center"
                  onClick={e => {
                    $('body').animate({scrollTop: '+=300'});
                  }}>
                  show me how it works
                </div>
              </div>
            : null}
          <Affix affixClassName="navbar-fixed-top" offsetTop={60}>
            <nav className={`navbar navbar-fixed-top ${__PRODUCTION__?'':'navbar-glass'}`}>
              <div className="navbar-header">
                <button
                  type="button"
                  className="navbar-toggle collapsed"
                  data-toggle="collapse"
                  data-target="#navbar"
                  aria-expanded="false"
                  aria-controls="navbar">
                  <span className="sr-only">Toggle navigation</span>
                  <i className="fa tunga-icon-bars" />
                </button>
                <Link className="navbar-brand" to="/">
                  <img src={require('../images/logo.png')} />
                </Link>
              </div>

              <div id="navbar" className="collapse navbar-collapse">
                {Auth.isAuthenticated?(
                  <ul className="nav navbar-nav navbar-right nav-actions">
                    <li>
                      <NavLink to="/home" className="primary" activeClassName="active">
                        Back to Tunga
                      </NavLink>
                    </li>
                  </ul>
                ):(
                  <ul className="nav navbar-nav navbar-right nav-actions">
                    <li className="schedule">
                      <a
                        className="primary"
                        onClick={() => {
                        openCalendlyWidget();
                      }}>
                        Schedule call
                      </a>
                    </li>
                    <li className="launch">
                      <Link className="primary" to="/start/">
                        <i className="tunga-icon-rocket fa-lg" /> Start your
                        project
                      </Link>
                    </li>
                    <li>
                      <NavLink to="/signin" activeClassName="active">
                        Login
                      </NavLink>
                    </li>
                  </ul>
                )}
                {Auth.isAuthenticated?null:(
                  <ul className="nav navbar-nav navbar-left nav-main">
                    <li>
                      <NavLink
                        to={`${pathPrefix}/our-story`}
                        activeClassName="active">
                        Our Story
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to={`${pathPrefix}/quality`} activeClassName="active">
                        Quality
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to={`${pathPrefix}/pricing`} activeClassName="active">
                        Pricing
                      </NavLink>
                    </li>
                    <li>
                      <a href="https://blog.tunga.io" target="_blank">
                        Blog
                      </a>
                    </li>
                  </ul>
                )}
              </div>
            </nav>
          </Affix>
          <div className="content">
            <div className="container">
              {this.props.headerContent}
            </div>
          </div>
        </header>

        {this.props.children}

        <ChatWindow channelId={this.props.chatId || null} closeChat={this.props.closeChat || false}/>
      </div>
    );
  }
}

ShowcaseContainer.propTypes = {
  chatId: React.PropTypes.number,
  closeChat: React.PropTypes.bool,
};

ShowcaseContainer.defaultProps = {
  chatId: null,
  closeChat: false,
};

export default connect(ShowcaseContainer);
