import React from 'react';
import ReactDOMServer from 'react-dom/server';
import Linkify from 'react-linkify';
import striptags from 'striptags';

export default class LinkifyHTML extends React.Component {

    render() {
        return React.Children.map(
            this.props.children,
            function(child) {
                if(typeof child === 'string') {
                    let linked = ReactDOMServer.renderToStaticMarkup(
                        <Linkify properties={{target: '_blank'}}>
                            {striptags(child.replace(/<br\s*\/>/gi, '\n').replace(/<\/\s*(p|div)>/, '</$1>\n'))}
                        </Linkify>
                    ).replace('\n', '<br/>');
                    return <div dangerouslySetInnerHTML={{__html: linked}}/>;
                }
                return child;
            }.bind(this),
        );
    }
}
