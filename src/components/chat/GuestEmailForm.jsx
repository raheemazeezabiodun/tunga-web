import React from 'react';

import FieldError from '../core/FieldError';
import Icon from "../core/Icon";

export default class GuestEmailForm extends React.Component {

    onSave(e) {
        e.preventDefault();
        let email = this.refs.email ? this.refs.email.value.trim() : null;
        this.saveChannel(email);
    }

    saveChannel(email) {
        const {channel, ActivityActions} = this.props;
        ActivityActions.createChannel({
            id: channel ? channel.id : null,
            email,
        });
    }

    render() {
        const {errors} = this.props;

        return (
            <div className="new-channel">
                <form
                    onSubmit={this.onSave.bind(this)}
                    name="channel"
                    role="form"
                    ref="channel_form">

                    <div>
                        {errors && errors.email? (
                            <FieldError
                                message={errors.email}
                            />
                        ) : null}
                        <div className="form-group">
                            <div className="input-group">
                                <input
                                    type="text"
                                    ref="email"
                                    className="form-control"
                                    placeholder="Your email address"
                                    required
                                />
                                <span className="input-group-btn">
                                    <button
                                        className="btn btn-grey"
                                        type="submit">
                                        <Icon name="paper-plane" />
                                    </button>
                                </span>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

