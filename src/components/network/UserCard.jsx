import PropTypes from 'prop-types';
import React from 'react';
import {Link} from 'react-router-dom';
import Linkify from '../Linkify';

import Avatar from "../core/Avatar";
import Button from "../core/Button";

export default class UserCard extends React.Component {
    static propTypes = {
        user: PropTypes.object
    };

    render() {
        const {user} = this.props, {profile} = user;

        return (
            user?(
                <Link to={`/network/${user.username}`} className="user-card">
                    <div className="basic-profile">
                        <Avatar image={user.avatar_url} size="lg"/>
                        <div className="font-weight-medium">{user.display_name}</div>
                        <div className="text text-sm">{user.profile.location}</div>
                    </div>
                    <div className="bio">
                        <Linkify properties={{target: '_blank'}}>
                            {profile.bio}
                        </Linkify>
                    </div>
                    <div className="skills">
                        {profile.skills && profile.skills.length?(
                            <div>
                                {profile.skills.slice(0, 6).map(skill => {
                                    return (
                                        <Button key={skill.id} variant="skill">{skill.name}</Button>
                                    );
                                })}
                            </div>
                        ):null}
                    </div>
                    <div className="text-center font-weight-medium">
                        View full profile
                    </div>
                </Link>
            ):null
        );
    }
}
