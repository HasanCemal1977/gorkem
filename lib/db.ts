import mysql from "mysql"
import { promisify } from "util"

// Create connection pool
const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "construction_management",
  port: Number.parseInt(process.env.DB_PORT || "3306"),
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true,
  charset: "utf8mb4",
})

// Promisify pool.query
const query = promisify(pool.query).bind(pool)

export async function executeQuery(sql: string, params: any[] = []): Promise<any> {
  try {
    console.log("Executing query:", sql, "with params:", params)
    const results = await query(sql, params)
    console.log("Query results:", results)
    return results
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

export default pool
