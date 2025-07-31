import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { check_number, drawer, check_date, due_date, amount, status, description, accounting_code } = body
    const id = params.id

    const query = `
      UPDATE checks 
      SET check_number = ?, drawer = ?, check_date = ?, due_date = ?, amount = ?, status = ?, description = ?, accounting_code = ?
      WHERE id = ?
    `
    const queryParams = [check_number, drawer, check_date, due_date, amount, status, description, accounting_code, id]

    await executeQuery(query, queryParams)
    return NextResponse.json({ message: "Check updated successfully" })
  } catch (error) {
    console.error("Error updating check:", error)
    return NextResponse.json({ error: "Failed to update check" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    await executeQuery("DELETE FROM checks WHERE id = ?", [id])
    return NextResponse.json({ message: "Check deleted successfully" })
  } catch (error) {
    console.error("Error deleting check:", error)
    return NextResponse.json({ error: "Failed to delete check" }, { status: 500 })
  }
}
