import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const checks = await executeQuery(
      `
      SELECT 
        bc.*,
        ba.account_name,
        ba.bank_name
      FROM banking_checks bc
      LEFT JOIN banking_accounts ba ON bc.account_id = ba.id
      WHERE bc.id = ?
    `,
      [params.id],
    )

    if (!Array.isArray(checks) || checks.length === 0) {
      return NextResponse.json({ error: "Banking check not found" }, { status: 404 })
    }

    return NextResponse.json(checks[0])
  } catch (error) {
    console.error("Banking check fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch banking check" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { account_id, check_type, check_number, amount, issue_date, due_date, payee, drawer, status, description } =
      body

    await executeQuery(
      `
      UPDATE banking_checks SET
        account_id = ?, check_type = ?, check_number = ?, amount = ?,
        issue_date = ?, due_date = ?, payee = ?, drawer = ?, status = ?, description = ?
      WHERE id = ?
    `,
      [
        account_id,
        check_type,
        check_number,
        amount,
        issue_date,
        due_date,
        payee,
        drawer,
        status,
        description,
        params.id,
      ],
    )

    return NextResponse.json({ message: "Banking check updated successfully" })
  } catch (error) {
    console.error("Banking check update error:", error)
    return NextResponse.json({ error: "Failed to update banking check" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await executeQuery(`DELETE FROM banking_checks WHERE id = ?`, [params.id])
    return NextResponse.json({ message: "Banking check deleted successfully" })
  } catch (error) {
    console.error("Banking check deletion error:", error)
    return NextResponse.json({ error: "Failed to delete banking check" }, { status: 500 })
  }
}
