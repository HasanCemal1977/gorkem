import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const query = `
      SELECT 
        p.*,
        pc.name as category_name
      FROM products p
      LEFT JOIN product_categories pc ON p.category_id = pc.id
      WHERE p.id = ?
    `

    const products = await executeQuery(query, [params.id])

    if (!products || products.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(products[0])
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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
      status,
    } = body

    const query = `
      UPDATE products SET
        product_code = ?, barcode = ?, name = ?, description = ?, 
        category_id = ?, unit = ?, purchase_price = ?, sales_price = ?,
        tax_rate = ?, critical_stock = ?, status = ?
      WHERE id = ?
    `

    await executeQuery(query, [
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
      status,
      params.id,
    ])

    return NextResponse.json({ success: true, message: "Ürün başarıyla güncellendi" })
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const query = 'UPDATE products SET status = "Pasif" WHERE id = ?'
    await executeQuery(query, [params.id])

    return NextResponse.json({ success: true, message: "Ürün başarıyla silindi" })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}
