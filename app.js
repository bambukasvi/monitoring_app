import { Application } from "./deps.js";
import { router } from './routes/routes.js'
import * as middleware from './middlewares/middlewares.js'
import { viewEngine, engineFactory, adapterFactory } from "./deps.js";
import { Session } from './deps.js';
import { oakCors } from "./deps.js";

let port = 7777
if (Deno.args.length > 0) {
    const lastArgument = Deno.args[Deno.args.length - 1]
    port = Number(lastArgument)
}

const app = new Application();

const ejsEngine = engineFactory.getEjsEngine();
const oakAdapter = adapterFactory.getOakAdapter();

app.use(viewEngine(oakAdapter, ejsEngine, {
    viewRoot: "./views"
}));

const session = new Session({ framework: "oak" });
await session.init()

app.use(session.use()(session))
app.use(oakCors())

app.use(middleware.errorMiddleware);
app.use(middleware.requestTimingMiddleware);
app.use(middleware.serveStaticFilesMiddleware);
app.use(middleware.checkAuthenticationMiddleware);

app.use(router.routes());


if (!Deno.env.get('TEST_ENVIRONMENT')) {
    app.listen({ port });
}
 
  
    
export default app;