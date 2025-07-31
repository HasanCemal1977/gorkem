"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, Calendar, DollarSign } from "lucide-react"
import Link from "next/link"
import { DataTable } from "@/components/data-table"
import { useState } from "react"

export default function SubcontractorsPage() {
  const [subcontractorData, setSubcontractorData] = useState([
    {
      id: 1,
      name: "Mehmet İnşaat Ltd.",
      contact: "Mehmet Yılmaz",
      phone: "0532 123 4567",
      email: "mehmet@mehmetinsaat.com",
      specialty: "Betonarme İşleri",
      status: "Aktif",
      totalProjects: 5,
      totalPayments: 450000,
      lastPayment: "2024-01-15",
      rating: 4.5,
      city: "Ankara",
    },
    {
      id: 2,
      name: "Güven Elektrik",
      contact: "Ali Güven",
      phone: "0533 987 6543",
      email: "ali@guvenelektrik.com",
      specialty: "Elektrik İşleri",
      status: "Aktif",
      totalProjects: 8,
      totalPayments: 280000,
      lastPayment: "2024-01-12",
      rating: 4.8,
      city: "İstanbul",
    },
    {
      id: 3,
      name: "Karadeniz Sıhhi Tesisat",
      contact: "Hasan Karadeniz",
      phone: "0534 456 7890",
      email: "hasan@karadeniztesisat.com",
      specialty: "Sıhhi Tesisat",
      status: "Beklemede",
      totalProjects: 3,
      totalPayments: 120000,
      lastPayment: "2024-01-08",
      rating: 4.2,
      city: "Trabzon",
    },
    {
      id: 4,
      name: "Anadolu Boyacılık",
      contact: "Fatma Anadolu",
      phone: "0535 789 0123",
      email: "fatma@anadoluboya.com",
      specialty: "Boyacılık",
      status: "Aktif",
      totalProjects: 12,
      totalPayments: 180000,
      lastPayment: "2024-01-10",
      rating: 4.6,
      city: "İzmir",
    },
  ])

  const subcontractorColumns = [
    {
      key: "name",
      title: "Firma Adı",
      filterable: true,
      width: "200px",
      editable: true,
      type: "text" as const,
      required: true,
    },
    {
      key: "contact",
      title: "İletişim",
      width: "150px",
      editable: true,
      type: "text" as const,
      required: true,
    },
    {
      key: "phone",
      title: "Telefon",
      width: "130px",
      editable: true,
      type: "text" as const,
      required: true,
      render: (value: string) => (
        <a href={`tel:${value}`} className="text-blue-600 hover:underline">
          {value}
        </a>
      ),
    },
    {
      key: "email",
      title: "E-posta",
      width: "180px",
      editable: true,
      type: "text" as const,
      required: true,
      render: (value: string) => (
        <a href={`mailto:${value}`} className="text-blue-600 hover:underline">
          {value}
        </a>
      ),
    },
    {
      key: "specialty",
      title: "Uzmanlık",
      filterable: true,
      filterType: "select" as const,
      width: "150px",
      editable: true,
      type: "select" as const,
      required: true,
      filterOptions: [
        { value: "Betonarme İşleri", label: "Betonarme İşleri" },
        { value: "Elektrik İşleri", label: "Elektrik İşleri" },
        { value: "Sıhhi Tesisat", label: "Sıhhi Tesisat" },
        { value: "Boyacılık", label: "Boyacılık" },
      ],
      selectOptions: [
        { value: "Betonarme İşleri", label: "Betonarme İşleri" },
        { value: "Elektrik İşleri", label: "Elektrik İşleri" },
        { value: "Sıhhi Tesisat", label: "Sıhhi Tesisat" },
        { value: "Boyacılık", label: "Boyacılık" },
        { value: "Doğalgaz Tesisatı", label: "Doğalgaz Tesisatı" },
        { value: "Asansör", label: "Asansör" },
      ],
    },
    {
      key: "city",
      title: "Şehir",
      filterable: true,
      filterType: "select" as const,
      width: "100px",
      editable: true,
      type: "select" as const,
      required: true,
      filterOptions: [
        { value: "Ankara", label: "Ankara" },
        { value: "İstanbul", label: "İstanbul" },
        { value: "İzmir", label: "İzmir" },
        { value: "Trabzon", label: "Trabzon" },
      ],
      selectOptions: [
        { value: "Ankara", label: "Ankara" },
        { value: "İstanbul", label: "İstanbul" },
        { value: "İzmir", label: "İzmir" },
        { value: "Trabzon", label: "Trabzon" },
        { value: "Antalya", label: "Antalya" },
        { value: "Bursa", label: "Bursa" },
      ],
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
            value === "Aktif" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      key: "totalProjects",
      title: "Proje Sayısı",
      sortable: true,
      align: "center" as const,
      width: "120px",
    },
    {
      key: "totalPayments",
      title: "Toplam Ödeme",
      sortable: true,
      align: "right" as const,
      width: "150px",
      render: (value: number) => `₺${value.toLocaleString()}`,
    },
    {
      key: "lastPayment",
      title: "Son Ödeme",
      sortable: true,
      width: "120px",
      render: (value: string) => new Date(value).toLocaleDateString("tr-TR"),
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
    },
  ]

  const paymentData = [
    {
      id: 1,
      subcontractor: "Mehmet İnşaat Ltd.",
      project: "Konut Projesi A",
      amount: 75000,
      date: "2024-01-15",
      status: "Ödendi",
      description: "Betonarme işleri - 1. hakediş",
      paymentMethod: "Banka Havalesi",
    },
    {
      id: 2,
      subcontractor: "Güven Elektrik",
      project: "Konut Projesi B",
      amount: 45000,
      date: "2024-01-12",
      status: "Ödendi",
      description: "Elektrik tesisatı kurulumu",
      paymentMethod: "Çek",
    },
    {
      id: 3,
      subcontractor: "Karadeniz Sıhhi Tesisat",
      project: "Konut Projesi A",
      amount: 32000,
      date: "2024-01-20",
      status: "Bekliyor",
      description: "Sıhhi tesisat malzemeleri",
      paymentMethod: "Banka Havalesi",
    },
    {
      id: 4,
      subcontractor: "Anadolu Boyacılık",
      project: "Ofis Kompleksi",
      amount: 28000,
      date: "2024-01-18",
      status: "Ödendi",
      description: "İç mekan boyama işleri",
      paymentMethod: "Nakit",
    },
  ]

  const paymentColumns = [
    {
      key: "subcontractor",
      title: "Taşeron",
      filterable: true,
      width: "200px",
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
      ],
    },
    {
      key: "amount",
      title: "Tutar",
      sortable: true,
      align: "right" as const,
      width: "120px",
      render: (value: number) => `₺${value.toLocaleString()}`,
    },
    {
      key: "date",
      title: "Tarih",
      sortable: true,
      width: "120px",
      render: (value: string) => new Date(value).toLocaleDateString("tr-TR"),
    },
    {
      key: "status",
      title: "Durum",
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
    },
    {
      key: "paymentMethod",
      title: "Ödeme Yöntemi",
      width: "130px",
    },
    {
      key: "description",
      title: "Açıklama",
      width: "250px",
    },
  ]

  const handleSubcontractorClick = (rowData: any) => {
    console.log("Seçilen taşeron:", rowData)
  }

  const handlePaymentClick = (rowData: any) => {
    console.log("Seçilen ödeme:", rowData)
  }

  const handleAddSubcontractor = (newRow: any) => {
    const newId = Math.max(...subcontractorData.map((item) => item.id), 0) + 1
    const newRecord = {
      ...newRow,
      id: newId,
      totalProjects: 0,
      totalPayments: 0,
      rating: 0,
      lastPayment: new Date().toISOString().split("T")[0],
    }
    setSubcontractorData([...subcontractorData, newRecord])
  }

  const handleUpdateSubcontractor = (id: number, updatedRow: any) => {
    setSubcontractorData(subcontractorData.map((item) => (item.id === id ? { ...updatedRow, id } : item)))
  }

  const handleDeleteSubcontractor = (id: number) => {
    setSubcontractorData(subcontractorData.filter((item) => item.id !== id))
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
                <h1 className="text-2xl font-bold text-gray-900">Taşeron Yönetimi</h1>
                <p className="text-sm text-gray-500">Taşeron firmaları ve ödeme takibi</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline">Rapor Al</Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Yeni Taşeron
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
                  <p className="text-sm font-medium text-gray-600">Toplam Taşeron</p>
                  <p className="text-2xl font-bold text-gray-900">{subcontractorData.length}</p>
                </div>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Aktif Taşeron</p>
                  <p className="text-2xl font-bold text-green-600">
                    {subcontractorData.filter((s) => s.status === "Aktif").length}
                  </p>
                </div>
                <div className="p-2 bg-green-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Bekleyen Ödeme</p>
                  <p className="text-2xl font-bold text-orange-600">
                    ₺
                    {paymentData
                      .filter((p) => p.status === "Bekliyor")
                      .reduce((sum, p) => sum + p.amount, 0)
                      .toLocaleString()}
                  </p>
                </div>
                <div className="p-2 bg-orange-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Toplam Ödeme</p>
                  <p className="text-2xl font-bold text-purple-600">
                    ₺{paymentData.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
                  </p>
                </div>
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="subcontractors" className="space-y-6">
          <TabsList>
            <TabsTrigger value="subcontractors">Taşeron Listesi</TabsTrigger>
            <TabsTrigger value="payments">Ödeme Takibi</TabsTrigger>
            <TabsTrigger value="contracts">Sözleşmeler</TabsTrigger>
            <TabsTrigger value="performance">Performans</TabsTrigger>
          </TabsList>

          <TabsContent value="subcontractors">
            <Card>
              <CardHeader>
                <CardTitle>Taşeron Firmaları</CardTitle>
                <CardDescription>
                  Çalıştığınız taşeron firmalarının listesi ve detayları. Tabloda filtreleme yapabilir ve kayıtları dışa
                  aktarabilirsiniz.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  data={subcontractorData}
                  columns={subcontractorColumns}
                  title="Taşeron Firmaları"
                  height={500}
                  editable={true}
                  onAdd={handleAddSubcontractor}
                  onUpdate={handleUpdateSubcontractor}
                  onDelete={handleDeleteSubcontractor}
                  idField="id"
                  autoAddRow={true}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>Ödeme Takibi</CardTitle>
                <CardDescription>Taşeron ödemelerinin detaylı takibi ve analizi</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  data={paymentData}
                  columns={paymentColumns}
                  title="Taşeron Ödemeleri"
                  height={500}
                  onRowClick={handlePaymentClick}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contracts">
            <Card>
              <CardHeader>
                <CardTitle>Sözleşme Yönetimi</CardTitle>
                <CardDescription>Taşeron sözleşmeleri ve anlaşmaları</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {subcontractorData.map((contractor) => (
                      <Card key={contractor.id}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium">{contractor.name}</h3>
                            <Badge variant={contractor.status === "Aktif" ? "default" : "secondary"}>
                              {contractor.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{contractor.specialty} Sözleşmesi</p>
                          <div className="text-xs text-gray-500">
                            <p>Proje Sayısı: {contractor.totalProjects}</p>
                            <p>Toplam Ödeme: ₺{contractor.totalPayments.toLocaleString()}</p>
                            <p>Değerlendirme: ⭐ {contractor.rating}/5</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance">
            <Card>
              <CardHeader>
                <CardTitle>Performans Değerlendirme</CardTitle>
                <CardDescription>Taşeron firmalarının performans analizi</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {subcontractorData.map((contractor) => (
                    <div key={contractor.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-medium text-lg">{contractor.name}</h3>
                          <p className="text-sm text-gray-600">
                            {contractor.specialty} - {contractor.city}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">⭐ {contractor.rating}</div>
                          <p className="text-xs text-gray-500">5 üzerinden</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-3 bg-blue-50 rounded">
                          <div className="text-xl font-bold text-blue-600">{contractor.totalProjects}</div>
                          <div className="text-sm text-gray-600">Tamamlanan Proje</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded">
                          <div className="text-xl font-bold text-green-600">
                            ₺{contractor.totalPayments.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-600">Toplam Ödeme</div>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded">
                          <div className="text-xl font-bold text-purple-600">%95</div>
                          <div className="text-sm text-gray-600">Zamanında Teslim</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
