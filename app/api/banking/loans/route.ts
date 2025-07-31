import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"

export async function GET() {
  try {
    const query = `
      SELECT 
        bl.*,
        ba.bank_name,
        ba.account_number
      FROM bank_loans bl
      LEFT JOIN bank_accounts ba ON bl.account_id = ba.id
      ORDER BY bl.id DESC
    `
    const loans = await executeQuery(query)
    return NextResponse.json(loans)
  } catch (error) {
    console.error("Error fetching bank loans:", error)
    return NextResponse.json({ error: "Failed to fetch bank loans" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { account_id = 1, loan_type, loan_amount, start_date, maturity_date, interest_rate, remaining_balance } = body

    const query = `
      INSERT INTO bank_loans (account_id, loan_type, loan_amount, start_date, maturity_date, interest_rate, remaining_balance)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `
    const params = [
      account_id,
      loan_type,
      loan_amount,
      start_date,
      maturity_date,
      interest_rate,
      remaining_balance || loan_amount,
    ]

    await executeQuery(query, params)
    return NextResponse.json({ message: "Bank loan created successfully" }, { status: 201 })
  } catch (error) {
    console.error("Error creating bank loan:", error)
    return NextResponse.json({ error: "Failed to create bank loan" }, { status: 500 })
  }
}
