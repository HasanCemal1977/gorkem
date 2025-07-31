import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await request.json()
    const vendorId = params.id

    const sql = `
      UPDATE vendors 
      SET name = ?, tax_no = ?, phone = ?, email = ?, address = ?, iban = ?, currency = ?
      WHERE id = ?
    `

    await executeQuery(sql, [
      data.name,
      data.tax_no || "",
      data.phone || "",
      data.email || "",
      data.address || "",
      data.iban || "",
      data.currency || "TRY",
      vendorId,
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating vendor:", error)
    return NextResponse.json({ error: "Failed to update vendor" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const vendorId = params.id

    // Delete related records first
    await executeQuery("DELETE FROM payments WHERE vendor_id = ?", [vendorId])
    await executeQuery(
      "DELETE FROM payment_plans WHERE invoice_id IN (SELECT id FROM purchase_invoices WHERE vendor_id = ?)",
      [vendorId],
    )
    await executeQuery("DELETE FROM purchase_invoices WHERE vendor_id = ?", [vendorId])
    await executeQuery("DELETE FROM vendor_balances WHERE vendor_id = ?", [vendorId])
    await executeQuery("DELETE FROM vendors WHERE id = ?", [vendorId])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting vendor:", error)
    return NextResponse.json({ error: "Failed to delete vendor" }, { status: 500 })
  }
}
