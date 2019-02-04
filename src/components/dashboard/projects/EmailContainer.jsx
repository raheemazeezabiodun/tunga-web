import React from 'react';
import { Link } from 'react-router-dom';

import Icon from '../../core/Icon';
import EmailListCard from './EmailListsCard';


export default class EmailContainer extends React.Component {
    render() {
        return (
            <div className="project-emails">
                <div className="email-header">
                    <Link to={`/projects/${this.props.project.id}/activity/`}>
                        <Icon name="arrow-left" />
                        Go back to Meeting room
                    </Link>
                </div>
               {[1,2].map(data => <EmailListCard key={data.index} />)}
            </div>
        )
    }
}