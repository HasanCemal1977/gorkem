import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ error: "Kullanıcı adı ve şifre gerekli" }, { status: 400 })
    }

    // Kullanıcıyı bul
    const users = await executeQuery('SELECT * FROM users WHERE username = ? AND status = "Aktif"', [username])

    if (!users || users.length === 0) {
      return NextResponse.json({ error: "Geçersiz kullanıcı adı veya şifre" }, { status: 401 })
    }

    const user = users[0]

    // Şifre kontrolü (basit kontrol - production'da bcrypt kullanın)
    const isValidPassword = password === "123456" // Test için basit şifre

    if (!isValidPassword) {
      return NextResponse.json({ error: "Geçersiz kullanıcı adı veya şifre" }, { status: 401 })
    }

    // Kullanıcının rollerini ve yetkilerini al
    const userRoles = await executeQuery(
      `
      SELECT r.id, r.name, r.description
      FROM roles r
      JOIN user_roles ur ON r.id = ur.role_id
      WHERE ur.user_id = ?
    `,
      [user.id],
    )

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

    // JWT token oluştur
    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        roles: userRoles.map((r: any) => r.name),
      },
      JWT_SECRET,
      { expiresIn: "24h" },
    )

    // Session kaydet
    const sessionToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 saat

    await executeQuery("INSERT INTO user_sessions (user_id, session_token, expires_at) VALUES (?, ?, ?)", [
      user.id,
      sessionToken,
      expiresAt,
    ])

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.full_name,
        department: user.department,
        roles: userRoles,
        permissions: userPermissions,
      },
      token,
    })

    // HTTP-only cookie olarak token'ı set et
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60, // 24 saat
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Giriş işlemi sırasında hata oluştu" }, { status: 500 })
  }
}
