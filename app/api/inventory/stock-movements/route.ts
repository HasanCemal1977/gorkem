import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get("limit") || "50"
    const productId = searchParams.get("product_id")
    const warehouseId = searchParams.get("warehouse_id")

    let query = `
      SELECT 
        sm.*,
        p.name as product_name,
        p.product_code,
        p.unit,
        w.name as warehouse_name
      FROM stock_movements sm
      JOIN products p ON sm.product_id = p.id
      JOIN warehouses w ON sm.warehouse_id = w.id
      WHERE 1=1
    `

    const params = []

    if (productId) {
      query += " AND sm.product_id = ?"
      params.push(productId)
    }

    if (warehouseId) {
      query += " AND sm.warehouse_id = ?"
      params.push(warehouseId)
    }

    query += " ORDER BY sm.movement_date DESC, sm.created_at DESC LIMIT ?"
    params.push(Number.parseInt(limit))

    const movements = await executeQuery(query, params)
    return NextResponse.json(movements)
  } catch (error) {
    console.error("Error fetching stock movements:", error)
    return NextResponse.json({ error: "Failed to fetch stock movements" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      product_id,
      warehouse_id,
      movement_type,
      reference_type,
      reference_id,
      quantity,
      unit_price,
      movement_date,
      description,
      user_name,
    } = body

    // Stok hareketi ekle
    const movementQuery = `
      INSERT INTO stock_movements (
        product_id, warehouse_id, movement_type, reference_type, reference_id,
        quantity, unit_price, movement_date, description, user_name
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `

    await executeQuery(movementQuery, [
      product_id,
      warehouse_id,
      movement_type,
      reference_type,
      reference_id,
      quantity,
      unit_price,
      movement_date,
      description,
      user_name,
    ])

    // Stok seviyesini güncelle
    const stockUpdateQuery = `
      INSERT INTO stock_levels (product_id, warehouse_id, quantity)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE 
      quantity = quantity + CASE 
        WHEN ? IN ('Giriş', 'İade') THEN ?
        WHEN ? IN ('Çıkış', 'Fire') THEN -?
        ELSE 0
      END
    `

    await executeQuery(stockUpdateQuery, [
      product_id,
      warehouse_id,
      quantity,
      movement_type,
      quantity,
      movement_type,
      quantity,
    ])

    return NextResponse.json({
      success: true,
      message: "Stok hareketi başarıyla eklendi",
    })
  } catch (error) {
    console.error("Error creating stock movement:", error)
    return NextResponse.json({ error: "Failed to create stock movement" }, { status: 500 })
  }
}
