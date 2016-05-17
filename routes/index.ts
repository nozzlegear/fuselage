/// <reference path="./../typings/main.d.ts" />

import {registerRoute as blogRoutes} from "./blog";
import {registerRoute as homeRoutes} from "./home";
import {registerRoute as assetsRoutes} from "./assets";

export const RoutesToRegister = [
    blogRoutes,
    homeRoutes,
    assetsRoutes
];