/// <reference path="./../../typings/index.d.ts" />

import * as React from "react";
import {map, uniqueId} from "lodash";
import Layout, {LayoutProps} from "../layout";
import {BlogPostSummary, FuselageConfig} from "fuselage";

export interface IProps extends LayoutProps
{
    posts: BlogPostSummary[];    
    
    currentPage: number;
    
    totalPages: number;
}

export default function BlogIndex(props: IProps & FuselageConfig) 
{
    const showNewerButton = (props.currentPage - 1) > 0;
    const showOlderButton = (props.currentPage + 1) <= props.totalPages;
    const css = ["/wwwroot/css/post.min.css", "/wwwroot/css/github-syntax-highlight.min.css"];
    
    const posts = map(props.posts || [], post => (
        <article key={uniqueId()} className="post-excerpt">
            <span className="post-meta">
                by {props.authorName}
            </span>
            <h2 className="post-title excerpt-title">
                <a href={`/blog/${post.url}`}>
                    {post.title}
                </a>
            </h2>
            <p>{post.description}</p>
        </article>
    ));
    
    return (
        <Layout {...props} css={css} customHeroTitle={props.blogIndexHeader}>
            <section className="page-main" id="blog-index">
                {posts}
                <div className="pagination">
                    <div className="left">
                        {
                            !showOlderButton ? null :
                            
                            <a className="btn btn-default" href={`/blog/?page=${props.currentPage + 1}`}>
                                <i className="fa fa-long-arrow-left color" />
                                {" Older posts"}
                            </a>
                        }
                    </div>
                    <div className="middle">
                        {`Page ${props.currentPage} of ${props.totalPages}`}
                    </div>
                    <div className="right">
                        { 
                            !showNewerButton ? null :
                            
                            <a className="btn btn-default" href={`/blog/?page=${props.currentPage - 1}`}>
                                {"Newer Posts "}
                                <i className="fa fa-long-arrow-right color" />
                            </a>
                        }
                    </div>
                </div>
            </section>
        </Layout>
    );
}