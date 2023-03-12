const app = require("express")();
const rateLimit = require("express-rate-limit");
const bq = require("./bq");
const cors = require("cors");
const crypto = require("crypto");
const fetch = require("node-fetch");

const urlCheckAccess =
  "https://www.googleapis.com/oauth2/v3/userinfo?access_token=";

const apiLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: function (req) {
    return req.get("token");
  },
});

app.use("/query", apiLimiter);
app.use(cors({ origin: "*" }));

app.get("/query", async (req, res) => {
  let token = req.get("token");
  let query = req.query.query;
  let result = null;
  if (token) {
    const d = await bq.runQueryGC(bq.checkToken(token));
    if (d.length > 0) {
      if (token === d[0].token) {
        if (query) {
          try {
            result = await bq.runQuery(query);
            return res.send({
              error: false,
              message: "success",
              data: result,
            });
          } catch (error) {
            res.status(400);
            return res.send({
              error: true,
              message: error.message,
            });
          }
          // const result = await bq.runQuery(query);
        } else {
          res.status(400);
          return res.send({
            error: true,
            message: "Missing Query",
          });
        }
      }
    }
  } else {
    res.status(400);
    return res.send({
      error: true,
      message: "Missing token",
    });
  }
  res.status(401);
  return res.send({
    error: true,
    message: "Unauthorized! Wrong token.",
  });
});

app.post("/check-session", async (req, res) => {
  let email = "";
  let access_token = "";
  let timestamp = Math.floor(Date.now() / 1000);
  let token = "";

  if (Object.keys(req.body).length > 0) {
    if (req.body.email && req.body.access_token) {
      email = req.body.email;
      access_token = req.body.access_token;
    } else {
      res.status(400);
      return res.send({
        error: true,
        message_error: "Missing payload",
      });
    }
  }

  const d = await bq.runQueryGC(bq.checkUser(email));
  if (d && d.length > 0) {
    token = d[0].token;
    if (d[0].access_token !== access_token) {
      await bq.runQueryGC(bq.updateUser(email, access_token));
    }
  } else {
    token = crypto.randomUUID();
    await bq.runQueryGC(bq.insertUser(timestamp, email, token, access_token));
  }

  return res.send({
    message: "success",
    error: false,
    data: [
      {
        login: true,
        token: token,
      },
    ],
  });
});

app.post("/check-login", async (req, res) => {
  let login = false;
  let token = null;
  if (req.body.email) {
    const d = await bq.runQueryGC(bq.checkUser(req.body.email));
    token = d[0].token;
    const info = await fetch(urlCheckAccess + d[0].access_token).then(
      async (response) => {
        return await response.json();
      }
    );
    login = Object.keys(info).includes("email") ? true : false;
  } else {
    return res.send({
      error: true,
      message: "Missing payload!",
    });
  }

  return res.send({
    message: "success",
    error: false,
    data: [
      {
        login: login,
        token: login ? token : null,
      },
    ],
  });
});

exports.queryBq = app;
