import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';
import Auth from './AuthReducers';
import Profile from './ProfileReducers';
import Project from './ProjectReducers';
import User from './UserReducers';
import Skill from './SkillReducers';
import Activity from './ActivityReducers';

const TungaApp = combineReducers({
    Auth,
    Profile,
    Project,
    User,
    Skill,
    Activity,
    routing: routerReducer,
});

export default TungaApp;
