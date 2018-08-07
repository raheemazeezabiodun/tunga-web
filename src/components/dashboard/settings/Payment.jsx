import React from 'react';

import Payoneer from "../../core/Payoneer";

export default (props) => {

    return (
        <Payoneer {...props}
                  nextUrl={`${window.location.origin}/settings/payment`}
                  errorUrl={`${window.location.origin}/settings/payment`}/>
    );
};
