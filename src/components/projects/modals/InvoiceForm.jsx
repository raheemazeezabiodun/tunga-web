import PropTypes from "prop-types";
import React from 'react';
import {FormGroup, Row, Col} from 'reactstrap';
import moment from "moment";

import Button from '../../../components/core/Button';
import Input from "../../core/Input";
import DateTimePicker from "../../core/DateTimePicker";
import UserSelector from "../../core/UserSelector";

import {INVOICE_TYPE_SALE} from "../../../actions/utils/api";
import IconButton from "../../core/IconButton";

export default class InvoiceForm extends React.Component {
    static propTypes = {
        invoice: PropTypes.shape({
            id: PropTypes.number,
            type: PropTypes.string,
            title: PropTypes.string,
            due_at: PropTypes.string,
            amount: PropTypes.string,
        }),
        proceed: PropTypes.func,
        cancel: PropTypes.func,
        dismiss: PropTypes.func,
    };

    constructor(props) {
        super(props);
        this.state = {
            invoice: props.invoice || {}
        }
    }

    onChangeValue(key, value) {
        let newState = {};
        newState[key] = value;
        this.setState({invoice: {...this.state.invoice, ...newState}});
    }

    onChangeField(key, e) {
        this.onChangeValue(key, e.target.value)
    }

    onSave = (e) => {
        e.preventDefault();

        if(this.props.proceed) {
            this.props.proceed(this.state.invoice);
        }
    };

    onCancel = (e) => {
        e.preventDefault();

        if(this.props.cancel) {
            this.props.cancel(this.state.plan);
        }
    };

    renderPayOut(user, amount) {
        return (
            <Row>
                <Col sm="8">
                    <label>Developer</label>
                    <UserSelector max={1} selected={user?[user]:[]}/>
                </Col>
                <Col sm="4">
                    <FormGroup>
                        <label>Amount in EUR</label>
                        <Input type="number"
                               value={amount}
                               onChange={this.onChangeField.bind(this, 'amount')}
                               required/>
                    </FormGroup>
                </Col>
            </Row>
        )
    }

    render() {
        return (
            <form onSubmit={this.onSave.bind(this)}>
                <FormGroup>
                    <label>Payment title</label>
                    <Input value={this.state.invoice.title}
                           onChange={this.onChangeField.bind(this, 'title')}
                           required/>
                </FormGroup>
                <FormGroup>
                    <label>Invoice due_at</label>
                    <DateTimePicker calendar={true} time={false}
                                    value={this.state.invoice.due_at?new Date(this.state.invoice.due_at):null}
                                    onChange={(due_at) => { this.onChangeValue('due_at', moment.utc(due_at).format())}}
                                    required/>
                </FormGroup>
                {this.state.invoice.type === INVOICE_TYPE_SALE?(
                    <FormGroup>
                        <label>Amount in EUR</label>
                        <Input type="number"
                               value={this.state.invoice.amount}
                               onChange={this.onChangeField.bind(this, 'amount')}
                               required/>
                    </FormGroup>
                ):(
                    <div>
                        {this.renderPayOut(null, '')}
                        <div className="text-right">
                            <IconButton name="add" size="main"/> add payout for developer
                        </div>
                    </div>
                )}
                <FormGroup>
                    <Button type="button" variant="secondary" className="float-left" onClick={this.onCancel.bind(this)}>Cancel</Button>
                    <Button type="submit" className="float-right">Save</Button>
                </FormGroup>
            </form>
        );
    }
}
