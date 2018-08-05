import React from 'react';

import Header from "./elements/Header";
import Footer from "./elements/Footer";

export default () => {
    let title = (
            <div>
                Our journey to unleash <br /> Africa’s tech talent
            </div>
        ),
        description = 'Our Mission: 21st Century Jobs for African Youths';

    return (
        <React.Fragment>
            <Header title={title} description={description}/>

            <Footer/>
        </React.Fragment>
    );
}
