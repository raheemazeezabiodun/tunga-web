import PropTypes from 'prop-types';
import React from 'react';
import {Link} from 'react-router';
import StripeCheckout from 'react-stripe-checkout';
import CopyToClipboard from 'react-copy-to-clipboard';

import Progress from './status/Progress';
import FormStatus from './status/FormStatus';
import FieldError from './status/FieldError';
import Error from './status/Error';

import {
    TASK_PAYMENT_METHOD_CHOICES,
    TASK_PAYMENT_METHOD_BITONIC,
    TASK_PAYMENT_METHOD_BITCOIN,
    TASK_PAYMENT_METHOD_BANK,
    TASK_PAYMENT_METHOD_STRIPE,
    ENDPOINT_TASK,
    ENDPOINT_MULTI_TASK_PAYMENT,
} from '../constants/Api';
import {objectToQueryString} from '../utils/html';
import {getUser, isAdmin, openProfileWizard} from '../utils/auth';
import {parseNumber} from '../utils/helpers';

export default class TaskPay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pay_method: null,
            pay_details: null,
            showForm: true,
            withhold_tunga_fee: false,
        };
    }

    componentDidMount() {
        const {task, Task, TaskActions, multi_task_payment} = this.props;
        if (multi_task_payment) {
            this.setState({
                showForm: !multi_task_payment.paid,
                withhold_tunga_fee: multi_task_payment.withhold_tunga_fee,
            });
        } else {
            if (task.id) {
                if (getUser().id == task.user.id && task.closed && task.paid) {
                    const {router} = this.context;
                    //router.replace(`/work/${Task.detail.task.id}/rate`);
                }

                if (task.payment_method) {
                    TaskActions.retrieveTaskInvoice(task.id);
                    this.setState({showForm: false});
                }
            }
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (
            (this.props.Task &&
                this.props.Task.detail.Invoice.isSaved &&
                !prevProps.Task.detail.Invoice.isSaved) ||
            (this.props.MultiTaskPayment &&
                this.props.MultiTaskPayment.detail.isSaved &&
                !prevProps.MultiTaskPayment.detail.isSaved)
        ) {
            const {
                Task,
                MultiTaskPayment,
                task,
                multi_task_payment,
            } = this.props;

            this.setState({showForm: false});

            let payment_method = null;
            if (multi_task_payment) {
                payment_method =
                    MultiTaskPayment.detail.multi_task_payment.payment_method;
            } else {
                const {Invoice} = Task.detail;
                payment_method = Invoice.invoice.payment_method;
            }

            if (multi_task_payment || (task && task.payment_approved)) {
                if (payment_method == TASK_PAYMENT_METHOD_STRIPE) {
                    let tp = this;
                    setTimeout(function() {
                        if (tp.refs.pay_stripe) {
                            tp.refs.pay_stripe.click();
                        }
                    }, 500);
                } else if (payment_method == TASK_PAYMENT_METHOD_BITONIC) {
                    window.location.href = `${
                        multi_task_payment
                            ? ENDPOINT_MULTI_TASK_PAYMENT
                            : ENDPOINT_TASK
                    }${
                        multi_task_payment ? multi_task_payment.id : task.id
                    }/pay/bitonic/?amount=${this.getActualPayAmount()}`;
                }
            }
        }
    }

    onChangePayMethod(pay_method) {
        this.setState({
            pay_method: pay_method.id,
            pay_details: pay_method.details,
        });
    }

    onStripeToken(token) {
        const {
            task,
            Task,
            TaskActions,
            multi_task_payment,
            MultiTaskPaymentActions,
        } = this.props;
        const {invoice} = Task ? Task.detail.Invoice : {};

        let stripe_options = {
            token: token.id,
            email: token.email,
            amount: parseInt(this.getActualPayAmount() * 100),
            description: multi_task_payment ? 'Bulk Payment' : task.summary,
            task_id: task.id,
            invoice_id: invoice ? invoice.id : null,
            multi_task_key: multi_task_payment ? multi_task_payment.id : null,
            currency: 'EUR',
        };
        if (multi_task_payment) {
            MultiTaskPaymentActions.makePayment(
                multi_task_payment.id,
                'stripe',
                stripe_options,
            );
        } else {
            TaskActions.makeTaskPayment(task.id, 'stripe', stripe_options);
        }
    }

    onWithHoldFeeChange() {
        this.setState({withhold_tunga_fee: !this.state.withhold_tunga_fee});
    }

    getActualPayAmount() {
        const {task, Task, TaskActions, multi_task_payment} = this.props;

        let amount = this.getTotalPayAmount();

        if (this.withHoldTungaFee()) {
            if (multi_task_payment) {
                return multi_task_payment.pay_participants;
            } else {
                return amount * (1 - task.tunga_ratio_dev);
            }
        }
        return parseFloat(amount) + parseFloat(this.getTaxAmount());
    }

    getBitonicPaymentUrl() {
        const {task, multi_task_payment} = this.props;

        return (
            'https://bitonic.nl/partner/263?' +
            objectToQueryString({
                bitcoinaddress: encodeURIComponent(
                    multi_task_payment
                        ? multi_task_payment.btc_address
                        : task.btc_address,
                ),
                ext_data: encodeURIComponent(
                    multi_task_payment ? 'Bulk Payment' : task.summary,
                ),
                ordertype: 'buy',
                euros: encodeURIComponent(
                    multi_task_payment ? multi_task_payment.amount : task.pay,
                ),
            })
        );
    }

    getInvoiceAmount() {
        const {task, Task, multi_task_payment, MultiTaskPayment} = this.props;
        if (multi_task_payment) {
            return multi_task_payment.amount;
        }
        const {invoice} = Task ? Task.detail.Invoice : {};
        return invoice.fee;
    }

    getMulitTaskList() {
        const {multi_task_payment} = this.props;
        if (multi_task_payment && multi_task_payment.details) {
            if (multi_task_payment.distribute_only) {
                return multi_task_payment.details.distribute_tasks;
            }
            return multi_task_payment.details.tasks;
        }
        return [];
    }

    getPaymentMethod() {
        const {task, Task, TaskActions, multi_task_payment} = this.props;
        if (multi_task_payment) {
            return multi_task_payment.payment_method;
        }
        const {invoice} = Task ? Task.detail.Invoice : {};
        return invoice.payment_method;
    }

    getTaxAmount() {
        const {task, Task, TaskActions, multi_task_payment} = this.props;

        let amount = this.getTotalPayAmount(),
            tax_ratio = 0;

        if (multi_task_payment) {
            tax_ratio = multi_task_payment.tax_ratio;
        } else {
            tax_ratio = task.tax_ratio;
        }
        return amount * tax_ratio;
    }

    getTaxRate() {
        const {task, Task, TaskActions, multi_task_payment} = this.props;

        let tax_rate = 0;

        if (multi_task_payment) {
            tax_rate = multi_task_payment.tax_rate;
        } else {
            tax_rate = task.tax_rate;
        }
        return tax_rate;
    }

    getTotalPayAmount() {
        const {task, Task, multi_task_payment, MultiTaskPayment} = this.props;
        const {invoice} = Task ? Task.detail.Invoice : {};
        if (!multi_task_payment && invoice && invoice.exclude_payment_costs) {
            return this.getInvoiceAmount();
        }
        switch (this.getPaymentMethod()) {
            case TASK_PAYMENT_METHOD_STRIPE:
                return this.getInvoiceAmount() * 1.029 + 0.25; // 2.9% + 25c charge
            case TASK_PAYMENT_METHOD_BITONIC:
                return this.getInvoiceAmount() * 1.03; // 3%
            case TASK_PAYMENT_METHOD_BANK:
                return this.getInvoiceAmount() * 1.055; // 5.5%
            default:
                return this.getInvoiceAmount();
        }
    }

    getTotalPaymentPlusTax() {
        return (
            parseFloat(this.getTotalPayAmount()) +
            parseFloat(this.getTaxAmount())
        );
    }

    changePayMethod() {
        this.setState({showForm: true});
    }

    handleSubmit(e) {
        const {
            Task,
            TaskActions,
            MultiTaskPaymentActions,
            multi_task_payment,
        } = this.props;

        e.preventDefault();
        var fee = multi_task_payment
            ? multi_task_payment.amount
            : this.refs.fee.value.trim();
        var payment_method = this.state.pay_method;
        var withhold_tunga_fee = this.state.withhold_tunga_fee;

        if (multi_task_payment) {
            MultiTaskPaymentActions.updateMultiTaskPayment(
                multi_task_payment.id,
                {
                    payment_method,
                    withhold_tunga_fee,
                },
            );
        } else {
            const {task} = Task.detail;
            TaskActions.createTaskInvoice(task.id, {
                fee,
                payment_method,
                withhold_tunga_fee,
            });
        }
    }

    isPaymentApproved() {
        const {multi_task_payment, task} = this.props;
        if (multi_task_payment) {
            return true;
        } else if (task) {
            return task.payment_approved;
        }
        return false;
    }

    withHoldTungaFee() {
        const {task, Task, TaskActions, multi_task_payment} = this.props;
        return (
            (multi_task_payment && multi_task_payment.withhold_tunga_fee) ||
            task.withhold_tunga_fee
        );
    }

    render() {
        if (!getUser().can_contribute) {
            return (
                <div>
                    <div className="alert alert-info">
                        You need to complete your profile before you can make
                        payments
                    </div>
                    <div>
                        <Link
                            to="/profile"
                            onClick={e => {
                                e.preventDefault();
                                openProfileWizard();
                            }}>
                            <i className="fa fa-arrow-right" /> Continue to your
                            profile
                        </Link>
                    </div>
                </div>
            );
        }

        const {task, Task, multi_task_payment, MultiTaskPayment} = this.props;
        const {invoice} = Task ? Task.detail.Invoice : {invoice: {}};

        var btc_amount = null;
        var btc_address = null;
        var btc_address_only = null;
        if (multi_task_payment) {
            if (multi_task_payment.btc_price) {
                btc_amount = parseFloat(
                    this.getActualPayAmount() / multi_task_payment.btc_price,
                ).toFixed(6);
            }
            btc_address_only = multi_task_payment.btc_address;
            btc_address = `bitcoin:${
                multi_task_payment.btc_address
            }?amount=${btc_amount}&message=${encodeURIComponent(
                'Bulk Payment',
            )}`;
        } else if (invoice) {
            btc_amount = parseFloat(
                this.getActualPayAmount() / invoice.btc_price,
            ).toFixed(6);
            btc_address_only = invoice.btc_address;
            btc_address = `bitcoin:${
                invoice.btc_address
            }?amount=${btc_amount}&message=${encodeURIComponent(task.summary)}`;
        }

        return (
            <div className="form-wrapper pay-wrapper">
                {(Task &&
                    (Task.detail.isRetrieving ||
                        Task.detail.Invoice.isRetrieving ||
                        Task.detail.isPaying)) ||
                (MultiTaskPayment &&
                    (MultiTaskPayment.detail.isSaving ||
                        MultiTaskPayment.detail.isRetrieving ||
                        MultiTaskPayment.detail.isPaying)) ? (
                    <Progress
                        message={
                            (Task && Task.detail.isPaying) ||
                            (MultiTaskPayment &&
                                MultiTaskPayment.detail.isPaying)
                                ? 'Processing payment ...'
                                : 'Loading ...'
                        }
                    />
                ) : (
                    <div>
                        {this.state.showForm ||
                        (!multi_task_payment && !invoice.id) ? (
                            <form
                                onSubmit={this.handleSubmit.bind(this)}
                                name="invoice"
                                role="form"
                                ref="invoice_form">
                                {/*<h4 className="title">Make Payment</h4>*/}

                                <FormStatus
                                    loading={
                                        (Task &&
                                            Task.detail.Invoice.isSaving) ||
                                        (MultiTaskPayment &&
                                            MultiTaskPayment.detail.isSaving)
                                    }
                                    success={
                                        (Task && Task.detail.Invoice.isSaved) ||
                                        (MultiTaskPayment &&
                                            MultiTaskPayment.detail.isSaved)
                                    }
                                    message={`${
                                        multi_task_payment
                                            ? 'Batch payment updated'
                                            : 'Invoice saved'
                                    } successfully`}
                                    error={
                                        Task && Task.detail.Invoice.error.create
                                    }
                                />

                                {multi_task_payment &&
                                multi_task_payment.details ? (
                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th>Task</th>
                                                <th>Fee</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.getMulitTaskList().map(
                                                item => {
                                                    return (
                                                        <tr>
                                                            <td>
                                                                {item.summary}
                                                            </td>
                                                            <td>
                                                                €{parseNumber(
                                                                    item.pay,
                                                                )}
                                                            </td>
                                                        </tr>
                                                    );
                                                },
                                            )}
                                            <tr>
                                                <th>Total: </th>
                                                <th>
                                                    €{parseNumber(
                                                        multi_task_payment.amount,
                                                    )}
                                                </th>
                                            </tr>
                                        </tbody>
                                    </table>
                                ) : null}

                                {(Task &&
                                    Task.detail.Invoice.error.create &&
                                    Task.detail.Invoice.error.create.fee) ||
                                (MultiTaskPayment &&
                                    MultiTaskPayment.detail.error.update &&
                                    MultiTaskPayment.detail.error.update
                                        .fee) ? (
                                    <FieldError
                                        message={
                                            Task
                                                ? Task.detail.Invoice.error
                                                      .create.fee
                                                : MultiTaskPayment.detail.error
                                                      .create.amount
                                        }
                                    />
                                ) : null}
                                <div className="form-group">
                                    <label className="control-label">
                                        {multi_task_payment ? 'Amount' : 'Fee'}{' '}
                                        (in Euro) *
                                    </label>
                                    <div>
                                        <input
                                            type="text"
                                            className="form-control"
                                            ref="fee"
                                            required
                                            placeholder={`${
                                                multi_task_payment
                                                    ? 'Amount'
                                                    : 'Fee'
                                            } in €"`}
                                            defaultValue={parseNumber(
                                                multi_task_payment
                                                    ? multi_task_payment.amount
                                                    : task.pay,
                                                false,
                                            )}
                                            disabled={
                                                multi_task_payment
                                                    ? true
                                                    : false
                                            }
                                        />
                                    </div>
                                </div>

                                {(Task &&
                                    Task.detail.Invoice.error.create &&
                                    Task.detail.Invoice.error.create
                                        .withhold_tunga_fee) ||
                                (MultiTaskPayment &&
                                    MultiTaskPayment.detail.error.update &&
                                    MultiTaskPayment.detail.error.update
                                        .withhold_tunga_fee) ? (
                                    <FieldError
                                        message={
                                            Task
                                                ? Task.detail.Invoice.error
                                                      .create.withhold_tunga_fee
                                                : MultiTaskPayment.detail.error
                                                      .update.withhold_tunga_fee
                                        }
                                    />
                                ) : null}

                                {isAdmin() ? (
                                    <div className="form-group">
                                        <div className="checkbox">
                                            <label className="control-label">
                                                <input
                                                    type="checkbox"
                                                    ref="withhold_tunga_fee"
                                                    checked={
                                                        this.state
                                                            .withhold_tunga_fee
                                                    }
                                                    disabled={
                                                        multi_task_payment &&
                                                        multi_task_payment.distribute_only
                                                    }
                                                    onChange={this.onWithHoldFeeChange.bind(
                                                        this,
                                                    )}
                                                />
                                                Withhold Tunga fee and taxes/
                                                Only pay participant fees.
                                            </label>
                                        </div>
                                        <div className="alert alert-info">
                                            Use the full{' '}
                                            {task.is_task ? 'task' : 'project'}{' '}
                                            fee even when this option is
                                            enabled.
                                        </div>
                                    </div>
                                ) : null}

                                {(Task &&
                                    Task.detail.Invoice.error.create &&
                                    Task.detail.Invoice.error.create
                                        .payment_method) ||
                                (MultiTaskPayment &&
                                    MultiTaskPayment.detail.error.update &&
                                    MultiTaskPayment.detail.error.update
                                        .payment_method) ? (
                                    <FieldError
                                        message={
                                            Task
                                                ? Task.detail.Invoice.error
                                                      .create.payment_method
                                                : MultiTaskPayment.detail.error
                                                      .update.payment_method
                                        }
                                    />
                                ) : null}
                                <div className="form-group">
                                    <label className="control-label">
                                        How would you like to pay?
                                    </label>
                                    <hr style={{marginTop: '0'}} />
                                    <div className="pay-choices">
                                        {TASK_PAYMENT_METHOD_CHOICES.slice(
                                            multi_task_payment &&
                                            multi_task_payment.distribute_only
                                                ? 1
                                                : 0,
                                            multi_task_payment
                                                ? 3
                                                : TASK_PAYMENT_METHOD_CHOICES.length,
                                        ).map(payment_method => {
                                            return (
                                                <div
                                                    key={payment_method.id}
                                                    className="row">
                                                    <div className="col-md-6">
                                                        <button
                                                            type="button"
                                                            className={
                                                                'btn btn-block ' +
                                                                (this.state
                                                                    .pay_method ==
                                                                payment_method.id
                                                                    ? 'active'
                                                                    : '')
                                                            }
                                                            onClick={this.onChangePayMethod.bind(
                                                                this,
                                                                payment_method,
                                                            )}>
                                                            <i
                                                                className={
                                                                    payment_method.icon_class +
                                                                    ' fa-lg pull-left'
                                                                }
                                                            />
                                                            {
                                                                payment_method.name
                                                            }
                                                        </button>
                                                    </div>
                                                    {task.exclude_payment_costs ? null : (
                                                        <div
                                                            className="col-md-6"
                                                            dangerouslySetInnerHTML={{
                                                                __html:
                                                                    payment_method.meta,
                                                            }}
                                                            style={{
                                                                paddingTop:
                                                                    '10px',
                                                            }}
                                                        />
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {this.state.pay_details ? (
                                    <div className="card">
                                        {this.state.pay_details}
                                    </div>
                                ) : null}

                                <div className="form-group text-center">
                                    <button
                                        type="submit"
                                        className="btn"
                                        disabled={
                                            (Task &&
                                                Task.detail.Invoice.isSaving) ||
                                            (MultiTaskPayment &&
                                                MultiTaskPayment.detail
                                                    .isSaving)
                                        }>
                                        Generate Invoice
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div>
                                {task.paid ||
                                (multi_task_payment &&
                                    multi_task_payment.paid) ? (
                                    <div>
                                        <div className="thank-you">
                                            We received your payment. Thank you!<br />
                                            <i className="fa fa-check-circle status-icon" />
                                            {multi_task_payment ? null : (
                                                <div className="next-action">
                                                    <a
                                                        href={`${ENDPOINT_TASK}${
                                                            task.id
                                                        }/download/invoice/?format=pdf&type=client`}
                                                        target="_blank"
                                                        className="btn">
                                                        <i className="fa fa-download" />{' '}
                                                        Download Invoice
                                                    </a>
                                                    <Link
                                                        to={`/work/${
                                                            task.id
                                                        }/rate`}
                                                        className="btn">
                                                        Rate Developers
                                                    </Link>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        {(Task &&
                                            Task.detail.error.pay &&
                                            Task.detail.error.pay.message) ||
                                        (MultiTaskPayment &&
                                            MultiTaskPayment.detail.error.pay &&
                                            MultiTaskPayment.detail.error.pay
                                                .message) ? (
                                            <Error
                                                message={
                                                    Task.detail.error.pay
                                                        .message
                                                }
                                            />
                                        ) : null}

                                        {!this.isPaymentApproved() ? (
                                            <blockquote className="highlight">
                                                {this.getPaymentMethod() !=
                                                TASK_PAYMENT_METHOD_BANK ? (
                                                    <div
                                                        style={{
                                                            marginBottom:
                                                                '10px',
                                                        }}>
                                                        You will be notified by
                                                        email once the payment
                                                        link for this invoice is
                                                        ready.<br />
                                                        This usually takes less
                                                        than 24 hours.
                                                    </div>
                                                ) : null}
                                                <div>
                                                    We{Task.detail.Invoice
                                                        .isSaved
                                                        ? "'ve"
                                                        : ' already'}{' '}
                                                    sent the invoice to your
                                                    email but you can also
                                                    download it using the button
                                                    below.
                                                </div>
                                            </blockquote>
                                        ) : null}

                                        {this.isPaymentApproved() &&
                                        this.getPaymentMethod() ==
                                            TASK_PAYMENT_METHOD_BITCOIN ? (
                                            <div>
                                                Send exactly BTC{' '}
                                                <strong>{btc_amount}</strong> to{' '}
                                                <a href={btc_address}>
                                                    <strong>
                                                        {btc_address_only}
                                                    </strong>
                                                </a>
                                                <div className="clearfix">
                                                    <div className="pull-left">
                                                        <div>
                                                            <img
                                                                src={`https://chart.googleapis.com/chart?cht=qr&chs=200x200&chl=${btc_address}`}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="pull-left">
                                                        <div className="btc-copy-widgets">
                                                            <CopyToClipboard
                                                                text={
                                                                    btc_amount
                                                                }>
                                                                <div className="input-group">
                                                                    <span className="input-group-addon">
                                                                        Fee:{' '}
                                                                    </span>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        value={
                                                                            btc_amount
                                                                        }
                                                                        disabled
                                                                    />
                                                                    <span className="input-group-btn">
                                                                        <button
                                                                            className="btn"
                                                                            type="button">
                                                                            <i className="fa fa-copy" />
                                                                        </button>
                                                                    </span>
                                                                </div>
                                                            </CopyToClipboard>
                                                            <CopyToClipboard
                                                                text={
                                                                    btc_address_only
                                                                }>
                                                                <div className="input-group">
                                                                    <span className="input-group-addon">
                                                                        Address:{' '}
                                                                    </span>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        value={
                                                                            btc_address_only
                                                                        }
                                                                        disabled
                                                                    />
                                                                    <span className="input-group-btn">
                                                                        <button
                                                                            className="btn"
                                                                            type="button">
                                                                            <i className="fa fa-copy" />
                                                                        </button>
                                                                    </span>
                                                                </div>
                                                            </CopyToClipboard>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : null}

                                        {this.isPaymentApproved() ? (
                                            <table className="table table-striped">
                                                <thead>
                                                    <tr>
                                                        <th colSpan="2">
                                                            Payment Breakdown
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>Task fee:</td>
                                                        <td>
                                                            &euro;{' '}
                                                            {parseNumber(
                                                                this.getInvoiceAmount(),
                                                            )}
                                                        </td>
                                                    </tr>
                                                    {!multi_task_payment &&
                                                    invoice &&
                                                    invoice.exclude_payment_costs ? null : (
                                                        <tr>
                                                            <td>
                                                                Payment costs:
                                                            </td>
                                                            <td>
                                                                &euro;{' '}
                                                                {parseNumber(
                                                                    this.getTotalPayAmount() -
                                                                        this.getInvoiceAmount(),
                                                                )}
                                                            </td>
                                                        </tr>
                                                    )}
                                                    <tr>
                                                        <th>Subtotal:</th>
                                                        <th>
                                                            &euro;{' '}
                                                            {parseNumber(
                                                                this.getTotalPayAmount(),
                                                            )}
                                                        </th>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            VAT{' '}
                                                            {parseNumber(
                                                                this.getTaxRate(),
                                                            )}%:
                                                        </td>
                                                        <td>
                                                            &euro;{' '}
                                                            {parseNumber(
                                                                this.getTaxAmount(),
                                                            )}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th>Total: </th>
                                                        <th>
                                                            &euro;{' '}
                                                            {parseNumber(
                                                                this.getTotalPaymentPlusTax(),
                                                            )}
                                                        </th>
                                                    </tr>
                                                    {this.withHoldTungaFee() &&
                                                    isAdmin() ? (
                                                        <tr>
                                                            <th>
                                                                Actual Payment
                                                                (minus Tunga fee
                                                                and taxes):{' '}
                                                            </th>
                                                            <th>
                                                                &euro;{' '}
                                                                {parseNumber(
                                                                    this.getActualPayAmount(),
                                                                )}
                                                            </th>
                                                        </tr>
                                                    ) : null}
                                                </tbody>
                                            </table>
                                        ) : null}

                                        <div className="clearfix">
                                            {this.isPaymentApproved() ? (
                                                <div className="pull-left">
                                                    {this.getPaymentMethod() ==
                                                    TASK_PAYMENT_METHOD_BITCOIN ? (
                                                        <a
                                                            href={btc_address}
                                                            className="btn">
                                                            <i className="fa fa-btc" />{' '}
                                                            Open bitcoin wallet
                                                            on device
                                                        </a>
                                                    ) : null}

                                                    {this.getPaymentMethod() ==
                                                    TASK_PAYMENT_METHOD_BITONIC ? (
                                                        <a
                                                            href={`${ENDPOINT_TASK}${
                                                                task.id
                                                            }/pay/bitonic/?amount=${this.getActualPayAmount()}`}
                                                            className="btn ">
                                                            <i className="fa fa-money" />{' '}
                                                            Pay with iDeal
                                                        </a>
                                                    ) : null}

                                                    {this.getPaymentMethod() ==
                                                    TASK_PAYMENT_METHOD_STRIPE ? (
                                                        <StripeCheckout
                                                            name="Tunga"
                                                            description={
                                                                multi_task_payment
                                                                    ? `Bulk Payment`
                                                                    : task.summary
                                                            }
                                                            image="https://tunga.io/icons/tunga_square.png"
                                                            ComponentClass="span"
                                                            panelLabel="Make Payment"
                                                            amount={parseInt(
                                                                parseFloat(
                                                                    this.getActualPayAmount(),
                                                                ) * 100,
                                                            )}
                                                            currency="EUR"
                                                            stripeKey={
                                                                __STRIPE_KEY__
                                                            }
                                                            locale="en"
                                                            //bitcoin={true}
                                                            email={
                                                                getUser().email
                                                            }
                                                            token={this.onStripeToken.bind(
                                                                this,
                                                            )}
                                                            reconfigureOnUpdate={
                                                                false
                                                            }
                                                            triggerEvent="onClick">
                                                            <button
                                                                type="button"
                                                                className="btn btn-success"
                                                                ref="pay_stripe">
                                                                <i className="fa fa-cc-stripe" />{' '}
                                                                Pay with Card
                                                            </button>
                                                        </StripeCheckout>
                                                    ) : null}
                                                </div>
                                            ) : null}

                                            {!multi_task_payment &&
                                            (this.getPaymentMethod() ==
                                                TASK_PAYMENT_METHOD_BANK ||
                                                !this.isPaymentApproved()) ? (
                                                <a
                                                    href={`${ENDPOINT_TASK}${
                                                        task.id
                                                    }/download/invoice/?format=pdf&type=client`}
                                                    target="_blank"
                                                    className={`btn ${
                                                        this.isPaymentApproved()
                                                            ? 'btn-alt'
                                                            : ''
                                                    }`}>
                                                    <i className="fa fa-download" />{' '}
                                                    Download Invoice
                                                </a>
                                            ) : null}

                                            <div className="pull-right">
                                                <button
                                                    className={`btn btn-alt`}
                                                    onClick={this.changePayMethod.bind(
                                                        this,
                                                    )}>
                                                    <i className="fa fa-pencil" />{' '}
                                                    Update Invoice
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }
}

TaskPay.propTypes = {
    task: PropTypes.object,
    multi_task_payment: PropTypes.object,
    isBatch: PropTypes.bool,
};

TaskPay.defaultProps = {
    task: {},
    multi_task_payment: null,
    isBatch: false,
};

TaskPay.contextTypes = {
    router: PropTypes.object.isRequired,
};
