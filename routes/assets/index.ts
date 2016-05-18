/// <reference path="./../../typings/main.d.ts" />

import {Server} from "hapi";
import * as path from "path";

export function registerRoute(server: Server)
{
    server.route({
        method: "GET",
        path: "/wwwroot/{path*}",
        handler: (request, reply) =>
        {
            return reply.file(path.resolve(server.app.rootDir, "../", "wwwroot", request.params["path"]));
        }
    });
    
    server.route({
        method: "GET",
        path: "/images/{path*}",
        handler: (request, reply) =>
        {
            return reply.file(path.resolve(server.app.rootDir, "../", "images", request.params["path"]));
        }
    });
}