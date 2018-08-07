import PropTypes from 'prop-types';
import React from 'react';

import {addEventListeners, BUTTON_EVENTS} from './utils/events';
import {filterButtonProps} from "./utils/forms";

export default class Icon extends React.Component {
    static propTypes = {
        name: PropTypes.string,
        size: PropTypes.string,
        className: PropTypes.string,
    };

    render() {
        return (
            <i className={`tg-ic-${this.props.name || ''} ${this.props.size?`tunga-ic-sz-${this.props.size}`:''} ${this.props.className || ''}`}
               {...filterButtonProps(this.props)}
               {...addEventListeners(BUTTON_EVENTS, this.props)}/>
        );
    }
}
