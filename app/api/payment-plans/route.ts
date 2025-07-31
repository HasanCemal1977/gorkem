import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"

export async function GET() {
  try {
    const sql = `
      SELECT 
        pp.*,
        pi.invoice_no,
        pi.total_amount as invoice_total,
        v.name as vendor_name,
        DATEDIFF(CURDATE(), pp.due_date) as days_overdue
      FROM payment_plans pp
      LEFT JOIN purchase_invoices pi ON pp.invoice_id = pi.id
      LEFT JOIN vendors v ON pi.vendor_id = v.id
      ORDER BY pp.due_date ASC
    `

    const plans = await executeQuery(sql)
    return NextResponse.json(plans)
  } catch (error) {
    console.error("Error fetching payment plans:", error)
    return NextResponse.json({ error: "Failed to fetch payment plans" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const sql = `
      INSERT INTO payment_plans (invoice_id, due_date, planned_amount, status)
      VALUES (?, ?, ?, ?)
    `

    const result: any = await executeQuery(sql, [
      data.invoice_id,
      data.due_date,
      data.planned_amount,
      data.status || "Bekliyor",
    ])

    return NextResponse.json({ success: true, id: result.insertId })
  } catch (error) {
    console.error("Error creating payment plan:", error)
    return NextResponse.json({ error: "Failed to create payment plan" }, { status: 500 })
  }
}
