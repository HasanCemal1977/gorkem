import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"

export async function GET() {
  try {
    const query = `
      SELECT 
        p.*,
        pc.name as category_name,
        COALESCE(SUM(sl.quantity), 0) as total_stock,
        CASE 
          WHEN COALESCE(SUM(sl.quantity), 0) <= p.critical_stock THEN 'Kritik'
          WHEN COALESCE(SUM(sl.quantity), 0) <= p.critical_stock * 1.5 THEN 'Düşük'
          ELSE 'Normal'
        END as stock_status
      FROM products p
      LEFT JOIN product_categories pc ON p.category_id = pc.id
      LEFT JOIN stock_levels sl ON p.id = sl.product_id
      WHERE p.status = 'Aktif'
      GROUP BY p.id
      ORDER BY p.name
    `

    const products = await executeQuery(query)
    return NextResponse.json(products)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      product_code,
      barcode,
      name,
      description,
      category_id,
      unit,
      purchase_price,
      sales_price,
      tax_rate,
      critical_stock,
    } = body

    const query = `
      INSERT INTO products (
        product_code, barcode, name, description, category_id, unit,
        purchase_price, sales_price, tax_rate, critical_stock
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `

    const result = await executeQuery(query, [
      product_code,
      barcode,
      name,
      description,
      category_id,
      unit,
      purchase_price,
      sales_price,
      tax_rate,
      critical_stock,
    ])

    return NextResponse.json({
      success: true,
      id: result.insertId,
      message: "Ürün başarıyla eklendi",
    })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
