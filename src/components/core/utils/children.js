import React from 'react';

export function addPropsToChildren(children, props) {

    return React.Children.map(
        children,
        function(child) {
            return React.cloneElement(child, props);
        }.bind(this),
    );
}
