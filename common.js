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

export async function formatOrderData(data) {
  try {
    let ordersData = [];
    if (data && data.orders) {
      (data.orders || []).forEach((el) => {
        let formattedData = {};
        formattedData["total"] = el.total_price;
        formattedData["paymentStatus"] = el.financial_status;
        formattedData["orderNumber"] = el.order_number;
        if (el.customer) {
          formattedData[
            "customer"
          ] = `${el.customer.first_name} ${el.customer.last_name}`;
          formattedData["created"] = el.customer.created_at
            .slice(0, 19)
            .replace("T", " ");
        } else {
          formattedData["customer"] = "Unknown User";
          formattedData["created"] = el.created_at
            .slice(0, 19)
            .replace("T", " ");
        }
        formattedData["items"] = el.line_items.length;
        let itemDetails = "";
        (el.line_items || []).forEach((item) => {
          itemDetails = itemDetails + `${item.name} `;
        });
        formattedData["itemDetails"] = itemDetails;

        ordersData.push(formattedData);
      });
    }

    return ordersData;
  } catch (error) {
    console.log(error);
  }
}
