import * as path from "path";
import * as http from "http";
import * as https from "https";
import * as express from "express";
import inspect from "./modules/inspect";
import { BlogPostSummary } from "fuselage";
import { BIN_ROOT } from "./modules/constants";
import { BoomError, wrap, notFound } from "boom";
import { IProps as ErrorProps } from "./views/errors/error";
import { json as parseJson, urlencoded as parseUrlEncoded } from "body-parser";

// Server configurations
import configureCache from "./modules/cache";
import configureRoutes from "./routes";

async function startServer(hostname: string, port: number, securePort?: number) {
    const app = express();

    app.use((req, res, next) => {
        res.setHeader("x-powered-by", `Fuselage https://github.com/nozzlegear/fuselage`);

        next();
    });

    // Set up the react view engine
    app.set('views', path.resolve(BIN_ROOT, "./views"));
    app.set('view engine', 'jsx');
    app.engine('jsx', require('express-react-views').createEngine());

    // Any request to the /wwwroot and /images paths should serve static files from those folders.
    app.use("/wwwroot", express.static("wwwroot"));
    app.use("/images", express.static("images"));

    // Let express trust the proxy that may be used on certain hosts (e.g. Azure and other cloud hosts). 
    // Enabling this will replace the `request.protocol` with the protocol that was requested by the end user, 
    // rather than the internal protocol used by the proxy.
    app.enable("trust proxy");

    // Set up request body parsers
    app.use(parseJson());
    app.use(parseUrlEncoded({ extended: true }));

    // Configure the server
    await configureCache();
    await configureRoutes(app);

    // Wildcard route must be set after all other routes are registered
    app.get("*", (req, res, next) => {
        if (res.finished) {
            return;
        }

        throw notFound();
    })

    // Typescript type guard for boom errors
    function isBoomError(err): err is BoomError {
        return err.isBoom;
    }

    // Register an error handler for all routes
    app.use(function (err: Error | BoomError, req: express.Request, res: express.Response, next: Function) {
        const fullError = isBoomError(err) ? err : wrap(err);

        if (fullError.output.statusCode >= 500) {
            inspect(`Error in ${req.url}`, err);
        }

        res.status(fullError.output.statusCode);

        if (!/^\/?api/i.test(req.path)) {
            const props: ErrorProps = {
                statusCode: fullError.output.statusCode,
                errorType: fullError.output.payload.error,
                message: fullError.message,
            };

            res.render("errors/error", props);
        } else {
            res.json(fullError.output.payload);
        }

        return next();
    } as any);
    
    const httpServer = http.createServer(app).listen(port, hostname);
    const httpsServer = (!!securePort && https.createServer(app).listen(securePort, hostname)) || undefined;

    return {
        http: httpServer,
        https: httpServer,
    }
}

const host = process.env.HOST || "127.0.0.1";
const port = process.env.PORT || 3000;
const securePort = process.env.SECURE_PORT || 3001;

//Start the server
startServer(host, port, securePort).then((servers) => {
    console.log(`HTTP and HTTPS servers listening on ${host}:${port} and ${host}:${securePort}.`);
}).catch((err) => {
    inspect("Server configuration error.", err);

    throw err;
});