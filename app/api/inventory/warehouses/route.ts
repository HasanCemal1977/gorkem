import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"

export async function GET() {
  try {
    const query = "SELECT * FROM warehouses ORDER BY name"
    const warehouses = await executeQuery(query)
    return NextResponse.json(warehouses)
  } catch (error) {
    console.error("Error fetching warehouses:", error)
    return NextResponse.json({ error: "Failed to fetch warehouses" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, location, manager_name, phone } = body

    const query = `
      INSERT INTO warehouses (name, location, manager_name, phone) 
      VALUES (?, ?, ?, ?)
    `

    const result = await executeQuery(query, [name, location, manager_name, phone])

    return NextResponse.json({
      success: true,
      id: result.insertId,
      message: "Depo başarıyla eklendi",
    })
  } catch (error) {
    console.error("Error creating warehouse:", error)
    return NextResponse.json({ error: "Failed to create warehouse" }, { status: 500 })
  }
}
