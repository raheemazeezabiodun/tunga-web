import React from 'react';
import Helmet from 'react-helmet';
import ReactDOMServer from 'react-dom/server';
import striptags from 'striptags';

function safeStringify(value) {
    let parsedValue = value;
    if(typeof value === 'object') {
        try {
            parsedValue = ReactDOMServer.renderToStaticMarkup(value);
        } catch (e) {
            parsedValue = value.toString();
        }
    }
    return striptags(parsedValue);
}

export default ({title, description, keywords}) => {
    const metaTitle = `Tunga | ${safeStringify(title)}`,
        metaDescription = safeStringify(description);

    return (
        <Helmet>
            <title>{metaTitle}</title>
            <link rel="canonical" href={window.location.href} />
            <meta name="description" content={metaDescription} />

            <meta property="og:url" content={window.location.href} />
            <meta property="og:title" content={metaTitle} />
            <meta property="og:description" content={metaDescription} />

            <meta name="twitter:title" content={metaTitle} />
            <meta name="twitter:description" content={metaDescription} />

            {keywords ? <meta name="keywords" content={keywords} /> : null}
        </Helmet>
    );
}
