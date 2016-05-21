/// <reference path="./../typings/index.d.ts" />

import {registerRoute as blogRoutes} from "./blog";
import {registerRoute as homeRoutes} from "./home";
import {registerRoute as assetsRoutes} from "./assets";
import {registerRoute as sitemapRoutes} from "./sitemap";

export const RoutesToRegister = [
    blogRoutes,
    homeRoutes,
    assetsRoutes,
    sitemapRoutes
];