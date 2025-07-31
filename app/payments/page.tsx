"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Plus, FileText, AlertTriangle, CheckCircle, Clock } from "lucide-react"
import Link from "next/link"
import { DataTable } from "@/components/data-table"
import { useState } from "react"

export default function PaymentsPage() {
  const [paymentData, setPaymentData] = useState([
    {
      id: 1,
      paymentNumber: "ÖDM-2024-001",
      recipient: "Mehmet İnşaat Ltd.",
      amount: 75000,
      dueDate: "2024-01-25",
      paymentDate: "2024-01-24",
      status: "Ödendi",
      paymentMethod: "Banka Havalesi",
      project: "Konut Projesi A",
      description: "Betonarme işleri - 1. hakediş",
      category: "Taşeron Ödemesi",
    },
    {
      id: 2,
      paymentNumber: "ÖDM-2024-002",
      recipient: "Akçansa Çimento",
      amount: 125000,
      dueDate: "2024-02-01",
      paymentDate: null,
      status: "Bekliyor",
      paymentMethod: "EFT",
      project: "Konut Projesi A",
      description: "Çimento ve kum alımı",
      category: "Malzeme Ödemesi",
    },
    {
      id: 3,
      paymentNumber: "ÖDM-2024-003",
      recipient: "Bosch Elektrik",
      amount: 85000,
      dueDate: "2024-01-30",
      paymentDate: null,
      status: "Gecikmiş",
      paymentMethod: "Çek",
      project: "Konut Projesi B",
      description: "Elektrik malzemeleri",
      category: "Malzeme Ödemesi",
    },
    {
      id: 4,
      paymentNumber: "ÖDM-2024-004",
      recipient: "Ziraat Bankası",
      amount: 45000,
      dueDate: "2024-02-05",
      paymentDate: null,
      status: "Planlandı",
      paymentMethod: "Otomatik Ödeme",
      project: "Genel",
      description: "Kredi faiz ödemesi",
      category: "Kredi Ödemesi",
    },
    {
      id: 5,
      paymentNumber: "ÖDM-2024-005",
      recipient: "Güven Elektrik",
      amount: 45000,
      dueDate: "2024-02-10",
      paymentDate: null,
      status: "Bekliyor",
      paymentMethod: "Banka Havalesi",
      project: "Konut Projesi B",
      description: "Elektrik tesisatı kurulumu",
      category: "Taşeron Ödemesi",
    },
  ])

  const [debtData, setDebtData] = useState([
    {
      id: 1,
      creditor: "Mehmet İnşaat Ltd.",
      originalAmount: 150000,
      paidAmount: 75000,
      remainingAmount: 75000,
      dueDate: "2024-02-15",
      daysPastDue: 0,
      status: "Aktif",
      project: "Konut Projesi A",
      interestRate: 0,
      lastPayment: "2024-01-24",
    },
    {
      id: 2,
      creditor: "Akçansa Çimento",
      originalAmount: 250000,
      paidAmount: 125000,
      remainingAmount: 125000,
      dueDate: "2024-01-28",
      daysPastDue: 3,
      status: "Gecikmiş",
      project: "Konut Projesi A",
      interestRate: 2.5,
      lastPayment: "2024-01-15",
    },
    {
      id: 3,
      creditor: "Bosch Elektrik",
      originalAmount: 85000,
      paidAmount: 0,
      remainingAmount: 85000,
      dueDate: "2024-02-10",
      daysPastDue: 0,
      status: "Aktif",
      project: "Konut Projesi B",
      interestRate: 0,
      lastPayment: null,
    },
  ])

  const paymentColumns = [
    {
      key: "paymentNumber",
      title: "Ödeme No",
      filterable: true,
      width: "130px",
    },
    {
      key: "recipient",
      title: "Alıcı",
      filterable: true,
      width: "180px",
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
      key: "dueDate",
      title: "Vade Tarihi",
      sortable: true,
      width: "120px",
      render: (value: string) => new Date(value).toLocaleDateString("tr-TR"),
    },
    {
      key: "paymentDate",
      title: "Ödeme Tarihi",
      sortable: true,
      width: "120px",
      render: (value: string | null) => (value ? new Date(value).toLocaleDateString("tr-TR") : "-"),
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
        { value: "Gecikmiş", label: "Gecikmiş" },
        { value: "Planlandı", label: "Planlandı" },
      ],
      render: (value: string) => {
        const colorClass =
          value === "Ödendi"
            ? "bg-green-100 text-green-800"
            : value === "Bekliyor"
              ? "bg-yellow-100 text-yellow-800"
              : value === "Gecikmiş"
                ? "bg-red-100 text-red-800"
                : "bg-blue-100 text-blue-800"
        return <span className={`px-2 py-1 rounded-full text-xs ${colorClass}`}>{value}</span>
      },
    },
    {
      key: "paymentMethod",
      title: "Ödeme Yöntemi",
      filterable: true,
      filterType: "select" as const,
      width: "130px",
      filterOptions: [
        { value: "Banka Havalesi", label: "Banka Havalesi" },
        { value: "EFT", label: "EFT" },
        { value: "Çek", label: "Çek" },
        { value: "Otomatik Ödeme", label: "Otomatik Ödeme" },
      ],
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
        { value: "Genel", label: "Genel" },
      ],
    },
    {
      key: "category",
      title: "Kategori",
      filterable: true,
      filterType: "select" as const,
      width: "130px",
      filterOptions: [
        { value: "Taşeron Ödemesi", label: "Taşeron Ödemesi" },
        { value: "Malzeme Ödemesi", label: "Malzeme Ödemesi" },
        { value: "Kredi Ödemesi", label: "Kredi Ödemesi" },
      ],
    },
    {
      key: "description",
      title: "Açıklama",
      width: "200px",
    },
  ]

  const debtColumns = [
    {
      key: "creditor",
      title: "Alacaklı",
      filterable: true,
      width: "180px",
    },
    {
      key: "originalAmount",
      title: "Orijinal Tutar",
      sortable: true,
      align: "right" as const,
      width: "130px",
      render: (value: number) => `₺${value.toLocaleString()}`,
    },
    {
      key: "paidAmount",
      title: "Ödenen",
      sortable: true,
      align: "right" as const,
      width: "120px",
      render: (value: number) => `₺${value.toLocaleString()}`,
    },
    {
      key: "remainingAmount",
      title: "Kalan",
      sortable: true,
      align: "right" as const,
      width: "120px",
      render: (value: number) => `₺${value.toLocaleString()}`,
    },
    {
      key: "dueDate",
      title: "Vade Tarihi",
      sortable: true,
      width: "120px",
      render: (value: string) => new Date(value).toLocaleDateString("tr-TR"),
    },
    {
      key: "daysPastDue",
      title: "Gecikme (Gün)",
      sortable: true,
      align: "center" as const,
      width: "120px",
      render: (value: number) => (
        <span className={value > 0 ? "text-red-600 font-medium" : "text-gray-600"}>{value}</span>
      ),
    },
    {
      key: "status",
      title: "Durum",
      filterable: true,
      filterType: "select" as const,
      width: "100px",
      filterOptions: [
        { value: "Aktif", label: "Aktif" },
        { value: "Gecikmiş", label: "Gecikmiş" },
        { value: "Kapalı", label: "Kapalı" },
      ],
      render: (value: string) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            value === "Aktif"
              ? "bg-blue-100 text-blue-800"
              : value === "Gecikmiş"
                ? "bg-red-100 text-red-800"
                : "bg-green-100 text-green-800"
          }`}
        >
          {value}
        </span>
      ),
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
      ],
    },
    {
      key: "interestRate",
      title: "Faiz Oranı",
      sortable: true,
      align: "center" as const,
      width: "100px",
      render: (value: number) => (value > 0 ? `%${value}` : "-"),
    },
    {
      key: "lastPayment",
      title: "Son Ödeme",
      sortable: true,
      width: "120px",
      render: (value: string | null) => (value ? new Date(value).toLocaleDateString("tr-TR") : "-"),
    },
  ]

  const handlePaymentUpdate = (id: number, key: string, value: string | number | null) => {
    setPaymentData((prevData) => prevData.map((item) => (item.id === id ? { ...item, [key]: value } : item)))
  }

  const handleDebtUpdate = (id: number, key: string, value: string | number | null) => {
    setDebtData((prevData) => prevData.map((item) => (item.id === id ? { ...item, [key]: value } : item)))
  }

  const handleCreatePayment = (newPayment: any) => {
    setPaymentData((prevData) => [...prevData, { ...newPayment, id: Date.now() }])
  }

  const handleCreateDebt = (newDebt: any) => {
    setDebtData((prevData) => [...prevData, { ...newDebt, id: Date.now() }])
  }

  const handleDeletePayment = (id: number) => {
    setPaymentData((prevData) => prevData.filter((item) => item.id !== id))
  }

  const handleDeleteDebt = (id: number) => {
    setDebtData((prevData) => prevData.filter((item) => item.id !== id))
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
                <h1 className="text-2xl font-bold text-gray-900">Ödemeler & Borç Takibi</h1>
                <p className="text-sm text-gray-500">Ödeme planları ve borç yönetimi</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline">Rapor Al</Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Yeni Ödeme
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
                  <p className="text-sm font-medium text-gray-600">Bekleyen Ödemeler</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ₺
                    {paymentData
                      .filter((p) => p.status === "Bekliyor")
                      .reduce((sum, p) => sum + p.amount, 0)
                      .toLocaleString()}
                  </p>
                  <p className="text-xs text-orange-600">
                    {paymentData.filter((p) => p.status === "Bekliyor").length} ödeme
                  </p>
                </div>
                <Clock className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Gecikmiş Ödemeler</p>
                  <p className="text-2xl font-bold text-red-600">
                    ₺
                    {paymentData
                      .filter((p) => p.status === "Gecikmiş")
                      .reduce((sum, p) => sum + p.amount, 0)
                      .toLocaleString()}
                  </p>
                  <p className="text-xs text-red-600">
                    {paymentData.filter((p) => p.status === "Gecikmiş").length} ödeme
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ödenen</p>
                  <p className="text-2xl font-bold text-green-600">
                    ₺
                    {paymentData
                      .filter((p) => p.status === "Ödendi")
                      .reduce((sum, p) => sum + p.amount, 0)
                      .toLocaleString()}
                  </p>
                  <p className="text-xs text-green-600">
                    {paymentData.filter((p) => p.status === "Ödendi").length} ödeme
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Toplam Borç</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ₺{debtData.reduce((sum, d) => sum + d.remainingAmount, 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-purple-600">{debtData.length} alacaklı</p>
                </div>
                <FileText className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="payments" className="space-y-6">
          <TabsList>
            <TabsTrigger value="payments">Ödeme Takibi</TabsTrigger>
            <TabsTrigger value="debts">Borç Yönetimi</TabsTrigger>
            <TabsTrigger value="schedule">Ödeme Takvimi</TabsTrigger>
            <TabsTrigger value="reports">Raporlar</TabsTrigger>
          </TabsList>

          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>Ödeme Takibi</CardTitle>
                <CardDescription>Tüm ödemelerinizin durumu ve takibi</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  data={paymentData}
                  columns={paymentColumns}
                  title="Ödemeler"
                  height={500}
                  onRowClick={(row) => console.log("Seçilen ödeme:", row)}
                  onUpdate={handlePaymentUpdate}
                  onCreate={handleCreatePayment}
                  onDelete={handleDeletePayment}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="debts">
            <Card>
              <CardHeader>
                <CardTitle>Borç Yönetimi</CardTitle>
                <CardDescription>Açık borçlarınız ve alacaklı bilgileri</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  data={debtData}
                  columns={debtColumns}
                  title="Borçlar"
                  height={500}
                  onRowClick={(row) => console.log("Seçilen borç:", row)}
                  onUpdate={handleDebtUpdate}
                  onCreate={handleCreateDebt}
                  onDelete={handleDeleteDebt}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule">
            <Card>
              <CardHeader>
                <CardTitle>Ödeme Takvimi</CardTitle>
                <CardDescription>Yaklaşan ödemeler ve vade tarihleri</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {paymentData
                    .filter((p) => p.status !== "Ödendi")
                    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                    .map((payment) => (
                      <div key={payment.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-medium">{payment.recipient}</h3>
                            <p className="text-sm text-gray-600">{payment.description}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-lg font-bold">₺{payment.amount.toLocaleString()}</span>
                            <p className="text-sm text-gray-500">
                              {new Date(payment.dueDate).toLocaleDateString("tr-TR")}
                            </p>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              payment.status === "Gecikmiş"
                                ? "bg-red-100 text-red-800"
                                : payment.status === "Bekliyor"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {payment.status}
                          </span>
                          <span className="text-sm text-gray-500">{payment.paymentMethod}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Ödeme Raporları</CardTitle>
                <CardDescription>Ödeme ve borç analizi raporları</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Ödeme Durumu</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                          <span className="font-medium">Ödenen</span>
                          <span className="font-bold text-green-600">
                            ₺
                            {paymentData
                              .filter((p) => p.status === "Ödendi")
                              .reduce((sum, p) => sum + p.amount, 0)
                              .toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-yellow-50 rounded">
                          <span className="font-medium">Bekleyen</span>
                          <span className="font-bold text-yellow-600">
                            ₺
                            {paymentData
                              .filter((p) => p.status === "Bekliyor")
                              .reduce((sum, p) => sum + p.amount, 0)
                              .toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-red-50 rounded">
                          <span className="font-medium">Gecikmiş</span>
                          <span className="font-bold text-red-600">
                            ₺
                            {paymentData
                              .filter((p) => p.status === "Gecikmiş")
                              .reduce((sum, p) => sum + p.amount, 0)
                              .toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Kategori Bazlı Ödemeler</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                          <span className="font-medium">Taşeron Ödemeleri</span>
                          <span className="font-bold">
                            ₺
                            {paymentData
                              .filter((p) => p.category === "Taşeron Ödemesi")
                              .reduce((sum, p) => sum + p.amount, 0)
                              .toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-orange-50 rounded">
                          <span className="font-medium">Malzeme Ödemeleri</span>
                          <span className="font-bold">
                            ₺
                            {paymentData
                              .filter((p) => p.category === "Malzeme Ödemesi")
                              .reduce((sum, p) => sum + p.amount, 0)
                              .toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-purple-50 rounded">
                          <span className="font-medium">Kredi Ödemeleri</span>
                          <span className="font-bold">
                            ₺
                            {paymentData
                              .filter((p) => p.category === "Kredi Ödemesi")
                              .reduce((sum, p) => sum + p.amount, 0)
                              .toLocaleString()}
                          </span>
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
