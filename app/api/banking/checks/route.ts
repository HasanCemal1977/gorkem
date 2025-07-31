import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"

export async function GET() {
  try {
    const query = `
      SELECT 
        c.*,
        ba.bank_name,
        ba.account_number
      FROM checks c
      LEFT JOIN bank_accounts ba ON c.bank_account_id = ba.id
      ORDER BY c.due_date DESC, c.id DESC
    `
    const checks = await executeQuery(query)
    return NextResponse.json(checks)
  } catch (error) {
    console.error("Error fetching checks:", error)
    return NextResponse.json({ error: "Failed to fetch checks" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      company_id = 1,
      bank_account_id = 1,
      check_number,
      drawer,
      check_date,
      due_date,
      amount,
      status = "Giriş",
      description,
      accounting_code,
    } = body

    const query = `
      INSERT INTO checks 
      (company_id, bank_account_id, check_number, drawer, check_date, due_date, amount, status, description, accounting_code)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `
    const params = [
      company_id,
      bank_account_id,
      check_number,
      drawer,
      check_date,
      due_date,
      amount,
      status,
      description,
      accounting_code,
    ]

    await executeQuery(query, params)
    return NextResponse.json({ message: "Check created successfully" }, { status: 201 })
  } catch (error) {
    console.error("Error creating check:", error)
    return NextResponse.json({ error: "Failed to create check" }, { status: 500 })
  }
}
