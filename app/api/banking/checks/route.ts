import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"

export async function GET() {
  try {
    const checks = await executeQuery(`
      SELECT 
        bc.*,
        ba.account_name,
        ba.bank_name
      FROM banking_checks bc
      LEFT JOIN banking_accounts ba ON bc.account_id = ba.id
      ORDER BY bc.due_date DESC, bc.created_at DESC
    `)

    return NextResponse.json(Array.isArray(checks) ? checks : [])
  } catch (error) {
    console.error("Banking checks fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch banking checks" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      account_id,
      check_type,
      check_number,
      amount,
      issue_date,
      due_date,
      payee,
      drawer,
      status = "pending",
      description,
    } = body

    const result = await executeQuery(
      `
      INSERT INTO banking_checks (
        account_id, check_type, check_number, amount, issue_date,
        due_date, payee, drawer, status, description
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [account_id, check_type, check_number, amount, issue_date, due_date, payee, drawer, status, description],
    )

    return NextResponse.json(
      {
        id: result.insertId,
        message: "Banking check created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Banking check creation error:", error)
    return NextResponse.json({ error: "Failed to create banking check" }, { status: 500 })
  }
}
