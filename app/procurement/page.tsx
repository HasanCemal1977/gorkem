"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Plus, ShoppingCart, Users, FileText, Clock } from "lucide-react"
import Link from "next/link"
import { DataTable } from "@/components/data-table"
import { useState } from "react"

export default function ProcurementPage() {
  const [supplierData, setSupplierData] = useState([
    {
      id: 1,
      name: "Akçansa Çimento",
      contact: "Ahmet Kaya",
      phone: "0212 555 0101",
      email: "ahmet@akcansa.com",
      category: "İnşaat Malzemeleri",
      city: "İstanbul",
      rating: 4.8,
      totalOrders: 25,
      totalAmount: 850000,
      status: "Aktif",
      paymentTerms: "30 Gün",
    },
    {
      id: 2,
      name: "Eczacıbaşı Yapı Gereçleri",
      contact: "Fatma Demir",
      phone: "0216 444 0202",
      email: "fatma@eczacibasi.com",
      category: "Seramik & Banyo",
      city: "İstanbul",
      rating: 4.6,
      totalOrders: 18,
      totalAmount: 420000,
      status: "Aktif",
      paymentTerms: "45 Gün",
    },
    {
      id: 3,
      name: "Bosch Elektrik",
      contact: "Mehmet Özkan",
      phone: "0312 333 0303",
      email: "mehmet@bosch.com",
      category: "Elektrik Malzemeleri",
      city: "Ankara",
      rating: 4.9,
      totalOrders: 32,
      totalAmount: 680000,
      status: "Aktif",
      paymentTerms: "60 Gün",
    },
    {
      id: 4,
      name: "Vitra Banyo",
      contact: "Ayşe Yılmaz",
      phone: "0232 777 0404",
      email: "ayse@vitra.com",
      category: "Banyo Gereçleri",
      city: "İzmir",
      rating: 4.4,
      totalOrders: 12,
      totalAmount: 320000,
      status: "Beklemede",
      paymentTerms: "30 Gün",
    },
  ])

  const [orderData, setOrderData] = useState([
    {
      id: 1,
      orderNumber: "SIP-2024-001",
      supplier: "Akçansa Çimento",
      project: "Konut Projesi A",
      orderDate: "2024-01-15",
      deliveryDate: "2024-01-25",
      amount: 125000,
      status: "Teslim Edildi",
      items: "Çimento 500 ton, Kum 200 m³",
      paymentStatus: "Ödendi",
    },
    {
      id: 2,
      orderNumber: "SIP-2024-002",
      supplier: "Bosch Elektrik",
      project: "Konut Projesi B",
      orderDate: "2024-01-18",
      deliveryDate: "2024-01-28",
      amount: 85000,
      status: "Yolda",
      items: "Kablo 5000m, Priz 200 adet",
      paymentStatus: "Bekliyor",
    },
    {
      id: 3,
      orderNumber: "SIP-2024-003",
      supplier: "Eczacıbaşı Yapı Gereçleri",
      project: "Ofis Kompleksi",
      orderDate: "2024-01-20",
      deliveryDate: "2024-02-05",
      amount: 95000,
      status: "Hazırlanıyor",
      items: "Seramik 500 m², Fayans 300 m²",
      paymentStatus: "Bekliyor",
    },
    {
      id: 4,
      orderNumber: "SIP-2024-004",
      supplier: "Vitra Banyo",
      project: "Villa Projesi",
      orderDate: "2024-01-22",
      deliveryDate: "2024-02-10",
      amount: 65000,
      status: "Sipariş Verildi",
      items: "Klozet 15 adet, Lavabo 20 adet",
      paymentStatus: "Bekliyor",
    },
  ])

  const [tenderData, setTenderData] = useState([
    {
      id: 1,
      tenderNumber: "IHL-2024-001",
      title: "Konut Projesi A - Elektrik İşleri",
      category: "Elektrik",
      publishDate: "2024-01-10",
      deadline: "2024-02-10",
      estimatedAmount: 500000,
      participantCount: 5,
      status: "Devam Ediyor",
      winningBid: null,
      winner: null,
    },
    {
      id: 2,
      tenderNumber: "IHL-2024-002",
      title: "Ofis Kompleksi - Sıhhi Tesisat",
      category: "Sıhhi Tesisat",
      publishDate: "2024-01-05",
      deadline: "2024-01-25",
      estimatedAmount: 300000,
      participantCount: 3,
      status: "Tamamlandı",
      winningBid: 285000,
      winner: "Karadeniz Sıhhi Tesisat",
    },
    {
      id: 3,
      tenderNumber: "IHL-2024-003",
      title: "Villa Projesi - Boyacılık İşleri",
      category: "Boyacılık",
      publishDate: "2024-01-20",
      deadline: "2024-02-20",
      estimatedAmount: 150000,
      participantCount: 7,
      status: "Devam Ediyor",
      winningBid: null,
      winner: null,
    },
  ])

  const supplierColumns = [
    {
      key: "name",
      title: "Tedarikçi Adı",
      filterable: true,
      width: "200px",
      editable: true,
    },
    {
      key: "contact",
      title: "İletişim",
      width: "150px",
      editable: true,
    },
    {
      key: "phone",
      title: "Telefon",
      width: "130px",
      render: (value: string) => (
        <a href={`tel:${value}`} className="text-blue-600 hover:underline">
          {value}
        </a>
      ),
      editable: true,
    },
    {
      key: "category",
      title: "Kategori",
      filterable: true,
      filterType: "select" as const,
      width: "150px",
      filterOptions: [
        { value: "İnşaat Malzemeleri", label: "İnşaat Malzemeleri" },
        { value: "Seramik & Banyo", label: "Seramik & Banyo" },
        { value: "Elektrik Malzemeleri", label: "Elektrik Malzemeleri" },
        { value: "Banyo Gereçleri", label: "Banyo Gereçleri" },
      ],
      editable: true,
    },
    {
      key: "city",
      title: "Şehir",
      filterable: true,
      filterType: "select" as const,
      width: "100px",
      filterOptions: [
        { value: "İstanbul", label: "İstanbul" },
        { value: "Ankara", label: "Ankara" },
        { value: "İzmir", label: "İzmir" },
      ],
      editable: true,
    },
    {
      key: "rating",
      title: "Değerlendirme",
      sortable: true,
      align: "center" as const,
      width: "120px",
      render: (value: number) => (
        <span title={`${value}/5`}>
          {"★".repeat(Math.floor(value))}
          {"☆".repeat(5 - Math.floor(value))} {value}
        </span>
      ),
      editable: true,
    },
    {
      key: "totalOrders",
      title: "Sipariş Sayısı",
      sortable: true,
      align: "center" as const,
      width: "120px",
      editable: true,
    },
    {
      key: "totalAmount",
      title: "Toplam Tutar",
      sortable: true,
      align: "right" as const,
      width: "150px",
      render: (value: number) => `₺${value.toLocaleString()}`,
      editable: true,
    },
    {
      key: "status",
      title: "Durum",
      filterable: true,
      filterType: "select" as const,
      width: "100px",
      filterOptions: [
        { value: "Aktif", label: "Aktif" },
        { value: "Beklemede", label: "Beklemede" },
        { value: "Pasif", label: "Pasif" },
      ],
      render: (value: string) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            value === "Aktif"
              ? "bg-green-100 text-green-800"
              : value === "Beklemede"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-gray-100 text-gray-800"
          }`}
        >
          {value}
        </span>
      ),
      editable: true,
    },
    {
      key: "paymentTerms",
      title: "Ödeme Vadesi",
      width: "120px",
      editable: true,
    },
  ]

  const orderColumns = [
    {
      key: "orderNumber",
      title: "Sipariş No",
      filterable: true,
      width: "130px",
      editable: true,
    },
    {
      key: "supplier",
      title: "Tedarikçi",
      filterable: true,
      width: "180px",
      editable: true,
    },
    {
      key: "project",
      title: "Proje",
      filterable: true,
      filterType: "select" as const,
      width: "150px",
      filterOptions: [
        { value: "Konut Projesi A", label: "Konut Projesi A" },
        { value: "Konut Projesi B", label: "Konut Projesi B" },
        { value: "Ofis Kompleksi", label: "Ofis Kompleksi" },
        { value: "Villa Projesi", label: "Villa Projesi" },
      ],
      editable: true,
    },
    {
      key: "orderDate",
      title: "Sipariş Tarihi",
      sortable: true,
      width: "120px",
      render: (value: string) => new Date(value).toLocaleDateString("tr-TR"),
      editable: true,
    },
    {
      key: "deliveryDate",
      title: "Teslimat Tarihi",
      sortable: true,
      width: "120px",
      render: (value: string) => new Date(value).toLocaleDateString("tr-TR"),
      editable: true,
    },
    {
      key: "amount",
      title: "Tutar",
      sortable: true,
      align: "right" as const,
      width: "120px",
      render: (value: number) => `₺${value.toLocaleString()}`,
      editable: true,
    },
    {
      key: "status",
      title: "Durum",
      filterable: true,
      filterType: "select" as const,
      width: "120px",
      filterOptions: [
        { value: "Teslim Edildi", label: "Teslim Edildi" },
        { value: "Yolda", label: "Yolda" },
        { value: "Hazırlanıyor", label: "Hazırlanıyor" },
        { value: "Sipariş Verildi", label: "Sipariş Verildi" },
      ],
      render: (value: string) => {
        const colorClass =
          value === "Teslim Edildi"
            ? "bg-green-100 text-green-800"
            : value === "Yolda"
              ? "bg-blue-100 text-blue-800"
              : value === "Hazırlanıyor"
                ? "bg-orange-100 text-orange-800"
                : "bg-yellow-100 text-yellow-800"
        return <span className={`px-2 py-1 rounded-full text-xs ${colorClass}`}>{value}</span>
      },
      editable: true,
    },
    {
      key: "paymentStatus",
      title: "Ödeme",
      filterable: true,
      filterType: "select" as const,
      width: "100px",
      filterOptions: [
        { value: "Ödendi", label: "Ödendi" },
        { value: "Bekliyor", label: "Bekliyor" },
      ],
      render: (value: string) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            value === "Ödendi" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {value}
        </span>
      ),
      editable: true,
    },
    {
      key: "items",
      title: "Ürünler",
      width: "200px",
      editable: true,
    },
  ]

  const tenderColumns = [
    {
      key: "tenderNumber",
      title: "İhale No",
      filterable: true,
      width: "130px",
      editable: true,
    },
    {
      key: "title",
      title: "İhale Başlığı",
      filterable: true,
      width: "250px",
      editable: true,
    },
    {
      key: "category",
      title: "Kategori",
      filterable: true,
      filterType: "select" as const,
      width: "120px",
      filterOptions: [
        { value: "Elektrik", label: "Elektrik" },
        { value: "Sıhhi Tesisat", label: "Sıhhi Tesisat" },
        { value: "Boyacılık", label: "Boyacılık" },
      ],
      editable: true,
    },
    {
      key: "publishDate",
      title: "Yayın Tarihi",
      sortable: true,
      width: "120px",
      render: (value: string) => new Date(value).toLocaleDateString("tr-TR"),
      editable: true,
    },
    {
      key: "deadline",
      title: "Son Tarih",
      sortable: true,
      width: "120px",
      render: (value: string) => new Date(value).toLocaleDateString("tr-TR"),
      editable: true,
    },
    {
      key: "estimatedAmount",
      title: "Tahmini Tutar",
      sortable: true,
      align: "right" as const,
      width: "130px",
      render: (value: number) => `₺${value.toLocaleString()}`,
      editable: true,
    },
    {
      key: "participantCount",
      title: "Katılımcı",
      sortable: true,
      align: "center" as const,
      width: "100px",
      editable: true,
    },
    {
      key: "status",
      title: "Durum",
      filterable: true,
      filterType: "select" as const,
      width: "120px",
      filterOptions: [
        { value: "Devam Ediyor", label: "Devam Ediyor" },
        { value: "Tamamlandı", label: "Tamamlandı" },
        { value: "İptal", label: "İptal" },
      ],
      render: (value: string) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            value === "Tamamlandı"
              ? "bg-green-100 text-green-800"
              : value === "Devam Ediyor"
                ? "bg-blue-100 text-blue-800"
                : "bg-red-100 text-red-800"
          }`}
        >
          {value}
        </span>
      ),
      editable: true,
    },
    {
      key: "winner",
      title: "Kazanan",
      width: "180px",
      render: (value: string | null) => value || "-",
      editable: true,
    },
    {
      key: "winningBid",
      title: "Kazanan Teklif",
      align: "right" as const,
      width: "130px",
      render: (value: number | null) => (value ? `₺${value.toLocaleString()}` : "-"),
      editable: true,
    },
  ]

  const handleSupplierUpdate = (id: number, key: string, value: string | number) => {
    setSupplierData((prevData) => prevData.map((item) => (item.id === id ? { ...item, [key]: value } : item)))
  }

  const handleOrderUpdate = (id: number, key: string, value: string | number) => {
    setOrderData((prevData) => prevData.map((item) => (item.id === id ? { ...item, [key]: value } : item)))
  }

  const handleTenderUpdate = (id: number, key: string, value: string | number) => {
    setTenderData((prevData) => prevData.map((item) => (item.id === id ? { ...item, [key]: value } : item)))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <Link href="/">
                <Button variant="ghost" size="sm" className="mr-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Ana Sayfa
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Satın Alma & İhale</h1>
                <p className="text-sm text-gray-500">Tedarikçi yönetimi ve ihale süreçleri</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline">Rapor Al</Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Yeni Sipariş
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Aktif Tedarikçiler</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {supplierData.filter((s) => s.status === "Aktif").length}
                  </p>
                  <p className="text-xs text-green-600">Toplam {supplierData.length}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Bekleyen Siparişler</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {orderData.filter((o) => o.status !== "Teslim Edildi").length}
                  </p>
                  <p className="text-xs text-orange-600">
                    ₺
                    {orderData
                      .filter((o) => o.status !== "Teslim Edildi")
                      .reduce((sum, o) => sum + o.amount, 0)
                      .toLocaleString()}
                  </p>
                </div>
                <ShoppingCart className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Aktif İhaleler</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {tenderData.filter((t) => t.status === "Devam Ediyor").length}
                  </p>
                  <p className="text-xs text-blue-600">
                    {tenderData
                      .filter((t) => t.status === "Devam Ediyor")
                      .reduce((sum, t) => sum + t.participantCount, 0)}{" "}
                    katılımcı
                  </p>
                </div>
                <FileText className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Aylık Harcama</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ₺{orderData.reduce((sum, o) => sum + o.amount, 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-purple-600">Bu ay</p>
                </div>
                <Clock className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="suppliers" className="space-y-6">
          <TabsList>
            <TabsTrigger value="suppliers">Tedarikçiler</TabsTrigger>
            <TabsTrigger value="orders">Siparişler</TabsTrigger>
            <TabsTrigger value="tenders">İhaleler</TabsTrigger>
            <TabsTrigger value="reports">Raporlar</TabsTrigger>
          </TabsList>

          <TabsContent value="suppliers">
            <Card>
              <CardHeader>
                <CardTitle>Tedarikçi Yönetimi</CardTitle>
                <CardDescription>Tedarikçi firmalarınızın listesi ve performans bilgileri</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  data={supplierData}
                  columns={supplierColumns}
                  title="Tedarikçiler"
                  height={500}
                  onRowClick={(row) => console.log("Seçilen tedarikçi:", row)}
                  onUpdate={handleSupplierUpdate}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Sipariş Yönetimi</CardTitle>
                <CardDescription>Tüm siparişlerinizin durumu ve takibi</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  data={orderData}
                  columns={orderColumns}
                  title="Siparişler"
                  height={500}
                  onRowClick={(row) => console.log("Seçilen sipariş:", row)}
                  onUpdate={handleOrderUpdate}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tenders">
            <Card>
              <CardHeader>
                <CardTitle>İhale Yönetimi</CardTitle>
                <CardDescription>İhale süreçleri ve sonuçları</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  data={tenderData}
                  columns={tenderColumns}
                  title="İhaleler"
                  height={500}
                  onRowClick={(row) => console.log("Seçilen ihale:", row)}
                  onUpdate={handleTenderUpdate}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Satın Alma Raporları</CardTitle>
                <CardDescription>Tedarikçi ve sipariş raporları</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Tedarikçi Performansı</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {supplierData.slice(0, 3).map((supplier) => (
                          <div key={supplier.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                            <div>
                              <span className="font-medium">{supplier.name}</span>
                              <p className="text-xs text-gray-500">{supplier.category}</p>
                            </div>
                            <div className="text-right">
                              <span className="text-sm font-bold">⭐ {supplier.rating}</span>
                              <p className="text-xs text-gray-500">{supplier.totalOrders} sipariş</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Kategori Bazlı Harcama</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                          <span className="font-medium">İnşaat Malzemeleri</span>
                          <span className="font-bold">₺850K</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                          <span className="font-medium">Elektrik Malzemeleri</span>
                          <span className="font-bold">₺680K</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-orange-50 rounded">
                          <span className="font-medium">Seramik & Banyo</span>
                          <span className="font-bold">₺420K</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-purple-50 rounded">
                          <span className="font-medium">Banyo Gereçleri</span>
                          <span className="font-bold">₺320K</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
