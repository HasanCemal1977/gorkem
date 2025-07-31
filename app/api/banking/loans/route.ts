import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"

export async function GET() {
  try {
    const loans = await executeQuery(`
      SELECT 
        bl.*,
        ba.account_name,
        ba.bank_name
      FROM banking_loans bl
      LEFT JOIN banking_accounts ba ON bl.account_id = ba.id
      ORDER BY bl.created_at DESC
    `)

    return NextResponse.json(Array.isArray(loans) ? loans : [])
  } catch (error) {
    console.error("Banking loans fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch banking loans" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      account_id,
      loan_type,
      principal_amount,
      interest_rate,
      term_months,
      start_date,
      monthly_payment,
      remaining_balance,
      status = "active",
      description,
      guarantor,
      collateral,
    } = body

    const result = await executeQuery(
      `
      INSERT INTO banking_loans (
        account_id, loan_type, principal_amount, interest_rate, term_months,
        start_date, monthly_payment, remaining_balance, status, description, guarantor, collateral
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        account_id,
        loan_type,
        principal_amount,
        interest_rate,
        term_months,
        start_date,
        monthly_payment,
        remaining_balance,
        status,
        description,
        guarantor,
        collateral,
      ],
    )

    return NextResponse.json(
      {
        id: result.insertId,
        message: "Banking loan created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Banking loan creation error:", error)
    return NextResponse.json({ error: "Failed to create banking loan" }, { status: 500 })
  }
}
