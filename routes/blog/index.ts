import * as fs from "fs";
import * as boom from "boom";
import { resolve } from "path";
import * as md from "markdown-it";
import * as bluebird from "bluebird";
import { clone, find, merge, some } from "lodash";
import { IProps as BlogPostProps } from "./../../views/blog/post";
import { getCacheValue, setCacheValue } from "../../modules/cache";
import { IProps as BlogIndexProps } from "./../../views/blog/index";
import { BLOG_INDEX_AT_HOME, BLOG_TITLE, APP_ROOT } from "../../modules/constants";
import { BlogPostSummary, BlogPost, PostContent, RouterFunction, RouteHandler } from "fuselage";
export const summaries: BlogPostSummary[] = require(resolve(APP_ROOT, "./posts/index.json"));

const readFile = bluebird.promisify(fs.readFile);

export default function registerRoutes(route: RouterFunction) {
    route({
        method: "get",
        path: "/blog",
        sitemap: true,
        handler: !BLOG_INDEX_AT_HOME ? getBlogIndex : async (req, res, next) => {
            res.redirect(302 /* Temporary redirect */, "/");

            return next();
        }
    })

    route({
        method: "get",
        path: "/blog/:url",
        handler: async function (req, res, next) {
            const url: string = req.params["url"] || "";
            const postSummary = summaries.find(s => s.url.toLowerCase() === url.toLowerCase());

            if (!postSummary) {
                return next(boom.notFound("Page not found."));
            }

            const cachedContent = await getCacheValue<PostContent>("posts", postSummary.filename);
            let postContent: PostContent = cachedContent && cachedContent.item || undefined;

            if (!postContent) {
                try {
                    const fileContent = await readFile(resolve(APP_ROOT, "./posts/markdown", postSummary.filename));

                    postContent = {
                        filename: postSummary.filename,
                        parsedContent: new md("commonmark").render(fileContent.toString("utf8")),
                    };
                }
                catch (e) {
                    let error: Error = e;

                    console.error(error);

                    const is404 = error.message.indexOf("no such file or directory") > -1;

                    return next(boom.wrap(error, is404 ? 404 : 500, error.message));
                }

                //Preserve the post content
                await setCacheValue("posts", postSummary.filename, postContent);
            }

            const post: BlogPost = Object.assign({}, {content: postContent.parsedContent}, postSummary);
            const props: BlogPostProps = {
                post: post,
                title: post.title,
                metaDescription: post.description,
                requestUrl: req.url
            };

            res.render("blog/post", props);

            return next();
        }
    })
}

export const getBlogIndex: RouteHandler = async (req, res, next) => {
    const postsPerPage = 5;
    const totalPosts = summaries.length;
    const currentPage = parseInt(req.query.page) || 1;
    const pagePosts = clone(summaries).splice(postsPerPage * (currentPage - 1), postsPerPage);
    const totalPages = totalPosts % postsPerPage > 0 ? Math.floor(totalPosts / postsPerPage) + 1 : totalPosts / postsPerPage;

    const props: BlogIndexProps = {
        title: BLOG_TITLE,
        currentPage: currentPage,
        totalPages: totalPages,
        posts: pagePosts,
        metaDescription: "Blog Posts",
        requestUrl: req.url,
    };

    res.render("blog/index", props);

    return next();
}