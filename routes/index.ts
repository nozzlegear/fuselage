/// <reference path="./../typings/main.d.ts" />

import {registerRoute as blogRoutes} from "./blog";
import {registerRoute as homeRoutes} from "./home";

export const RoutesToRegister = [
    blogRoutes,
    homeRoutes
];