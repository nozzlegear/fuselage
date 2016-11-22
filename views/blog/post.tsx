import * as React from "react";
import { BlogPost } from "fuselage";
import Layout, { LayoutProps } from "../layout";
import { BLOG_INDEX_AT_HOME } from "../../modules/constants";

namespace BlogPostPage {
    export interface IProps extends LayoutProps {
        post: BlogPost;
        title: string;
        metaDescription: string;
    }
}

function BlogPostPage(props: BlogPostPage.IProps) {
    const post = props.post;
    const scripts = [
        "/wwwroot/vendor/highlightjs/index.min.js",
        "/wwwroot/js/blog/blog-post.js"
    ];
    const css = [
        "/wwwroot/vendor/highlightjs/index.min.css",
        "/wwwroot/css/post.css",
    ];

    const shareUrl = props.requestUrl;

    const share = (
        <div className="share">
            <h4>Share this post</h4>
            <a className="icon-twitter" href={`https://twitter.com/share?text=${`${encodeURIComponent(props.post.title)}`}&url=${shareUrl}`}>
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
                    {`by ${post.author}`}
                </h4>
                <article className="post" dangerouslySetInnerHTML={{ __html: props.post.content }} />
                <div className="post-footer">
                    <div className="author">
                        <h4>{post.author}</h4>
                        <p>
                            {post.author_description}
                        </p>
                    </div>
                    {share}
                </div>
                <div className="back">
                    <a href={BLOG_INDEX_AT_HOME ? "/" : "/blog"}>Click here to head back to the blog.</a>
                </div>
            </section>
        </Layout>
    )
}

// Any view that gets directly rendered must be the file's only export.
export = BlogPostPage; 