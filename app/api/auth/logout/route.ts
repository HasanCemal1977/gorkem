import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value

    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as any

        // Session'ı sil
        await executeQuery("DELETE FROM user_sessions WHERE user_id = ?", [decoded.userId])
      } catch (error) {
        console.error("Token decode error:", error)
      }
    }

    const response = NextResponse.json({ success: true })

    // Cookie'yi sil
    response.cookies.delete("auth-token")

    return response
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ error: "Çıkış işlemi sırasında hata oluştu" }, { status: 500 })
  }
}
