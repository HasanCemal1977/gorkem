import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"

export async function GET() {
  try {
    const query = `
      SELECT 
        bt.*,
        ba.bank_name,
        ba.account_number
      FROM bank_transactions bt
      LEFT JOIN bank_accounts ba ON bt.account_id = ba.id
      ORDER BY bt.transaction_date DESC, bt.id DESC
    `
    const transactions = await executeQuery(query)
    return NextResponse.json(transactions)
  } catch (error) {
    console.error("Error fetching bank transactions:", error)
    return NextResponse.json({ error: "Failed to fetch bank transactions" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      account_id = 1,
      transaction_date,
      value_date,
      type,
      description,
      reference_no,
      debit = 0,
      credit = 0,
      balance_after = 0,
      accounting_code,
    } = body

    const query = `
      INSERT INTO bank_transactions 
      (account_id, transaction_date, value_date, type, description, reference_no, debit, credit, balance_after, accounting_code)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `
    const params = [
      account_id,
      transaction_date,
      value_date,
      type,
      description,
      reference_no,
      debit,
      credit,
      balance_after,
      accounting_code,
    ]

    await executeQuery(query, params)
    return NextResponse.json({ message: "Bank transaction created successfully" }, { status: 201 })
  } catch (error) {
    console.error("Error creating bank transaction:", error)
    return NextResponse.json({ error: "Failed to create bank transaction" }, { status: 500 })
  }
}
