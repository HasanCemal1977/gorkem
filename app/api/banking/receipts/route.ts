import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"

export async function GET() {
  try {
    const query = `
      SELECT 
        r.*,
        ba.bank_name,
        ba.account_number
      FROM receipts r
      LEFT JOIN bank_accounts ba ON r.related_account_id = ba.id
      ORDER BY r.receipt_date DESC, r.id DESC
    `
    const receipts = await executeQuery(query)
    return NextResponse.json(receipts)
  } catch (error) {
    console.error("Error fetching receipts:", error)
    return NextResponse.json({ error: "Failed to fetch receipts" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      company_id = 1,
      receipt_date,
      receipt_type,
      payment_method,
      related_account_id = 1,
      amount,
      payer_name,
      description,
      accounting_code,
    } = body

    const query = `
      INSERT INTO receipts 
      (company_id, receipt_date, receipt_type, payment_method, related_account_id, amount, payer_name, description, accounting_code)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `
    const params = [
      company_id,
      receipt_date,
      receipt_type,
      payment_method,
      related_account_id,
      amount,
      payer_name,
      description,
      accounting_code,
    ]

    await executeQuery(query, params)
    return NextResponse.json({ message: "Receipt created successfully" }, { status: 201 })
  } catch (error) {
    console.error("Error creating receipt:", error)
    return NextResponse.json({ error: "Failed to create receipt" }, { status: 500 })
  }
}
