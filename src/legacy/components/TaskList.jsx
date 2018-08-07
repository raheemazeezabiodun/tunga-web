import PropTypes from 'prop-types';
import React from 'react';
import {Link, IndexLink} from 'react-router';

import Progress from './status/Progress';
import LoadMore from './status/LoadMore';
import TaskCard from './TaskCard';
import SearchBox from './SearchBox';
import GenericListContainer from '../containers/GenericListContainer';

import {isAdmin, isDeveloper, isProjectManager} from '../utils/auth';

export default class TaskList extends GenericListContainer {
    componentDidUpdate(prevProps, prevState) {
        super.componentDidUpdate(prevProps, prevState);

        if (
            prevProps.location &&
            this.props.location &&
            prevProps.location.pathname != this.props.location.pathname
        ) {
            this.getList();
        }

        if (prevProps.search != this.props.search) {
            this.setState({
                selection_key:
                    this.state.selection_key + (this.props.search || ''),
                prev_key: this.state.selection_key,
            });
        }
    }

    getList(filters) {
        this.props.TaskActions.listTasks(
            {
                filter: this.getFilter(),
                skill: this.getSkill(),
                ...this.props.filters,
                search: this.props.search,
                ...(filters || {}),
            },
            this.state.selection_key,
            this.state.prev_key,
        );
    }

    getFilter() {
        if (this.props.params && this.props.params.filter) {
            return this.props.params.filter;
        }
        return null;
    }

    getSkill() {
        if (this.props.params && this.props.params.skill) {
            return this.props.params.skill;
        }
        return null;
    }

    render() {
        const {Task, TaskActions, hide_header, emptyListText} = this.props;
        let filter = this.getFilter();
        let skill = this.getSkill();

        const all_tasks = Task.list.ids[this.state.selection_key] || [];

        return (
            <div>
                {hide_header ? null : (
                    <div>
                        <div className="clearfix">
                            <h2 className="pull-left">
                                {filter == 'my-tasks' && !isDeveloper()
                                    ? 'My '
                                    : ''}Work
                            </h2>
                            <div className="pull-right">
                                <SearchBox
                                    placeholder="Search tasks"
                                    onSearch={this.getList.bind(this)}
                                    count={Task.list.count}
                                />
                            </div>
                        </div>
                        {filter == 'my-tasks' && !isDeveloper() ? null : (
                            <ul className="nav nav-pills nav-top-filter">
                                <li role="presentation">
                                    <IndexLink
                                        to="/work"
                                        activeClassName="active">
                                        All
                                    </IndexLink>
                                </li>
                                {isProjectManager() || isAdmin()
                                    ? [
                                          <li role="presentation" key="leads">
                                              <Link
                                                  to="/work/filter/leads"
                                                  activeClassName="active">
                                                  <i className="fa fa-bullseye" />{' '}
                                                  Leads
                                              </Link>
                                          </li>,
                                          <li
                                              role="presentation"
                                              key="projects">
                                              <Link
                                                  to="/work/filter/projects"
                                                  activeClassName="active">
                                                  <i className="tunga-icon-project" />{' '}
                                                  Projects
                                              </Link>
                                          </li>,
                                          <li role="presentation" key="tasks">
                                              <Link
                                                  to="/work/filter/tasks"
                                                  activeClassName="active">
                                                  <i className="tunga-icon-task" />{' '}
                                                  Tasks
                                              </Link>
                                          </li>,
                                      ]
                                    : null}
                                <li role="presentation">
                                    <Link
                                        to="/work/filter/running"
                                        activeClassName="active">
                                        <i className="tunga-icon-running-tasks" />{' '}
                                        Running
                                    </Link>
                                </li>
                                <li role="presentation">
                                    <Link
                                        to="/work/filter/closed"
                                        activeClassName="active">
                                        <i className="fa fa-list" /> Closed
                                    </Link>
                                </li>
                                {isDeveloper() || isAdmin() ? (
                                    <li
                                        role="presentation"
                                        key="skills"
                                        style={{marginLeft: '20px'}}>
                                        <Link
                                            to="/work/filter/skills"
                                            activeClassName="active">
                                            My Skills
                                        </Link>
                                    </li>
                                ) : null}
                                {isDeveloper() ? (
                                    <li role="presentation" key="clients">
                                        <Link
                                            to="/work/filter/project-owners"
                                            activeClassName="active">
                                            My Clients
                                        </Link>
                                    </li>
                                ) : null}
                                {skill ? (
                                    <li
                                        role="presentation"
                                        style={{marginLeft: '20px'}}>
                                        <Link
                                            to={`/work/skill/${skill}`}
                                            activeClassName="active">
                                            <i className="tunga-icon-tag" />{' '}
                                            {skill}
                                        </Link>
                                    </li>
                                ) : null}
                            </ul>
                        )}
                    </div>
                )}
                {Task.list.isFetching ? (
                    <Progress />
                ) : (
                    <div>
                        <div className="row flex-row">
                            {all_tasks.map(id => {
                                const task = Task.list.tasks[id];
                                return (
                                    <div className="col-sm-6 col-md-4" key={id}>
                                        <TaskCard
                                            Task={Task}
                                            task={task}
                                            TaskActions={TaskActions}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                        {all_tasks.length ? (
                            Task.list.next ? (
                                <LoadMore
                                    url={Task.list.next}
                                    callback={x => {
                                        TaskActions.listMoreTasks(
                                            x,
                                            this.state.selection_key,
                                        );
                                    }}
                                    loading={Task.list.isFetchingMore}
                                />
                            ) : null
                        ) : (
                            <div className="alert alert-info">
                                {emptyListText}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }
}

TaskList.propTypes = {
    emptyListText: PropTypes.string,
};

TaskList.defaultProps = {
    emptyListText: 'No tasks match your query',
};
