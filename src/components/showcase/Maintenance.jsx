import React from 'react';

import ContactUs from "./elements/ContactUs";
import Footer from "./elements/Footer";
import Icon from "../core/Icon";

export default () => {

    return (
        <div className="maintenance-page">
            <header className="height-80">
                <div className="container text-center">
                    <div className="showcase-title"><Icon name="attention"/> Tunga is being updated.</div>

                    <h4>Please check back in a bit.</h4>

                    <div className="showcase-desc">
                        For urgent matters, please use the chat function or the contact form below.
                    </div>
                </div>
            </header>

            <ContactUs/>

            <Footer/>
        </div>
    );
}
