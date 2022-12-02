import request from "request";

export async function getShopifyOrderDetails() {
  const options = {
    method: "GET",
    url: `https://${process.env.API_KEY}:${process.env.ADMIN_API}@${process.env.SHOP}/admin/api/2022-10/orders.json`,
    headers: {
      "Content-Type": "application/json",
    },
  };
  return new Promise((resolve, reject) => {
    request(options, (error, response) => {
      if (!error) {
        let responseBody = response.body;
        responseBody = JSON.parse(responseBody);
        resolve(responseBody);
      } else {
        reject({
          error: {
            statusCode: 500,
            body: { error: "Something went wrong with shopify server" },
          },
        });
      }
    });
  });
}

export async function getShopifyProductDetails() {
  const options = {
    method: "GET",
    url: `https://${process.env.API_KEY}:${process.env.ADMIN_API}@${process.env.SHOP}/admin/api/2022-10/product.json`,
    headers: {
      "Content-Type": "application/json",
    },
  };
  return new Promise((resolve, reject) => {
    request(options, (error, response) => {
      if (!error) {
        let responseBody = response.body;
        responseBody = JSON.parse(responseBody);
        resolve(responseBody);
      } else {
        reject({
          error: {
            statusCode: 500,
            body: { error: "Something went wrong with shopify server" },
          },
        });
      }
    });
  });
}
