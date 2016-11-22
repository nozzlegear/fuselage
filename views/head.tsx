import * as React from "react";
import { uniqueId } from "lodash";
import { APP_NAME } from "../modules/constants";

export interface IProps {
    title: string;

    metaDescription?: string;

    skipCommonCss?: boolean;

    /**
     * Extra CSS that will be appended to the layout's head.
     */
    css?: string[];

    noIndexNoFollow?: boolean;
}

export default function Head(props: IProps) {
    const links = props.css.map(link => <link key={uniqueId()} href={link} rel="stylesheet" />);

    //A custom fontawesome script allows async icon loading and accessibility best practices. Must be in the head.
    const customFontAwesome = <script key={uniqueId()} src="https://use.fontawesome.com/47ceb506ad.js"></script>;

    return (
        <head>
            <title>{`${props.title} | ${APP_NAME}`}</title>

            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
            <meta name="description" content={props.metaDescription} />
            <meta content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' name='viewport' />
            <link rel="shortcut icon" href="/images/favicon.ico?v=3" type="image/x-icon" />
            <link rel="stylesheet" href="/wwwroot/css/normalize.css" />

            {
                props.noIndexNoFollow ? <meta name="robots" content="noindex, nofollow" /> : null
            }

            {
                props.skipCommonCss ? null :
                    [
                        <script key={uniqueId()} src="/wwwroot/vendor/responsive-nav/index.min.js" />,
                        <link key={uniqueId()} href="/wwwroot/vendor/responsive-nav/index.min.css" />,
                        <link key={uniqueId()} href="/wwwroot/css/nav.css" rel="stylesheet" />,
                        <link key={uniqueId()} href="/wwwroot/css/theme.css" rel="stylesheet" />,
                        customFontAwesome
                    ]
            }

            {links}
        </head>
    );
}