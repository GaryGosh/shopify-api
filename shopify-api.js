const express = require("express");
const app = express();
const http = require("http");

const Shopify = require("@shopify/shopify-api").Shopify;
const ApiVersion = require("@shopify/shopify-api").ApiVersion;

require("dotenv").config();

const { API_KEY, API_SECRET_KEY, SCOPES, SHOP, HOST, HOST_SCHEME } =
  process.env;

Shopify.Context.initialize({
  API_KEY,
  API_SECRET_KEY,
  SCOPES: [SCOPES],
  HOST_NAME: HOST.replace(/https?:\/\//, ""),
  HOST_SCHEME,
  IS_EMBEDDED_APP: false,
  API_VERSION: ApiVersion.July22,
});

const ACTIVE_SHOPIFY_SHOPS = {};

const PORT = process.env.PORT || 3000;

app.get("/", async (req, res) => {
  if (ACTIVE_SHOPIFY_SHOPS[SHOP] === undefined) {
    res.redirect("/auth/shopify");
  } else {
    res.send("<html><body><p>Your Node instance is running.</p></body></html>");
  }
});

app.get("/auth/shopify", async (req, res) => {
  let authorizedRoute = await Shopify.Auth.beginAuth(
    req,
    res,
    SHOP,
    "/auth/shopify/callback",
    false
  );
  console.log("authorizedRoute : ", authorizedRoute);
  return res.redirect(authorizedRoute);
});

app.get("/auth/shopify/callback", async (req, res) => {
  try {
    const client_session = await Shopify.Auth.validateAuthCallback(
      req,
      res,
      req.query
    );
    console.log("client session : ", client_session);
    ACTIVE_SHOPIFY_SHOPS[SHOP] = client_session.scope;
    console.log("client_session token ", client_session.accessToken);
  } catch (err) {
    console.error(err);
    res.send("<html><body><p>${JSON.stringify(eek)}</p></body></html>");
  }
  return res.redirect("/auth/shopify/success");
});

app.get("/auth/shopify/success", async (req, res) => {
  res.send(
    "<html><body><p>You have successfully authenticated and are back at your app.</p></body></html>"
  );
});

const httpServer = http.createServer(app);

httpServer.listen(PORT, () =>
  console.log(`App is listening on PORT : ${PORT}`)
);

// Get API call
// https://{API_KEY}:{ADMIN_API}@{SHOP}/admin/api/2022-10/orders.json
// URL : https://7fd6336abf60b6b04e55afe4bd791258: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@cloud9stores.myshopify.com/admin/api/2022-10/orders.json
