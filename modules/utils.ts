/// <reference path="./../typings/index.d.ts" />

import {Request} from "hapi";

export function GetRequestUrl(req: Request)
{
    return {
        hostname: req.info.hostname,
        path: req.url.path,
        protocol: req.headers['x-forwarded-proto'] || req.connection.info.protocol
    };
}