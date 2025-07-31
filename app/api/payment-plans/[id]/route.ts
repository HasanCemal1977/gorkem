import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await request.json()
    const planId = params.id

    const sql = `
      UPDATE payment_plans 
      SET invoice_id = ?, due_date = ?, planned_amount = ?, status = ?
      WHERE id = ?
    `

    await executeQuery(sql, [data.invoice_id, data.due_date, data.planned_amount, data.status || "Bekliyor", planId])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating payment plan:", error)
    return NextResponse.json({ error: "Failed to update payment plan" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const planId = params.id
    await executeQuery("DELETE FROM payment_plans WHERE id = ?", [planId])
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting payment plan:", error)
    return NextResponse.json({ error: "Failed to delete payment plan" }, { status: 500 })
  }
}
