import React from 'react';

import MetaTags from "../../MetaTags";
import Button from "../../core/Button";

import {openCalendlyWidget} from "../../utils/calendly";

export default ({title, description, className, showCTA=true, ctaText='Schedule a call', ctaSize='xxl', ctaCallback, children, addMeta=true, videoBg=false}) => {
    return (
        <React.Fragment>
            {addMeta?(
                <MetaTags title={title} description={description}/>
            ):null}
            <header className={`${className || ''} ${videoBg?'no-bg':''}`}>
                {videoBg ? (
                    <video
                        autoPlay
                        loop
                        muted>
                        <source
                            src={require('../../../assets/videos/BG.mp4')}
                            type="video/mp4"
                        />
                    </video>
                ) : null}
                <div className="container">
                    {title?(
                        <div className="showcase-title">{title}</div>
                    ):null}
                    {description?(
                        <div className="showcase-desc">{description}</div>
                    ):null}

                    {showCTA?(
                        <Button className="cta" size={ctaSize} onClick={() => {ctaCallback?ctaCallback():openCalendlyWidget()}}>{ctaText}</Button>
                    ):null}

                    {children}
                </div>
            </header>
        </React.Fragment>
    );
}
