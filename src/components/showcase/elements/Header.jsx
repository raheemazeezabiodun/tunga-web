import React from 'react';

import MetaTags from "../../MetaTags";
import Button from "../../core/Button";

import {openCalendlyWidget} from "../../utils/calendly";

export default ({title, description, className, showCTA=true, ctaText='Schedule a call', ctaSize='xl', ctaCallback, children}) => {
    return (
        <React.Fragment>
            <MetaTags title={title} description={description}/>
            <header className={className || ''}>
                <div className="container">
                    <div className="showcase-title">{title}</div>
                    <div className="showcase-desc">{description}</div>

                    {showCTA?(
                        <Button className="cta" size={ctaSize} onClick={() => {ctaCallback?ctaCallback():openCalendlyWidget()}}>{ctaText}</Button>
                    ):null}
                </div>
                {children}
            </header>
        </React.Fragment>
    );
}
