import express from "express";
import http from "http";
import dotenv from "dotenv";
import { Shopify, ApiVersion } from "@shopify/shopify-api";

import { getOrders, getOrder, createOrder } from "./database.js";
import { getShopifyOrderDetails } from "./common.js";

const app = express();
dotenv.config();

const requiredParamsToCreateOrder = [
  "orderNumber",
  "date",
  "customer",
  "total",
  "items",
  "paymentStatus",
  "itemCount",
];

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

// the orders "variable" can be replaced with "products".
// we can dump this json data by taking only the required key value pairs
// form the table columns required.

app.get("/shopify/orders/fetch/orders-from-shopify", async (req, res) => {
  try {
    let orderDataResposne = await getShopifyOrderDetails();
    res.send(orderDataResposne);
  } catch (error) {}
});

app.get("/shopify/orders/fetch", async (req, res) => {
  try {
    let allOrders = await getOrders();
    res.send(allOrders);
  } catch (error) {
    throw error;
  }
});

app.get("/shopify/order/:id", async (req, res) => {
  try {
    const orderId = req.params.id;
    let order = await getOrder(orderId);
    res.send(order);
  } catch (error) {
    throw error;
  }
});

app.post("/shopify/order-record/create", async (req, res) => {
  const payload = req.body;
});
