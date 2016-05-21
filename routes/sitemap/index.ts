/// <reference path="./../../typings/index.d.ts" />

import * as sitemap from "sitemap";
import {getBlogIndex} from "./../blog";
import {IReply, Request, IRoute} from "hapi";
import {FuselageServer as Server} from "fuselage";
import {GetRequestUrl} from "./../../modules/utils";
import {filter, map, isArray, every as all} from "lodash";

export function registerRoute(server: Server)
{
    server.route({
        method: "GET",
        path: "/sitemap.xml",
        handler: (request, reply) => reply.redirect("/sitemap").permanent(true),
        config: {
            notes: "no-sitemap"
        }
    });
    
    server.route({
        method: "GET",
        path: "/sitemap",
        handler: {
            async: async (request, reply) => await getSitemap(server, request, reply)
        },  
        config: {
            notes: ["no-sitemap"] 
        }
    })
}

export async function getSitemap(server: Server, request: Request, reply: IReply)
{
    const routeTable: IRoute[] = (server.connections[0] as any).table();
    const filteredRoutes = filter(routeTable, (route: IRoute & {params: any[]}) => 
    {
        const notes = route.settings.notes;
        
        //Filter out any routes with params or no-sitemap tags.
        return route.params.length === 0 && (isArray(notes) ? all(notes, note => note !== "no-sitemap") : notes !== "no-sitemap");
    });
    const urls = map(filteredRoutes, route =>
    {
        let url: sitemap.ISitemapUrl = {
            url: route.path,
            changefreq: "weekly"
        };
        
        return url;
    }).concat(map(server.app.posts, post => {
        let url: sitemap.ISitemapUrl = {
            url: `blog/${post.url}`,
            changefreq: "weekly"
        };
        
        return url;
    }));
    const sm = sitemap.createSitemap({
        hostname: GetRequestUrl(request).protocolAndHost,
        urls: urls 
    });;
    
    return reply(sm.toString()).type("text/xml");
}