import PropTypes from 'prop-types';
import React from 'react';

import Button from '../core/Button';
import ProjectCard from './ProjectCard';

export default class ProjectList extends React.Component {
    static propTypes = {
        projects: PropTypes.array,
        onLoadMore: PropTypes.func,
        isLoadingMore: PropTypes.bool,
        hasMore: PropTypes.bool,
    };

    render() {
        const {projects, onLoadMore, hasMore, isLoadingMore} = this.props;

        return (
            <div>
                <div className="row card-list">
                    {projects.map(project => {
                        return (
                            <div key={`project-card--${project.id}`} className="col-sm-4">
                                <ProjectCard project={project}/>
                            </div>
                        );
                    })}
                </div>

                {projects.length && hasMore && !isLoadingMore?(
                    <div className="text-center">
                        <Button size="sm" onClick={onLoadMore}>Load More</Button>
                    </div>
                ):null}
            </div>
        );
    }
}
