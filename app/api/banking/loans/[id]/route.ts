import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const loans = await executeQuery(
      `
      SELECT 
        bl.*,
        ba.account_name,
        ba.bank_name
      FROM banking_loans bl
      LEFT JOIN banking_accounts ba ON bl.account_id = ba.id
      WHERE bl.id = ?
    `,
      [params.id],
    )

    if (!Array.isArray(loans) || loans.length === 0) {
      return NextResponse.json({ error: "Banking loan not found" }, { status: 404 })
    }

    return NextResponse.json(loans[0])
  } catch (error) {
    console.error("Banking loan fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch banking loan" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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
      status,
      description,
      guarantor,
      collateral,
    } = body

    await executeQuery(
      `
      UPDATE banking_loans SET
        account_id = ?, loan_type = ?, principal_amount = ?, interest_rate = ?,
        term_months = ?, start_date = ?, monthly_payment = ?, remaining_balance = ?,
        status = ?, description = ?, guarantor = ?, collateral = ?
      WHERE id = ?
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
        params.id,
      ],
    )

    return NextResponse.json({ message: "Banking loan updated successfully" })
  } catch (error) {
    console.error("Banking loan update error:", error)
    return NextResponse.json({ error: "Failed to update banking loan" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await executeQuery(`DELETE FROM banking_loans WHERE id = ?`, [params.id])
    return NextResponse.json({ message: "Banking loan deleted successfully" })
  } catch (error) {
    console.error("Banking loan deletion error:", error)
    return NextResponse.json({ error: "Failed to delete banking loan" }, { status: 500 })
  }
}
