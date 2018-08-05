import React from 'react';
import PropTypes from 'prop-types';
import randomstring from 'randomstring';

import Progress from "../../core/Progress";

import {addPropsToChildren} from "../../core/utils/children";


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
        const {projectId, Project, ProjectActions, children} = this.props;

        return addPropsToChildren(children, {
            project: Project.projects[projectId],
            isRetrieving: Project.isRetrieving[projectId],
            isSaving: Project.isSaving,
            isSaved: Project.isSaved,
            ProjectActions
        });
    }

    render() {
        const {projectId, Project} = this.props;
        const project = Project.projects[projectId];

        return (
            <React.Fragment>
                {Project.isRetrieving[projectId]?(
                    <Progress/>
                ):project?(
                    this.renderChildren()
                ):null}
            </React.Fragment>
        );
    }
}
