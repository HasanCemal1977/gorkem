import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const accounts = await executeQuery(
      `
      SELECT * FROM banking_accounts WHERE id = ?
    `,
      [params.id],
    )

    if (!Array.isArray(accounts) || accounts.length === 0) {
      return NextResponse.json({ error: "Banking account not found" }, { status: 404 })
    }

    return NextResponse.json(accounts[0])
  } catch (error) {
    console.error("Banking account fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch banking account" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const {
      account_name,
      account_number,
      bank_name,
      branch,
      account_type,
      balance,
      currency,
      iban,
      swift_code,
      status,
    } = body

    await executeQuery(
      `
      UPDATE banking_accounts SET
        account_name = ?, account_number = ?, bank_name = ?, branch = ?,
        account_type = ?, balance = ?, currency = ?, iban = ?, swift_code = ?, status = ?
      WHERE id = ?
    `,
      [
        account_name,
        account_number,
        bank_name,
        branch,
        account_type,
        balance,
        currency,
        iban,
        swift_code,
        status,
        params.id,
      ],
    )

    return NextResponse.json({ message: "Banking account updated successfully" })
  } catch (error) {
    console.error("Banking account update error:", error)
    return NextResponse.json({ error: "Failed to update banking account" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await executeQuery(`DELETE FROM banking_accounts WHERE id = ?`, [params.id])
    return NextResponse.json({ message: "Banking account deleted successfully" })
  } catch (error) {
    console.error("Banking account deletion error:", error)
    return NextResponse.json({ error: "Failed to delete banking account" }, { status: 500 })
  }
}
