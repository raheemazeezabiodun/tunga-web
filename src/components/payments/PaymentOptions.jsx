import React from 'react';
import PropTypes from "prop-types";

import ChoiceGroup from "../core/ChoiceGroup";

export default class PaymentOptions extends React.Component {
    static propTypes = {
        onChange: PropTypes.func,
    };

    onChange = (type) => {
        const {proceed} = this.props;
        if(proceed) {
            proceed(type);
        }
    };

    render() {
        let choices = [
            ['card', 'Pay with Card', 'card'],
            ['bank', 'Pay by bank transfer', 'bank']
        ];

        return (
            <div className="text-center">
                <ChoiceGroup variant="card" choices={choices} onChange={this.onChange}/>
            </div>
        );
    }
}

