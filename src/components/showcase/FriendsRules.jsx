import React from 'react';

import Header from "./elements/Header";
import ContactUs from "./elements/ContactUs";
import Footer from "./elements/Footer";
import MetaTags from "../MetaTags";

export default () => {

    return (
        <React.Fragment>
            <MetaTags title="Friends of Tunga Rules"
                      description="Friends of Tunga program in detail"/>
            <Header title={'The program in detail'} showCTA={false} addMeta={false}/>

            <Footer/>
        </React.Fragment>
    );
}
