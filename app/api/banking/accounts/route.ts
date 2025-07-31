import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"

export async function GET() {
  try {
    const query = `
      SELECT 
        ba.*,
        c.name as company_name
      FROM bank_accounts ba
      LEFT JOIN companies c ON ba.company_id = c.id
      ORDER BY ba.id DESC
    `
    const accounts = await executeQuery(query)
    return NextResponse.json(accounts)
  } catch (error) {
    console.error("Error fetching bank accounts:", error)
    return NextResponse.json({ error: "Failed to fetch bank accounts" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { bank_name, branch_name, iban, account_number, currency, opening_date, company_id = 1 } = body

    const query = `
      INSERT INTO bank_accounts (company_id, bank_name, branch_name, iban, account_number, currency, opening_date)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `
    const params = [company_id, bank_name, branch_name, iban, account_number, currency, opening_date]

    await executeQuery(query, params)
    return NextResponse.json({ message: "Bank account created successfully" }, { status: 201 })
  } catch (error) {
    console.error("Error creating bank account:", error)
    return NextResponse.json({ error: "Failed to create bank account" }, { status: 500 })
  }
}
