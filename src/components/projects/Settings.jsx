import PropTypes from 'prop-types';
import React from 'react';
import {Link} from 'react-router-dom';
import Avatar from "../core/Avatar";
import ChoiceGroup from "../core/ChoiceGroup";
import {SOCIAL_PROVIDERS} from "../../legacy/constants/Api";
import Icon from "../core/Icon";

export default class Settings extends React.Component {
    static propTypes = {
        project: PropTypes.object,
        ProjectActions: PropTypes.object,
    };

    onToggleUpdates(participation) {
        const {ProjectActions} = this.props;
        ProjectActions.updateParticipation(participation.id, {updates_enabled: !participation.updates_enabled});
    }

    render() {
        const { project } = this.props;
        let task = {};

        return (
            <div className="project-settings">
                <div className="section">
                    <div className="font-weight-normal">Integrations</div>
                    <div className="text text-sm font-weight-thin">Add an integration by clicking on the icons</div>

                    <div className="clearfix">
                        <ul className="integration-options pull-right">
                            <li id="github-btn">
                                <Link to={`/projects/${
                                        project.id
                                        }/settings/${
                                        SOCIAL_PROVIDERS.github
                                        }`}
                                    activeClassName="active"
                                    title="GitHub">
                                    <Icon name="github" />
                                </Link>
                            </li>
                            <li id="slack-btn">
                                <Link
                                    to={`/projects/${
                                        project.id
                                        }/settings/${
                                        SOCIAL_PROVIDERS.slack
                                        }`}
                                    activeClassName="active"
                                    title="Slack">
                                    <Icon name="slack" />
                                </Link>
                            </li>
                            <li id="trello-btn">
                                <Link
                                    to={`/projects/${project.id}/settings/${
                                        SOCIAL_PROVIDERS.trello
                                        }`}
                                    activeClassName="active"
                                    title="Trello">
                                    <Icon name="trello" />
                                </Link>
                            </li>
                            <li id="google-drive-btn">
                                <Link
                                    to={`/projects/${project.id}/settings/${
                                        SOCIAL_PROVIDERS['google-drive']
                                        }`}
                                    activeClassName="active"
                                    title="Google Drive">
                                    <Icon name="g-drive" />
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="section">
                    <div className="font-weight-normal">Progress reports</div>
                    <div className="text text-sm font-weight-thin">Turn progress reports on and off for specific developers</div>
                </div>

                <div className="section developers-list">
                    {project.participation.map(participation => {
                        return (
                            <div className="clearfix developer">
                                <div className="float-left">
                                    <Avatar key={participation.id}
                                            image={participation.user.avatar_url}
                                            title={participation.user.display_name}/>

                                </div>
                                <div className="float-left">
                                    <div className="font-weight-normal">{participation.user.display_name}</div>
                                    <div className="text text-sm font-weight-light">@{participation.user.username}</div>
                                </div>

                                <ChoiceGroup choices={[[true, 'on'], [false, 'off']]} selected={participation.updates_enabled}
                                             onChange={this.onToggleUpdates.bind(this, participation)}/>
                            </div>
                        )
                    })}
                </div>
            </div>
        );
    }
}
