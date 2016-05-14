/// <reference path="./../../typings/main.d.ts" />

import * as React from "react";
import {map, uniqueId} from "lodash";
import {BlogPostSummary} from "fuselage";
import Layout, {LayoutProps} from "../layout";

export interface IProps extends LayoutProps
{
    posts: BlogPostSummary[];    
    
    currentPage: number;
    
    totalPages: number;
}

export default function BlogIndex(props: IProps) 
{
    const showNewerButton = (props.currentPage - 1) > 0;
    const showOlderButton = (props.currentPage + 1) <= props.totalPages;
    const css = ["/wwwroot/css/post/post.min.css"];
    
    const posts = map(props.posts || [], post => (
        <div key={uniqueId()} className="post">
            <div className="post-header">
                <span className="post-meta">
                    by {"Joshua Harms"}
                </span>
                <h2 className="post-title">
                    <a href={`/blog/${post.url}`}>
                        {post.title}
                    </a>
                </h2>
            </div>
            <div className="post-excerpt">
                <p>{post.description}</p>
            </div>
        </div>
    ));
    
    return (
        <Layout {...props} css={css}>
            <main id="blog-index">
                <div id="splash" className="bg checkered color-darkblue">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12 text-center">
                                <h1>
                                    {"Maecenas quis erat id ipsum bibendum mattis at in ante."}
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="section white">
                    <div className="container long-form">
                        <div className="row">
                            <div className="col-md-10 col-md-offset-1">
                                {posts}
                                <div className="pagination">
                                    <div className="row">
                                        <div className="col-xs-4">
                                            {
                                                !showOlderButton ? null :
                                                
                                                <a className="btn btn-default" href={`/blog/?page=${props.currentPage + 1}`}>
                                                    <i className="fa fa-long-arrow-left color" />
                                                    {" Older posts"}
                                                </a>
                                            }
                                        </div>
                                        <div className="col-xs-4 page-number">
                                            <span>{`Page ${props.currentPage} of ${props.totalPages}`}</span>
                                        </div>
                                        <div className="col-xs-4 text-right">
                                            { 
                                                !showNewerButton ? null :
                                                
                                                <a className="btn btn-default" href={`/blog/?page=${props.currentPage - 1}`}>
                                                    {"Newer Posts "}
                                                    <i className="fa fa-long-arrow-right color" />
                                                </a>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </Layout>
    );
}