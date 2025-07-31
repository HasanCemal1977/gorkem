import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"

export async function GET() {
  try {
    const sql = `
      SELECT 
        pi.*,
        v.name as vendor_name,
        v.tax_no as vendor_tax_no,
        COALESCE(SUM(p.amount), 0) as paid_amount,
        (pi.total_amount - COALESCE(SUM(p.amount), 0)) as remaining_amount
      FROM purchase_invoices pi
      LEFT JOIN vendors v ON pi.vendor_id = v.id
      LEFT JOIN payments p ON pi.id = p.invoice_id
      GROUP BY pi.id
      ORDER BY pi.invoice_date DESC
    `

    const invoices = await executeQuery(sql)
    return NextResponse.json(invoices)
  } catch (error) {
    console.error("Error fetching purchase invoices:", error)
    return NextResponse.json({ error: "Failed to fetch purchase invoices" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const sql = `
      INSERT INTO purchase_invoices (vendor_id, invoice_no, invoice_date, due_date, total_amount, currency, description, accounting_code)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `

    const result: any = await executeQuery(sql, [
      data.vendor_id,
      data.invoice_no,
      data.invoice_date,
      data.due_date,
      data.total_amount,
      data.currency || "TRY",
      data.description || "",
      data.accounting_code || "320",
    ])

    // Update vendor balance
    await executeQuery(
      `
      UPDATE vendor_balances 
      SET total_invoiced = total_invoiced + ?, 
          remaining_balance = remaining_balance + ?
      WHERE vendor_id = ?
    `,
      [data.total_amount, data.total_amount, data.vendor_id],
    )

    return NextResponse.json({ success: true, id: result.insertId })
  } catch (error) {
    console.error("Error creating purchase invoice:", error)
    return NextResponse.json({ error: "Failed to create purchase invoice" }, { status: 500 })
  }
}
