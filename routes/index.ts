/// <reference path="./../typings/main.d.ts" />

import {registerRoute as blogRoutes} from "./blog";
import {registerRoute as homeRoutes} from "./home";
import {registerRoute as wwwrootRoutes} from "./wwwroot";

export const RoutesToRegister = [
    blogRoutes,
    homeRoutes,
    wwwrootRoutes
];