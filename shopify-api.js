import express from "express";
import http from "http";
import dotenv from "dotenv";
// import { Shopify, ApiVersion } from "@shopify/shopify-api";

import {
  getOrders,
  getOrder,
  createOrder,
  getOrderById,
  testConnection,
} from "./database.js";
import {
  formatFreshOrderData,
  formatOrderData,
  getShopifyOrderDetails,
} from "./common.js";

const app = express();
dotenv.config();

app.use(express.json());

// Can be used for payload validation
const requiredParamsToCreateOrder = [
  "orderNumber",
  "date",
  "customer",
  "total",
  "items",
  "paymentStatus",
  "itemCount",
];

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  console.log("total awesome !");
  res.send("Welcome to shopify backend !");
});

app.get("/test", async (req, res) => {
  let result = await testConnection();
  console.log("result : ", result);
  res.send(result);
});

app.get("/shopify/orders/fetch/orders-from-shopify", async (req, res) => {
  try {
    let orderDataResposne = await getShopifyOrderDetails();
    let orderData = await formatOrderData(orderDataResposne);

    let result = [];

    for (let i = 0; i < orderData.length; i++) {
      let response = await createOrder(orderData[i]);
      result.push(response);
    }

    res.send(result);
  } catch (error) {
    throw error;
  }
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

app.post("/shopify/webhook/order-creation", async (req, res) => {
  // console.log("payload : ", req.body);
  let payload = {};
  payload = req.body;

  let orderData = await formatFreshOrderData(payload);
  // console.log("orders data formtatted : ", orderData);
  let result = [];
  for (let i = 0; i < orderData.length; i++) {
    let response = await createOrder(orderData[i]);
    result.push(response);
  }

  let newItemId = result[0].insertId;
  res.send(getOrderById(newItemId));
  // res.send("Shopify new order request has received and entry has been cerated in the record");
});

const httpServer = http.createServer(app);

httpServer.listen(PORT, () =>
  console.log(`App is listening on PORT : ${PORT}`)
);

// shopify code that can be used later

// const { API_KEY, API_SECRET_KEY, SCOPES, SHOP, HOST, HOST_SCHEME } = process.env;

// Shopify.Context.initialize({
//   API_KEY,
//   API_SECRET_KEY,
//   SCOPES: [SCOPES],
//   HOST_NAME: HOST.replace(/https?:\/\//, ""),
//   HOST_SCHEME,
//   IS_EMBEDDED_APP: false,
//   API_VERSION: ApiVersion.July22,
// });

// const ACTIVE_SHOPIFY_SHOPS = {};

// app.get("/", async (req, res) => {
//   if (ACTIVE_SHOPIFY_SHOPS[SHOP] === undefined) {
//     res.redirect("/auth/shopify");
//   } else {
//     res.send("<html><body><p>Your Node instance is running.</p></body></html>");
//   }
// });

// app.get("/auth/shopify", async (req, res) => {
//   let authorizedRoute = await Shopify.Auth.beginAuth(
//     req,
//     res,
//     SHOP,
//     "/auth/shopify/callback",
//     false
//   );
//   console.log("authorizedRoute : ", authorizedRoute);
//   return res.redirect(authorizedRoute);
// });

// app.get("/auth/shopify/callback", async (req, res) => {
//   try {
//     const client_session = await Shopify.Auth.validateAuthCallback(
//       req,
//       res,
//       req.query
//     );
//     console.log("client session : ", client_session);
//     ACTIVE_SHOPIFY_SHOPS[SHOP] = client_session.scope;
//     console.log("client_session token ", client_session.accessToken);
//   } catch (err) {
//     console.error(err);
//     res.send("<html><body><p>${JSON.stringify(eek)}</p></body></html>");
//   }
//   return res.redirect("/auth/shopify/success");
// });

// app.get("/auth/shopify/success", async (req, res) => {
//   res.send(
//     "<html><body><p>You have successfully authenticated and are back at your app.</p></body></html>"
//   );
// });
