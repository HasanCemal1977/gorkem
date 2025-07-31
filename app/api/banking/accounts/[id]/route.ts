import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { bank_name, branch_name, iban, account_number, currency, opening_date } = body
    const id = params.id

    const query = `
      UPDATE bank_accounts 
      SET bank_name = ?, branch_name = ?, iban = ?, account_number = ?, currency = ?, opening_date = ?
      WHERE id = ?
    `
    const queryParams = [bank_name, branch_name, iban, account_number, currency, opening_date, id]

    await executeQuery(query, queryParams)
    return NextResponse.json({ message: "Bank account updated successfully" })
  } catch (error) {
    console.error("Error updating bank account:", error)
    return NextResponse.json({ error: "Failed to update bank account" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // First delete related transactions
    await executeQuery("DELETE FROM bank_transactions WHERE account_id = ?", [id])

    // Then delete the account
    await executeQuery("DELETE FROM bank_accounts WHERE id = ?", [id])

    return NextResponse.json({ message: "Bank account deleted successfully" })
  } catch (error) {
    console.error("Error deleting bank account:", error)
    return NextResponse.json({ error: "Failed to delete bank account" }, { status: 500 })
  }
}
