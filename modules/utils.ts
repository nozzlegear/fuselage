/// <reference path="./../typings/index.d.ts" />

import {Request} from "hapi";

export function GetRequestUrl(req: Request)
{
    let output = {
        hostname: req.info.hostname,
        path: req.url.path,
        protocol: req.headers['x-forwarded-proto'] || req.connection.info.protocol,
        protocolAndHost: undefined
    };
    
    output.protocolAndHost = `${output.protocol}://${output.hostname}`;
    
    return output;
}