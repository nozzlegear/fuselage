import { resolve } from "path";

// NODE_ENV is injected by webpack for the browser client.
declare const NODE_ENV: string;

const env = process && process.env || {};
let isBrowser = true;

if (typeof process === 'object' && process + '' === '[object process]') {
    isBrowser = false;
}

export const BIN_ROOT = resolve(__dirname, "../");

export const APP_ROOT = resolve(__dirname, "../../");

export const ISLIVE = env.NODE_ENV === "production" || (isBrowser && NODE_ENV === "production");

export const APP_NAME = env.GEARWORKS_APP_NAME || env.APP_NAME || "Fuselage";

/**
 * Whether the blog index should show up at / (home) instead of /blog.
 */
export const BLOG_INDEX_AT_HOME = false;

/**
 * App's theme color.
 */
export const THEME_COLOR = "#256792";

/**
 * The title of your blog.
 */
export const BLOG_TITLE = `${APP_NAME} Blog`;
