import PropTypes from 'prop-types';
import React from 'react';

import Button from './Button';
import Icon from './Icon';

import {addEventListeners, BUTTON_EVENTS} from './utils/events';
import {filterButtonProps} from "./utils/forms";

export default class IconButton extends React.Component {
    static defaultProps = {
        type: 'button',
        size: 'md'
    };

    static propTypes = {
        type: PropTypes.string,
        className: PropTypes.string,
        name: PropTypes.string,
        size: PropTypes.string,
    };

    render() {
        return (
            <Button type={this.props.type || 'button'}
                    className={this.props.className || ''}
                    variant="icon"
                    {...filterButtonProps(this.props)}
                    {...addEventListeners(BUTTON_EVENTS, this.props)}>
                <Icon name={this.props.name} size={this.props.size}/>
            </Button>
        );
    }
}
