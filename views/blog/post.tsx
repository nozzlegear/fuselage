/// <reference path="./../../typings/index.d.ts" />

import * as React from "react";
import {BlogPost} from "fuselage";
import Layout, {LayoutProps} from "../layout";
import {FuselageConfig} from "fuselage";

export interface IProps extends LayoutProps
{
    post: BlogPost;
    requestUrl: {
        hostname: string,
        protocol: string;
        path: string;
    }
}

export default function BlogPostPage(props: IProps & FuselageConfig)
{
    const scripts = [
        "/wwwroot/js/blog/blog-post.min.js"
    ];
    const css = [
        "/wwwroot/css/post.min.css",
    ];
    
    const shareUrl = `${props.requestUrl.protocol}://${props.requestUrl.hostname}/blog/${props.post.url}`;

    const share = (
        <div className="share">
            <h4>Share this post</h4>
            <a className="icon-twitter" href={`https://twitter.com/share?text=${`${encodeURIComponent(props.post.title)}${props.authorTwitterUsername ? ` - via @${props.authorTwitterUsername} -` : ""}`}&url=${shareUrl}`}>
                <i className="fa fa-twitter-square" />
            </a>
            <a className="icon-facebook" href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}>
                <i className="fa fa-facebook-square" />
            </a>
            <a className="icon-google-plus" href={`https://plus.google.com/share?url=${encodeURIComponent(shareUrl)}`}>
                <i className="fa fa-google-plus-square" />
            </a>
        </div>
    );
    
    return (
        <Layout {...props} css={css} scripts={scripts}>
            <section className="page-main" id="blog-post">
                <h4 className="post-meta">
                    {`by ${props.authorName}`}
                </h4>
                <article className="post" dangerouslySetInnerHTML={{__html: props.post.content}} />
                <div className="post-footer">
                    <div className="author">
                        <h4>{props.authorName}</h4>
                        <p>
                            {props.authorDescription}
                        </p>
                    </div>
                    {share}
                </div>
                <div className="back">
                    <a href={props.blogIndexAtHome ? "/" : "/blog"}>Click here to head back to the blog.</a>
                </div>
            </section>
        </Layout>
    )
}