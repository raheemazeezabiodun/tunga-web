import React from 'react';

import Payoneer from "../core/Payoneer";
import IconButton from "../core/IconButton";


export default (props) => {

    return (
        <div>
            <div style={{height: '255px'}}>
                <Payoneer {...props}
                          nextUrl={`${window.location.origin}/onboard/finish`}
                          errorUrl={`${window.location.origin}/onboard/payment`}/>
            </div>

            <div className="clearfix">
                <IconButton name='arrow-left' size='main'
                            className="float-left onboard-action"
                            onClick={() => props.history.push('/onboard/identity')} />
            </div>
        </div>
    );
};
