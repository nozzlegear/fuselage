/// <reference path="./../typings/index.d.ts" />

import * as React from "react";
import {uniqueId, map} from "lodash";
import {FuselageConfig} from "fuselage";

export interface IProps extends React.Props<any>
{
    title: string;
    
    metaDescription: string;
    
    skipCommonCss?: boolean;
    
    /**
     * Extra CSS that will be appended to the layout's head.
     */
    css?: string[];
}

export default function Head(props: IProps & FuselageConfig)
{
    const links = map(props.css, link => <link key={uniqueId()} href={link} rel="stylesheet" />);
    
    //A custom fontawesome script allows async icon loading and accessibility best practices. Must be in the head.
    const customFontAwesome = <script key={uniqueId()} src="https://use.fontawesome.com/47ceb506ad.js"></script>;

    return (
        <head>
            <title>{props.title} | {props.appName}</title>

            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
            <meta name="description" content={props.metaDescription} />
            <meta content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' name='viewport' />
            <meta name="google-site-verification" content="D6jvWqJJtMkzsMtAYEbVyOQUFiTAzv8Bx2ebzYmVpbc" />
            <meta name="msvalidate.01" content="4D50DA62EDC9DD1E9408EC94F9D5AFD2" />
            <link rel="shortcut icon" href="/images/favicon.ico?v=3" type="image/x-icon" />
            <link rel="stylesheet" href="/wwwroot/css/normalize.min.css" />
            
            { 
                props.skipCommonCss ? null :
                
                [
                    <link key={uniqueId()} href="/wwwroot/css/nav.min.css" rel="stylesheet" />,
                    <link key={uniqueId()} href="/wwwroot/css/theme.min.css" rel="stylesheet" />,
                    customFontAwesome

                ]
            }
            
            {links}
            {props.children}
        </head>
    );
}