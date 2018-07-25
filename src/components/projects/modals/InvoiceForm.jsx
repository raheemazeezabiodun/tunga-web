import PropTypes from "prop-types";
import React from 'react';
import {FormGroup, Row, Col} from 'reactstrap';
import moment from "moment";
import _ from 'lodash';

import Button from '../../../components/core/Button';
import Input from "../../core/Input";
import DateTimePicker from "../../core/DateTimePicker";
import MilestoneSelector from "../../core/MilestoneSelector";

import {INVOICE_TYPE_SALE} from "../../../actions/utils/api";
import IconButton from "../../core/IconButton";

export default class InvoiceForm extends React.Component {
    static propTypes = {
        invoice: PropTypes.shape({
            id: PropTypes.number,
            type: PropTypes.string,
            title: PropTypes.string,
            due_at: PropTypes.string,
            milestone: PropTypes.object,
            amount: PropTypes.string,
        }),
        project: PropTypes.object,
        proceed: PropTypes.func,
        cancel: PropTypes.func,
        dismiss: PropTypes.func,
    };

    constructor(props) {
        super(props);
        this.state = {
            invoice: props.invoice || {},
            payouts: props.payouts || {0: {}},
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
            if(this.props.invoice.type === INVOICE_TYPE_SALE) {
                this.props.proceed(this.state.invoice);
            } else {
                this.props.proceed({invoice: this.state.invoice, payouts: this.state.payouts});
            }
        }
    };

    onCancel = (e) => {
        e.preventDefault();

        if(this.props.cancel) {
            this.props.cancel(this.state.plan);
        }
    };

    onAddPayout = () => {
        let idx = Object.keys(this.state.payouts).length,
            newState = {};
        newState[idx] = {};
        this.setState({payouts: {...this.state.payouts, ...newState}});
    };

    onPayoutUpdate(idx, key, value) {
        let newPayout = {}, newState = {};
        newPayout[key] = value;
        newState[idx] = {...(this.state.payouts[idx] || {}), ...newPayout};
        this.setState({payouts: {...this.state.payouts, ...newState}});
    }

    renderPayOut(idx) {
        let payout = this.state.payouts[idx] || {};
        return (
            <Row key={idx}>
                <Col sm="8">
                    {idx === 0?(
                        <label>Developer</label>
                    ):null}
                    <UserSelector max={1}
                                  selected={payout.user?[payout.user]:[]}
                                  onChange={users => this.onPayoutUpdate(idx, 'user', users[0])}/>
                </Col>
                <Col sm="4">
                    <FormGroup>
                        {idx === 0?(
                            <label>Amount in EUR</label>
                        ):null}
                        <Input type="number"
                               value={payout.amount || null}
                               onChange={e => this.onPayoutUpdate(idx, 'amount', e.target.value)}
                               required/>
                    </FormGroup>
                </Col>
            </Row>
        )
    }

    render() {
        return (
            <form onSubmit={this.onSave.bind(this)} className="invoice-form">
                <FormGroup>
                    <label>{this.props.invoice.type === INVOICE_TYPE_SALE?'Payment':'Payout'} title</label>
                    <Input value={this.state.invoice.title}
                           onChange={this.onChangeField.bind(this, 'title')}
                           required/>
                </FormGroup>
                <FormGroup>
                    <label>Invoice date</label>
                    <DateTimePicker calendar={true} time={false}
                                    value={this.state.invoice.due_at?new Date(this.state.invoice.due_at):null}
                                    onChange={(due_at) => { this.onChangeValue('due_at', moment.utc(due_at).format())}}
                                    required/>
                </FormGroup>
                <FormGroup>
                    <label>Milestone</label>
                    <MilestoneSelector variant="bottom" max={1}
                                       filters={{project: this.props.project?this.props.project.id:null}}
                                       selected={this.state.invoice.milestone?[this.state.invoice.milestone]:[]} onChange={milestones => this.onChangeValue('milestone', milestones[0] || null)}/>
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
                        {Object.keys(this.state.payouts).map(idx => {
                            return (
                                this.renderPayOut(idx)
                            );
                        })}
                        <div className="text-right">
                            <IconButton name="add" size="main" onClick={this.onAddPayout}/> add payout for developer
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
