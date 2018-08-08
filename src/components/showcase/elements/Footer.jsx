import React from 'react';
import {Link} from 'react-router-dom';

import Icon from "../../core/Icon";

import connect from '../../../connectors/UtilityConnector';

import {openCalendlyWidget} from '../../utils/calendly';
import {proxySafeUrl} from '../../utils/proxy';

class Footer extends React.Component {

    componentDidMount() {
        const {Utility, UtilityActions} = this.props;
        if(!Utility.posts || !Utility.posts.length) {
            UtilityActions.getMediumPosts();
        }
    }

    render() {
        const {Utility} = this.props;

        return (
            <footer>
                <div className="sections">
                    <div className="section social">
                        <div>
                            <div className="tunga-logo-btm">
                                <img
                                    src={require('../../../assets/images/logo_round.png')}
                                />
                            </div>
                            <p>
                                <a href="http://www.butterflyworks.org/">
                                    a butterfly works initiative
                                </a>
                            </p>
                            <div className="social-networks">
                                <a
                                    target="_blank"
                                    href="https://www.linkedin.com/company/tunga"
                                    id="fb"
                                    title="LinkedIn">
                                    <Icon name="linkedin" />
                                </a>
                                <a
                                    target="_blank"
                                    href="https://www.facebook.com/tunga.io"
                                    id="fb"
                                    title="Facebook">
                                    <Icon name="facebook" />
                                </a>
                                <a
                                    target="_blank"
                                    href="https://twitter.com/tunga_io"
                                    id="twitter"
                                    title="Twitter">
                                    <Icon name="twitter" />
                                </a>
                                <a
                                    target="_blank"
                                    href="https://blog.tunga.io"
                                    id="medium"
                                    title="Medium">
                                    <Icon name="medium" />
                                </a>
                            </div>
                            <div className="footer-address">
                                <p>Wibautstraat 131</p>
                                <p>Amsterdam, The Netherlands</p>
                                <p>
                                    <a href="mailto:hello@tunga.io">
                                        hello@tunga.io
                                    </a>
                                </p>
                                <p>
                                    <a href="tel:+31615955194">
                                        +31615955194
                                    </a>
                                </p>
                                <p>
                                    <Link to="/call" onClick={() => {openCalendlyWidget()}}>
                                        Schedule a call with us
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="section footer-info">
                        <div>
                            <h4>Top Pages</h4>
                            <ul>
                                <li>
                                    <a href={proxySafeUrl('/pricing')}>Pricing</a>
                                </li>
                                <li>
                                    <a href={proxySafeUrl('/our-story')}>Our Story</a>
                                </li>
                                <li>
                                    <a href="https://blog.tunga.io/" target="_blank">
                                        Blog
                                    </a>
                                </li>
                                <li>
                                    <a href={proxySafeUrl('/effortless-software-projects')}>Effortless Software projects</a>
                                </li>
                                <li>
                                    <a href={proxySafeUrl('/dedicated-developers')}>Dedicated Developers</a>
                                </li>
                                <li>
                                    <a href={proxySafeUrl('/IT-recruitment')}>Recruitment Services</a>
                                </li>
                                <li>
                                    <a href={proxySafeUrl('/hire-ios-developers')}>iOS Developers</a>
                                </li>
                                <li>
                                    <a href={proxySafeUrl('/african-software-developers')}>African Developers</a>
                                </li>
                                <li>
                                    <a href={proxySafeUrl('/remote-developers')}>Remote Teams</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="section footer-info">
                        <div>
                            <h4>Legal information</h4>
                            <ul className="list-info">
                                <li>
                                    <a
                                        href="https://tunga.io/privacy">
                                        Privacy Policy
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="https://tunga.io/agreement">
                                        User Agreement
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="https://tunga.io/code-of-conduct">
                                        Code of Conduct
                                    </a>
                                </li>
                            </ul>

                        </div>
                    </div>
                    <div className="section latest-from-blog">
                        <div>
                            <h4>Latest from our blog</h4>
                            <ul className="list-unstyled">
                                {Utility.posts.length
                                    ? Utility.posts
                                        .slice(0, 4)
                                        .map(article => {
                                            return (
                                                <li key={article.id}>
                                                    <a
                                                        target="_blank"
                                                        href={
                                                            article.url
                                                        }>
                                                        <i className="fa fa-angle-right" />{' '}
                                                        {article.title}
                                                    </a>
                                                </li>
                                            );
                                        })
                                    : null}
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="text-center">
                    2018 Tunga BV - All rights reserved
                </div>
            </footer>
        );
    }
}

export default connect(Footer);
