import { getBlogIndex } from "../blog";
import { RouterFunction, RouteHandler } from "fuselage";
import { BLOG_INDEX_AT_HOME } from "../../modules/constants";

export default function registerRoutes(route: RouterFunction) {
    route({
        method: "get",
        path: "/",
        sitemap: true,
        handler: BLOG_INDEX_AT_HOME ? getBlogIndex : (req, res, next) => {
            res.redirect("/blog", 302 /* Temporary redirect */);

            return next();
        }
    })
}