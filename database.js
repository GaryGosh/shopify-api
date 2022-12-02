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

async function getOrders() {
  const [rows] = await pool.query("SELECT * FROM orders");
  return rows;
}

// const orders = await getOrders();
// console.log("orders : ", orders);

async function getOrder(orderNumber) {
  const [rows] = await pool.query(
    `
    SELECT * FROM orders WHERE order_number = ?`,
    [orderNumber]
  );
  return rows[0];
}

const order = await getOrder(2001);
console.log("searched order : ", order);

// async function createOrder()
