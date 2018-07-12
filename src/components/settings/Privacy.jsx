import PropTypes from 'prop-types';
import React from 'react';
import ChoiceGroup from "../core/ChoiceGroup";

import * as UserSettings from "../../legacy/utils/UserSettings";
import {openCookieConsentPopUp} from "../utils/consent";
import Button from "../core/Button";

export default class Privacy extends React.Component {
    static propTypes = {
        user: PropTypes.object,
        isRetrieving: PropTypes.object,
        isSaving: PropTypes.object,
        isSaved: PropTypes.object,
        errors: PropTypes.object,
        ProfileActions: PropTypes.object,
    };

    componentDidMount() {
        const {ProfileActions} = this.props;
        ProfileActions.retrieveSettings();
    }

    onCookieSettings() {
        openCookieConsentPopUp();
    }

    onChange(name, value) {
        const {user, ProfileActions} = this.props;

        let setting = {};
        setting[name] = value;

        if(value !== user.settings.switches[name]) {
            ProfileActions.updateSettings({switches: setting});
        }
    }

    render() {
        const {user, isRetrieving, isSaving, isSaved, errors} = this.props;
        const {settings} = user;

        let promotional_email_switches = [
                UserSettings.NEWSLETTER_EMAIL, UserSettings.EVENT_EMAIL
            ],
            transactional_switches = [];

        if (user.is_developer) {
            transactional_switches = transactional_switches.concat([
                UserSettings.TASK_PROGRESS_REPORT_REMINDER_EMAIL,
                UserSettings.TASK_INVITATION_RESPONSE_EMAIL,
            ]);
        } else if(user.is_project_manager) {
            transactional_switches = transactional_switches.concat([
                UserSettings.TASK_PROGRESS_REPORT_REMINDER_EMAIL,
                UserSettings.TASK_INVITATION_RESPONSE_EMAIL,
            ]);
        } else {
            transactional_switches = transactional_switches.concat([
                UserSettings.TASK_SURVEY_REMINDER_EMAIL,
                UserSettings.NEW_TASK_PROGRESS_REPORT_EMAIL
            ]);
        }

        return (
            <div className="privacy-settings">
                {isRetrieving.settings?null:(
                    <div>
                        <div className="section">
                            <div className="section-title">Cookie Settings</div>

                            <div className="row">
                                <div className="col-md-8">
                                    <p>
                                        Learn more about how we use cookies from the "Cookies" section of our <a href="https://tunga.io/privacy/#cookies">Privacy Policy.</a>
                                    </p>
                                </div>
                                <div className="col-md-4"/>
                                <div className="col-md-8">
                                    <p>
                                        You can opt-out of specific cookie categories (except essential website cookies) by clicking on the “Cookie Settings” button
                                    </p>
                                </div>
                                <div className="col-md-4 text-right">
                                    <Button onClick={this.onCookieSettings.bind(this)}>Cookie Settings</Button>
                                </div>
                            </div>
                        </div>

                        <div className="section">
                            <div className="section-title">Promotional Email Settings</div>
                            {UserSettings.SWITCH_SETTINGS.map(setting => {
                                if (promotional_email_switches.indexOf(setting.name) === -1) {
                                    return null;
                                }
                                return (
                                    <div
                                        key={setting.name}
                                        className="form-group">
                                        <div className="row">
                                            <div className="col-md-8">
                                                {setting.label}
                                            </div>
                                            <div className="col-md-4 text-right">
                                                <ChoiceGroup variant="outline-primary"
                                                             choices={[[true, 'on'], [false, 'off']]}
                                                             selected={settings.switches[setting.name]}
                                                             onChange={this.onChange.bind(this, setting.name)}/>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="section">
                            <div className="section-title">Transactional Email Settings</div>
                            {UserSettings.SWITCH_SETTINGS.map(setting => {
                                if (transactional_switches.indexOf(setting.name) === -1) {
                                    return null;
                                }
                                return (
                                    <div
                                        key={setting.name}
                                        className="form-group">
                                        <div className="row">
                                            <div className="col-md-8">
                                                {setting.label}
                                            </div>
                                            <div className="col-md-4 text-right">
                                                <ChoiceGroup variant="outline-primary"
                                                             choices={[[true, 'on'], [false, 'off']]}
                                                             selected={settings.switches[setting.name]}
                                                             onChange={this.onChange.bind(this, setting.name)}/>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="section agreements">
                            <div className="section-title">Agreements and Policies</div>
                            <ul>
                                {[
                                    ['/privacy', 'Privacy Policy'],
                                    ['/agreement', 'User Agreement'],
                                    ['/code-of-conduct', 'Code of Conduct']
                                ].map(link => {
                                    return (
                                        <li>
                                            <a href={link[0]}>{link[1]}</a>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>

                    </div>
                )}
            </div>
        );
    }
}
