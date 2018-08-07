import React from 'react';
import Progress from "./Progress";

const BootLogo = ({}) => {
    return (
        <div className="boot-logo">
            <div>
                <img src={require('../../assets/images/logo.png')} />
            </div>
            <Progress/>
        </div>
    );
};

export default BootLogo;
