import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const {
      transaction_date,
      value_date,
      type,
      description,
      reference_no,
      debit,
      credit,
      balance_after,
      accounting_code,
    } = body
    const id = params.id

    const query = `
      UPDATE bank_transactions 
      SET transaction_date = ?, value_date = ?, type = ?, description = ?, reference_no = ?, 
          debit = ?, credit = ?, balance_after = ?, accounting_code = ?
      WHERE id = ?
    `
    const queryParams = [
      transaction_date,
      value_date,
      type,
      description,
      reference_no,
      debit,
      credit,
      balance_after,
      accounting_code,
      id,
    ]

    await executeQuery(query, queryParams)
    return NextResponse.json({ message: "Bank transaction updated successfully" })
  } catch (error) {
    console.error("Error updating bank transaction:", error)
    return NextResponse.json({ error: "Failed to update bank transaction" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    await executeQuery("DELETE FROM bank_transactions WHERE id = ?", [id])
    return NextResponse.json({ message: "Bank transaction deleted successfully" })
  } catch (error) {
    console.error("Error deleting bank transaction:", error)
    return NextResponse.json({ error: "Failed to delete bank transaction" }, { status: 500 })
  }
}
