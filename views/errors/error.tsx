/// <reference path="./../../typings/main.d.ts" />

import * as React from "react";
import {LayoutProps} from "../layout";
import LayoutHead from "../head";

export interface IProps extends LayoutProps
{
    errorType: string;
    
    message: string;
    
    statusCode: number;
}

export default function ErrorPage(props: IProps)
{
    const css = ".error {color: #fff;}.error h2 {font-size: 10em;text-align: center;}.error h3 {text-align: center;margin-bottom: 25px;} .error p.lead {text-align: center;}";
    const styles = ["/wwwroot/css/error.min.css"];
    
    return (
        <html>
            <LayoutHead {...props} css={styles}>
                <meta name="robots" content="noindex, nofollow" />
                <style dangerouslySetInnerHTML={{__html: css}} />
            </LayoutHead>
            <body className="minimal">
                <main id="error">
                    <h1 className="logo">
                        <a href="/">
                            {props.appName} 
                        </a>
                    </h1>
                    <div className="error">
                        <h2>
                            Oops!
                        </h2>
                        <h3>{props.errorType}.</h3>
                        <a className="back" href="/" style={{"color":"#fff", "textDecoration":"underline"}}>Click here to go back.</a>
                    </div>
                </main>
            </body>
        </html>
    )
}