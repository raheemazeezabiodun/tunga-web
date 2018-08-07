import React from 'react';
import PropTypes from 'prop-types';
import randomstring from 'randomstring';

import Home from "./Home";

import connect from "../../connectors/SkillPageConnector";

import {addPropsToChildren} from "../core/utils/children";


class SkillPage extends React.Component  {

    static propTypes = {
        keyword: PropTypes.string,
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
        this.getSkillPage();
    }

    componentDidUpdate(prevProps, prevState, snapShot) {
        if(prevProps.keyword !== this.props.keyword) {
            this.getSkillPage();
        }
    }

    getSkillPage() {
        const {keyword, SkillPageActions, SkillPage: {skill_page}} = this.props;
        if(keyword && (!skill_page || keyword !== skill_page.keyword)) {
            SkillPageActions.retrieveSkillPage(keyword);
        }
    }

    render() {
        const {keyword, SkillPage} = this.props,
            skill_page = SkillPage.skill_page,
            isRetrieving = SkillPage.isRetrieving[keyword];

        return (
            <Home skill_page={skill_page} isLoading={isRetrieving}/>
        );
    }
}

export default connect(SkillPage);
