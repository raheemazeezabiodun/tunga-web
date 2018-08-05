import React from 'react';
import {Link} from 'react-router-dom';

import Header from "./elements/Header";
import Footer from "./elements/Footer";
import MetaTags from "../MetaTags";

export default () => {
    let title = (
            <div>
                Help Us Create Tech Jobs for <br />African Youths
            </div>
        ),
        description = (
            <div>
                <div style={{marginBottom: '40px'}}>
                    Become a Friend of Tunga by referring leads to us. For each
                    lead that becomes a paying customer we donate 5% up to EUR
                    1,000 to{' '}
                    <a href="http://bitsacademy.org/" target="_blank">
                        WeAreBits
                    </a>, a network of schools that gives free tech education to
                    African youths from less privileged backgrounds
                </div>
                <div>
                    <Link to="/friends/rules">
                        How it works in detail
                    </Link>
                </div>
            </div>
        );

    return (
        <div className="friends-page">
            <MetaTags title="Friends of Tunga"
                      description="Become a Friend of Tunga by referring leads to us"/>
            <Header title={title} description={description} showCTA={false} addMeta={false}/>

            <Footer/>
        </div>
    );
}
