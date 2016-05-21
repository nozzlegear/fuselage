/// <reference path="../globals/hapi/index.d.ts" />

declare module "fuselage"
{
    import {Server} from "hapi";
    
    export interface BlogPostSummary
    {
        title: string;
        
        description: string;
        
        url: string;
        
        filename: string;
    }

    export interface BlogPost extends BlogPostSummary
    {
        content: string;
    }

    export interface FuselageConfig
    {
        blogTitle: string;
        
        blogIndexHeader: string;
        
        authorName: string;
        
        authorDescription: string;
        
        authorTwitterUsername: string;
        
        appName: string;
        
        /**
         * A CSS color used for the site's top banner.
         */
        themeColor: string;
        
        /**
         * Whether the blog index should be shown at / (true) or /blog (false).
         */
        blogIndexAtHome: boolean;
    }

    export interface PostContent
    {
        filename: string; 
        
        parsedContent: string;
    }
    
    export interface FuselageServer extends Server
    {
        app: { 
            posts: BlogPostSummary[],  
            postContents: PostContent[],
            rootDir: string,
        } & FuselageConfig;
    }
}