import React from 'react';

import Header from "./elements/Header";
import ContactUs from "./elements/ContactUs";
import Footer from "./elements/Footer";

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
        <React.Fragment>
            <Header title={title} description={description}/>

            <ContactUs/>

            <Footer/>
        </React.Fragment>
    );
}
