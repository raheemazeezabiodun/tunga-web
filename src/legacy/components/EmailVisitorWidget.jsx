import PropTypes from 'prop-types';
import React from 'react';

export default class EmailVisitorWidget extends React.Component {
    onSubmitEmail(e) {
        e.preventDefault();
        const email = this.refs.visitor_email.value.trim();
        const {onSubmit} = this.props;
        if (onSubmit && email) {
            onSubmit(email);
        }
        return;
    }

    render() {
        const {
            btnText,
            placeholder,
            disabled,
            success,
            error,
            className,
        } = this.props;

        return (
            <div className={'email-widget ' + (className || '')}>
                <form
                    id="contact-form"
                    role="form"
                    name="contact-form"
                    ref="contact_form"
                    onSubmit={this.onSubmitEmail.bind(this)}>
                    {success ? <Success message={success} /> : null}
                    {error ? <Error message={error} /> : null}
                    <div className="input-group">
                        <input
                            className="form-control"
                            ref="visitor_email"
                            name="email"
                            type="email"
                            placeholder={placeholder || 'Enter your email'}
                            required
                        />
                        <span className="input-group-btn">
                            <button
                                className="btn"
                                type="submit"
                                disabled={disabled}>
                                {btnText}
                            </button>
                        </span>
                    </div>
                </form>
            </div>
        );
    }
}

EmailVisitorWidget.propTypes = {
    btnText: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    onSubmit: PropTypes.func.isRequired,
    success: PropTypes.string,
    error: PropTypes.string,
    disabled: PropTypes.bool,
    className: PropTypes.string,
};

EmailVisitorWidget.defaultProps = {
    btnText: 'Send',
    placeholder: 'Enter your email',
    canUpload: true,
    disabled: false,
};
