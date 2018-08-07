import React from 'react';
import moment from 'moment';

import {COOKIE_OPTIONS, getCookieConsentCloseAt, setCookieConsentCloseAt, getCookieConsent, setCookieConsent, parseDefaultConsents} from "../utils/tracking";

export default class CookieSettings extends React.Component {

    constructor(props) {
        super(props);
        this.state = {cookieConsents: parseDefaultConsents(), showConsentAlert: !getCookieConsentCloseAt() && !getCookieConsent()};
    }

    onChangeConsentValue(key, e) {
        let idx = this.state.cookieConsents.indexOf(key),
            updateConsents = this.state.cookieConsents;
        if(e.target.checked) {
            if(idx === -1) {
                updateConsents = [...this.state.cookieConsents, key];
            }
        } else if (idx > -1) {
            updateConsents = [
                ...this.state.cookieConsents.slice(0, idx),
                ...this.state.cookieConsents.slice(idx + 1)
            ];
        }

        updateConsents = Array.from(new Set(updateConsents));
        this.setState({cookieConsents: updateConsents});
        if(this.props.onChange) {
            this.props.onChange(updateConsents);
        }
    }

    render() {
        return (
            <div>
                {COOKIE_OPTIONS.map(category => {
                    let categoryId = category[0];
                    return (
                        <div className="form-group">
                            <div className="checkbox">
                                <label className="control-label">
                                    <input
                                        type="checkbox"
                                        checked={(category[3] && category[4]) || this.state.cookieConsents.indexOf(categoryId) > -1}
                                        disabled={category[4]}
                                        onChange={this.onChangeConsentValue.bind(this, categoryId)}
                                    />
                                    {category[1]}
                                </label>
                            </div>
                            <div>
                                {category[2]}
                            </div>
                        </div>
                    );
                })}
                Learn more from the "Cookies" section of our <a href="https://tunga.io/privacy/#cookies">Privacy Policy.</a>
            </div>
        );
    }
}
