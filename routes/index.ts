import * as Bluebird from "bluebird";
import { Schema, validate } from "joi";
import { getCacheValue } from "../modules/cache";
import { badData, unauthorized, forbidden } from "boom";
import { Express, Request, Response, NextFunction } from "express";
import { RouterResponse, RouterFunction, RouterRequest, RegisteredRoute } from "fuselage";

import blogRoutes from "./blog";
import homeRoutes from "./home";
import sitemapRoutes from "./sitemap";

const routeRegisters = [
    blogRoutes,
    homeRoutes,
    sitemapRoutes
];

export default async function registerAllRoutes(app: Express) {
    const registeredRoutes: RegisteredRoute[] = [];

    // A custom routing function that handles authentication and body/query/param validation
    const route: RouterFunction = (config) => {
        app[config.method.toLowerCase()](config.path, async function (req: RouterRequest, res: RouterResponse, next: NextFunction) {
            // Shim the request and response objects with expected properties.
            req.domainWithProtocol = `${req.protocol}://${req.hostname}` + (req.hostname === "localhost" ? ":3000" : "");
            req.app = Object.assign({registeredRoutes}, req.app);

            if (config.bodyValidation) {
                const validation = validate(req.body, config.bodyValidation);

                if (validation.error) {
                    const error = badData(validation.error.message, validation.error.details);

                    return next(error);
                }

                req.validatedBody = validation.value;
            }

            if (config.queryValidation) {
                const validation = validate(req.query, config.queryValidation);

                if (validation.error) {
                    const error = badData(validation.error.message, validation.error.details);

                    return next(error);
                }

                req.validatedQuery = validation.value;
            }

            if (config.paramValidation) {
                const validation = validate(req.params, config.paramValidation);

                if (validation.error) {
                    const error = badData(validation.error.message, validation.error.details);

                    return next(error);
                }

                req.validatedParams = validation.value;
            }

            // Pass control to the route's handler. Handlers can be async, so wrap them in try/catch to handle promise rejections.
            try {
                const handler = config.handler(req, res, next);

                if (handler instanceof Promise) {
                    await handler;
                }

                return;
            } catch (e) {
                return next(e);
            }
        });

        // Log the route registration, which can then be used for e.g. sitemap operations with req.app.registeredRoutes
        registeredRoutes.push({
            path: config.path,
            sitemap: !!config.sitemap
        })
    }

    routeRegisters.forEach(register => register(route));
}