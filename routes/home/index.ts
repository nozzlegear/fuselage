/// <reference path="./../../typings/index.d.ts" />

import {IReply} from "hapi";
import {getBlogIndex} from "./../blog";
import {FuselageServer as Server} from "fuselage";

export function registerRoute(server: Server)
{
    let indexHandler: any = (request, reply: IReply) => reply.redirect("/blog").temporary(true);
    
    if (server.app.blogIndexAtHome)
    {
        indexHandler = {
            async: async (request, reply) => await getBlogIndex(server, request, reply)
        };
    }
    
    server.route({
        method: "GET",
        path: "/",
        handler: indexHandler
    })
}