import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"

export async function GET() {
  try {
    const query = `
      SELECT 
        bt.*,
        ba.account_name,
        ba.bank_name
      FROM banking_transactions bt
      LEFT JOIN banking_accounts ba ON bt.account_id = ba.id
      ORDER BY bt.transaction_date DESC, bt.created_at DESC
    `
    const transactions = await executeQuery(query)
    return NextResponse.json(Array.isArray(transactions) ? transactions : [])
  } catch (error) {
    console.error("Banking transactions fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch banking transactions" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      account_id,
      transaction_type,
      amount,
      description,
      transaction_date,
      reference_number,
      category,
      project_id,
      status = "completed",
    } = body

    // Start transaction
    await executeQuery("START TRANSACTION")

    try {
      // Insert transaction
      const result = await executeQuery(
        `
        INSERT INTO banking_transactions (
          account_id, transaction_type, amount, description, transaction_date,
          reference_number, category, project_id, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
        [
          account_id,
          transaction_type,
          amount,
          description,
          transaction_date,
          reference_number,
          category,
          project_id,
          status,
        ],
      )

      // Update account balance
      const balanceChange = transaction_type === "income" ? amount : -amount
      await executeQuery(
        `
        UPDATE banking_accounts 
        SET balance = balance + ? 
        WHERE id = ?
      `,
        [balanceChange, account_id],
      )

      await executeQuery("COMMIT")

      return NextResponse.json(
        {
          id: result.insertId,
          message: "Banking transaction created successfully",
        },
        { status: 201 },
      )
    } catch (error) {
      await executeQuery("ROLLBACK")
      throw error
    }
  } catch (error) {
    console.error("Banking transaction creation error:", error)
    return NextResponse.json({ error: "Failed to create banking transaction" }, { status: 500 })
  }
}
