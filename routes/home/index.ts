/// <reference path="./../../typings/main.d.ts" />

import {Server} from "hapi";

export function registerRoute(server: Server)
{
    server.route({
        method: "GET",
        path: "/",
        handler: (request, reply) =>
        {
            // TODO: Read a config setting to determine whether blog index should be displayed at / or /blog
            return reply.redirect("/blog").temporary(true);
        }
    })
}