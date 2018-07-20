import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';
import Auth from './AuthReducers';
import Profile from './ProfileReducers';
import Project from './ProjectReducers';
import User from './UserReducers';
import Skill from './SkillReducers';
import Activity from './ActivityReducers';
import ProgressEvent from './ProgressEventReducers';
import Invoice from './InvoiceReducers';

const TungaApp = combineReducers({
    Auth,
    Profile,
    Project,
    User,
    Skill,
    Activity,
    ProgressEvent,
    Invoice,
    routing: routerReducer,
});

export default TungaApp;
