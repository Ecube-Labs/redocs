const Koa = require("koa");
const Router = require("@koa/router");
const koaStatic = require("koa-static");
const axios = require("axios");

const app = new Koa();
const router = new Router();

const refs = JSON.parse(process.env.DOC_SPECS);

app.use(koaStatic("src/static"));
app.use(router.middleware());

router.get("/server-variables.js", async (ctx) => {
  const specUrls = refs.map((r) => ({
    ...r,
    url: `/api-spec.json?name=${r.name}`,
  }));

  ctx.set("Content-Type", "application/javascript");
  ctx.body = `
const specUrls = ${JSON.stringify(specUrls)};
`;
});

router.get("/api-spec.json", async (ctx) => {
  const ref = refs.find((s) => s.name === ctx.query.name);
  if (!ref) {
    ctx.status = 404;
    return;
  }

  const { data } = await axios.get(ref.url, {
    headers: {
      authorization: "Token ???", // TODO: token
    },
  });
  ctx.set("Content-Type", "application/json");
  ctx.body = data; // like reverse proxy
});

app.listen(process.env.PORT || 3000);
