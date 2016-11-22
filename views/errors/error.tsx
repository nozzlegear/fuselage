import * as React from "react";
import LayoutHead from "../head";
import { LayoutProps } from "../layout";
import { APP_NAME } from "../../modules/constants";

namespace ErrorPage {
    export interface IProps {
        errorType: string;

        message: string;

        statusCode: number;
    }
}

function ErrorPage(props: ErrorPage.IProps) {
    const styles = ["/wwwroot/css/error.css"];

    return (
        <html>
            <LayoutHead title={props.errorType} css={styles} noIndexNoFollow={true} />
            <body className="minimal">
                <main id="error">
                    <h1 className="logo">
                        <a href="/">
                            {APP_NAME}
                        </a>
                    </h1>
                    <div className="error">
                        <h2>
                            Oops!
                        </h2>
                        <h3>{props.errorType}.</h3>
                        <a className="back" href="/" style={{ "color": "#fff", "textDecoration": "underline" }}>Click here to go back.</a>
                    </div>
                </main>
            </body>
        </html>
    )
}

// Any view that gets directly rendered must be the file's only export.
export = ErrorPage;