import PropTypes from 'prop-types';
import React from 'react';

import InputGroup from './InputGroup';
import {filterEventProps} from "./utils/events";
import {filterInputProps} from "./utils/forms";
import Icon from "./Icon";

const CUSTOM_INPUTS = {
    search: {
        className: 'input-search input-search-branded',
        placeholder: 'Search',
        prepend: <Icon name="search" />
    },
    'search-plain': {
        className: 'input-search ',
        placeholder: 'Search',
        prepend: <Icon name="search" />
    },
    message: {
        placeholder: 'Type message here',
        isAppendText: false,
        append: (
            <button className="btn"
                    type="button">
                <Icon name="paper-plane" />
            </button>
        )
    },
    url: {
        placeholder: 'Paste URL here',
        prepend: <Icon name="link" />
    },
    personal: {
        placeholder: 'Name',
        prepend: <Icon name="avatar" />
    },
    address: {
        placeholder: 'Address',
        prepend: <Icon name="map-marker" />
    },
    tel: {
        placeholder: 'Phone number',
        prepend: <Icon name="phone" />
    },
    email: {
        type: 'email',
        placeholder: 'Email address',
        prepend: <Icon name="envelope" />
    },
    password: {
        type: 'password',
        placeholder: 'Password',
        prepend: <Icon name="lock" />
    },
};

export default class CustomInputGroup extends React.Component {
    static defaultProps = {
        variant: null
    };

    static propTypes = {
        variant: PropTypes.string,
        className: PropTypes.string,
        placeholder: PropTypes.string,
    };

    getProperties() {
        let variantProps = CUSTOM_INPUTS[this.props.variant] || {},
            overrideProps = this.cleanProps();

        return {
            ...variantProps,
            ...overrideProps,
            ...{
                className: `${variantProps.className || ''} ${overrideProps.className || ''}`
            }
        }
    }

    cleanProps() {
        const allowedProps = ['className', 'placeholder', 'prepend', 'type'],
            cleanedProps = {};
        allowedProps.forEach(key => {
            if(this.props[key]) {
                cleanedProps[key] = this.props[key];
            }
        });
        return cleanedProps;
    }

    render() {
        return (
            <InputGroup {...this.getProperties()}
                        {...filterInputProps(this.props)}
                        {...filterEventProps(this.props)}/>
        );
    }
}
