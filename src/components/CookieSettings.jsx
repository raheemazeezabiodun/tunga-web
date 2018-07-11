import React from 'react';
import {FormGroup} from 'reactstrap';

import {
    COOKIE_OPTIONS, getCookieConsentCloseAt, getCookieConsent, parseDefaultConsents,
    setCookieConsentCloseAt, setCookieConsent
} from "./utils/consent";
import Button from "./core/Button";

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
    }

    onSave = (e) => {
        e.preventDefault();
        setCookieConsent(this.state.cookieConsents);
        setCookieConsentCloseAt();
        return;
    };

    render() {
        return (
            <form onSubmit={this.onSave} className="cookie-settings">
                {COOKIE_OPTIONS.map(category => {
                    let categoryId = category[0];
                    return (
                        <FormGroup>
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
                        </FormGroup>
                    );
                })}

                <FormGroup>
                    Learn more from the "Cookies" section of our <a href="https://tunga.io/privacy/#cookies">Privacy Policy.</a>
                </FormGroup>

                <div className="text-right">
                    <Button type="submit">Save Settings</Button>
                </div>
            </form>
        );
    }
}
