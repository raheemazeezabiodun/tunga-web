import React from 'react';
import {Link} from 'react-router';
import {Affix} from 'react-overlays';

import {isTungaDomain} from '../utils/router';

import ChatWindow from '../containers/ChatWindow';

import connect from '../utils/connectors/AuthConnector';
import {Button} from "react-bootstrap";

class ShowcaseContainer extends React.Component {
    componentDidMount() {
        let hasGlassNav = this.props.hasGlassNav;
        let updateTopBar = function () {
            let windowWidth = $(window).innerWidth();
            if (windowWidth >= 992) {
                if ($(document).scrollTop() >= 20) {
                    $('.navbar').removeClass('navbar-glass');
                } else if (hasGlassNav) {
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
        const {Auth, className, headerImage} = this.props;

        return (
            <div className={'showcase ' + className}>
                <header
                    style={
                        this.props.headerVideo
                            ? {overflow: 'hidden', position: 'relative'}
                            : headerImage
                            ? {
                                backgroundImage: `url(require(${headerImage}))`,
                            }
                            : null
                    }>
                    {this.props.headerVideo ? (
                        <video
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
                    ) : null}
                    {this.props.headerVideo ? (
                        <div className="video-overlay"/>
                    ) : null}
                    {this.props.hasArrow && false ? (
                        <div className="arrow-overlay">
                            <div className="ribbon"/>
                            <div
                                className="pointer text-center"
                                onClick={e => {
                                    $('body').animate({scrollTop: '+=300'});
                                }}>
                                show me how it works
                            </div>
                        </div>
                    ) : null}
                    <Affix affixClassName="navbar-fixed-top" offsetTop={60}>
                        <nav
                            className={`navbar navbar-fixed-top ${
                                this.props.hasGlassNav ? 'navbar-glass' : ''
                                }`}>
                            <div className="navbar-header">
                                <button
                                    type="button"
                                    className="navbar-toggle collapsed"
                                    data-toggle="collapse"
                                    data-target="#navbar"
                                    aria-expanded="false"
                                    aria-controls="navbar">
                                    <span className="sr-only">
                                        Toggle navigation
                                    </span>
                                    <i className="fa tunga-icon-bars"/>
                                </button>
                                <Link className="navbar-brand" to="/">
                                    <img src={require('../images/logo.png')}/>
                                </Link>
                            </div>

                            <div
                                id="navbar"
                                className="collapse navbar-collapse">

                                {Auth.isAuthenticated ? (
                                    <ul className="nav navbar-nav navbar-right nav-actions">
                                        <li>
                                            <Link
                                                to="/home"
                                                className="primary"
                                                activeClassName="active">
                                                Back to Tunga
                                            </Link>
                                        </li>
                                    </ul>
                                ) : (
                                    <ul className="nav navbar-nav navbar-right nav-actions">
                                        <li>
                                            <span>
                                                <button type="button" className="call">
                                                    <i className="fa fa-phone"/> <span>+31 20 220 2157</span>
                                                </button>

                                            </span>
                                            <span>
                                                <Link
                                                    to="/signin"
                                                    activeClassName="active"
                                                    className="primary">
                                                    Login
                                                </Link>
                                            </span>


                                        </li>
                                    </ul>
                                )}

                                <ul className="nav navbar-nav navbar-left nav-main">
                                    <li>
                                        <Link
                                            to={`${pathPrefix}/our-story`}
                                            activeClassName="active">
                                            Our Story
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to={`${pathPrefix}/quality`}
                                            activeClassName="active">
                                            Quality
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to={`${pathPrefix}/pricing`}
                                            activeClassName="active">
                                            Pricing
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to={`${pathPrefix}/friends-of-tunga`}
                                            activeClassName="active">
                                            Friends Of Tunga
                                        </Link>
                                    </li>
                                    <li>
                                        <a
                                            href="https://blog.tunga.io"
                                            target="_blank">
                                            Blog
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </nav>
                    </Affix>
                    <div className="container">{this.props.headerContent}</div>
                    <div>{this.props.freeHeaderSection}</div>
                </header>

                {this.props.children}

                <ChatWindow
                    channelId={this.props.chatId || null}
                    closeChat={this.props.closeChat || false}
                    autoOpen={this.props.autoOpenChat}
                />
            </div>
        );
    }
}

ShowcaseContainer.propTypes = {
    chatId: React.PropTypes.number,
    closeChat: React.PropTypes.bool,
    hasGlassNav: React.PropTypes.bool,
    autoOpenChat: React.PropTypes.bool,
    backgroundImage: React.PropTypes.string,
    hasArrow: React.PropTypes.bool,
};

ShowcaseContainer.defaultProps = {
    chatId: null,
    closeChat: false,
    hasGlassNav: true,
    autoOpenChat: true,
    headerImage: null,
    hasArrow: false,
};

export default connect(ShowcaseContainer);
