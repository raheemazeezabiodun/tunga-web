import PropTypes from 'prop-types';
import React from 'react';

import {addEventListeners, BUTTON_EVENTS} from './utils/events';
import {filterButtonProps} from "./utils/forms";

export default class Button extends React.Component {
    static defaultProps = {
        type: 'button',
        variant: 'primary',
        block: false,
    };

    static propTypes = {
        type: PropTypes.string,
        className: PropTypes.string,
        variant: PropTypes.string,
        size: PropTypes.string,
        block: PropTypes.bool,
    };

    render() {
        return (
            <button type={this.props.type}
                    className={`btn ${this.props.variant?`btn-${this.props.variant}`:''} ${this.props.className || ''} ${this.props.block?'btn-block':''} ${this.props.size ?`btn-${this.props.size}`:''}`}
                    {...filterButtonProps(this.props)}
                    {...addEventListeners(BUTTON_EVENTS, this.props)}>
                {this.props.children}
            </button>
        );
    }
}
