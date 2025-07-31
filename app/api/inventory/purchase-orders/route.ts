import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"

export async function GET() {
  try {
    const query = `
      SELECT 
        po.*,
        v.name as vendor_name,
        COUNT(poi.id) as item_count
      FROM purchase_orders po
      LEFT JOIN vendors v ON po.vendor_id = v.id
      LEFT JOIN purchase_order_items poi ON po.id = poi.purchase_order_id
      GROUP BY po.id
      ORDER BY po.order_date DESC
    `

    const orders = await executeQuery(query)
    return NextResponse.json(orders)
  } catch (error) {
    console.error("Error fetching purchase orders:", error)
    return NextResponse.json({ error: "Failed to fetch purchase orders" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { order_number, vendor_id, order_date, expected_delivery_date, description, created_by, items } = body

    // Sipariş oluştur
    const orderQuery = `
      INSERT INTO purchase_orders (
        order_number, vendor_id, order_date, expected_delivery_date,
        description, created_by
      ) VALUES (?, ?, ?, ?, ?, ?)
    `

    const orderResult = await executeQuery(orderQuery, [
      order_number,
      vendor_id,
      order_date,
      expected_delivery_date,
      description,
      created_by,
    ])

    const orderId = orderResult.insertId

    // Sipariş kalemlerini ekle
    if (items && items.length > 0) {
      const itemQuery = `
        INSERT INTO purchase_order_items (
          purchase_order_id, product_id, quantity, unit_price, total_price, warehouse_id
        ) VALUES (?, ?, ?, ?, ?, ?)
      `

      let totalAmount = 0

      for (const item of items) {
        await executeQuery(itemQuery, [
          orderId,
          item.product_id,
          item.quantity,
          item.unit_price,
          item.total_price,
          item.warehouse_id,
        ])
        totalAmount += Number.parseFloat(item.total_price)
      }

      // Toplam tutarı güncelle
      await executeQuery("UPDATE purchase_orders SET total_amount = ? WHERE id = ?", [totalAmount, orderId])
    }

    return NextResponse.json({
      success: true,
      id: orderId,
      message: "Satın alma siparişi başarıyla oluşturuldu",
    })
  } catch (error) {
    console.error("Error creating purchase order:", error)
    return NextResponse.json({ error: "Failed to create purchase order" }, { status: 500 })
  }
}
