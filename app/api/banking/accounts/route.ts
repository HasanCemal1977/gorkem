import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"

export async function GET() {
  try {
    const accounts = await executeQuery(`
      SELECT 
        id,
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
        created_at,
        updated_at
      FROM banking_accounts 
      ORDER BY created_at DESC
    `)

    return NextResponse.json(Array.isArray(accounts) ? accounts : [])
  } catch (error) {
    console.error("Banking accounts fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch banking accounts" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      account_name,
      account_number,
      bank_name,
      branch,
      account_type,
      balance = 0,
      currency = "TRY",
      iban,
      swift_code,
      status = "active",
    } = body

    const result = await executeQuery(
      `
      INSERT INTO banking_accounts (
        account_name, account_number, bank_name, branch, account_type,
        balance, currency, iban, swift_code, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [account_name, account_number, bank_name, branch, account_type, balance, currency, iban, swift_code, status],
    )

    return NextResponse.json(
      {
        id: result.insertId,
        message: "Banking account created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Banking account creation error:", error)
    return NextResponse.json({ error: "Failed to create banking account" }, { status: 500 })
  }
}
