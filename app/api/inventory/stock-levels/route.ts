import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const warehouseId = searchParams.get("warehouse_id")
    const productId = searchParams.get("product_id")

    let query = `
      SELECT 
        sl.*,
        p.name as product_name,
        p.product_code,
        p.unit,
        p.critical_stock,
        w.name as warehouse_name,
        CASE 
          WHEN sl.quantity <= p.critical_stock THEN 'Kritik'
          WHEN sl.quantity <= p.critical_stock * 1.5 THEN 'Düşük'
          ELSE 'Normal'
        END as stock_status
      FROM stock_levels sl
      JOIN products p ON sl.product_id = p.id
      JOIN warehouses w ON sl.warehouse_id = w.id
      WHERE p.status = 'Aktif'
    `

    const params = []

    if (warehouseId) {
      query += " AND sl.warehouse_id = ?"
      params.push(warehouseId)
    }

    if (productId) {
      query += " AND sl.product_id = ?"
      params.push(productId)
    }

    query += " ORDER BY p.name, w.name"

    const stockLevels = await executeQuery(query, params)
    return NextResponse.json(stockLevels)
  } catch (error) {
    console.error("Error fetching stock levels:", error)
    return NextResponse.json({ error: "Failed to fetch stock levels" }, { status: 500 })
  }
}
