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
    
    return (
        <html>
            <LayoutHead {...props}>
                <meta name="robots" content="noindex, nofollow" />
                <style dangerouslySetInnerHTML={{__html: css}} />
            </LayoutHead>
            <body className="minimal">
                <main id="body">
                    <div className="container">
                        <div className="row header">
                            <div className="col-md-12">
                                <div className="logo">
                                    <a href="/">
                                        {"APP NAME"}
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-8 col-md-offset-2 error">
                                <h2>
                                    Oops!
                                </h2>
                                <h3>{props.errorType}.</h3>
                                <p className="lead">
                                    <a href="/" style={{"color":"#fff", "textDecoration":"underline"}}>Click here to go back.</a>
                                </p>
                            </div>
                        </div>
                    </div>
                </main>
            </body>
        </html>
    )
}