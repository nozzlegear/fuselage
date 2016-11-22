import * as React from "react";
import { map, uniqueId, clone } from "lodash";
import ImageHero from "./_components/image-hero";
import LayoutHead, { IProps as HeadProps } from "./head"
import LayoutScripts, { IProps as ScriptProps } from "./scripts";
import { APP_NAME, THEME_COLOR, BLOG_TITLE, BLOG_INDEX_AT_HOME } from "../modules/constants";

export interface LayoutProps extends HeadProps, ScriptProps {
    scripts?: string[];

    customHeroTitle?: string;

    requestUrl: string;
}

export default function Layout(props: LayoutProps) {
    return (
        <html lang="en">
            <LayoutHead css={props.css} metaDescription={props.metaDescription} skipCommonCss={props.skipCommonCss} title={props.title} />
            <body>
                <nav id="header-nav">
                    <div className="container">
                        <div className="brand">
                            <a href="/">
                                {APP_NAME}
                            </a>
                            <div id="nav-toggle">
                                <a href="#" id="toggler" className="toggler">
                                    <i className="fa fa-bars"></i>
                                </a>
                            </div>
                        </div>
                        <div id="collapsible" className="collapsible">
                            <menu className="right">
                                <div className={/\/blog\/?/i.test(props.requestUrl) ? "active" : ""}>
                                    <a href={BLOG_INDEX_AT_HOME ? "/" : "/blog"}>
                                        {BLOG_TITLE}
                                    </a>
                                </div>
                            </menu>
                        </div>
                    </div>
                </nav>
                <ImageHero title={props.customHeroTitle || props.title} />
                <main id="container">
                    {props.children}
                </main>
                <footer id="footer">
                    <div>
                        <p>
                            {`© ${APP_NAME}, ${new Date().getUTCFullYear()}. All rights reserved.`}
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