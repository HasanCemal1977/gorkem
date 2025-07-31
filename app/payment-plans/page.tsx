"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Plus, Calendar, DollarSign, TrendingUp, CheckCircle } from "lucide-react"
import Link from "next/link"
import { DataTable } from "@/components/data-table"
import { useState } from "react"

export default function PaymentPlansPage() {
  const [paymentPlanData, setPaymentPlanData] = useState([
    {
      id: 1,
      planNumber: "PP-2024-001",
      planName: "Konut Projesi A - Ekipman Finansmanı",
      totalAmount: 500000,
      paidAmount: 150000,
      remainingAmount: 350000,
      installmentCount: 24,
      paidInstallments: 6,
      monthlyPayment: 25000,
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      interestRate: 18.5,
      status: "Aktif",
      creditor: "ABC Leasing",
      category: "Ekipman Finansmanı",
      nextPaymentDate: "2024-02-01",
    },
    {
      id: 2,
      planNumber: "PP-2024-002",
      planName: "Ofis Kompleksi - Araç Kredisi",
      totalAmount: 300000,
      paidAmount: 200000,
      remainingAmount: 100000,
      installmentCount: 36,
      paidInstallments: 24,
      monthlyPayment: 12500,
      startDate: "2023-06-01",
      endDate: "2026-05-31",
      interestRate: 16.8,
      status: "Aktif",
      creditor: "XYZ Bank",
      category: "Araç Kredisi",
      nextPaymentDate: "2024-02-01",
    },
    {
      id: 3,
      planNumber: "PP-2024-003",
      planName: "Villa Projesi - Makine Finansmanı",
      totalAmount: 750000,
      paidAmount: 750000,
      remainingAmount: 0,
      installmentCount: 18,
      paidInstallments: 18,
      monthlyPayment: 45000,
      startDate: "2022-08-01",
      endDate: "2024-01-31",
      interestRate: 15.2,
      status: "Tamamlandı",
      creditor: "DEF Finansman",
      category: "Makine Finansmanı",
      nextPaymentDate: null,
    },
    {
      id: 4,
      planNumber: "PP-2024-004",
      planName: "Genel - Ofis Mobilyası",
      totalAmount: 120000,
      paidAmount: 40000,
      remainingAmount: 80000,
      installmentCount: 12,
      paidInstallments: 4,
      monthlyPayment: 10000,
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      interestRate: 12.5,
      status: "Aktif",
      creditor: "GHI Mobilya",
      category: "Mobilya",
      nextPaymentDate: "2024-02-01",
    },
  ])

  const [installmentData, setInstallmentData] = useState([
    {
      id: 1,
      planNumber: "PP-2024-001",
      installmentNumber: 7,
      dueDate: "2024-02-01",
      amount: 25000,
      principalAmount: 18500,
      interestAmount: 6500,
      status: "Bekliyor",
      paymentDate: null,
      lateDays: 0,
      penaltyAmount: 0,
    },
    {
      id: 2,
      planNumber: "PP-2024-001",
      installmentNumber: 6,
      dueDate: "2024-01-01",
      amount: 25000,
      principalAmount: 18200,
      interestAmount: 6800,
      status: "Ödendi",
      paymentDate: "2024-01-01",
      lateDays: 0,
      penaltyAmount: 0,
    },
    {
      id: 3,
      planNumber: "PP-2024-002",
      installmentNumber: 25,
      dueDate: "2024-02-01",
      amount: 12500,
      principalAmount: 10200,
      interestAmount: 2300,
      status: "Bekliyor",
      paymentDate: null,
      lateDays: 0,
      penaltyAmount: 0,
    },
    {
      id: 4,
      planNumber: "PP-2024-004",
      installmentNumber: 5,
      dueDate: "2024-02-01",
      amount: 10000,
      principalAmount: 8800,
      interestAmount: 1200,
      status: "Bekliyor",
      paymentDate: null,
      lateDays: 0,
      penaltyAmount: 0,
    },
  ])

  const [amortizationData, setAmortizationData] = useState([
    {
      id: 1,
      planNumber: "PP-2024-001",
      month: 1,
      openingBalance: 500000,
      payment: 25000,
      principal: 17708,
      interest: 7292,
      closingBalance: 482292,
      cumulativePrincipal: 17708,
      cumulativeInterest: 7292,
    },
    {
      id: 2,
      planNumber: "PP-2024-001",
      month: 2,
      openingBalance: 482292,
      payment: 25000,
      principal: 17981,
      interest: 7019,
      closingBalance: 464311,
      cumulativePrincipal: 35689,
      cumulativeInterest: 14311,
    },
    {
      id: 3,
      planNumber: "PP-2024-001",
      month: 3,
      openingBalance: 464311,
      payment: 25000,
      principal: 18258,
      interest: 6742,
      closingBalance: 446053,
      cumulativePrincipal: 53947,
      cumulativeInterest: 21053,
    },
    {
      id: 4,
      planNumber: "PP-2024-001",
      month: 4,
      openingBalance: 446053,
      payment: 25000,
      principal: 18540,
      interest: 6460,
      closingBalance: 427513,
      cumulativePrincipal: 72487,
      cumulativeInterest: 27513,
    },
    {
      id: 5,
      planNumber: "PP-2024-001",
      month: 5,
      openingBalance: 427513,
      payment: 25000,
      principal: 18826,
      interest: 6174,
      closingBalance: 408687,
      cumulativePrincipal: 91313,
      cumulativeInterest: 33687,
    },
    {
      id: 6,
      planNumber: "PP-2024-001",
      month: 6,
      openingBalance: 408687,
      payment: 25000,
      principal: 19117,
      interest: 5883,
      closingBalance: 389570,
      cumulativePrincipal: 110430,
      cumulativeInterest: 39570,
    },
  ])

  const paymentPlanColumns = [
    {
      key: "planNumber",
      title: "Plan No",
      filterable: true,
      width: "130px",
    },
    {
      key: "planName",
      title: "Plan Adı",
      filterable: true,
      width: "250px",
    },
    {
      key: "totalAmount",
      title: "Toplam Tutar",
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
      key: "monthlyPayment",
      title: "Aylık Ödeme",
      sortable: true,
      align: "right" as const,
      width: "120px",
      render: (value: number) => `₺${value.toLocaleString()}`,
    },
    {
      key: "installmentCount",
      title: "Taksit",
      sortable: true,
      align: "center" as const,
      width: "100px",
      render: (value: number, row: any) => `${row.paidInstallments}/${value}`,
    },
    {
      key: "interestRate",
      title: "Faiz %",
      sortable: true,
      align: "center" as const,
      width: "80px",
      render: (value: number) => `%${value}`,
    },
    {
      key: "status",
      title: "Durum",
      filterable: true,
      filterType: "select" as const,
      width: "100px",
      filterOptions: [
        { value: "Aktif", label: "Aktif" },
        { value: "Tamamlandı", label: "Tamamlandı" },
        { value: "Gecikmiş", label: "Gecikmiş" },
        { value: "Dondurulmuş", label: "Dondurulmuş" },
      ],
      render: (value: string) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            value === "Aktif"
              ? "bg-green-100 text-green-800"
              : value === "Tamamlandı"
                ? "bg-blue-100 text-blue-800"
                : value === "Gecikmiş"
                  ? "bg-red-100 text-red-800"
                  : "bg-gray-100 text-gray-800"
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      key: "creditor",
      title: "Alacaklı",
      filterable: true,
      width: "150px",
    },
    {
      key: "category",
      title: "Kategori",
      filterable: true,
      filterType: "select" as const,
      width: "130px",
      filterOptions: [
        { value: "Ekipman Finansmanı", label: "Ekipman Finansmanı" },
        { value: "Araç Kredisi", label: "Araç Kredisi" },
        { value: "Makine Finansmanı", label: "Makine Finansmanı" },
        { value: "Mobilya", label: "Mobilya" },
      ],
    },
    {
      key: "nextPaymentDate",
      title: "Sonraki Ödeme",
      sortable: true,
      width: "130px",
      render: (value: string | null) => (value ? new Date(value).toLocaleDateString("tr-TR") : "-"),
    },
  ]

  const installmentColumns = [
    {
      key: "planNumber",
      title: "Plan No",
      filterable: true,
      width: "130px",
    },
    {
      key: "installmentNumber",
      title: "Taksit No",
      sortable: true,
      align: "center" as const,
      width: "100px",
    },
    {
      key: "dueDate",
      title: "Vade Tarihi",
      sortable: true,
      width: "120px",
      render: (value: string) => new Date(value).toLocaleDateString("tr-TR"),
    },
    {
      key: "amount",
      title: "Taksit Tutarı",
      sortable: true,
      align: "right" as const,
      width: "120px",
      render: (value: number) => `₺${value.toLocaleString()}`,
    },
    {
      key: "principalAmount",
      title: "Ana Para",
      sortable: true,
      align: "right" as const,
      width: "120px",
      render: (value: number) => `₺${value.toLocaleString()}`,
    },
    {
      key: "interestAmount",
      title: "Faiz",
      sortable: true,
      align: "right" as const,
      width: "100px",
      render: (value: number) => `₺${value.toLocaleString()}`,
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
      ],
      render: (value: string) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            value === "Ödendi"
              ? "bg-green-100 text-green-800"
              : value === "Bekliyor"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      key: "paymentDate",
      title: "Ödeme Tarihi",
      sortable: true,
      width: "120px",
      render: (value: string | null) => (value ? new Date(value).toLocaleDateString("tr-TR") : "-"),
    },
    {
      key: "lateDays",
      title: "Gecikme (Gün)",
      sortable: true,
      align: "center" as const,
      width: "120px",
      render: (value: number) => (
        <span className={value > 0 ? "text-red-600 font-medium" : "text-gray-600"}>{value}</span>
      ),
    },
    {
      key: "penaltyAmount",
      title: "Gecikme Faizi",
      sortable: true,
      align: "right" as const,
      width: "120px",
      render: (value: number) => (value > 0 ? `₺${value.toLocaleString()}` : "-"),
    },
  ]

  const amortizationColumns = [
    {
      key: "month",
      title: "Ay",
      sortable: true,
      align: "center" as const,
      width: "80px",
    },
    {
      key: "openingBalance",
      title: "Açılış Bakiyesi",
      sortable: true,
      align: "right" as const,
      width: "130px",
      render: (value: number) => `₺${value.toLocaleString()}`,
    },
    {
      key: "payment",
      title: "Ödeme",
      sortable: true,
      align: "right" as const,
      width: "100px",
      render: (value: number) => `₺${value.toLocaleString()}`,
    },
    {
      key: "principal",
      title: "Ana Para",
      sortable: true,
      align: "right" as const,
      width: "100px",
      render: (value: number) => `₺${value.toLocaleString()}`,
    },
    {
      key: "interest",
      title: "Faiz",
      sortable: true,
      align: "right" as const,
      width: "100px",
      render: (value: number) => `₺${value.toLocaleString()}`,
    },
    {
      key: "closingBalance",
      title: "Kapanış Bakiyesi",
      sortable: true,
      align: "right" as const,
      width: "130px",
      render: (value: number) => `₺${value.toLocaleString()}`,
    },
    {
      key: "cumulativePrincipal",
      title: "Kümülatif Ana Para",
      sortable: true,
      align: "right" as const,
      width: "140px",
      render: (value: number) => `₺${value.toLocaleString()}`,
    },
    {
      key: "cumulativeInterest",
      title: "Kümülatif Faiz",
      sortable: true,
      align: "right" as const,
      width: "130px",
      render: (value: number) => `₺${value.toLocaleString()}`,
    },
  ]

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
                <h1 className="text-2xl font-bold text-gray-900">Ödeme Planları</h1>
                <p className="text-sm text-gray-500">Uzun vadeli ödeme planları ve amortisman takibi</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline">Rapor Al</Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Yeni Plan
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
                  <p className="text-sm font-medium text-gray-600">Aktif Planlar</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {paymentPlanData.filter((p) => p.status === "Aktif").length}
                  </p>
                  <p className="text-xs text-green-600">
                    ₺
                    {paymentPlanData
                      .filter((p) => p.status === "Aktif")
                      .reduce((sum, p) => sum + p.remainingAmount, 0)
                      .toLocaleString()}{" "}
                    kalan
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Aylık Ödeme</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ₺
                    {paymentPlanData
                      .filter((p) => p.status === "Aktif")
                      .reduce((sum, p) => sum + p.monthlyPayment, 0)
                      .toLocaleString()}
                  </p>
                  <p className="text-xs text-orange-600">Toplam taksit</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Toplam Borç</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ₺{paymentPlanData.reduce((sum, p) => sum + p.remainingAmount, 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-purple-600">Kalan tutar</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tamamlanan</p>
                  <p className="text-2xl font-bold text-green-600">
                    {paymentPlanData.filter((p) => p.status === "Tamamlandı").length}
                  </p>
                  <p className="text-xs text-green-600">Plan</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="plans" className="space-y-6">
          <TabsList>
            <TabsTrigger value="plans">Ödeme Planları</TabsTrigger>
            <TabsTrigger value="installments">Taksit Takibi</TabsTrigger>
            <TabsTrigger value="amortization">Amortisman Tablosu</TabsTrigger>
            <TabsTrigger value="reports">Raporlar</TabsTrigger>
          </TabsList>

          <TabsContent value="plans">
            <Card>
              <CardHeader>
                <CardTitle>Ödeme Planları</CardTitle>
                <CardDescription>Tüm uzun vadeli ödeme planlarınız ve durumları</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  data={paymentPlanData}
                  columns={paymentPlanColumns}
                  title="Ödeme Planları"
                  height={500}
                  onRowClick={(row) => console.log("Seçilen plan:", row)}
                />

                {/* Plan Progress Cards */}
                <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {paymentPlanData
                    .filter((plan) => plan.status === "Aktif")
                    .map((plan) => {
                      const progressPercentage = (plan.paidInstallments / plan.installmentCount) * 100

                      return (
                        <Card key={plan.id}>
                          <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="font-medium">{plan.planName}</h3>
                                <p className="text-sm text-gray-600">{plan.creditor}</p>
                              </div>
                              <span className="text-sm text-gray-500">%{plan.interestRate} faiz</span>
                            </div>

                            <div className="space-y-3">
                              <div className="flex justify-between text-sm">
                                <span>İlerleme:</span>
                                <span>
                                  {plan.paidInstallments}/{plan.installmentCount} taksit
                                </span>
                              </div>
                              <Progress value={progressPercentage} className="h-2" />

                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="text-gray-600">Ödenen:</span>
                                  <p className="font-medium">₺{plan.paidAmount.toLocaleString()}</p>
                                </div>
                                <div>
                                  <span className="text-gray-600">Kalan:</span>
                                  <p className="font-medium">₺{plan.remainingAmount.toLocaleString()}</p>
                                </div>
                              </div>

                              <div className="flex justify-between items-center pt-2 border-t">
                                <span className="text-sm text-gray-600">Sonraki Ödeme:</span>
                                <span className="font-medium">
                                  {plan.nextPaymentDate
                                    ? new Date(plan.nextPaymentDate).toLocaleDateString("tr-TR")
                                    : "-"}
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="installments">
            <Card>
              <CardHeader>
                <CardTitle>Taksit Takibi</CardTitle>
                <CardDescription>Tüm taksitlerin ödeme durumu ve detayları</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  data={installmentData}
                  columns={installmentColumns}
                  title="Taksitler"
                  height={500}
                  onRowClick={(row) => console.log("Seçilen taksit:", row)}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="amortization">
            <Card>
              <CardHeader>
                <CardTitle>Amortisman Tablosu</CardTitle>
                <CardDescription>Ödeme planlarının detaylı amortisman hesaplaması</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Plan Seçin:</label>
                  <select className="border rounded-md px-3 py-2 text-sm">
                    <option value="PP-2024-001">PP-2024-001 - Konut Projesi A - Ekipman Finansmanı</option>
                    <option value="PP-2024-002">PP-2024-002 - Ofis Kompleksi - Araç Kredisi</option>
                    <option value="PP-2024-004">PP-2024-004 - Genel - Ofis Mobilyası</option>
                  </select>
                </div>

                <DataTable
                  data={amortizationData}
                  columns={amortizationColumns}
                  title="Amortisman Tablosu - PP-2024-001"
                  height={500}
                  onRowClick={(row) => console.log("Seçilen ay:", row)}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Ödeme Planı Raporları</CardTitle>
                <CardDescription>Ödeme planları analizi ve raporları</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Kategori Bazlı Dağılım</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {["Ekipman Finansmanı", "Araç Kredisi", "Makine Finansmanı", "Mobilya"].map((category) => {
                          const plans = paymentPlanData.filter((plan) => plan.category === category)
                          const totalRemaining = plans.reduce((sum, plan) => sum + plan.remainingAmount, 0)
                          const planCount = plans.length

                          return (
                            <div key={category} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                              <div>
                                <span className="font-medium">{category}</span>
                                <p className="text-xs text-gray-500">{planCount} plan</p>
                              </div>
                              <span className="font-bold">₺{totalRemaining.toLocaleString()}</span>
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Aylık Ödeme Takvimi</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                          <span className="font-medium">Şubat 2024</span>
                          <span className="font-bold">
                            ₺
                            {paymentPlanData
                              .filter((p) => p.status === "Aktif")
                              .reduce((sum, p) => sum + p.monthlyPayment, 0)
                              .toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                          <span className="font-medium">Mart 2024</span>
                          <span className="font-bold">
                            ₺
                            {paymentPlanData
                              .filter((p) => p.status === "Aktif")
                              .reduce((sum, p) => sum + p.monthlyPayment, 0)
                              .toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-orange-50 rounded">
                          <span className="font-medium">Nisan 2024</span>
                          <span className="font-bold">
                            ₺
                            {paymentPlanData
                              .filter((p) => p.status === "Aktif")
                              .reduce((sum, p) => sum + p.monthlyPayment, 0)
                              .toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-purple-50 rounded">
                          <span className="font-medium">Mayıs 2024</span>
                          <span className="font-bold">
                            ₺
                            {paymentPlanData
                              .filter((p) => p.status === "Aktif")
                              .reduce((sum, p) => sum + p.monthlyPayment, 0)
                              .toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Summary Statistics */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="text-lg">Özet İstatistikler</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center p-4 bg-blue-50 rounded">
                        <div className="text-2xl font-bold text-blue-600">
                          ₺{paymentPlanData.reduce((sum, p) => sum + p.totalAmount, 0).toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">Toplam Finansman</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded">
                        <div className="text-2xl font-bold text-green-600">
                          ₺{paymentPlanData.reduce((sum, p) => sum + p.paidAmount, 0).toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">Toplam Ödenen</div>
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded">
                        <div className="text-2xl font-bold text-orange-600">
                          %
                          {Math.round(
                            (paymentPlanData.reduce((sum, p) => sum + p.paidAmount, 0) /
                              paymentPlanData.reduce((sum, p) => sum + p.totalAmount, 0)) *
                              100,
                          )}
                        </div>
                        <div className="text-sm text-gray-600">Tamamlanma Oranı</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
