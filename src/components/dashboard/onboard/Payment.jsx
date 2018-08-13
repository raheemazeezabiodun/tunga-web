import React from 'react';

import Payoneer from "../../core/Payoneer";
import IconButton from "../../core/IconButton";
import {STATUS_APPROVED, STATUS_PENDING} from "../../../actions/utils/api";


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
                {[STATUS_PENDING, STATUS_APPROVED].includes(props.user.payoneer_status)?(
                    <IconButton name='arrow-right' size='main'
                                className="float-right onboard-action"
                                onClick={() => props.history.push('/onboard/finish')} />
                ):null}
            </div>
        </div>
    );
};
