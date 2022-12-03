import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql
  .createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  })
  .promise();

export async function getOrders() {
  const [rows] = await pool.query("SELECT * FROM orders");
  return rows;
}

// const orders = await getOrders();
// console.log("orders : ", orders);

export async function getOrder(orderNumber) {
  const [rows] = await pool.query(
    `
    SELECT * FROM orders WHERE order_number = ?`,
    [orderNumber]
  );
  return rows[0];
}

// use for showing newly added record data as repose body
export async function getOrderById(id) {
  const [rows] = await pool.query(
    `
        SELECT * FROM orders WHERE id = ?`,
    [id]
  );
  return rows[0];
}

// const order = await getOrder(2001);
// console.log("searched order : ", order);

export async function createOrder(args) {
  const {
    orderNumber,
    date,
    customer,
    total,
    items,
    paymentStatus,
    itemCount,
  } = args;
  const [result] = await pool.query(
    `
    INSERT INTO orders (order_number, date, customer, total, items, payment_status, item_count)
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [orderNumber, date, customer, total, items, paymentStatus, itemCount]
  );

  return result;
}

// let body = {
//   orderNumber: 2003,
//   date: "2022-12-02 09:57:23",
//   customer: "Nileena",
//   total: "Rs 11201",
//   items: "White Levi Jean - M, Green Sweater - M",
//   paymentStatus: "paid",
//   itemCount: 2,
// };

// const created = await createOrder(body);
// console.log("cerated : ", created);
