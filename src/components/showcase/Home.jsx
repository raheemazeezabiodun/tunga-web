import React from 'react';

import Header from "./elements/Header";
import ContactUs from "./elements/ContactUs";
import Footer from "./elements/Footer";

export default class Home extends React.Component {
    render() {
        let title = "Unleashing Africa's Tech Talent",
            description =
                'Small and large businesses from all over the world use Tunga for hiring African software engineers to address their most pressing software development needs.';

        return (
            <React.Fragment>
                <Header className="height-100" title={title} description={description} ctaSize={'xxl'}/>

                <ContactUs/>

                <Footer/>
            </React.Fragment>
        );
    }
}
