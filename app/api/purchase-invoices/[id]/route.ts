import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await request.json()
    const invoiceId = params.id

    // Get old invoice data for balance adjustment
    const oldInvoice: any = await executeQuery("SELECT * FROM purchase_invoices WHERE id = ?", [invoiceId])
    const oldAmount = oldInvoice[0]?.total_amount || 0
    const vendorId = oldInvoice[0]?.vendor_id

    const sql = `
      UPDATE purchase_invoices 
      SET vendor_id = ?, invoice_no = ?, invoice_date = ?, due_date = ?, 
          total_amount = ?, currency = ?, description = ?, accounting_code = ?
      WHERE id = ?
    `

    await executeQuery(sql, [
      data.vendor_id,
      data.invoice_no,
      data.invoice_date,
      data.due_date,
      data.total_amount,
      data.currency || "TRY",
      data.description || "",
      data.accounting_code || "320",
      invoiceId,
    ])

    // Update vendor balance (subtract old amount, add new amount)
    const amountDifference = data.total_amount - oldAmount
    await executeQuery(
      `
      UPDATE vendor_balances 
      SET total_invoiced = total_invoiced + ?, 
          remaining_balance = remaining_balance + ?
      WHERE vendor_id = ?
    `,
      [amountDifference, amountDifference, vendorId],
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating purchase invoice:", error)
    return NextResponse.json({ error: "Failed to update purchase invoice" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const invoiceId = params.id

    // Get invoice data for balance adjustment
    const invoice: any = await executeQuery("SELECT * FROM purchase_invoices WHERE id = ?", [invoiceId])
    const amount = invoice[0]?.total_amount || 0
    const vendorId = invoice[0]?.vendor_id

    // Delete related records
    await executeQuery("DELETE FROM payment_plans WHERE invoice_id = ?", [invoiceId])
    await executeQuery("DELETE FROM payments WHERE invoice_id = ?", [invoiceId])
    await executeQuery("DELETE FROM purchase_invoices WHERE id = ?", [invoiceId])

    // Update vendor balance
    await executeQuery(
      `
      UPDATE vendor_balances 
      SET total_invoiced = total_invoiced - ?, 
          remaining_balance = remaining_balance - ?
      WHERE vendor_id = ?
    `,
      [amount, amount, vendorId],
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting purchase invoice:", error)
    return NextResponse.json({ error: "Failed to delete purchase invoice" }, { status: 500 })
  }
}
