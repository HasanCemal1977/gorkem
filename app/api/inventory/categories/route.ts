import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"

export async function GET() {
  try {
    const query = "SELECT * FROM product_categories ORDER BY name"
    const categories = await executeQuery(query)
    return NextResponse.json(categories)
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description } = body

    const query = "INSERT INTO product_categories (name, description) VALUES (?, ?)"
    const result = await executeQuery(query, [name, description])

    return NextResponse.json({
      success: true,
      id: result.insertId,
      message: "Kategori başarıyla eklendi",
    })
  } catch (error) {
    console.error("Error creating category:", error)
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 })
  }
}
