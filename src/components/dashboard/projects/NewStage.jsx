import React from 'react';
import {Link} from 'react-router-dom';
import Icon from "../../core/Icon";

export default () => {

    return (
        <div className="content-card project-form-card text-center">
            <p className="text text-lg font-weight-medium">What stage is the project?</p>
            <div className="btn-group choice-group">
                <Link to={'/projects/new'} className="btn btn-card">
                    <div>Active Project</div>
                    <Icon name="projects" size={'lg'} className="icon"/>
                </Link>
                <Link to={'/projects/new/opportunity'} className="btn btn-card">
                    <div>Opportunity</div>
                    <Icon name="bullhorn" size={'lg'} className="icon"/>
                </Link>
            </div>
        </div>
    );
}
