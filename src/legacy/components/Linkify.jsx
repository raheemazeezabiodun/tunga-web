import React from 'react';
import {renderToString} from 'react-dom/server';
import Linkify from 'react-linkify';

import {nl_to_br, br_to_nl} from '../utils/html';

export default class LinkifyHTML extends React.Component {
    getLinkifiedHTML() {
        return (
            <Linkify properties={{target: '_blank'}}>
                {br_to_nl(this.props.children)}
            </Linkify>
        );
    }

    render() {
        return (
            <div
                dangerouslySetInnerHTML={{
                    __html: nl_to_br(renderToString(this.getLinkifiedHTML())),
                }}
            />
        );
    }
}
