import React from 'react';
import {Link} from 'react-router-dom';

import Header from "./elements/Header";
import ContactUs from "./elements/ContactUs";
import Footer from "./elements/Footer";
import {proxySafeUrl} from "../utils/proxy";

export default () => {
    let title = "Unleashing Africa's Tech Talent",
        description =
            'Small and large businesses from all over the world use Tunga for hiring African software engineers to address their most pressing software development needs.';

    return (
        <div className="landing-page">
            <Header className="height-100" title={title} description={description} ctaSize={'xxl'}>
                <section id="services">
                    <div className="service">
                        <div className="wrapper">
                            <div className="headline">
                                Effortless software projects
                            </div>
                            <div>
                                Need an app or website? We can build software for
                                you on-demand and turn-key.
                                <Link
                                    to={proxySafeUrl('/effortless-software-projects')}>
                                    find out more
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="service">
                        <div className="wrapper">
                            <div className="headline">Dedicated developers</div>
                            <div>
                                Use Tunga to quickly mobilize developers. Parttime
                                or fulltime. Individuals or entire teams.
                                <Link
                                    to={proxySafeUrl('/dedicated-developers')}>
                                    find out more
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="service">
                        <div className="wrapper">
                            <div className="headline">Recruitment services</div>
                            <div>
                                Tap into our network of top African software
                                programmers to reinforce your own tech team.
                                <Link
                                    to={proxySafeUrl('/it-recruitment')}>
                                    find out more
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </Header>

            <ContactUs/>

            <Footer/>
        </div>
    );
}
