import * as sitemap from "sitemap";
import { summaries } from "../blog";
import { RouterFunction } from "fuselage";
import inspect from "../../modules/inspect";

export default function registerRoutes(route: RouterFunction) {
    route({
        method: "get",
        path: "/sitemap.xml",
        sitemap: false,
        handler: (req, res, next) => {
            res.redirect(301 /* Permanent redirect */, "/sitemap");

            return next();
        },
    });

    route({
        method: "get",
        path: "/sitemap",
        sitemap: false,
        handler: (req, res, next) => {
            const routes = req.app.registeredRoutes;
            const urls = routes.filter(route => route.sitemap).map(route => {
                let url: sitemap.ISitemapUrl = {
                    url: route.path,
                    changefreq: "weekly"
                };

                return url;
            }).concat(summaries.map(post => {
                let url: sitemap.ISitemapUrl = {
                    url: `blog/${post.url}`,
                    changefreq: "weekly"
                };

                return url;
            }));
            const sm = sitemap.createSitemap({
                hostname: req.domainWithProtocol,
                urls: urls
            });

            res.type("text/xml").send(sm.toString());

            return next();
        },
    })
}