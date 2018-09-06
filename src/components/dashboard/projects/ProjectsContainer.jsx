import React from 'react';
import { Switch, Route } from 'react-router-dom';
import randomstring from 'randomstring';

import ProjectListContainer from './ProjectListContainer';
import ProjectDetailContainer from './ProjectDetailContainer';
import NewStage from "./Stage/NewStage";
import StageRouter from './Stage/StageRouter';
import CreateOpportunities from './Opportunities/CreateOpportunities';

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

    render() {
        let filters = null;
        switch(this.props.location.pathname) {
            case '/projects':
                filters = {stage: 'active'}
                break;
            case '/projects/filter/archived':
                filters = {archived: 'True'};
                break;
            case '/projects/filter/opportunity':
                filters = {stage: 'opportunity'}
                break;
            default:
                break;
        }
        const {Project, ProjectActions, InterestActions} = this.props, targetKey = this.state.targetKey;
        return (
            <React.Fragment>
                <Switch>
                    <Route exact path="/projects/new/stage" component={NewStage}/>
                    <Route exact path="/projects/new/opportunity"
                        render={props => <CreateOpportunities {...props}
                                                              errors={Project.errors.create || {}}
                                                              ProjectActions={ProjectActions}
                                                              isSaving={Project.isSaving[targetKey] || false}
                                                              isSaved={Project.isSaved[targetKey] || false} />}
                    />
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
                                                                          filters={{...filters}}
                                                                          ProjectActions={ProjectActions}>
                                       <StageRouter project={Project} projectFilter={true} />
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
                               <StageRouter {...props} />
                           </ProjectDetailContainer>}
                    />
                </Switch>
            </React.Fragment>
        );
    }
}

export default connect(ProjectsContainer);
