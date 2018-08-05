import React from 'react';
import Helmet from 'react-helmet';

export default ({title, description, keywords}) => {
    const metaTitle = `Tunga | ${title}`;

    return (
        <Helmet>
            <title>{metaTitle}</title>
            <link rel="canonical" href={window.location.href} />
            <meta name="description" content={description} />

            <meta property="og:url" content={window.location.href} />
            <meta property="og:title" content={metaTitle} />
            <meta property="og:description" content={description} />

            <meta name="twitter:title" content={metaTitle} />
            <meta name="twitter:description" content={description} />

            {keywords ? <meta name="keywords" content={keywords} /> : null}
        </Helmet>
    );
}
