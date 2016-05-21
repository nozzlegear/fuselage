/// <reference path="./../../typings/index.d.ts" />

import * as fs from "fs";
import * as boom from "boom";
import * as md from "markdown-it";
import * as bluebird from "bluebird";
import {Request, IReply} from "hapi";
import {resolve as resolvePath} from "path"
import {clone, find, merge, some} from "lodash";
import {GetRequestUrl} from "./../../modules/utils";
import {IProps as BlogPostProps} from "./../../views/blog/post";
import {IProps as BlogIndexProps} from "./../../views/blog/index";
import {BlogPostSummary, BlogPost, PostContent, FuselageServer as Server} from "fuselage";

const readFile = bluebird.promisify(fs.readFile);

export function registerRoute(server: Server)
{
    let indexHandler: any = {
        async: async (request, reply) => await getBlogIndex(server, request, reply)
    }; 
    
    if (server.app.blogIndexAtHome)
    {
        indexHandler = (request, reply: IReply) => reply.redirect("/").temporary(true);
    }
    
    server.route({
        method: "GET",
        path: "/blog",
        handler: indexHandler
    });
    
    server.route({
        method: "GET",
        path: "/blog/{url}",
        handler: {
            async: async (request, reply) => await getBlogPost(server, request, reply)
        }
    });
}

export async function getBlogIndex(server: Server, request: Request, reply: IReply)
{
    const posts: BlogPostSummary[] = server.app.posts;
    
    const postsPerPage = 5;
    const totalPosts = posts.length;
    const currentPage = parseInt(request.query.page) || 1;
    const pagePosts = clone(posts).splice(postsPerPage * (currentPage - 1), postsPerPage);
    const totalPages = totalPosts % postsPerPage > 0 ? Math.floor(totalPosts / postsPerPage) + 1 : totalPosts / postsPerPage; 
    
    const props: BlogIndexProps = {
        title: server.app.blogTitle,
        blogLinkClass: "active",
        currentPage: currentPage,
        totalPages: totalPages,
        posts: pagePosts,
        metaDescription: "Blog Posts",
    };
    
    return reply.view("blog/index.js", props);
}

export async function getBlogPost(server: Server, request: Request, reply: IReply)
{
    const postContents: PostContent[] = server.app.postContents;
    const posts: BlogPostSummary[] = server.app.posts;
    
    const url = request.params["url"] || "";
    const postSummary = find(posts, post => post.url.toLowerCase() === url.toLowerCase());
    
    if (!postSummary)
    {
        return reply(boom.notFound("Page not found."));
    }
    
    let postContent = find(postContents, content => content.filename === postSummary.filename);
    
    if (!postContent)
    {
        try
        {
            const fileContent = await readFile( resolvePath(server.app.rootDir, "../posts/markdown", postSummary.filename));
            
            postContent = {
                filename: postSummary.filename,
                parsedContent: new md("commonmark").render(fileContent.toString("utf8")), 
            };
        }
        catch (e)
        {
            let error: Error = e;
            
            console.error(error);
        
            const is404 = error.message.indexOf("no such file or directory") > -1;
            
            return reply.response(boom.wrap(error, is404 ? 404 : 500, error.message));
        }
        
        //Preserve the post content
        postContents.push(postContent);
    }
    
    const post: BlogPost = merge({content: postContent.parsedContent}, postSummary);
    const props: BlogPostProps = {
        post: post, 
        title: post.title, 
        blogLinkClass: "active",
        metaDescription: post.description,
        requestUrl: GetRequestUrl(request)
    };
    
    return reply.view("blog/post.js", props);
}