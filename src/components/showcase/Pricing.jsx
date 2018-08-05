import React from 'react';

import Header from "./elements/Header";
import ContactUs from "./elements/ContactUs";
import Footer from "./elements/Footer";

export default () => {
    let title = "High quality and service level at affordable fees",
        description = "We calculate our fees transparently and stick with that. No excuses, no discussions, no additional costs";

    return (
        <React.Fragment>
            <Header title={title} description={description}/>

            <Footer/>
        </React.Fragment>
    );
}
