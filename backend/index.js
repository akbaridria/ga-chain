const app = require("express")();
const rateLimit = require("express-rate-limit");
const bq = require("./bq");

const apiLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: 10000,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(apiLimiter);

app.get("/query", async (req, res) => {
  const result = await bq.runQuery(req.query.query);
  res.send(result);
});

exports.queryBq = app;
