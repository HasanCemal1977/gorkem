import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"

export async function GET() {
  try {
    const sql = `
      SELECT 
        v.*,
        vb.total_invoiced,
        vb.total_paid,
        vb.remaining_balance,
        vb.last_updated
      FROM vendors v
      LEFT JOIN vendor_balances vb ON v.id = vb.vendor_id
      ORDER BY v.name ASC
    `

    const vendors = await executeQuery(sql)
    return NextResponse.json(vendors)
  } catch (error) {
    console.error("Error fetching vendors:", error)
    return NextResponse.json({ error: "Failed to fetch vendors" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const sql = `
      INSERT INTO vendors (company_id, name, tax_no, phone, email, address, iban, currency)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `

    const result: any = await executeQuery(sql, [
      data.company_id || 1,
      data.name,
      data.tax_no || "",
      data.phone || "",
      data.email || "",
      data.address || "",
      data.iban || "",
      data.currency || "TRY",
    ])

    // Initialize vendor balance
    await executeQuery(
      "INSERT INTO vendor_balances (vendor_id, total_invoiced, total_paid, remaining_balance) VALUES (?, 0, 0, 0)",
      [result.insertId],
    )

    return NextResponse.json({ success: true, id: result.insertId })
  } catch (error) {
    console.error("Error creating vendor:", error)
    return NextResponse.json({ error: "Failed to create vendor" }, { status: 500 })
  }
}
