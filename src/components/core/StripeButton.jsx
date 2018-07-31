import React from 'react';
import PropTypes from "prop-types";
import StripeCheckout from 'react-stripe-checkout';

import Button from "./Button";
import Icon from "./Icon";

import {parseStripeAmount} from "../utils/stripe";

export default class StripeButton extends React.Component {
    static defaultProps = {
        title: 'Make Payment',
        componentClass: 'span'
    };

    static propTypes = {
        amount: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string,
        ]),
        email: PropTypes.string,
        title: PropTypes.string,
        description: PropTypes.string,
        onPay: PropTypes.func,
        className: PropTypes.string,
        size: PropTypes.string,
        componentClass: PropTypes.string,
    };

    onStripeToken(token) {
        if(this.props.onPay) {
            this.props.onPay({
                token: token.id,
                email: token.email,
                amount: parseStripeAmount(this.props.amount),
                description: this.props.description,
                currency: 'EUR',
                tokenDetails: token,
            });
        }
    }

    render() {
        return (
            <StripeCheckout
                name="Tunga"
                description={this.props.description}
                image="https://tunga.io/icons/tunga_square.png"
                ComponentClass={this.props.componentClass}
                panelLabel={this.props.title}
                amount={parseStripeAmount(this.props.amount)}
                currency="EUR"
                stripeKey={__STRIPE_KEY__}
                locale="en"
                email={this.props.email}
                token={this.onStripeToken.bind(this)}
                reconfigureOnUpdate={false}
                triggerEvent="onClick">
                <Button className={`stripe-btn ${this.props.className || ''}`}
                        {...this.props.size?{size: this.props.size}:{}}>
                    <Icon name="card"/> Pay with Card
                </Button>
            </StripeCheckout>
        );
    }
}
