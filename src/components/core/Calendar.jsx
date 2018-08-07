import React from 'react';

import {Calendar as Cal} from 'react-widgets';
import moment from "moment/moment";
import momentLocalizer from "react-widgets/lib/localizers/moment";

momentLocalizer(moment);

const Calendar = (props) => {
    return (
        <Cal {...props}/>
    );
};

export default Calendar;
