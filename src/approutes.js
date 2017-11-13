import React from "react";
import { Router, Route, Redirect, Switch } from 'react-router-dom';

import App from 'containers/App';
import AppWrapper from 'containers/AppWrapper';
import LandingPage from 'routes/LandingPage';
import PricingPage from 'routes/PricingPage';
import QualityPage from 'routes/QualityPage';
import Home from 'routes/Home';
import SignInPage from 'routes/SignInPage';
import SignUpPage from 'routes/SignUpPage';
import PasswordResetPage from 'containers/PasswordResetPage';
import PasswordResetConfirmPage from 'containers/PasswordResetConfirmPage';
import Agreement from 'routes/Agreement';
import PrivacyPolicy from 'routes/PrivacyPolicy';
import CodeOfConduct from 'routes/CodeOfConduct';
import SettingsPage from 'containers/SettingsPage';
import ProjectBoard from 'components/ProjectBoard';
import ProjectTaskForm from 'components/ProjectTaskForm';
import TaskContainer from 'containers/TaskContainer';
import TaskList from 'components/TaskList';
import TaskForm from 'components/TaskForm';
import EditTaskSectionForm from 'components/EditTaskSectionForm';
import TaskDetailPage from 'routes/TaskDetailPage';
import ApplicationForm from 'components/ApplicationForm';
import TaskWorkflow from 'components/TaskWorkflow';
import ApplicationList from 'components/ApplicationList';
import ApplicationDetail from 'components/ApplicationDetail';
import MilestoneContainer from 'containers/MilestoneContainer';
import Milestone from 'components/Milestone';
import MilestoneList from 'components/MilestoneList';
import IntegrationList from 'components/IntegrationList';
import TaskPay from 'components/TaskPay';
import Participation from 'components/Participation';
import RateDevelopers from 'components/RateDevelopers';
import UserPage from 'routes/UserPage';
import UserList from 'components/UserList';
import User from 'components/User';
import InviteDeveloper from 'containers/InviteDeveloper';
import MessagePage from 'routes/MessagePage';
import ChannelContainer from 'containers/ChannelContainer';
import ChannelForm from 'components/ChannelForm';
import ChatBox from 'components/ChatBox';
import MessageList from 'components/MessageList';
import ProfilePage from 'routes/ProfilePage';
import Profile from 'components/Profile';
import Stack from 'components/Stack';
import CompanyProfile from 'components/CompanyProfile';
import PaymentMethod from 'components/PaymentMethod';
import Account from 'components/Account';
import IDDocument from 'components/IDDocument';
import ProfilePicture from 'components/ProfilePicture';
import PasswordChangeForm from 'components/PasswordChangeForm';
import ProfileType from 'components/ProfileType';
import PaymentList from 'components/PaymentList';
import SupportPage from 'routes/SupportPage';
import SupportSectionList from 'components/SupportSectionList';
import SupportPageDetail from 'components/SupportPageDetail';
import SearchPage from 'routes/SearchPage';
import SupportPageList from 'components/SupportPageList';
import EstimateContainer from 'containers/EstimateContainer';
import EstimateDetailContainer from 'containers/EstimateDetailContainer';
import EstimateForm from 'components/EstimateForm';
import EstimateDetail from 'components/EstimateDetail';
import EstimateList from 'components/EstimateList';
import QuoteContainer from 'containers/QuoteContainer';
import QuoteDetailContainer from 'containers/QuoteDetailContainer';
import QuoteForm from 'components/QuoteForm';
import QuoteDetail from 'components/QuoteDetail';
import TaskWizard from 'routes/TaskWizard';
import StoryPage from 'routes/StoryPage';
import TaskWizardLander from 'routes/TaskWizardLander';
import MultiTaskPaymentContainer from 'containers/MultiTaskPaymentContainer';
import MultiTaskPaymentDetailContainer from 'containers/MultiTaskPaymentDetailContainer';
import MultiTaskPay from 'components/MultiTaskPay';
import MultiTaskPayProcessing from 'components/MultiTaskPayProcessing';
import QuizForm from 'components/QuizForm';
import DeveloperProfile from 'components/DeveloperProfile';


function generateUrl(childUrl, parentUrl, params = {}) {
    var url = `${parentUrl}/${childUrl}`;
    Object.keys(params).forEach(val => {
        url = url.replace(`:${val}`, params[val]);
    });
    return url.replace("//", "/");
}

const NestedComponent = props => {
    return (
        <Switch>
            {props.children.map((child, index) => {
                const new_route = generateUrl(child.path, props.path);
                console.log(props.path);

                if (child.to) {
                    return (
                        <RenderRouteComponent
                            path={new_route}
                            render={({ match: { params }, location: { pathname } }) => {
                                let new_props = generateUrl(child.to, props.path, params);

                                return <Redirect to={new_props} />;

                            }}
                        />
                    );
                }
                if (child.children) {

                    const { path, ...rest } = child;

                    return (
                        <RenderRouteComponent
                            path={new_route.replace("//", "/")}
                            exact={false}
                            render={({ match }) => (
                                <props.parent name={child.name}>
                                    <NestedComponent
                                        path={new_route.replace("//", "/")}
                                        {...rest}
                                    />
                                </props.parent>
                            )}
                        />
                    );
                }
                return (
                    <RenderRouteComponent
                        path={new_route.replace("//", "/")}
                        exact={child.exact === false ? false : true}
                        render={({ match }) => (
                            <props.parent>
                                <child.component />
                            </props.parent>
                        )}
                    />
                );
            })}
        </Switch>
    );
};

const RenderRouteComponent = props => {
    if (props.to) {
        return <Redirect {...props} />;
    }
    return <Route {...props} />;
};

const WrappedComponent = ({ base_url = "" }) => {
    return (
        <AppWrapper>
            <Switch>
                {authRoutes.map((route, index) => {
                    const { path, ...rest } = route;
                    const full_url = generateUrl(path, base_url);
                    if (rest.children) {
                        return <NestedComponent path={full_url} {...rest} />;
                    }
                    return <RenderRouteComponent path={full_url} {...rest} />;
                })}
            </Switch>
        </AppWrapper>
    );
};

const Div = props => <div {...props} />;

const all_routes = [

    {
        path: "",
        parent: Div,
        "unauthedOnly": true,
        children: [
            { path: "welcome", exact: true, component: TaskWizardLander },
            { path: "welcome/:skill", component: TaskWizardLander, unauthedOnly: true },
            { path: "quiz", exact: true, component: QuizForm },
            { path: "quiz/*", exact: true, component: QuizForm },
            { path: "developer/profile", exact: true, component: DeveloperProfile },
            { path: "developer/profile/*", xact: true, component: DeveloperProfile },
            { path: "start", exact: true, component: TaskWizard },
            { path: "start/:phase/:taskId", exact: true, component: TaskWizard },
            { path: "start/:phase/:taskId/*", component: TaskWizard },
            { path: "start/*", component: TaskWizard },
            { path: "start-welcome", exact: true, component: TaskWizard },
            { path: "start-welcome/:phase/:taskId", exact: true, component: TaskWizard },
            { path: "start-welcome/:phase/:taskId/*", component: TaskWizard },
            { path: "start-welcome/*", component: TaskWizard },
            { path: "start-outsource", exact: true, component: TaskWizard },
            { path: "start-outsource/:phase/:taskId", exact: true, component: TaskWizard },
            { path: "start-outsource/:phase/:taskId/*", component: TaskWizard },
            { path: "start-outsource/*", component: TaskWizard },
            { path: "call", component: LandingPage, "showCallWidget": true },
            { path: "our-story", component: StoryPage },
            { path: "quality", component: QualityPage },
            { path: "pricing", component: PricingPage },
            { path: "press", component: LandingPage },
            { path: "FAQ", component: LandingPage },
            { path: "signin", component: SignInPage },
            { path: "signup", exact: true, to: "signin" },
            { path: "signup/project-owner", component: SignUpPage },
            { path: "signup/invite/:invitationKey", component: SignUpPage },
            { path: "signup/developer/invite/:invitationKey", component: SignUpPage },
            { path: "signup/developer/:confirmationKey", component: SignUpPage },
            { path: "reset-password", exact: true, component: PasswordResetPage },
            { path: "reset-password/confirm/:uid/:token", component: PasswordResetConfirmPage }
        ]
    },

    {
        parent: AppWrapper,
        path: "",
        authedOrEmailOnly: true,
        children: [
            { path: "home", component: Home },
            {
                parent: ProfilePage,
                path: "profile",
                children: [
                    { path: "", exact: true, to: "personal" },
                    { path: "personal", component: Profile },
                    { path: "stack", component: Stack },
                    { path: "company", component: CompanyProfile },
                    { path: "payment", exact: true, component: PaymentMethod },
                    { path: "payment/:provider", component: PaymentMethod },
                    { path: "account", component: Account },
                    { path: "id-document", component: IDDocument },
                    { path: "photo", component: ProfilePicture },
                    { path: "security", component: PasswordChangeForm },
                    { path: "complete", component: ProfileType },
                    { path: "*", to: "personal" }
                ]
            },
            {
                parent: EstimateContainer,
                path: "proposal",
                children: [
                    { path: "", exact: true, component: EstimateList },
                    { path: "new", component: EstimateForm },
                    { path: "filter/:filter", component: EstimateList },
                    {
                        parent: EstimateDetailContainer,
                        path: "",
                        children: [
                            { path: "edit", component: EstimateForm },
                            { path: ":estimateId", exact: true, component: EstimateDetail }
                        ]
                    }
                ]
            },
            { path: "estimate*", to: "/proposal" },
            { path: "settings*", component: SettingsPage },
            {
                parent: TaskContainer,
                path: "work",
                children: [
                    { path: "", exact: true, component: TaskList },
                    { path: "new", component: TaskForm },
                    { path: "filter/:filter", component: TaskList },
                    { path: "skill/:skill/:filter", component: TaskList },
                    {
                        parent: TaskDetailPage,
                        path: ":taskId",
                        children: [
                            { path: "", exact: true, component: TaskWorkflow },
                            { path: "edit", exact: true, component: TaskForm },
                            { path: "edit/participation", component: TaskForm, crumb: "Participation" },
                            { path: "edit/payment-approval", component: TaskForm, crumb: "Payment Review" },
                            { path: "edit/:editSection", component: EditTaskSectionForm, crumbs: {trello: 'Trello', 'google-drive': 'Google Drive'} },
                            { path: "edit/*", component: TaskForm },
                            { path: "apply", component: ApplicationForm, crumb: "Apply" },
                            {
                                parent: EstimateContainer,
                                path: "proposal",
                                crumb: "Proposal",
                                children: [
                                    { path: "new", component: EstimateForm },
                                    {
                                        parent: EstimateDetailContainer,
                                        path: "",
                                        children: [
                                            { path: "", exact: true, to: "new" },
                                            { path: "edit", component: EstimateForm },
                                            { path: ":estimateId", exact: true, component: EstimateDetail }
                                        ]
                                    }
                                ]
                            },
                            { path: "estimate", to: "proposal" },
                            {
                                parent: QuoteContainer,
                                path: "planning",
                                crumb: "Planning",
                                children: [
                                    { path: "new", component: QuoteForm },
                                    {
                                        parent: QuoteDetailContainer,
                                        path: ":quoteId",
                                        name: "QuoteDetailContainer",
                                        children: [
                                            { path: "", exact: true, component: QuoteDetail },
                                            { path: "edit", component: QuoteForm }
                                        ]
                                    },
                                    { path: "", exact: true, to: "new" }
                                ]
                            },
                            {
                                path: "applications",
                                exact: true,
                                component: ApplicationList,
                                crumb: "Applications"
                            },
                            {
                                path: "applications/:applicationId",
                                component: ApplicationDetail
                            },
                            { path: "board", component: ProjectBoard, crumb: "Project Board" },
                            { path: "task/new", exact: true, component: ProjectTaskForm, crumb: "Add task" },
                            { path: "task/new/*", component: ProjectTaskForm, crumb: "Add task" },
                            { path: "integrations/trello", component: TaskForm, crumb: "Trello" },
                            { path: "integrations/google", component: TaskForm, crumb: "Google Drive" },
                            { path: "integrations/:provider", component: IntegrationList, crumbs: {slack: 'Slack', github: 'GitHub'} },
                            {
                                path: "integrations",
                                exact: true,
                                to: "integrations/github",
                            },
                            { path: "invoice", component: TaskPay, crumb: "Generate Invoice" },
                            { path: "pay", component: TaskPay, crumb: "Make Payment" },
                            { path: "participation", component: Participation, crumb: "Participation shares" },
                            { path: "rate", component: RateDevelopers, crumb: "Rate Developers" },
                            {
                                path: "event",
                                parent: MilestoneContainer,
                                children: [{ path: ":eventId", component: Milestone }]
                            },
                            { path: "*", component: TaskForm },
                            { path: "task*", to: "work*" }
                        ]
                    }
                ]
            },
            {
                path: "conversation",
                parent: MessagePage,
                children: [
                    { path: "", exact: true, to: "start" },
                    { path: "start/:recipientId", component: ChannelForm },
                    { path: "start/task/:taskId", component: ChannelForm },
                    {
                        path: ":channelId",
                        parent: ChannelContainer,
                        children: [
                            { path: "", exact: true, to: "messages" },
                            { path: "edit", component: ChannelForm },
                            { path: ":channelView", component: ChatBox }
                        ]
                    }
                ]
            },
            { path: "channel*", to: "conversation*" },
            { path: "message*", to: "channel" },
            {
                path: "payments",
                parent: TaskContainer,
                children: [
                    { path: "", exact: true, component: PaymentList },
                    { path: "filter/:filter", component: PaymentList },
                    {
                        path: "bulk",
                        parent: MultiTaskPaymentContainer,
                        children: [
                            {
                                path: ":batchId",
                                parent: MultiTaskPaymentDetailContainer,
                                children: [
                                    { path: "", exact: true, component: MultiTaskPay },
                                    { path: "processing", component: MultiTaskPayProcessing }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                path: "help",
                parent: MessagePage,
                children: [
                    {
                        path: ":channelId",
                        parent: ChannelContainer,
                        children: [{ path: "", exact: true, component: ChatBox }]
                    }
                ]
            },
            {
                path: "dashboard/updates",
                parent: MilestoneContainer,
                children: [
                    { path: "", exact: true, component: MilestoneList },
                    { path: "filter/:filter", component: MilestoneList }
                ]
            }
        ]
    },
    {
        path: "people",
        parent: UserPage,
        children: [
            { path: "", exact: true, redirect: "filter/developers" },
            { path: "filter/:filter", component: UserList },
            { path: "skill/:skill(/:filter)", component: UserList },
            { path: "invite", component: InviteDeveloper },
            { path: ":userId", component: User }
        ]
    },
    { path: "member*", to: "people*" },
    {
        path: "support",
        parent: SupportPage,
        children: [
            { path: "", exact: true, component: SupportSectionList },
            { path: ":section", exact: true, component: SupportPageList },
            { path: "tag/:tag", exact: true, component: SupportPageList },
            { path: ":page", exact: true, component: SupportPageDetail }
        ]
    },
    {
        path: "search",
        parent: SearchPage,
        children: [
            { path: "", exact: true, to: "people" },
            { path: "people", component: UserList },
            { path: "developers", component: UserList },
            { path: "tasks", component: TaskList },
            { path: "messages", component: MessageList },
            { path: "support", component: SupportPageList }
        ]
    },
    {
        path: "customer/help/:chatId",
        component: LandingPage
    },
];

const AuthComponent = ({ base_url = "" }) => {
    return (
        <Switch>
            {all_routes.map((route, index) => {
                const { path, ...rest } = route;
                const full_url = generateUrl(path, base_url);
                if (rest.children) {
                    return <NestedComponent path={full_url} {...rest} />;
                }
                return <RenderRouteComponent path={full_url} {...rest} />;
            })}
        </Switch>
    );
};

export const AppRoutes = ({ base_route = "" }) => {
    return (
        <Switch>
            <Route
                exact
                path={`${generateUrl("", base_route)}`}
                component={LandingPage}
                unauthedOnly={true}
            />
            <Route
                exact
                path={`${generateUrl("agreement", base_route)}`}
                component={Agreement}
            />
            <Route
                exact
                path={`${generateUrl("privacy", base_route)}`}
                component={PrivacyPolicy}
            />
            <Route
                exact
                path={`${generateUrl("code-of-conduct", base_route)}`}
                component={CodeOfConduct}
            />
            <AuthComponent base_url={base_route} />
            <Route
                path={`${generateUrl(":skill", base_route)}`}
                component={LandingPage}
            />
            <Redirect path="*" to="home" />
        </Switch>
    );
};

export default ({ history }) => {
    return (
        <Router history={history}>
            <App location={history.location}>
                {/* <AppRoutes base_route="/tunga" /> */}
                <AppRoutes base_route="" />
            </App>
        </Router>
    );
};