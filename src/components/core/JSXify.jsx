import React from 'react';

export default ({children, expand=false}) => {
    const nl_to_br = (str) => {
        if (str) {
            return str.replace(/\n+/gi, '<br />');
        }
        return str;
    };

    if(children) {
        return React.Children.map(
            children,
            function(child) {
                if(typeof child === 'string') {
                    return <div dangerouslySetInnerHTML={{__html: expand?nl_to_br(child):child}}/>;
                }
                return child;
            }.bind(this),
        );
    }
    return null;
}
