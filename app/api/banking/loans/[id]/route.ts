import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { loan_type, loan_amount, start_date, maturity_date, interest_rate, remaining_balance } = body
    const id = params.id

    const query = `
      UPDATE bank_loans 
      SET loan_type = ?, loan_amount = ?, start_date = ?, maturity_date = ?, interest_rate = ?, remaining_balance = ?
      WHERE id = ?
    `
    const queryParams = [loan_type, loan_amount, start_date, maturity_date, interest_rate, remaining_balance, id]

    await executeQuery(query, queryParams)
    return NextResponse.json({ message: "Bank loan updated successfully" })
  } catch (error) {
    console.error("Error updating bank loan:", error)
    return NextResponse.json({ error: "Failed to update bank loan" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // First delete related payments
    await executeQuery("DELETE FROM loan_payments WHERE loan_id = ?", [id])

    // Then delete the loan
    await executeQuery("DELETE FROM bank_loans WHERE id = ?", [id])

    return NextResponse.json({ message: "Bank loan deleted successfully" })
  } catch (error) {
    console.error("Error deleting bank loan:", error)
    return NextResponse.json({ error: "Failed to delete bank loan" }, { status: 500 })
  }
}
