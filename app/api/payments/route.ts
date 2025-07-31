import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"

export async function GET() {
  try {
    const sql = `
      SELECT 
        p.*,
        v.name as vendor_name,
        pi.invoice_no,
        ba.bank_name,
        ba.account_number
      FROM payments p
      LEFT JOIN vendors v ON p.vendor_id = v.id
      LEFT JOIN purchase_invoices pi ON p.invoice_id = pi.id
      LEFT JOIN bank_accounts ba ON p.bank_account_id = ba.id
      ORDER BY p.payment_date DESC
    `

    const payments = await executeQuery(sql)
    return NextResponse.json(payments)
  } catch (error) {
    console.error("Error fetching payments:", error)
    return NextResponse.json({ error: "Failed to fetch payments" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const sql = `
      INSERT INTO payments (vendor_id, payment_date, amount, payment_method, bank_account_id, invoice_id, payment_plan_id, reference_no, accounting_code, description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `

    const result: any = await executeQuery(sql, [
      data.vendor_id,
      data.payment_date,
      data.amount,
      data.payment_method,
      data.bank_account_id || null,
      data.invoice_id || null,
      data.payment_plan_id || null,
      data.reference_no || "",
      data.accounting_code || "320",
      data.description || "",
    ])

    // Update vendor balance
    await executeQuery(
      `
      UPDATE vendor_balances 
      SET total_paid = total_paid + ?, 
          remaining_balance = remaining_balance - ?
      WHERE vendor_id = ?
    `,
      [data.amount, data.amount, data.vendor_id],
    )

    // Update invoice paid status if fully paid
    if (data.invoice_id) {
      const invoiceCheck: any = await executeQuery(
        `
        SELECT 
          pi.total_amount,
          COALESCE(SUM(p.amount), 0) as total_paid
        FROM purchase_invoices pi
        LEFT JOIN payments p ON pi.id = p.invoice_id
        WHERE pi.id = ?
        GROUP BY pi.id
      `,
        [data.invoice_id],
      )

      if (invoiceCheck[0] && invoiceCheck[0].total_paid >= invoiceCheck[0].total_amount) {
        await executeQuery("UPDATE purchase_invoices SET is_paid = TRUE WHERE id = ?", [data.invoice_id])
      }
    }

    // Update payment plan status if applicable
    if (data.payment_plan_id) {
      await executeQuery("UPDATE payment_plans SET status = 'Ödendi' WHERE id = ?", [data.payment_plan_id])
    }

    return NextResponse.json({ success: true, id: result.insertId })
  } catch (error) {
    console.error("Error creating payment:", error)
    return NextResponse.json({ error: "Failed to create payment" }, { status: 500 })
  }
}
