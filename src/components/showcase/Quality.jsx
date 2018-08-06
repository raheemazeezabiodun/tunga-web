import React from 'react';

import Header from "./elements/Header";
import ContactUs from "./elements/ContactUs";
import Footer from "./elements/Footer";
import Title from "./elements/Title";
import Press from "./elements/Press";
import Icon from "../core/Icon";

export default () => {
    let title = "Our quality assurance program",
        description = (
            <div>
                We thoroughly select the brightest developers from the
                African continent. Tunga nourishes and constantly <br />
                improve our community of developers by providing them with
                the tools and guidance they <br />need to be even more
                successful.
            </div>
        );

    return (
        <div className="quality-page">
            <Header title={title} description={description}/>

            <section id="select-devs-section">
                <div className="container">
                    <Title>
                        How we select the best developers
                    </Title>
                </div>
            </section>

            <section id="new-quality-guide">
                <div className="container">
                    <div className="step clearfix">
                        <div className="step-icon">
                            <Icon name="cv-alt" />
                        </div>
                        <div className="step-body">
                            <div className="number">1</div>
                            <h1>Screening Portfolio</h1>
                            <div>
                                The first thing that we do is screening
                                the CV, references, recent projects of
                                the applicant. If the experience of the
                                developer meets our standard we invite
                                them to a remote interview with one of
                                our senior developers or project
                                coordinators. During this interview, we
                                assess their English proficiency level
                                and communication skills.
                            </div>
                        </div>
                        <div className="dot-connector">
                            <img
                                src={require('../../assets/images/icons/dot_curve1.png')}
                                alt=""
                            />
                        </div>
                    </div>

                    <div className="step clearfix">
                        <div className="step-icon">
                            <Icon name="soft-skills" />
                        </div>
                        <div className="step-body">
                            <div className="number">2</div>
                            <h1>Soft skills</h1>
                            <div>
                                When a developer has successfully passed
                                the first stage of our program we assess
                                our developers on several "soft skills".
                                Such as communication skills, management
                                of expectations, work ethics, stress
                                management and time management. At
                                Tunga, we believe that soft skills are
                                as much or more important than software
                                development skills.
                            </div>
                        </div>
                        <div className="dot-connector">
                            <img
                                src={require('../../assets/images/icons/dot_curve2.png')}
                                alt=""
                            />
                        </div>
                    </div>

                    <div className="step clearfix">
                        <div className="step-icon">
                            <Icon name="coding-skills" />
                        </div>
                        <div className="step-body">
                            <div className="number">3</div>
                            <h1>Coding skills</h1>
                            <div>
                                When the developer has passed our soft
                                skills assessment we thoroughly test
                                their coding skills. We do this in
                                several ways: reviewing recent projects,
                                online coding tests, and in depth Skype
                                interviews. Only the brightest
                                developers are selected to go to the
                                next stage of our program.
                            </div>
                        </div>
                        <div className="dot-connector">
                            <img
                                src={require('../../assets/images/icons/dot_curve1.png')}
                                alt=""
                            />
                        </div>
                    </div>

                    <div className="step clearfix">
                        <div className="step-icon">
                            <Icon name="teamwork" />
                        </div>
                        <div className="step-body">
                            <div className="number">4</div>
                            <h1>Guidance program</h1>
                            <div>
                                When a developer passed all our
                                assessments he or she gets to work on
                                the first project on Tunga. For the
                                first couple of projects, the developers
                                work under the guidance of a senior
                                Tunga developer to ensure great
                                collaboration between you and the
                                developer(s) and that all our developer
                                produce top notch products.
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            <Press/>

            <ContactUs/>

            <Footer/>
        </div>
    );
}
