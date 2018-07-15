import PropTypes from 'prop-types';
import React from 'react';
import {FormGroup, Row, Col} from 'reactstrap';
import {NavLink} from 'react-router-dom';
import Avatar from "../core/Avatar";
import ChoiceGroup from "../core/ChoiceGroup";
import Icon from "../core/Icon";

import {SOCIAL_PROVIDERS} from "../../legacy/constants/Api";
import CustomInputGroup from "../core/CustomInputGroup";
import Button from "../core/Button";
import Success from "../core/Success";
import {isAdminOrPMOrClient} from "../utils/auth";
import Info from "../core/Info";

export default class Settings extends React.Component {
    static defaultProps = {
        section: null
    };

    static propTypes = {
        project: PropTypes.object,
        section: PropTypes.string,
        ProjectActions: PropTypes.object,
    };

    constructor(props) {
        super(props);
        this.state = {trello_board_url: '', google_drive_url: '', github_repo_url: '', github_issue_url: '', ...this.parseMetaMap(props.project.meta)}
    }

    onToggleUpdates(participation) {
        const {ProjectActions} = this.props;
        ProjectActions.updateParticipation(participation.id, {updates_enabled: !participation.updates_enabled});
    }

    parseMetaMap(meta, returnId=false) {
        let metaMap = {};
        (meta || []).forEach(item => {
            metaMap[item.meta_key] = returnId?item.id:item.meta_value;
        });
        return metaMap;
    }

    onChangeValue(key, e) {
        let newState = {};
        newState[key] = e.target.value;
        this.setState(newState);
    }

    onSaveMeta = (e) => {
        e.preventDefault();
        const { project, section, ProjectActions } = this.props;
        const targetKeysMap = {
            'google-drive': ['google_drive_url'],
            'trello': ['trello_board_url'],
            'github': ['github_repo_url', 'github_issue_url']
        };

        if(targetKeysMap[section]) {
            let metaData = {};
            targetKeysMap[section].forEach(key => {
                if(this.state[key]) {
                    metaData[key] = this.state[key];
                }
            });

            if(Object.keys(metaData).length) {
                let reqData = [], idMap = this.parseMetaMap(project.meta, true);
                Object.keys(metaData).map(key => {
                    let metaInfo = {meta_key: key, meta_value: metaData[key]},
                        metaId = idMap[key];
                    if(metaId) {
                        metaInfo.id = metaId;
                    }
                    reqData.push(metaInfo);
                });

                ProjectActions.updateProject(project.id, {meta: reqData});
            }
        }

    };

    render() {
        const { project, section, isSaved } = this.props;

        return (
            <div className="project-settings">
                <div className="section">
                    <div className="font-weight-normal">Integrations</div>
                    <div className="text text-sm font-weight-thin">Add an integration by clicking on the icons</div>

                    <div className="clearfix">
                        <ul className="integration-options pull-right">
                            <li>
                                <NavLink
                                    to={`/projects/${
                                        project.id
                                        }/settings/${
                                        SOCIAL_PROVIDERS.slack
                                        }`}
                                    activeClassName="active"
                                    title="Slack">
                                    <Icon name="slack" />
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to={`/projects/${
                                        project.id
                                        }/settings/${
                                        SOCIAL_PROVIDERS.github
                                        }`}
                                    activeClassName="active"
                                    title="GitHub">
                                    <Icon name="github" />
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to={`/projects/${project.id}/settings/${
                                        SOCIAL_PROVIDERS.trello
                                        }`}
                                    activeClassName="active"
                                    title="Trello">
                                    <Icon name="trello" />
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to={`/projects/${project.id}/settings/${
                                        SOCIAL_PROVIDERS['google-drive']
                                        }`}
                                    activeClassName="active"
                                    title="Google Drive">
                                    <Icon name="g-drive" />
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="section">
                    {section === 'slack'?(
                        <div>
                            <div className="font-weight-normal">Slack</div>

                            <div>// TODO: Re-enable Slack integration</div>
                        </div>
                    ):null}

                    {['trello', 'google-drive'].indexOf(section) > -1?(
                        <div className="clearfix">
                            <div className="font-weight-normal">{section === 'trello'?'Trello':'Google Drive'}</div>
                            {isAdminOrPMOrClient()?(
                                <form onSubmit={this.onSaveMeta}>
                                    {isSaved[project.id]?(
                                        <Success message="Changes saved successfully!"/>
                                    ):null}
                                    <Row>
                                        <Col>
                                            <FormGroup>
                                                <CustomInputGroup variant="url"
                                                                  placeholder={`${section === 'trello'?'Trello Board':'Google Drive'} URL`}
                                                                  onChange={this.onChangeValue.bind(this, section === 'trello'?'trello_board_url':'google_drive_url')}
                                                                  value={this.state[section === 'trello'?'trello_board_url':'google_drive_url']}
                                                                  required/>
                                            </FormGroup>
                                        </Col>
                                        <Col>
                                            <Button type="submit">Save</Button>
                                        </Col>
                                    </Row>
                                </form>
                            ):(
                                <div>
                                    {this.state[section === 'trello'?'trello_board_url':'google_drive_url']?(
                                        <div>
                                            <a href={this.state.github_repo_url} target="_blank"><Icon name="link"/> {this.state[section === 'trello'?'trello_board_url':'google_drive_url']}</a>
                                        </div>
                                    ):null}
                                </div>
                            )}
                        </div>
                    ):null}

                    {section === 'github'?(
                        <div>
                            <div className="font-weight-normal">GitHub</div>
                            {isAdminOrPMOrClient()?(
                                <form onSubmit={this.onSaveMeta}>
                                    {isSaved[project.id]?(
                                        <Success message="Changes saved successfully!"/>
                                    ):null}
                                    <Row>
                                        <Col sm="5">
                                            <label className="font-weight-light">Repo URL</label>
                                        </Col>
                                        <Col sm="5">
                                            <label className="font-weight-light">Issue URL</label>
                                        </Col>
                                        <Col></Col>
                                    </Row>
                                    <Row>
                                        <Col sm="5">
                                            <FormGroup>
                                                <CustomInputGroup variant="url" placeholder="GitHub Repo URL"
                                                                  onChange={this.onChangeValue.bind(this, 'github_repo_url')}
                                                                  value={this.state.github_repo_url}
                                                                  required/>
                                            </FormGroup>
                                        </Col>
                                        <Col sm="5">
                                            <FormGroup>
                                                <CustomInputGroup variant="url" placeholder="GitHub Issue URL"
                                                                  onChange={this.onChangeValue.bind(this, 'github_issue_url')}
                                                                  value={this.state.github_issue_url}/>
                                            </FormGroup>
                                        </Col>
                                        <Col>
                                            <Button type="submit">Save</Button>
                                        </Col>
                                    </Row>
                                </form>
                            ):(
                                <div>
                                    {this.state.github_repo_url || this.state.github_issue_url?(
                                        <div>
                                            {this.state.github_repo_url?(
                                                <p>
                                                    <div className="font-weight-light">Repo URL</div>
                                                    <a href={this.state.github_repo_url} target="_blank"><Icon name="link"/> {this.state.github_repo_url}</a>
                                                </p>
                                            ):null}

                                            {this.state.github_issue_url?(
                                                <p>
                                                    <div className="font-weight-light">Issue URL</div>
                                                    <a href={this.state.github_issue_url} target="_blank"><Icon name="link"/> {this.state.github_issue_url}</a>
                                                </p>
                                            ):null}
                                        </div>
                                    ):(
                                        <Info message="Integration is not yet configured"/>
                                    )}
                                </div>
                            )}
                        </div>
                    ):null}
                </div>

                {isAdminOrPMOrClient()?(
                    <div>
                        <div className="section">
                            <div className="font-weight-normal">Progress reports</div>
                            <div className="text text-sm font-weight-thin">Turn progress reports on and off for specific developers</div>
                        </div>
                        
                        <div className="section developers-list">
                            {project.participation.map(participation => {
                                return (
                                    <div key={participation.id} className="clearfix developer">
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
                                                     onChange={this.onToggleUpdates.bind(this, participation)} disabled={!isAdminOrPMOrClient()}/>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                ):null}
            </div>
        );
    }
}
