import React from 'react';
import PropTypes from 'prop-types';
import randomstring from 'randomstring';

export default class ProjectDetailContainer extends React.Component  {

    static propTypes = {
        projectId: PropTypes.string,
        selectionKey: PropTypes.string,
    };

    static defaultProps = {
        filters: {},
        selectionKey: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            selectionKey: props.selectionKey || randomstring.generate(),
            prevKey: null,
        };
    }

    componentDidMount() {
        this.getProject();
    }

    componentDidUpdate(prevProps, prevState, snapShot) {
        if(prevProps.projectId !== this.props.projectId) {
            this.getProject();
        }
    }

    getProject() {
        const {projectId, ProjectActions, Project} = this.props;
        if(projectId && !Project.projects[projectId]) {
            ProjectActions.retrieveProject(projectId);
        }
    }

    renderChildren() {
        const {projectId, Project, ProjectActions} = this.props;


        return React.Children.map(
            this.props.children,
            function(child) {
                return React.cloneElement(child, {
                    project: Project.projects[projectId],
                    isSaving: Project.isSaving,
                    isSaved: Project.isSaved,
                    ProjectActions
                });
            }.bind(this),
        );
    }

    render() {
        return (
            <React.Fragment>
                {this.renderChildren()}
            </React.Fragment>
        );
    }
}
