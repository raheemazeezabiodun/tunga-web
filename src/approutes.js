import React from "react";
import { Router, Route, Redirect, Switch } from 'react-router-dom';

import { requiresAuth, requiresAuthOrEmail, requiresNoAuth } from 'utils/router'
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

const Div = props => <div {...props} />;

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

                    const { path, children, parent, ...rest } = child;
                    const Parent = parent;
                    const new_path = new_route.replace("//", "/");

                    return (
                        <RenderRouteComponent
                            path={new_path}
                            exact={false}
                            render={({ match }) => {
                                return (
                                    <Parent {...rest}>
                                        <NestedComponent
                                            children={children}
                                            parent={Div}
                                            path={new_path}
                                        />
                                    </Parent>
                                );
                            }}
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

const TungaRoute = ({ base_url = "", routes, history }) => (
    <App routes={routes} location={history.location}>
        <NestedComponent
            parent={Div}
            path={generateUrl("", base_url)}
            children={routes}
        />
    </App>
)



export default ({ history }) => {
    const all_routes = [
        { path: "", component: LandingPage, unauthedOnly: true },
        { path: "agreement", component: Agreement },
        { path: "privacy", component: PrivacyPolicy },
        { path: "code-of-conduct", component: CodeOfConduct },
        {
            path: "welcome",
            exact: true,
            component: TaskWizardLander,
            unauthedOnly: true
        },
        { path: "welcome/:skill", component: TaskWizardLander, unauthedOnly: true },
        { path: "quiz", exact: true, component: QuizForm, unauthedOnly: true },
        { path: "quiz/*", exact: true, component: QuizForm, unauthedOnly: true },
        {
            path: "developer/profile",
            exact: true,
            component: DeveloperProfile,
            unauthedOnly: true
        },
        {
            path: "developer/profile/*",
            exact: true,
            component: DeveloperProfile,
            unauthedOnly: true
        },
        { path: "start", exact: true, component: TaskWizard, unauthedOnly: true },
        {
            path: "start/:phase/:taskId",
            exact: true,
            component: TaskWizard,
            unauthedOnly: true
        },
        {
            path: "start/:phase/:taskId/*",
            component: TaskWizard,
            unauthedOnly: true
        },
        { path: "start/*", component: TaskWizard, unauthedOnly: true },
        {
            path: "start-welcome",
            exact: true,
            component: TaskWizard,
            unauthedOnly: true
        },
        {
            path: "start-welcome/:phase/:taskId",
            exact: true,
            component: TaskWizard,
            unauthedOnly: true
        },
        {
            path: "start-welcome/:phase/:taskId/*",
            component: TaskWizard,
            unauthedOnly: true
        },
        { path: "start-welcome/*", component: TaskWizard, unauthedOnly: true },
        {
            path: "start-outsource",
            exact: true,
            component: TaskWizard,
            unauthedOnly: true
        },
        {
            path: "start-outsource/:phase/:taskId",
            exact: true,
            component: TaskWizard,
            unauthedOnly: true
        },
        {
            path: "start-outsource/:phase/:taskId/*",
            component: TaskWizard,
            unauthedOnly: true
        },
        { path: "start-outsource/*", component: TaskWizard, unauthedOnly: true },
        {
            path: "call",
            component: LandingPage,
            unauthedOnly: true,
            showCallWidget: true
        },
        { path: "our-story", component: StoryPage, unauthedOnly: true },
        { path: "quality", component: QualityPage, unauthedOnly: true },
        { path: "pricing", component: PricingPage, unauthedOnly: true },
        { path: "press", component: LandingPage, unauthedOnly: true },
        { path: "FAQ", component: LandingPage, unauthedOnly: true },
        { path: "signin", component: SignInPage, unauthedOnly: true },
        { path: "signup", exact: true, to: "signin", unauthedOnly: true },
        { path: "signup/project-owner", component: SignUpPage, unauthedOnly: true },
        {
            path: "signup/invite/:invitationKey",
            component: SignUpPage,
            unauthedOnly: true
        },
        {
            path: "signup/developer/invite/:invitationKey",
            component: SignUpPage,
            unauthedOnly: true
        },
        {
            path: "signup/developer/:confirmationKey",
            component: SignUpPage,
            unauthedOnly: true
        },
        {
            path: "reset-password",
            exact: true,
            component: PasswordResetPage,
            unauthedOnly: true
        },
        {
            path: "reset-password/confirm/:uid/:token",
            component: PasswordResetConfirmPage,
            unauthedOnly: true
        },
        {
            path: "people",
            parent: UserPage,
            children: [
                { path: "filter/:filter", component: UserList },
                { path: "skill/:skill(/:filter)", component: UserList },
                { path: "invite", component: InviteDeveloper },
                { path: ":userId", component: User },
                { path: "", to: "filter/developers" }
            ]
        },
        { path: "member", exact: false, to: "people" },
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
                { path: "people", component: UserList },
                { path: "developers", component: UserList },
                { path: "tasks", component: TaskList },
                { path: "messages", component: MessageList },
                { path: "support", component: SupportPageList },
                { path: "", exact: true, to: "people" }
            ]
        },
        {
            path: "customer/help/:chatId",
            component: LandingPage,
            unauthedOnly: true
        },
        {
            authedOrEmailOnly: true,
            parent: AppWrapper,
            path: "",
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
                                { path: "edit/participation", component: TaskForm },
                                { path: "edit/payment-approval", component: TaskForm },
                                { path: "edit/:editSection", component: EditTaskSectionForm },
                                { path: "edit/*", component: TaskForm },
                                { path: "apply", component: ApplicationForm },
                                {
                                    parent: EstimateContainer,
                                    path: "proposal",
                                    children: [
                                        { path: "new", component: EstimateForm },
                                        {
                                            parent: EstimateDetailContainer,
                                            path: "",
                                            children: [
                                                { path: "", exact: true, to: "new" },
                                                { path: "edit", component: EstimateForm },
                                                {
                                                    path: ":estimateId",
                                                    exact: true,
                                                    component: EstimateDetail
                                                }
                                            ]
                                        }
                                    ]
                                },
                                { path: "estimate", to: "proposal" },
                                {
                                    parent: QuoteContainer,
                                    path: "planning",
                                    name: "QuoteContainer",
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
                                    component: ApplicationList
                                },
                                {
                                    path: "applications/:applicationId",
                                    component: ApplicationDetail
                                },
                                { path: "board", component: ProjectBoard },
                                { path: "task/new", exact: true, component: ProjectTaskForm },
                                { path: "task/new/*", component: ProjectTaskForm },
                                { path: "integrations/trello", component: TaskForm },
                                { path: "integrations/google", component: TaskForm },
                                { path: "integrations/:provider", component: IntegrationList },
                                {
                                    path: "integrations",
                                    exact: true,
                                    to: "integrations/github"
                                },
                                { path: "invoice", component: TaskPay },
                                { path: "participation", component: Participation },
                                { path: "rate", component: RateDevelopers },
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
        { path: ":skill", component: LandingPage, unauthedOnly: true },
        { path: "*", exact: false, to: "home" }
    ];

    return (
        <Router history={history}>
            <Switch>
                <Route
                    path="/tunga"
                    render={() => (
                        <TungaRoute history={history} routes={all_routes} base_url="/tunga" />
                    )}
                />
                <Route
                    path="/"
                    render={() => <TungaRoute history={history} routes={all_routes} />}
                />
            </Switch>
        </Router>
    );
};