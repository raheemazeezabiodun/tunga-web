import React from 'react';
import Helmet from 'react-helmet';

export default class MetaTags extends React.Component {
    render() {
        const {title, description, keywords} = this.props;

        return (
            <Helmet>
                <title>{title}</title>
                <link rel="canonical" href={window.location.href} />
                <meta name="description" content={description} />

                <meta property="og:url" content={window.location.href} />
                <meta property="og:title" content={title} />
                <meta property="og:description" content={description} />

                <meta name="twitter:title" content={title} />
                <meta name="twitter:description" content={description} />

                {keywords ? <meta name="keywords" content={keywords} /> : null}
            </Helmet>
        );
    }
}
