import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const receipts = await executeQuery(
      `
      SELECT 
        br.*,
        ba.account_name,
        ba.bank_name
      FROM banking_receipts br
      LEFT JOIN banking_accounts ba ON br.account_id = ba.id
      WHERE br.id = ?
    `,
      [params.id],
    )

    if (!Array.isArray(receipts) || receipts.length === 0) {
      return NextResponse.json({ error: "Banking receipt not found" }, { status: 404 })
    }

    return NextResponse.json(receipts[0])
  } catch (error) {
    console.error("Banking receipt fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch banking receipt" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { account_id, receipt_type, receipt_number, amount, receipt_date, payer, description, project_id, status } =
      body

    await executeQuery(
      `
      UPDATE banking_receipts SET
        account_id = ?, receipt_type = ?, receipt_number = ?, amount = ?,
        receipt_date = ?, payer = ?, description = ?, project_id = ?, status = ?
      WHERE id = ?
    `,
      [
        account_id,
        receipt_type,
        receipt_number,
        amount,
        receipt_date,
        payer,
        description,
        project_id,
        status,
        params.id,
      ],
    )

    return NextResponse.json({ message: "Banking receipt updated successfully" })
  } catch (error) {
    console.error("Banking receipt update error:", error)
    return NextResponse.json({ error: "Failed to update banking receipt" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await executeQuery(`DELETE FROM banking_receipts WHERE id = ?`, [params.id])
    return NextResponse.json({ message: "Banking receipt deleted successfully" })
  } catch (error) {
    console.error("Banking receipt deletion error:", error)
    return NextResponse.json({ error: "Failed to delete banking receipt" }, { status: 500 })
  }
}
