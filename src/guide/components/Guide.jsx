import React from 'react';
import ReactDOMServer from 'react-dom/server';
import jsxToString from 'jsx-to-string';
import _ from 'lodash';

import Icon from '../../components/core/Icon';
import Button from '../../components/core/Button';
import IconButton from '../../components/core/IconButton';
import Input from '../../components/core/Input';
import CustomInputGroup from '../../components/core/CustomInputGroup';
import SearchBox from '../../components/core/SearchBox';
import TextArea from '../../components/core/TextArea';
import Upload from '../../components/core/Upload';
import ChoiceGroup from '../../components/core/ChoiceGroup';
import Avatar from '../../components/core/Avatar';
import NavBar from '../../components/NavBar';
import SideBar from '../../components/SideBar';
import Select from '../../components/core/Select';
import CountrySelector from '../../components/core/CountrySelector';
import {openAlert, openConfirm, openPrompt, openModal} from '../../components/core/utils/modals';
import FieldError from '../../components/core/FieldError';
import Error from '../../components/core/Error';
import Warning from '../../components/core/Warning';
import Success from '../../components/core/Success';
import Info from '../../components/core/Info';
import SkillSelector from '../../components/core/SkillSelector';
import UserSelector from '../../components/core/UserSelector';
import DateTimePicker from '../../components/core/DateTimePicker';
import Calendar from '../../components/core/Calendar';
import DocumentPicker from '../../components/core/DocumentPicker';

import SampleProfileForm from './samples/SampleProfileForm';

let avatarUrl = require('../images/deadpool.jpg');

export default class Guide extends React.Component {

    document(component, showComponent=true, showHTML=false, componentName=null) {
        let options = {};
        if(componentName) {
            options.displayName = componentName;
        }

        return (
            <div>
                {showComponent?(
                    <div>
                        {showComponent && showHTML?(
                            <h6>Component:</h6>
                        ):null}
                        <code>
                            {jsxToString(component, options)}
                        </code>
                    </div>
                ):null}
                {showHTML?(
                    <div>
                        {showComponent && showHTML?(
                            <h6>HTML:</h6>
                        ):null}
                        <code>
                            {ReactDOMServer.renderToStaticMarkup(component)}
                        </code>
                    </div>
                ):null}
            </div>
        );
    }

    renderAndDocument(component, showHTML=false, componentName=null, extraDocs=null) {
        return (
            <div>
                {this.document(component, true, showHTML, componentName)}
                {extraDocs || null}
                <div>
                    {component}
                </div>
            </div>
        );
    }

    wrapCode(code) {
        return (
            <React.Fragment>
                <code>{code}</code><br/>
            </React.Fragment>
        );
    }

    render() {
        return (
            <div>
                <NavBar/>
                <div className="container">
                    <h1>Style & Component Guide</h1>

                    <div className="row">
                        <nav id="side-nav" className="col-md-2">
                            <ul data-spy="affix" data-offset-top="0">
                                {[
                                    'Colors', 'Typography', 'Navigation',
                                    ['Icons', 'Icon Sizes'],
                                    'Buttons',
                                    ['Inputs', 'Text Input'],
                                    ['Search', 'Search Input'],
                                    ['DateTime', 'DateTime Input'],
                                    ['Select', 'Select Input'],
                                    ['Choices', 'Choice Input'],
                                    ['Uploads', 'File Uploads'],
                                    ['Documents', 'Document Picker'],
                                    ['Tags', 'Tag Input'],
                                    ['Users', 'User Selector'],
                                    'Avatars',
                                    'Modals',
                                    'Alerts'
                                ].map((section, idx) => {
                                    let sectionId = section,
                                        sectionTitle = section;

                                    if(Array.isArray(section)) {
                                        sectionId = section[0];
                                        sectionTitle = section[1];
                                    }

                                    return (
                                        <li key={`nav-${sectionId}`}><a href={`#id${sectionId}`}>{ idx + 1 }. {sectionTitle}</a></li>
                                    );
                                })}
                            </ul>
                        </nav>
                        <div className="col-md-10">
                            <div className="section">
                                <h2 id="idColors">Colors</h2>
                                {[
                                    ['black', '#444'],
                                    ['white', '#fff'],
                                    ['pink', '#ed134d'],
                                    ['lightest-grey', '#fafafa'],
                                    ['light-grey', '#f8f8f8'],
                                    ['dark-grey', '#888'],
                                    ['green', '#40bb56'],
                                    ['orange', '#ff7904'],
                                    ['red', '#e93232']
                                ].map(color => {
                                    return (
                                        <div key={`color-${color}`}>
                                            <span className={`color color-${color[0]}`}/> <span className="hex">{color[1]}</span> | <span className="name">{_.upperFirst(color[0].split('-').join(' '))}</span>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="section">
                                <h2 id="idTypography">Typography</h2>
                                <div className="sub-section">
                                    <h4>Font</h4>
                                    Fira Sans <a href="https://fonts.google.com/specimen/Fira+Sans" target="_blank">https://fonts.google.com/specimen/Fira+Sans</a>
                                </div>

                                <div className="sub-section">
                                    <h4>Weight</h4>
                                    {this.renderAndDocument(
                                        <div className="font-weight-thin">Thin (100 | .font-weight-thin)</div>
                                    )}
                                    {this.renderAndDocument(
                                        <div className="font-weight-light">Light (300 | .font-weight-light) - Default font weight</div>
                                    )}
                                    {this.renderAndDocument(
                                        <div className="font-weight-normal">Regular (400 | .font-weight-normal)</div>
                                    )}
                                    {this.renderAndDocument(
                                        <div className="font-weight-medium">Regular (500 | .font-weight-medium) - Default for headings</div>
                                    )}
                                    {this.renderAndDocument(
                                        <div className="font-weight-bold">Bold (700 | .font-weight-bold)</div>
                                    )}
                                </div>

                                <div className="sub-section">
                                    <h4>HTML Headings</h4>
                                    {this.renderAndDocument(
                                        <h1>h1 (2.5 rem)</h1>
                                    )}
                                    {this.renderAndDocument(
                                        <h2>h2 (2.0 rem)</h2>
                                    )}
                                    {this.renderAndDocument(
                                        <h3>h3 (1.75 rem)</h3>
                                    )}
                                    {this.renderAndDocument(
                                        <h4>h4 (1.5 rem)</h4>
                                    )}
                                    {this.renderAndDocument(
                                        <h5>h5 (1.25 rem)</h5>
                                    )}
                                    {this.renderAndDocument(
                                        <h6>h6 (1 rem)</h6>
                                    )}
                                </div>

                                <div className="sub-section">
                                    <h4>Custom headings</h4>
                                    {this.renderAndDocument(
                                        <div className="showcase-title">Showcase title</div>
                                    )}
                                    {this.renderAndDocument(
                                        <div className="showcase-section-title">Showcase section title</div>
                                    )}
                                    {this.renderAndDocument(
                                        <div className="page-title">Page title</div>
                                    )}
                                    {this.renderAndDocument(
                                        <div className="page-sub-title">Page sub title</div>
                                    )}
                                    {this.renderAndDocument(
                                        <div className="pop-up-title">Pop up title</div>
                                    )}
                                </div>

                                <div className="sub-section">
                                    <h4>Text</h4>
                                    {this.renderAndDocument(
                                        <div className="text text-sm">Small text</div>
                                    )}
                                    {this.renderAndDocument(
                                        <div className="text">Normal text - Default text size</div>
                                    )}
                                    {this.renderAndDocument(
                                        <div className="text text-lg">Large text</div>
                                    )}
                                    {this.renderAndDocument(
                                        <div className="showcase-desc">Showcase description</div>
                                    )}
                                </div>
                            </div>

                            <div className="section detailed">
                                <h2 id="idNavigation">Navigation</h2>

                                {[
                                    ['Navbar', false],
                                    ['Navbar for Admins', true]
                                ].map(navbar => {
                                    return (
                                        <div key={`navbar-${navbar[0]}`} className="sub-section">
                                            <h4>{navbar[0]}</h4>
                                            {this.renderAndDocument(
                                                <NavBar user={{is_admin: navbar[1], display_name: 'DeadPool', avatar_url: avatarUrl}}/>,
                                                false, 'NavBar'
                                            )}
                                        </div>
                                    );
                                })}

                                <div className="sub-section">
                                    <h4>Sidebar</h4>
                                    {this.renderAndDocument(
                                        <SideBar/>,
                                        false, 'SideBar'
                                    )}
                                </div>
                            </div>

                            <div className="section detailed">
                                <h2 id="idIcons">Icon sizes</h2>

                                <div>
                                    Checkout <a target="_blank" href="http://resources.tunga.io/tunga-assets/icons/latest/demo.html">http://resources.tunga.io/tunga-assets/icons/latest/demo.html</a> for a list of all available icons and their name.

                                    <div>
                                        <strong>NOTE: </strong> Our custom <code>&lt;Icon&gt;</code> component takes an abbreviated name for the icon.
                                        e.g <code>check</code> instead of <code>tg-ic-check</code> or <code>search</code> instead <code>tg-ic-search</code>
                                    </div>
                                </div>
                                {[
                                    'navbar', 'sidebar', 'topbar',
                                    ['showcase', 'Showcase', ['webfunnel']],
                                    'card',
                                    ['sm', 'Small', ['main-sm']],
                                    ['icon', 'Icon', ['main']],
                                    ['md', 'Medium', ['main-md']],
                                    ['lg', 'Large', ['main-lg']],
                                    ['xl', 'Extra Large', ['main-xl', 'main-xlg']],
                                ].map(icon => {
                                    let iconName = icon,
                                        sizeTitle = icon, aliases = null;
                                    if(Array.isArray(icon)) {
                                        iconName = icon[0];
                                        sizeTitle = icon[1];
                                        aliases = icon[2];
                                    }

                                    let extraDoc = null;

                                    if(aliases) {
                                        extraDoc = (
                                            <div>
                                                <h6>Aliases:</h6>
                                                {aliases.map(alias => {
                                                    return (
                                                        this.document(
                                                            <Icon name="check" size={alias}/>, true, false, 'Icon'
                                                        )
                                                    );
                                                })}
                                            </div>
                                        );
                                    }

                                    return (
                                        <div key={`icon-${iconName}`}>
                                            <h4>{_.upperFirst(sizeTitle)}</h4>
                                            {this.renderAndDocument(
                                                <Icon name="check" size={iconName}/>,
                                                false, 'Icon', extraDoc
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="section detailed">
                                <h2 id="idButtons">Buttons</h2>
                                {[
                                    [null, 'Small', {size: 'sm'}],
                                    [null, 'Default'],
                                    [null, 'Large', {size: 'lg'}],
                                    [null, 'Extra Large', {size: 'xl'}],
                                    [null, 'Extra Extra Large', {size: 'xxl'}],
                                    'secondary',
                                    'skill',
                                    'outline-primary', 'outline-secondary'
                                ].map(button => {
                                    let buttonProps = {},
                                        buttonName = button,
                                        buttonTitle = null;

                                    if(button) {
                                        if(Array.isArray(button)) {
                                            if(button[0]) {
                                                buttonProps.variant = button[0];
                                            }
                                            buttonName = button[1];
                                            buttonTitle = button[1];
                                            if(button[2]) {
                                                buttonProps = {...buttonProps, ...button[2]};
                                            }
                                        } else {
                                            buttonProps.variant = button;
                                            buttonTitle =_.upperFirst(button);
                                        }
                                    }

                                    function cleanName(name) {
                                        return name.split('-').map(str => {
                                            return _.upperFirst(str);
                                        }).join(' ');
                                    }

                                    return (
                                        <div key={`btn-${buttonTitle}`}>
                                            <h4>{cleanName(buttonTitle)}</h4>
                                            {this.renderAndDocument(
                                                <Button {...buttonProps}>{cleanName(buttonName)}</Button>,
                                                true, 'Button'
                                            )}
                                        </div>
                                    );
                                })}

                                {[
                                    ['Icon Button', null],
                                    ['Icon Button Small', 'sm'],
                                    ['Icon Button Large', 'lg']
                                ].map(button => {
                                    let buttonProps = {};
                                    if(button[1]) {
                                        buttonProps.size = button[1];
                                    }

                                    return (
                                        <div>
                                            <h4>{button[0]}</h4>
                                            {this.renderAndDocument(
                                                <IconButton name="add" {...buttonProps}/>,
                                                true, 'IconButton'
                                            )}
                                        </div>
                                    );
                                })}


                            </div>

                            <div className="section detailed">
                                <h2 id="idInputs">Input Widgets</h2>

                                {[
                                    ['Small', {size: 'sm'}],
                                    ['Default'],
                                    ['Large', {size: 'lg'}]
                                ].map(input => {
                                    return (
                                        <div key={`input-${input[0]}`}>
                                            <h4>{input[0]}</h4>
                                            {this.renderAndDocument(
                                                <Input {...(input[1] || {})} placeholder="Placeholder"/>,
                                                false, 'Input'
                                            )}
                                        </div>
                                    );
                                })}

                                {[
                                    ['personal', 'Personal Information'],
                                    ['password', 'Password'],
                                    ['tel', 'Phone Number'],
                                    ['address', 'Address'],
                                    ['url', 'URL Input'],
                                    ['message', 'Message'],
                                ].map(input => {
                                    let inputProps = {};

                                    if(input[0]) {
                                        inputProps.variant = input[0];
                                    }
                                    if(input[2]) {
                                        inputProps.placeholder = input[2];
                                    }
                                    if(input[3]) {
                                        inputProps = {...inputProps, ...input[3]};
                                    }

                                    return (
                                        <div key={`input-group-${input[0]}`}>
                                            <h4>{input[1]}</h4>
                                            {this.renderAndDocument(
                                                <CustomInputGroup {...inputProps}/>,
                                                false, 'CustomInputGroup'
                                            )}
                                        </div>
                                    );
                                })}

                                <div>
                                    <h4>TextArea</h4>
                                    {this.renderAndDocument(
                                        <TextArea placeholder="Type message here"/>,
                                        false, 'TextArea'
                                    )}
                                </div>
                            </div>

                            <div className="section detailed">
                                <h2 id="idSearch">Search Input</h2>

                                {[
                                    [null, 'Search'],
                                    [null, 'Search (custom placeholder)', {placeholder: 'Search Tunga'}],
                                    [false, 'Search Plain'],
                                ].map(search => {
                                    let searchProps = {};

                                    if(typeof search[0] === 'boolean') {
                                        searchProps.branded = search[0];
                                    }

                                    if(search[2]) {
                                        searchProps = {...searchProps, ...search[2]};
                                    }

                                    return (
                                        <div key={`search-${search[1]}`}>
                                            <h4>{search[1]}</h4>
                                            {this.renderAndDocument(
                                                <SearchBox {...searchProps}/>,
                                                false, 'SearchBox'
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="section detailed">
                                <h2 id="idDateTime">DateTime Input</h2>

                                <div>
                                    <code>&lt;DateTimePicker&gt;</code> and <code>&lt;Calendar&gt;</code> components are imported from <code>/src/components/core/</code> but share the same API as the thirdparty <a target="_blank" href="https://jquense.github.io/react-widgets/api/DateTimePicker/">React Widgets</a> library but have an automatically confugured localizer.
                                </div>

                                {[
                                    ['DateTimePicker', true, true],
                                    ['DatePicker', true, false],
                                    ['TimePicker', false, true],
                                ].map(picker => {
                                    return (
                                        <div key={`picker-${picker[0]}`}>
                                            <h4>{picker[0]}</h4>
                                            {this.renderAndDocument(
                                                <DateTimePicker calendar={picker[1]} time={picker[2]}/>,
                                                false, 'DateTimePicker'
                                            )}
                                        </div>
                                    );
                                })}

                                <div>
                                    <h4>Calendar</h4>
                                    {this.renderAndDocument(
                                        <Calendar/>, false, 'Calendar'
                                    )}
                                </div>
                            </div>

                            <div className="section detailed">
                                <h2 id="idUploads">File Uploads</h2>
                                {[
                                    [null, 'Upload'],
                                    ['image', 'Image Upload'],
                                    [null, 'Upload Button', {variant: 'button'}],
                                    [null, 'Upload Icon', {variant: 'icon'}],
                                    [null, 'Upload Button Small', {variant: 'button', size: 'sm'}],
                                    [null, 'Upload Button Large', {variant: 'button', size: 'lg'}],
                                    [null, 'Upload Icon Large', {variant: 'icon', size: 'lg'}],
                                    [null, 'Multiple File Upload', {multiple: true}],
                                    ['image', 'Multiple Image Upload', {multiple: true}],
                                    ['image', 'Upload (with custom placeholder)', {placeholder: <Icon name="avatar" size="xl"/>}],
                                    [null, 'Upload (with custom instructions)', {instructions: 'Drag and drop or click and upload'}],
                                    [null, 'Upload (with no instructions)', {instructions: false}],
                                ].map(upload => {
                                    let uploadProps = {};
                                    if(upload[0]) {
                                        uploadProps.type = upload[0];
                                    }
                                    if(upload[2]) {
                                        uploadProps = {...uploadProps, ...upload[2]};
                                    }

                                    return (
                                        <div key={`upload-${upload[1]}`}>
                                            <h4>{upload[1]}</h4>
                                            {this.renderAndDocument(
                                                <Upload {...uploadProps}/>, false, 'Upload'
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="section detailed">
                                <h2 id="idDocuments">Document Picker</h2>
                                <div>Documents can be either files or urls and include additional properties like title, description and type. See our <a href="http://resources.tunga.io/docs/data-dictionary#idDocument" target="blank">data dictionary reference</a> for details.</div>


                                {[
                                    [null, 'Document Picker'],
                                    ['button', 'Document Picker Button'],
                                    [
                                        null,
                                        'Document Picker (with pre-selected document type)',
                                        {
                                            documentType: 'requirements'
                                        }
                                    ],
                                    [
                                        null,
                                        'Document Picker (with limited options for document types)',
                                        {
                                            documentTypes: [
                                                ['requirements', 'Requirements document'],
                                                ['other', 'Other']
                                            ]
                                        }
                                    ],
                                    [null, 'Document Picker (selected list disabled)', {showSelected: false}],
                                ].map(doc => {
                                    let docProps = {};

                                    if(doc[0]) {
                                        docProps.variant = doc[0];
                                    }

                                    if(doc[2]) {
                                        docProps = {...docProps, ...doc[2]};
                                    }

                                    return (
                                        <div key={`doc-${doc[1]}`}>
                                            <h4>{doc[1]}</h4>
                                            {this.renderAndDocument(
                                                <DocumentPicker {...docProps}/>,
                                                false, 'DocumentPicker'
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="section detailed">
                                <h2 id="idTags">Tag Input</h2>
                                {[
                                    ['Skill Selector'],
                                    ['Skill Selector (limit selections)', {max: 3}],
                                    ['Skill Selector (selected string)', {selected: 'React.js, Python'}],
                                    ['Skill Selector (selected array)', {selected: ['React.js', 'Python']}],
                                    ['Skill Selector (selected array of objects)', {selected: [{name: 'React.js'}, {name:'Python'}]}]
                                ].map(skill => {
                                    let skillProps = {};
                                    if(skill[1]) {
                                        skillProps = {...skillProps, ...skill[1]};
                                    }
                                    return (
                                        <div key={`skill-${skill[0]}`}>
                                            <h4>{skill[0]}</h4>
                                            {this.renderAndDocument(
                                                <SkillSelector placeholder="Add skill or product" {...skillProps}/>,
                                                false, 'SkillSelector'
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="section detailed">
                                <h2 id="idUsers">User Selector</h2>
                                {[
                                    ['User Selector'],
                                    ['User Selector (limit selections)', {max: 1}],
                                    ['User Selector (Developers)', {account_type: 'developer'}],
                                    ['User Selector (Project Managers)', {account_type: 'project_manager'}],
                                    ['User Selector (Clients)', {account_type: 'project_owner'}],
                                    ['User Selector (Admins)', {account_type: 'admin'}],
                                    ['User Selector (selected users)', {selected: [{id: 1000000, display_name: 'DeadPool', avatar_url: avatarUrl}]}],
                                    ['User Selector (bottom selection variant)', {variant: 'bottom', selected: [{id: 1000000, display_name: 'DeadPool', avatar_url: avatarUrl}]}]
                                ].map(user => {
                                    let userProps = {};
                                    if(user[1]) {
                                        userProps = {...userProps, ...user[1]};
                                    }
                                    return (
                                        <div key={`skill-${user[0]}`}>
                                            <h4>{user[0]}</h4>
                                            {this.renderAndDocument(
                                                <UserSelector {...userProps}/>,
                                                false, 'UserSelector'
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="section detailed">
                                <h2 id="idSelect">Select Input</h2>

                                {[
                                    ['Select', {selected: 2}],
                                    ['Select (custom placeholder)', {placeholder: '-- Select a number --'}]
                                ].map(select => {
                                    let selectProps = {
                                        options: [
                                            [1, 'One'],
                                            [2, 'Two'],
                                            [3, 'Three']
                                        ]
                                    };

                                    if(select[1]) {
                                        selectProps = {...selectProps, ...select[1]};
                                    }

                                    return (
                                        <div key={`select-${select[0]}`}>
                                            <h4>{select[0]}</h4>
                                            {this.renderAndDocument(
                                                <Select {...selectProps}/>,
                                                false, 'Select'
                                            )}
                                        </div>
                                    );
                                })}

                                <div>
                                    <h4>Country Selector</h4>
                                    {this.renderAndDocument(
                                        <CountrySelector/>, false, 'CountrySelector'
                                    )}
                                </div>

                                <div>
                                    <h4>Country Selector (with selected value)</h4>
                                    {this.renderAndDocument(
                                        <CountrySelector selected="UG"/>, false, 'CountrySelector'
                                    )}
                                </div>
                            </div>

                            <div className="section detailed">
                                <h2 id="idChoices">Choice Input</h2>
                                {[
                                    [null, 'Choice Group'],
                                    ['primary', 'Choice Group Primary Small', {size: 'sm'}],
                                    ['primary', 'Choice Group Primary Default'],
                                    ['primary', 'Choice Group Primary Large', {size: 'lg'}],
                                    ['outline-primary', 'Choice Group Outline Primary'],
                                    ['secondary', 'Choice Group Secondary'],
                                    ['outline-secondary', 'Choice Group Outline Secondary'],
                                    ['card', 'Choice Group Card'],
                                    ['dotted-card', 'Choice Group Dotted Card'],
                                    [
                                        'dotted-card',
                                        'Choice Group Dotted Card with Icons',
                                        {
                                            choices: [
                                                ['facebook', 'Facebook', 'facebook-square'],
                                                ['twitter', 'Twitter', 'twitter-square'],
                                                ['linkedin', 'LinkedIn', 'linkedin-square']
                                            ],
                                            selected: 'twitter'
                                        }
                                    ],
                                ].map(choice => {
                                    let choiceProps = {};

                                    if(choice[0]) {
                                        choiceProps.variant = choice[0];
                                    }

                                    if(choice[2]) {
                                        choiceProps = {...choiceProps, ...choice[2]};
                                    }

                                    if(!choiceProps.choices) {
                                        let choices = [
                                            [1, 'One'],
                                            [2, 'Two'],
                                            [3, 'Three']
                                        ];
                                        choiceProps = {...choiceProps, choices};
                                    }

                                    if(!choiceProps.selected) {
                                        choiceProps = {...choiceProps, selected: 2};
                                    }

                                    return (
                                        <div key={`choice-${choice[1]}`}>
                                            <h4>{choice[1]}</h4>
                                            {this.renderAndDocument(
                                                <ChoiceGroup {...choiceProps}/>,
                                                false, 'ChoiceGroup'
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="section detailed">
                                <h2 id="idAvatars">Avatars</h2>
                                {[
                                    ['xs', avatarUrl, 'Extra Small (20px)'],
                                    ['sm', avatarUrl, 'Small (30px)'],
                                    [null, avatarUrl, 'Default (40px)'],
                                    ['md', avatarUrl, 'Medium (60px)'],
                                    ['lg', avatarUrl, 'Large (80px)'],
                                    ['xl', avatarUrl, 'Extra Large (100px)'],
                                    ['xxl', avatarUrl, 'Extra Extra Large (120px)'],
                                    [null, null, 'Missing Image'],
                                    [null, avatarUrl, 'Notification Badge', {badge: 5}],
                                    [null, avatarUrl, 'Title', {title: 'Deadpool'}],
                                    [null, avatarUrl, 'Verified', {verified: true}],
                                ].map(avatar => {
                                    let avatarProps = {};
                                    if(avatar[0]) {
                                        avatarProps.size = avatar[0];
                                    }
                                    if(avatar[1]) {
                                        avatarProps.image = avatar[1];
                                    }
                                    if(avatar[3]) {
                                        avatarProps = {...avatarProps, ...avatar[3]};
                                    }

                                    return (
                                        <div key={`avatar-${avatar[0] || avatar[2]}`}>
                                            <h4>{avatar[2]}</h4>
                                            {this.renderAndDocument(
                                                <Avatar {...avatarProps}/>, false, 'Avatar'
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="section detailed">
                                <h2 id="idModals">Modals</h2>

                                <div>
                                    <h6>Functions:</h6>

                                    <p>
                                        There are 4 modal functions: <code>openAlert</code>, <code>openConfirm</code>, <code>openPrompt</code> and <code>openModal</code>.
                                    </p>

                                    <p>
                                        The first 3 render dialogs equivalent to JavaScript alerts, confirms and prompts as per the function name
                                        while <code>openModal</code> renders a more generic modal with only the modal chrome (title and close button) and no automatic action buttons.
                                    </p>

                                    <p>
                                        All modal functions return a <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise" target="_blank">Promise</a> which is either resolved or rejected depending on the user action and modal type.<br/>

                                        <code>
                                            {this.wrapCode("openConfirm('Are you ok?').then((result) => { // Accepted }, (result) => { // Rejected });")}
                                        </code>
                                    </p>

                                    <p>
                                        All modal functions are imported from the <code>'src/components/core/utils/modals'</code> module.
                                    </p>
                                </div>

                                <div>

                                    <div>
                                        <h6>Arguments:</h6>
                                        <p>
                                            <code>body:</code> (required | string or JSX)<br/>
                                            The first argument for all modal functions.
                                        </p>
                                        <p>
                                            <code>title:</code> (optional | string or JSX)<br/>
                                            The second argument for all modal functions.
                                        </p>
                                        <p>
                                            <code>canClose:</code> (optional | boolean)<br/>
                                            The third argument for all modal functions and determines whether a close button is shown by the modal<br/>
                                            Defaults to false for <code>openAlert</code>, <code>openConfirm</code> and <code>openPrompt</code> and true for <code>openModal</code>
                                        </p>
                                        <p>
                                            <code>options:</code> (optional | object)<br/>
                                            The fourth argument for all modal functions and determines whether a close button is shown by the modal<br/>
                                        </p>
                                        <div>
                                            Available options include:<br/>
                                            <p>
                                                <code>className:</code> which allow customization via CSS/Sass<br/>
                                            </p>

                                            <p>
                                                <code>size:</code> set's the bootstrap size class for the modal, accepts <code>sm</code>, <code>md</code> and <code>lg</code> for small, medium and large modals.<br/>
                                                <code>md</code> is the default.
                                                Applies to only <code>openModal</code> because sizes for alert, confirm and prompt modals are overriden in css.
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <h6>Body Components:</h6>
                                        <p>
                                            Any components passed in as the body will receive 3 function props that allow them to control the modal:
                                        </p>
                                        <p>
                                            <code>proceed:</code> call this to close the modal and resolved the promise (e.g pass back onSuccess data to the calling component)<br/>
                                            <code>cancel:</code> call this to close the modal and reject the promise (e.g pass back onError data to the calling component)<br/>
                                            <code>dismiss:</code> call this to only close the modal.
                                        </p>
                                    </div>
                                </div>

                                <p>
                                    All samples below use the onClick event of the button to call the appropriate modal function as documented above the button.
                                </p>

                                <div>
                                    <h4>Alerts</h4>
                                    {this.wrapCode("openAlert('Pay attention!')")}
                                    <Button onClick={() => {openAlert('Pay attention!')}} size="sm">Open Alert</Button>
                                </div>

                                <div>
                                    <h4>Confirm</h4>
                                    {this.wrapCode("openConfirm('Do you agree?', 'Changes')")}
                                    <Button onClick={() => {openConfirm('Do you agree?', 'Changes')}} size="sm">Open Confirm</Button>
                                </div>

                                <div>
                                    <h4>Prompt</h4>
                                    {this.wrapCode("openPrompt('What\'s your name?', 'Welcome')")}
                                    <Button onClick={() => {openPrompt('What\'s your name?', 'Welcome')}} size="sm">Open Prompt</Button>
                                </div>

                                <div>
                                    <h4>Custom Component Modal</h4>
                                    {this.wrapCode("openModal(<SampleProfileForm/>, 'Profile')")}
                                    <Button onClick={() => {openModal(<SampleProfileForm/>, 'Profile')}} size="sm">Open Custom Component Modal</Button>
                                </div>

                                <div>
                                    <h4>Custom JSX Modal</h4>
                                    {this.wrapCode("openModal(<div>Hello!</div>, 'Greetings')")}
                                    <Button onClick={() => {openModal(<div>Hello!</div>, 'Greetings')}} size="sm">Open Custom JSX Modal</Button>
                                </div>

                                <div>
                                    <h4>Small Custom Modal</h4>
                                    {this.wrapCode("openModal(<SampleProfileForm/>, 'Profile', true, {size: 'sm'})")}
                                    <Button onClick={() => {openModal(<SampleProfileForm/>, 'Profile', true, {size: 'sm'})}} size="sm">Open Small Custom Modal</Button>
                                </div>

                                <div>
                                    <h4>Medium Custom Modal</h4>
                                    {this.wrapCode("openModal(<SampleProfileForm/>, 'Profile', true, {size: 'md'})")}
                                    <Button onClick={() => {openModal(<SampleProfileForm/>, 'Profile', true, {size: 'md'})}} size="sm">Open Medium Custom Modal</Button>
                                </div>

                                <div>
                                    <h4>Large Custom Modal</h4>
                                    {this.wrapCode("openModal(<SampleProfileForm/>, 'Profile', true, {size: 'lg'})")}
                                    <Button onClick={() => {openModal(<SampleProfileForm/>, 'Profile', true, {size: 'lg'})}} size="sm">Open Large Custom Modal</Button>
                                </div>
                            </div>

                            <div className="section detailed">
                                <h2 id="idAlerts">Alerts</h2>

                                <div>
                                    <h4>Field Error</h4>
                                    {this.renderAndDocument(
                                        <FieldError message="Invalid email."/>, false, 'FieldError'
                                    )}
                                </div>

                                <div>
                                    <h4>Error</h4>
                                    {this.renderAndDocument(
                                        <Error message="Something went wrong! Please try again."/>, false, 'Error'
                                    )}
                                </div>

                                <div>
                                    <h4>Warning</h4>
                                    {this.renderAndDocument(
                                        <Warning message="Please correct the errors below to proceed."/>, false, 'Warning'
                                    )}
                                </div>

                                <div>
                                    <h4>Success</h4>
                                    {this.renderAndDocument(
                                        <Success message="Changes saved successfully"/>, false, 'Success'
                                    )}
                                </div>

                                <div>
                                    <h4>Success</h4>
                                    {this.renderAndDocument(
                                        <Success message="Changes saved successfully" variant="icon"/>, false, 'Success'
                                    )}
                                </div>

                                <div>
                                    <h4>Info</h4>
                                    {this.renderAndDocument(
                                        <Info message="Welcome to Tunga!"/>, false, 'Info'
                                    )}
                                </div>

                                <div>
                                    <h4>Secondary Info</h4>
                                    {this.renderAndDocument(
                                        <Info variant="secondary" message="Welcome to Tunga!"/>, false, 'Info'
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
