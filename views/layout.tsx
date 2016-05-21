/// <reference path="./../typings/index.d.ts" />

import * as React from "react";
import {map, uniqueId, clone} from "lodash";
import ImageHero from "./_components/image-hero";
import LayoutHead, {IProps as HeadProps} from "./head"
import {FuselageConfig} from "fuselage";
import LayoutScripts, {IProps as ScriptProps} from "./scripts";

export interface LayoutProps extends HeadProps, ScriptProps
{   
    scripts?: string[];
    
    sdhLinkClass?: string;
    
    blogLinkClass?: string;
    
    customHeroTitle?: string;
}

export default function Layout(props: LayoutProps & FuselageConfig)
{       
    const headProps = clone(props);
    
    //Headprops should not have children , else it will duplicate the layout page's children content.
    headProps.children = undefined;
    
    return (
        <html lang="en">
        <LayoutHead {...headProps} />
        <body>
            <nav id="header-nav">
                <div className="container">
                    <div className="brand">
                        <a href="/">
                            {props.appName}
                        </a>
                        <div id="nav-toggle">
                            <a href="#" id="toggler" className="toggler">
                                <i className="fa fa-bars"></i>
                            </a>
                        </div>
                    </div>
                    <div id="collapsible" className="collapsible">
                        <menu className="right">
                            <div className={props.blogLinkClass}>
                                <a href={props.blogIndexAtHome ? "/" : "/blog"}>
                                    {props.blogTitle}
                                </a>
                            </div>
                        </menu>
                    </div>
                </div>
            </nav>
            <ImageHero title={props.customHeroTitle || props.title} themeColor={props.themeColor} />
            <main id="container">
                {props.children}
            </main>
            <footer id="footer">
                <div>
                    <p>
                        {`© ${props.appName}, ${new Date().getUTCFullYear()}. All rights reserved.`}
                    </p>
                    <p>
                        {"Powered by "}
                        <a target="_blank" href="https://github.com/nozzlegear/fuselage">
                            {"Fuselage"}
                        </a>
                        {"."}
                    </p>
                </div>
            </footer>
            <LayoutScripts scripts={props.scripts} />
        </body>
        </html>
    )
}