/// <reference path="./../../typings/main.d.ts" />

import * as React from "react";
import {BlogPost} from "fuselage";
import Layout, {LayoutProps} from "../layout";

export interface IProps extends LayoutProps
{
    post: BlogPost;
}

export default function BlogPostPage(props: IProps)
{
    const scripts = [
        "/wwwroot/js/blog/blog-post.min.js"
    ];
    const css = [
        "/wwwroot/bundles/blog-post.min.css"
    ];
    
    const shareUrl = `https://DOMAIN.com/blog/${props.post.url}`;

    const share = (
        <div className="share">
            <h4>Share this post</h4>
            <a className="icon-twitter" href={`https://twitter.com/share?text=${`${encodeURIComponent(props.post.title)} - via @TWITTERHANDLE - `}&url=${shareUrl}`}>
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
            <main id="blog-post">
                <div className="bg tops-blooby">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-10 col-md-offset-1 text-center">
                                <h1 className="page-title">
                                    {props.post.title}
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="section white">
                    <div className="container long-form">
                        <div className="row">
                            <div className="col-md-10 col-md-offset-1">
                                <div className="post">
                                    <div className="post-header">
                                        <span className="post-meta">
                                            {"by AUTHOR NAME"}
                                        </span>
                                    </div>
                                    <div className="post-excerpt">
                                        <article dangerouslySetInnerHTML={{__html: props.post.content}} />
                                    </div>
                                    <div className="post-footer">
                                        <div className="row">
                                            <div className="col-md-7">
                                                <div className="author">
                                                    <h4>{"AUTHOR NAME"}</h4>
                                                    <p>
                                                        {'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec at erat maximus turpis mollis vestibulum.'}
                                                    </p>
                                                    <p>
                                                        {"Phasellus velit arcu, accumsan pretium gravida vitae, dictum faucibus sem. "}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="col-md-5">
                                                {share}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <a href="/blog">Click here to head back to the blog.</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </Layout>
    )
}