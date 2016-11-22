declare module "fuselage"
{
    import { Schema } from "joi";
    import { Request, Response, NextFunction, Express } from "express";

    export interface BlogPostSummary {
        title: string;

        description: string;

        url: string;

        filename: string;

        author: string;

        author_url: string;

        author_description: string;
    }

    export interface BlogPost extends BlogPostSummary {
        content: string;
    }

    export interface PostContent {
        filename: string;

        parsedContent: string;
    }

    //#region Routing

    export interface RegisteredRoute {
        sitemap: boolean;
        path: string;
    }

    export interface RouterRequest extends Request {
        validatedBody?: any;
        validatedQuery?: any;
        validatedParams?: any;
        domainWithProtocol: string;
        app: Express & { registeredRoutes: RegisteredRoute[] }
    }

    export interface RouterResponse extends Response {
        
    }

    export type RouteHandler = (req: RouterRequest, res: RouterResponse, next: NextFunction) => void | any;

    export interface RouterFunctionConfig {
        method: "get" | "post" | "put" | "delete" | "options" | "head",
        path: string,
        handler: RouteHandler,
        bodyValidation?: Schema,
        queryValidation?: Schema,
        paramValidation?: Schema,
        /**
         * Whether this route should be included in a sitemap. Should be set to false for any routes with a parameter.
         */
        sitemap?: boolean;
    }

    export type RouterFunction = (config: RouterFunctionConfig) => void;

    //#endregion
}