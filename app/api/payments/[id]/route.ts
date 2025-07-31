import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await request.json()
    const paymentId = params.id

    // Get old payment data for balance adjustment
    const oldPayment: any = await executeQuery("SELECT * FROM payments WHERE id = ?", [paymentId])
    const oldAmount = oldPayment[0]?.amount || 0
    const vendorId = oldPayment[0]?.vendor_id

    const sql = `
      UPDATE payments 
      SET vendor_id = ?, payment_date = ?, amount = ?, payment_method = ?, 
          bank_account_id = ?, invoice_id = ?, payment_plan_id = ?, 
          reference_no = ?, accounting_code = ?, description = ?
      WHERE id = ?
    `

    await executeQuery(sql, [
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
      paymentId,
    ])

    // Update vendor balance (subtract old amount, add new amount)
    const amountDifference = data.amount - oldAmount
    await executeQuery(
      `
      UPDATE vendor_balances 
      SET total_paid = total_paid + ?, 
          remaining_balance = remaining_balance - ?
      WHERE vendor_id = ?
    `,
      [amountDifference, amountDifference, vendorId],
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating payment:", error)
    return NextResponse.json({ error: "Failed to update payment" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const paymentId = params.id

    // Get payment data for balance adjustment
    const payment: any = await executeQuery("SELECT * FROM payments WHERE id = ?", [paymentId])
    const amount = payment[0]?.amount || 0
    const vendorId = payment[0]?.vendor_id
    const invoiceId = payment[0]?.invoice_id
    const paymentPlanId = payment[0]?.payment_plan_id

    await executeQuery("DELETE FROM payments WHERE id = ?", [paymentId])

    // Update vendor balance
    await executeQuery(
      `
      UPDATE vendor_balances 
      SET total_paid = total_paid - ?, 
          remaining_balance = remaining_balance + ?
      WHERE vendor_id = ?
    `,
      [amount, amount, vendorId],
    )

    // Update invoice paid status
    if (invoiceId) {
      await executeQuery("UPDATE purchase_invoices SET is_paid = FALSE WHERE id = ?", [invoiceId])
    }

    // Update payment plan status
    if (paymentPlanId) {
      await executeQuery("UPDATE payment_plans SET status = 'Bekliyor' WHERE id = ?", [paymentPlanId])
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting payment:", error)
    return NextResponse.json({ error: "Failed to delete payment" }, { status: 500 })
  }
}
