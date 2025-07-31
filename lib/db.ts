import mysql from "mysql2/promise"

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "construction_management",
  port: Number.parseInt(process.env.DB_PORT || "3306"),
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
  connectionLimit: 10,
  acquireTimeout: 60000,
  timeout: 60000,
}

const pool = mysql.createPool(dbConfig)

export async function executeQuery(query: string, params: any[] = []) {
  try {
    const [results] = await pool.execute(query, params)
    return results
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

export default pool
