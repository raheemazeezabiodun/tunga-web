import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'reactstrap';
import randomstring from 'randomstring';

export default class OverlayTooltip extends React.Component {

    static defaultProps = {
        placement: 'auto'
    };

    static propTypes = {
        overlay: PropTypes.any,
        className: PropTypes.string,
        placement: PropTypes.string
    };

    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            open: false,
            id: randomstring.generate()
        };
    }

    toggle() {
        this.setState({
            open: !this.state.open
        });
    }

    render() {
        const {overlay, children, className, placement} = this.props,
            elementId = `tooltip-${this.state.id}`;

        return (
            <React.Fragment>
                <div id={elementId} className={`d-inline-block ${className || ''}`}>
                    {children}
                </div>

                <Tooltip isOpen={this.state.open} target={elementId} toggle={this.toggle} placement={placement}>
                    {overlay}
                </Tooltip>
            </React.Fragment>
        );
    }
}
