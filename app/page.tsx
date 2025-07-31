import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Building2,
  Users,
  Calculator,
  CreditCard,
  ShoppingCart,
  FileText,
  Shield,
  Package,
  Calendar,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
} from "lucide-react"
import Link from "next/link"

export default function Dashboard() {
  const modules = [
    {
      title: "Genel Muhasebe",
      description: "Temel muhasebe işlemleri ve finansal raporlama",
      icon: Calculator,
      href: "/accounting",
      color: "bg-blue-500",
      isCore: true,
    },
    {
      title: "Taşeron Yönetimi",
      description: "Taşeron sözleşmeleri ve ödeme takibi",
      icon: Users,
      href: "/subcontractors",
      color: "bg-green-500",
    },
    {
      title: "Proje Yönetimi",
      description: "Şantiye bazlı finansal yönetim",
      icon: Building2,
      href: "/projects",
      color: "bg-purple-500",
    },
    {
      title: "Banka & Krediler",
      description: "Banka hesapları ve kredi yönetimi",
      icon: CreditCard,
      href: "/banking",
      color: "bg-red-500",
    },
    {
      title: "Satın Alma & İhale",
      description: "Tedarikçi yönetimi ve ihale süreçleri",
      icon: ShoppingCart,
      href: "/procurement",
      color: "bg-orange-500",
    },
    {
      title: "Ödemeler & Borçlar",
      description: "Ödeme planları ve borç takibi",
      icon: FileText,
      href: "/payments",
      color: "bg-yellow-500",
    },
    {
      title: "Teminat Mektupları",
      description: "Teminat mektupları ve komisyon takibi",
      icon: Shield,
      href: "/guarantees",
      color: "bg-indigo-500",
    },
    {
      title: "Sipariş & Stok",
      description: "Malzeme siparişleri ve stok yönetimi",
      icon: Package,
      href: "/inventory",
      color: "bg-pink-500",
    },
    {
      title: "Ödeme Planları",
      description: "Uzun vadeli ödeme planları ve amortisman",
      icon: Calendar,
      href: "/payment-plans",
      color: "bg-teal-500",
    },
    {
      title: "Raporlama & Analiz",
      description: "Kapsamlı raporlar ve performans analizi",
      icon: BarChart3,
      href: "/reports",
      color: "bg-cyan-500",
    },
  ]

  const stats = [
    {
      title: "Aktif Projeler",
      value: "12",
      change: "+2",
      icon: Building2,
      color: "text-blue-600",
    },
    {
      title: "Toplam Ciro",
      value: "₺2.4M",
      change: "+15%",
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      title: "Bekleyen Ödemeler",
      value: "₺340K",
      change: "-8%",
      icon: AlertTriangle,
      color: "text-orange-600",
    },
    {
      title: "Tamamlanan İşler",
      value: "28",
      change: "+4",
      icon: CheckCircle,
      color: "text-purple-600",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">İnşaat Yönetim Sistemi</h1>
                <p className="text-sm text-gray-500">Modüler İnşaat Firması Yönetim Yazılımı</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline">Ayarlar</Button>
              <Button>Yeni Proje</Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p
                      className={`text-sm ${stat.change.startsWith("+") ? "text-green-600" : stat.change.startsWith("-") ? "text-red-600" : "text-gray-600"}`}
                    >
                      {stat.change} bu ay
                    </p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Modules Grid */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Sistem Modülleri</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {modules.map((module, index) => (
              <Link key={index} href={module.href}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className={`p-2 rounded-lg ${module.color} text-white`}>
                        <module.icon className="h-6 w-6" />
                      </div>
                      {module.isCore && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Temel Modül</span>
                      )}
                    </div>
                    <CardTitle className="text-lg">{module.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm">{module.description}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Hızlı İşlemler</CardTitle>
            <CardDescription>Sık kullanılan işlemlere hızlı erişim</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex-col bg-transparent">
                <FileText className="h-6 w-6 mb-2" />
                Yeni Fatura
              </Button>
              <Button variant="outline" className="h-20 flex-col bg-transparent">
                <Users className="h-6 w-6 mb-2" />
                Taşeron Ekle
              </Button>
              <Button variant="outline" className="h-20 flex-col bg-transparent">
                <CreditCard className="h-6 w-6 mb-2" />
                Ödeme Yap
              </Button>
              <Button variant="outline" className="h-20 flex-col bg-transparent">
                <BarChart3 className="h-6 w-6 mb-2" />
                Rapor Oluştur
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
