/// <reference path="./typings/main.d.ts" />

import * as Hapi from "hapi";
import * as joi from "joi";
import * as boom from "boom";
import * as path from "path";
import * as util from "util";
import uri = require('jsuri');
import {every as all, clone, find, some, merge, filter, map, isArray, isError} from "lodash";

//Import routes
import {RoutesToRegister} from "./routes";

//Interfaces
import {LayoutProps} from "./views/layout";
import {BlogPostSummary, BlogPost} from "fuselage";
import {IProps as ErrorPageProps} from "./views/errors/error";

//Import the post index
const posts: BlogPostSummary[] = require(path.join(__dirname, "../", "posts/index.json"));

//Other imports
const inert = require("inert"); //Inert gives Hapi static file and directory handling via reply.file and reply.directory.
const vision = require("vision"); //Vision gives Hapi dynamic view rendering.
const yar = require("yar"); //Yar is a cookie management plugin for Hapi.
const reactViewEngine = require("hapi-react-views");
const npmPackage = require(path.join(__dirname, "../", "package.json"));

//Prepare Hapi server
const server = new Hapi.Server();
const config: Hapi.IServerConnectionOptions = {
    port: process.env.PORT || 3000,
    host: process.env.HOST || "localhost",
    router: {
        isCaseSensitive: false,
        stripTrailingSlash: true
    }
};
const connection = server.connection(config);

async function registerPlugins()
{
    await server.register(inert);
    await server.register(vision);
    await server.register({
        register: yar,
        options: {
            storeBlank: false,
            cookieOptions: {
                password: 'REPLACE-THIS-WITH-A-STRONG-32-CHAR-PASSWORD',
                isSecure: true,
                ignoreErrors: true, //tells Hapi that it should not respond with a HTTP 400 error if the session cookie cannot decrypt
                clearInvalid: true  //tells Hapi that if a session cookie is invalid for any reason, to clear it from the browser.
            }
        }
    })
}

async function startServer()
{
    await registerPlugins();
    
    const isLive = process.env.NODE_ENV === "production";
    const defaultViewContext = {
        appName: "Fuselage"
    }
    
    //Set the viewengine to use react as its view engine.
    server.views({
        engines: {
            js: reactViewEngine
        },
        compileOptions:{},
        relativeTo: path.resolve(__dirname),
        path: "views",
        context: defaultViewContext
    });
    
    //Configure the server's app state
    server.app.posts = posts || [];
    server.app.postContents = [];
    server.app.rootDir = __dirname;
    
    //Filter all responses to check if they have an error. If so, render the error page.
    server.ext("onPreResponse", (request, reply) =>
    {
        if (request.response.isBoom || isError(request.response))
        {
            const resp: Boom.BoomError = request.response as any;
            const payload: { error: string, message: string, statusCode: number } = resp.output.payload;
            const props: ErrorPageProps = {
                errorType: payload.error,
                message: payload.message,
                statusCode: payload.statusCode,
                metaDescription: undefined,
                title: payload.error
            };
            
            console.log(`${payload.statusCode} ${payload.error} for ${request.url.pathname}. ${payload.message}.`);
            
            return (reply.view("errors/error.js", props)).code(payload.statusCode);
        }
        
        return reply.continue();
    }); 
    
    //Register all app routes.
    RoutesToRegister.forEach((register) => register(server));
    
    return server.start((error) =>
    {
        if (error)
        {
            throw error;
        }
        
        console.log(`${isLive ? "Live" : "Development"} server running at:`, server.info.uri);
    })
};

//Start the server
startServer().catch((err) =>
{
    console.log("Hapi server registration error.", err);
    
    throw err;
});