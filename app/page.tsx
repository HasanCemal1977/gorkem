"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Building2,
  Users,
  Package,
  Calculator,
  CreditCard,
  ShoppingCart,
  FileText,
  Shield,
  LogOut,
  User,
  TrendingUp,
  AlertCircle,
  CheckCircle,
} from "lucide-react"

interface User {
  id: number
  username: string
  email: string
  fullName: string
  department: string
  roles: Array<{ name: string; description: string }>
  permissions: Array<{ name: string; module: string }>
}

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/me")

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      } else {
        router.push("/login")
      }
    } catch (error) {
      router.push("/login")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const hasPermission = (permission: string) => {
    return user?.permissions.some((p) => p.name === permission) || false
  }

  const isAdmin = () => {
    return user?.roles.some((r) => r.name === "Admin") || false
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const modules = [
    {
      title: "Projeler",
      description: "Proje yönetimi ve takibi",
      icon: Building2,
      href: "/projects",
      permission: "project_view",
      color: "bg-blue-500",
    },
    {
      title: "Stok & Envanter",
      description: "Stok takibi ve envanter yönetimi",
      icon: Package,
      href: "/inventory",
      permission: "inventory_view",
      color: "bg-green-500",
    },
    {
      title: "Genel Muhasebe",
      description: "Muhasebe kayıtları ve raporları",
      icon: Calculator,
      href: "/accounting",
      permission: "accounting_view",
      color: "bg-purple-500",
    },
    {
      title: "Bankacılık",
      description: "Banka hesapları ve işlemleri",
      icon: CreditCard,
      href: "/banking",
      permission: "banking_view",
      color: "bg-indigo-500",
    },
    {
      title: "Ödemeler",
      description: "Ödeme planları ve takibi",
      icon: FileText,
      href: "/payments",
      permission: "payment_view",
      color: "bg-orange-500",
    },
    {
      title: "Satın Alma & İhale",
      description: "Tedarikçi ve satın alma yönetimi",
      icon: ShoppingCart,
      href: "/procurement",
      permission: "procurement_view",
      color: "bg-red-500",
    },
    {
      title: "Taşeronlar",
      description: "Taşeron firma yönetimi",
      icon: Users,
      href: "/subcontractors",
      permission: "project_view",
      color: "bg-teal-500",
    },
  ]

  const availableModules = modules.filter((module) => hasPermission(module.permission))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Building2 className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">İnşaat Yönetim Sistemi</h1>
                <p className="text-sm text-gray-600">Hoş geldiniz, {user.fullName}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user.fullName}</p>
                <div className="flex gap-1">
                  {user.roles.map((role) => (
                    <Badge key={role.name} variant="outline" className="text-xs">
                      {role.name}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                {isAdmin() && (
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/admin">
                      <Shield className="h-4 w-4 mr-2" />
                      Yönetici Paneli
                    </Link>
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Çıkış
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Welcome Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Kullanıcı Bilgileri
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Kullanıcı Adı</p>
                <p className="font-medium">{user.username}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">E-posta</p>
                <p className="font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Departman</p>
                <p className="font-medium">{user.department}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableModules.map((module) => {
            const IconComponent = module.icon
            return (
              <Card key={module.href} className="hover:shadow-lg transition-shadow cursor-pointer">
                <Link href={module.href}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${module.color}`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{module.title}</CardTitle>
                        <CardDescription>{module.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Link>
              </Card>
            )
          })}
        </div>

        {availableModules.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Erişim Yetkisi Yok</h3>
              <p className="text-gray-600">
                Herhangi bir modüle erişim yetkiniz bulunmamaktadır. Lütfen sistem yöneticisi ile iletişime geçin.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Quick Stats for Admin */}
        {isAdmin() && (
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Sistem Özeti</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Aktif Kullanıcı</p>
                      <p className="text-xl font-bold">4</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Building2 className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Aktif Proje</p>
                      <p className="text-xl font-bold">12</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Bu Ay Ciro</p>
                      <p className="text-xl font-bold">₺2.4M</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Tamamlanan</p>
                      <p className="text-xl font-bold">8</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
