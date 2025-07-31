import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"

export async function GET() {
  try {
    const receipts = await executeQuery(`
      SELECT 
        br.*,
        ba.account_name,
        ba.bank_name
      FROM banking_receipts br
      LEFT JOIN banking_accounts ba ON br.account_id = ba.id
      ORDER BY br.receipt_date DESC, br.created_at DESC
    `)

    return NextResponse.json(Array.isArray(receipts) ? receipts : [])
  } catch (error) {
    console.error("Banking receipts fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch banking receipts" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      account_id,
      receipt_type,
      receipt_number,
      amount,
      receipt_date,
      payer,
      description,
      project_id,
      status = "received",
    } = body

    const result = await executeQuery(
      `
      INSERT INTO banking_receipts (
        account_id, receipt_type, receipt_number, amount, receipt_date,
        payer, description, project_id, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [account_id, receipt_type, receipt_number, amount, receipt_date, payer, description, project_id, status],
    )

    return NextResponse.json(
      {
        id: result.insertId,
        message: "Banking receipt created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Banking receipt creation error:", error)
    return NextResponse.json({ error: "Failed to create banking receipt" }, { status: 500 })
  }
}
