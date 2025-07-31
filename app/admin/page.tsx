"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Users, Shield, Settings, UserPlus, Edit, Trash2, CheckCircle, XCircle, AlertCircle } from "lucide-react"

interface User {
  id: number
  username: string
  email: string
  full_name: string
  department: string
  status: string
  roles: string[]
}

interface Role {
  id: number
  name: string
  description: string
  permissions: string[]
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Bu örnekte static data kullanıyoruz
      setUsers([
        {
          id: 1,
          username: "admin",
          email: "admin@company.com",
          full_name: "Sistem Yöneticisi",
          department: "BT",
          status: "Aktif",
          roles: ["Admin"],
        },
        {
          id: 2,
          username: "muhasebe",
          email: "muhasebe@company.com",
          full_name: "Muhasebe Uzmanı",
          department: "Muhasebe",
          status: "Aktif",
          roles: ["Muhasebe"],
        },
        {
          id: 3,
          username: "finans",
          email: "finans@company.com",
          full_name: "Finans Uzmanı",
          department: "Finans",
          status: "Aktif",
          roles: ["Finans"],
        },
      ])

      setRoles([
        {
          id: 1,
          name: "Admin",
          description: "Sistem yöneticisi - Tüm yetkilere sahip",
          permissions: ["Tüm Yetkiler"],
        },
        {
          id: 2,
          name: "Muhasebe",
          description: "Muhasebe işlemleri yetkisi",
          permissions: ["Muhasebe Görüntüleme", "Muhasebe Ekleme", "Raporlar"],
        },
        {
          id: 3,
          name: "Finans",
          description: "Finansal işlemler yetkisi",
          permissions: ["Bankacılık", "Ödemeler", "Raporlar"],
        },
      ])

      setLoading(false)
    } catch (error) {
      setError("Veri yüklenirken hata oluştu")
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Aktif":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Aktif
          </Badge>
        )
      case "Pasif":
        return (
          <Badge variant="secondary">
            <XCircle className="w-3 h-3 mr-1" />
            Pasif
          </Badge>
        )
      case "Askıda":
        return (
          <Badge variant="destructive">
            <AlertCircle className="w-3 h-3 mr-1" />
            Askıda
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Yükleniyor...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold">Yönetici Paneli</h1>
          <p className="text-gray-600">Kullanıcı ve yetki yönetimi</p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Kullanıcılar
          </TabsTrigger>
          <TabsTrigger value="roles" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Roller
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Ayarlar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Kullanıcı Yönetimi</CardTitle>
                  <CardDescription>Sistem kullanıcılarını görüntüleyin ve yönetin</CardDescription>
                </div>
                <Button className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Yeni Kullanıcı
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">{user.full_name}</h3>
                        <p className="text-sm text-gray-600">
                          @{user.username} • {user.email}
                        </p>
                        <p className="text-sm text-gray-500">{user.department}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1">
                        {user.roles.map((role) => (
                          <Badge key={role} variant="outline">
                            {role}
                          </Badge>
                        ))}
                      </div>
                      {getStatusBadge(user.status)}
                      <div className="flex gap-1">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Rol Yönetimi</CardTitle>
                  <CardDescription>Sistem rollerini ve yetkilerini yönetin</CardDescription>
                </div>
                <Button className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Yeni Rol
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {roles.map((role) => (
                  <Card key={role.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{role.name}</CardTitle>
                          <CardDescription>{role.description}</CardDescription>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {role.permissions.map((permission) => (
                          <Badge key={permission} variant="secondary">
                            {permission}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sistem Ayarları</CardTitle>
              <CardDescription>Genel sistem ayarlarını yapılandırın</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Şirket Adı</Label>
                  <Input id="company-name" placeholder="Şirket adını girin" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="session-timeout">Oturum Zaman Aşımı (dakika)</Label>
                  <Input id="session-timeout" type="number" placeholder="60" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="backup-frequency">Yedekleme Sıklığı</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Yedekleme sıklığını seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Günlük</SelectItem>
                      <SelectItem value="weekly">Haftalık</SelectItem>
                      <SelectItem value="monthly">Aylık</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button>Ayarları Kaydet</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
