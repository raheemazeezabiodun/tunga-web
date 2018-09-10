import React from 'react';
import { Switch, Route } from 'react-router-dom';
import randomstring from 'randomstring';

import ProjectListContainer from './ProjectListContainer';
import ProjectDetailContainer from './ProjectDetailContainer';
import ProjectForm from "./ProjectForm";
import ProjectList from './ProjectList';
import ProjectStageContainer from './ProjectStageContainer';

import connect from '../../../connectors/ProjectConnector';


class ProjectsContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {targetKey: randomstring.generate()};
    }

    onCreateProject(project) {
        const {ProjectActions} = this.props;
        ProjectActions.createProject(project, this.state.targetKey);
    }

    getProjectFilters(filter) {
        switch(filter) {
            case 'archived':
                return {stage: 'active', archived: 'True'};
            case 'opportunity':
                return {stage: 'opportunity'};
            default:
                return {stage: 'active', archived: 'False'};
        }
    }

    render() {
        const {Project, ProjectActions, InterestActions} = this.props, targetKey = this.state.targetKey;
        return (
            <React.Fragment>
                <Switch>
                    <Route exact path="/projects/new"
                           render={props => <ProjectForm {...props}
                                                         project={Project.created[targetKey] || null}
                                                         isSaving={Project.isSaving[targetKey] || false}
                                                         isSaved={Project.isSaved[targetKey] || false}
                                                         errors={Project.errors.create || {}}
                                                         onCreate={this.onCreateProject.bind(this)}/>}
                    />
                    {[
                        '/projects/filter/:filter',
                        '/projects',
                    ].map(path => {
                        return (
                            <Route key={`project-container-path--${path}`}
                                   path={path}
                                   exact={true}
                                   render={props => <ProjectListContainer {...props}
                                                                          Project={Project}
                                                                          filters={this.getProjectFilters(props.match.params.filter)}
                                                                          ProjectActions={ProjectActions}>
                                       <ProjectList/>
                                   </ProjectListContainer>}
                            />
                        );
                    })}
                    <Route path="/projects/:projectId"
                           render={props => <ProjectDetailContainer {...props}
                                                                    projectId={props.match.params.projectId}
                                                                    Project={Project} ProjectActions={ProjectActions}
                                                                    isSaving={Project.isSaving[targetKey] || false}
                                                                    isSaved={Project.isSaved[targetKey] || false}
                                                                    InterestActions={InterestActions}>
                               <ProjectStageContainer {...props} />
                           </ProjectDetailContainer>}
                    />
                </Switch>
            </React.Fragment>
        );
    }
}

export default connect(ProjectsContainer);
