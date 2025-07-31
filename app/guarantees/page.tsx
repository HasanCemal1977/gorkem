"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Plus, Shield, AlertTriangle, Clock, DollarSign } from "lucide-react"
import Link from "next/link"
import { DataTable } from "@/components/data-table"
import { useState } from "react"

export default function GuaranteesPage() {
  const [guaranteeData, setGuaranteeData] = useState([
    {
      id: 1,
      guaranteeNumber: "TM-2024-001",
      type: "Kesin Teminat",
      bank: "Ziraat Bankası",
      amount: 250000,
      project: "Konut Projesi A",
      beneficiary: "ABC Müteahhitlik",
      issueDate: "2024-01-15",
      expiryDate: "2024-12-15",
      status: "Aktif",
      commissionRate: 0.5,
      commissionAmount: 1250,
      renewalCount: 0,
      guaranteeText: "İş bitim teminatı",
    },
    {
      id: 2,
      guaranteeNumber: "TM-2024-002",
      type: "Geçici Teminat",
      bank: "İş Bankası",
      amount: 150000,
      project: "Konut Projesi B",
      beneficiary: "XYZ İnşaat",
      issueDate: "2024-01-20",
      expiryDate: "2024-06-20",
      status: "Aktif",
      commissionRate: 0.3,
      commissionAmount: 450,
      renewalCount: 1,
      guaranteeText: "İhale teminatı",
    },
    {
      id: 3,
      guaranteeNumber: "TM-2024-003",
      type: "Avans Teminatı",
      bank: "Garanti BBVA",
      amount: 300000,
      project: "Ofis Kompleksi",
      beneficiary: "DEF Yapı",
      issueDate: "2024-02-01",
      expiryDate: "2024-08-01",
      status: "Kullanıldı",
      commissionRate: 0.4,
      commissionAmount: 1200,
      renewalCount: 0,
      guaranteeText: "Avans geri ödeme teminatı",
    },
    {
      id: 4,
      guaranteeNumber: "TM-2024-004",
      type: "İyi İcra Teminatı",
      bank: "Akbank",
      amount: 180000,
      project: "Villa Projesi",
      beneficiary: "GHI Müteahhit",
      issueDate: "2024-02-10",
      expiryDate: "2024-05-10",
      status: "Süresi Dolacak",
      commissionRate: 0.6,
      commissionAmount: 1080,
      renewalCount: 2,
      guaranteeText: "İş yapım teminatı",
    },
    {
      id: 5,
      guaranteeNumber: "TM-2024-005",
      type: "Bakım Teminatı",
      bank: "Vakıfbank",
      amount: 120000,
      project: "Konut Projesi A",
      beneficiary: "ABC Müteahhitlik",
      issueDate: "2024-01-25",
      expiryDate: "2025-01-25",
      status: "Aktif",
      commissionRate: 0.4,
      commissionAmount: 480,
      renewalCount: 0,
      guaranteeText: "1 yıl bakım teminatı",
    },
  ])

  const [commissionData, setCommissionData] = useState([
    {
      id: 1,
      guaranteeNumber: "TM-2024-001",
      bank: "Ziraat Bankası",
      amount: 250000,
      commissionRate: 0.5,
      period: "Yıllık",
      dueDate: "2024-03-15",
      paidAmount: 625,
      remainingAmount: 625,
      status: "Bekliyor",
      paymentHistory: "2024-01: ₺625",
    },
    {
      id: 2,
      guaranteeNumber: "TM-2024-002",
      bank: "İş Bankası",
      amount: 150000,
      commissionRate: 0.3,
      period: "6 Aylık",
      dueDate: "2024-02-20",
      paidAmount: 450,
      remainingAmount: 0,
      status: "Ödendi",
      paymentHistory: "2024-01: ₺450",
    },
    {
      id: 3,
      guaranteeNumber: "TM-2024-003",
      bank: "Garanti BBVA",
      amount: 300000,
      commissionRate: 0.4,
      period: "6 Aylık",
      dueDate: "2024-04-01",
      paidAmount: 600,
      remainingAmount: 600,
      status: "Bekliyor",
      paymentHistory: "2024-02: ₺600",
    },
  ])

  const guaranteeColumns = [
    {
      key: "guaranteeNumber",
      title: "Teminat No",
      filterable: true,
      width: "130px",
      editable: true,
    },
    {
      key: "type",
      title: "Teminat Tipi",
      filterable: true,
      filterType: "select" as const,
      width: "150px",
      editable: true,
      filterOptions: [
        { value: "Kesin Teminat", label: "Kesin Teminat" },
        { value: "Geçici Teminat", label: "Geçici Teminat" },
        { value: "Avans Teminatı", label: "Avans Teminatı" },
        { value: "İyi İcra Teminatı", label: "İyi İcra Teminatı" },
        { value: "Bakım Teminatı", label: "Bakım Teminatı" },
      ],
    },
    {
      key: "bank",
      title: "Banka",
      filterable: true,
      filterType: "select" as const,
      width: "130px",
      editable: true,
      filterOptions: [
        { value: "Ziraat Bankası", label: "Ziraat Bankası" },
        { value: "İş Bankası", label: "İş Bankası" },
        { value: "Garanti BBVA", label: "Garanti BBVA" },
        { value: "Akbank", label: "Akbank" },
        { value: "Vakıfbank", label: "Vakıfbank" },
      ],
    },
    {
      key: "amount",
      title: "Tutar",
      sortable: true,
      align: "right" as const,
      width: "120px",
      editable: true,
      render: (value: number) => `₺${value.toLocaleString()}`,
    },
    {
      key: "project",
      title: "Proje",
      filterable: true,
      filterType: "select" as const,
      width: "150px",
      editable: true,
      filterOptions: [
        { value: "Konut Projesi A", label: "Konut Projesi A" },
        { value: "Konut Projesi B", label: "Konut Projesi B" },
        { value: "Ofis Kompleksi", label: "Ofis Kompleksi" },
        { value: "Villa Projesi", label: "Villa Projesi" },
      ],
    },
    {
      key: "beneficiary",
      title: "Lehtar",
      filterable: true,
      width: "150px",
      editable: true,
    },
    {
      key: "issueDate",
      title: "Düzenleme",
      sortable: true,
      width: "120px",
      editable: true,
      render: (value: string) => new Date(value).toLocaleDateString("tr-TR"),
    },
    {
      key: "expiryDate",
      title: "Vade",
      sortable: true,
      width: "120px",
      editable: true,
      render: (value: string, row: any) => {
        const expiryDate = new Date(value)
        const today = new Date()
        const daysLeft = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
        const isExpiringSoon = daysLeft <= 30 && daysLeft > 0
        const isExpired = daysLeft <= 0

        return (
          <div>
            <div className={isExpired ? "text-red-600" : isExpiringSoon ? "text-orange-600" : ""}>
              {expiryDate.toLocaleDateString("tr-TR")}
            </div>
            {isExpiringSoon && !isExpired && <div className="text-xs text-orange-600">{daysLeft} gün kaldı</div>}
            {isExpired && <div className="text-xs text-red-600">Süresi doldu</div>}
          </div>
        )
      },
    },
    {
      key: "status",
      title: "Durum",
      filterable: true,
      filterType: "select" as const,
      width: "120px",
      editable: true,
      filterOptions: [
        { value: "Aktif", label: "Aktif" },
        { value: "Kullanıldı", label: "Kullanıldı" },
        { value: "Süresi Dolacak", label: "Süresi Dolacak" },
        { value: "İptal", label: "İptal" },
      ],
      render: (value: string) => {
        const colorClass =
          value === "Aktif"
            ? "bg-green-100 text-green-800"
            : value === "Kullanıldı"
              ? "bg-blue-100 text-blue-800"
              : value === "Süresi Dolacak"
                ? "bg-orange-100 text-orange-800"
                : "bg-red-100 text-red-800"
        return <span className={`px-2 py-1 rounded-full text-xs ${colorClass}`}>{value}</span>
      },
    },
    {
      key: "commissionRate",
      title: "Komisyon %",
      sortable: true,
      align: "center" as const,
      width: "100px",
      editable: true,
      render: (value: number) => `%${value}`,
    },
    {
      key: "commissionAmount",
      title: "Komisyon",
      sortable: true,
      align: "right" as const,
      width: "100px",
      editable: true,
      render: (value: number) => `₺${value.toLocaleString()}`,
    },
  ]

  const commissionColumns = [
    {
      key: "guaranteeNumber",
      title: "Teminat No",
      filterable: true,
      width: "130px",
      editable: true,
    },
    {
      key: "bank",
      title: "Banka",
      filterable: true,
      width: "130px",
      editable: true,
    },
    {
      key: "amount",
      title: "Teminat Tutarı",
      sortable: true,
      align: "right" as const,
      width: "130px",
      editable: true,
      render: (value: number) => `₺${value.toLocaleString()}`,
    },
    {
      key: "commissionRate",
      title: "Komisyon %",
      sortable: true,
      align: "center" as const,
      width: "100px",
      editable: true,
      render: (value: number) => `%${value}`,
    },
    {
      key: "period",
      title: "Dönem",
      filterable: true,
      filterType: "select" as const,
      width: "100px",
      editable: true,
      filterOptions: [
        { value: "Yıllık", label: "Yıllık" },
        { value: "6 Aylık", label: "6 Aylık" },
        { value: "3 Aylık", label: "3 Aylık" },
      ],
    },
    {
      key: "dueDate",
      title: "Vade Tarihi",
      sortable: true,
      width: "120px",
      editable: true,
      render: (value: string) => new Date(value).toLocaleDateString("tr-TR"),
    },
    {
      key: "paidAmount",
      title: "Ödenen",
      sortable: true,
      align: "right" as const,
      width: "100px",
      editable: true,
      render: (value: number) => `₺${value.toLocaleString()}`,
    },
    {
      key: "remainingAmount",
      title: "Kalan",
      sortable: true,
      align: "right" as const,
      width: "100px",
      editable: true,
      render: (value: number) => `₺${value.toLocaleString()}`,
    },
    {
      key: "status",
      title: "Durum",
      filterable: true,
      filterType: "select" as const,
      width: "100px",
      editable: true,
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
      key: "paymentHistory",
      title: "Ödeme Geçmişi",
      width: "150px",
      editable: true,
    },
  ]

  const handleCreateGuarantee = (newGuarantee: any) => {
    setGuaranteeData([...guaranteeData, { ...newGuarantee, id: Date.now() }])
  }

  const handleUpdateGuarantee = (id: number, updatedGuarantee: any) => {
    setGuaranteeData(
      guaranteeData.map((guarantee) => (guarantee.id === id ? { ...guarantee, ...updatedGuarantee } : guarantee)),
    )
  }

  const handleDeleteGuarantee = (id: number) => {
    setGuaranteeData(guaranteeData.filter((guarantee) => guarantee.id !== id))
  }

  const handleCreateCommission = (newCommission: any) => {
    setCommissionData([...commissionData, { ...newCommission, id: Date.now() }])
  }

  const handleUpdateCommission = (id: number, updatedCommission: any) => {
    setCommissionData(
      commissionData.map((commission) => (commission.id === id ? { ...commission, ...updatedCommission } : commission)),
    )
  }

  const handleDeleteCommission = (id: number) => {
    setCommissionData(commissionData.filter((commission) => commission.id !== id))
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
                <h1 className="text-2xl font-bold text-gray-900">Teminat Mektupları</h1>
                <p className="text-sm text-gray-500">Teminat mektupları ve komisyon takibi</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline">Rapor Al</Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Yeni Teminat
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
                  <p className="text-sm font-medium text-gray-600">Aktif Teminatlar</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {guaranteeData.filter((g) => g.status === "Aktif").length}
                  </p>
                  <p className="text-xs text-green-600">
                    ₺
                    {guaranteeData
                      .filter((g) => g.status === "Aktif")
                      .reduce((sum, g) => sum + g.amount, 0)
                      .toLocaleString()}
                  </p>
                </div>
                <Shield className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Süresi Dolacaklar</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {guaranteeData.filter((g) => g.status === "Süresi Dolacak").length}
                  </p>
                  <p className="text-xs text-orange-600">30 gün içinde</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Toplam Tutar</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ₺{guaranteeData.reduce((sum, g) => sum + g.amount, 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-purple-600">{guaranteeData.length} teminat</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Aylık Komisyon</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ₺{guaranteeData.reduce((sum, g) => sum + g.commissionAmount, 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-blue-600">Toplam komisyon</p>
                </div>
                <Clock className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="guarantees" className="space-y-6">
          <TabsList>
            <TabsTrigger value="guarantees">Teminat Listesi</TabsTrigger>
            <TabsTrigger value="commissions">Komisyon Takibi</TabsTrigger>
            <TabsTrigger value="renewals">Yenileme Takibi</TabsTrigger>
            <TabsTrigger value="reports">Raporlar</TabsTrigger>
          </TabsList>

          <TabsContent value="guarantees">
            <Card>
              <CardHeader>
                <CardTitle>Teminat Mektupları</CardTitle>
                <CardDescription>Tüm teminat mektuplarınızın durumu ve detayları</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  data={guaranteeData}
                  columns={guaranteeColumns}
                  title="Teminat Mektupları"
                  height={500}
                  onRowClick={(row) => console.log("Seçilen teminat:", row)}
                  onCreate={handleCreateGuarantee}
                  onUpdate={handleUpdateGuarantee}
                  onDelete={handleDeleteGuarantee}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="commissions">
            <Card>
              <CardHeader>
                <CardTitle>Komisyon Takibi</CardTitle>
                <CardDescription>Teminat mektubu komisyonları ve ödeme durumları</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  data={commissionData}
                  columns={commissionColumns}
                  title="Komisyon Ödemeleri"
                  height={500}
                  onRowClick={(row) => console.log("Seçilen komisyon:", row)}
                  onCreate={handleCreateCommission}
                  onUpdate={handleUpdateCommission}
                  onDelete={handleDeleteCommission}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="renewals">
            <Card>
              <CardHeader>
                <CardTitle>Yenileme Takibi</CardTitle>
                <CardDescription>Süresi dolacak teminatlar ve yenileme durumları</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {guaranteeData
                    .filter((g) => {
                      const expiryDate = new Date(g.expiryDate)
                      const today = new Date()
                      const daysLeft = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
                      return daysLeft <= 60
                    })
                    .sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime())
                    .map((guarantee) => {
                      const expiryDate = new Date(guarantee.expiryDate)
                      const today = new Date()
                      const daysLeft = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
                      const isUrgent = daysLeft <= 30

                      return (
                        <div
                          key={guarantee.id}
                          className={`border rounded-lg p-4 ${isUrgent ? "border-red-200 bg-red-50" : "border-orange-200 bg-orange-50"}`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-medium">{guarantee.guaranteeNumber}</h3>
                              <p className="text-sm text-gray-600">
                                {guarantee.type} - {guarantee.project}
                              </p>
                            </div>
                            <div className="text-right">
                              <span className="text-lg font-bold">₺{guarantee.amount.toLocaleString()}</span>
                              <p className="text-sm text-gray-500">{guarantee.bank}</p>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">
                              Vade: {expiryDate.toLocaleDateString("tr-TR")}
                              <span className={`ml-2 ${isUrgent ? "text-red-600" : "text-orange-600"}`}>
                                ({daysLeft > 0 ? `${daysLeft} gün kaldı` : "Süresi doldu"})
                              </span>
                            </span>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                Yenile
                              </Button>
                              <Button size="sm" variant="outline">
                                İptal Et
                              </Button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Teminat Raporları</CardTitle>
                <CardDescription>Teminat mektubu analizi ve raporları</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Teminat Tipi Dağılımı</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          "Kesin Teminat",
                          "Geçici Teminat",
                          "Avans Teminatı",
                          "İyi İcra Teminatı",
                          "Bakım Teminatı",
                        ].map((type) => {
                          const count = guaranteeData.filter((g) => g.type === type).length
                          const total = guaranteeData
                            .filter((g) => g.type === type)
                            .reduce((sum, g) => sum + g.amount, 0)
                          return (
                            <div key={type} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                              <div>
                                <span className="font-medium">{type}</span>
                                <p className="text-xs text-gray-500">{count} adet</p>
                              </div>
                              <span className="font-bold">₺{total.toLocaleString()}</span>
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Banka Dağılımı</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {["Ziraat Bankası", "İş Bankası", "Garanti BBVA", "Akbank", "Vakıfbank"].map((bank) => {
                          const count = guaranteeData.filter((g) => g.bank === bank).length
                          const total = guaranteeData
                            .filter((g) => g.bank === bank)
                            .reduce((sum, g) => sum + g.amount, 0)
                          return (
                            <div key={bank} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                              <div>
                                <span className="font-medium">{bank}</span>
                                <p className="text-xs text-gray-500">{count} adet</p>
                              </div>
                              <span className="font-bold">₺{total.toLocaleString()}</span>
                            </div>
                          )
                        })}
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
