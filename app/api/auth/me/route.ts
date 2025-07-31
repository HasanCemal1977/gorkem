import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ error: "Oturum bulunamadı" }, { status: 401 })
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any

    // Kullanıcı bilgilerini al
    const users = await executeQuery(
      'SELECT id, username, email, full_name, department, status FROM users WHERE id = ? AND status = "Aktif"',
      [decoded.userId],
    )

    if (!users || users.length === 0) {
      return NextResponse.json({ error: "Kullanıcı bulunamadı" }, { status: 404 })
    }

    const user = users[0]

    // Kullanıcının rollerini al
    const userRoles = await executeQuery(
      `
      SELECT r.id, r.name, r.description
      FROM roles r
      JOIN user_roles ur ON r.id = ur.role_id
      WHERE ur.user_id = ?
    `,
      [user.id],
    )

    // Kullanıcının yetkilerini al
    const userPermissions = await executeQuery(
      `
      SELECT DISTINCT p.name, p.description, p.module
      FROM permissions p
      JOIN role_permissions rp ON p.id = rp.permission_id
      JOIN user_roles ur ON rp.role_id = ur.role_id
      WHERE ur.user_id = ?
      UNION
      SELECT p.name, p.description, p.module
      FROM permissions p
      JOIN user_permissions up ON p.id = up.permission_id
      WHERE up.user_id = ? AND up.is_granted = true
    `,
      [user.id, user.id],
    )

    return NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.full_name,
        department: user.department,
        roles: userRoles,
        permissions: userPermissions,
      },
    })
  } catch (error) {
    console.error("Auth check error:", error)
    return NextResponse.json({ error: "Oturum doğrulama hatası" }, { status: 401 })
  }
}
