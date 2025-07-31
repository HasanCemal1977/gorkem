import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { receipt_date, receipt_type, payment_method, amount, payer_name, description, accounting_code } = body
    const id = params.id

    const query = `
      UPDATE receipts 
      SET receipt_date = ?, receipt_type = ?, payment_method = ?, amount = ?, payer_name = ?, description = ?, accounting_code = ?
      WHERE id = ?
    `
    const queryParams = [
      receipt_date,
      receipt_type,
      payment_method,
      amount,
      payer_name,
      description,
      accounting_code,
      id,
    ]

    await executeQuery(query, queryParams)
    return NextResponse.json({ message: "Receipt updated successfully" })
  } catch (error) {
    console.error("Error updating receipt:", error)
    return NextResponse.json({ error: "Failed to update receipt" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    await executeQuery("DELETE FROM receipts WHERE id = ?", [id])
    return NextResponse.json({ message: "Receipt deleted successfully" })
  } catch (error) {
    console.error("Error deleting receipt:", error)
    return NextResponse.json({ error: "Failed to delete receipt" }, { status: 500 })
  }
}
