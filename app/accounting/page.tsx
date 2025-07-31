"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Plus, Download, Calculator, TrendingUp, TrendingDown } from "lucide-react"
import Link from "next/link"
import { DataTable } from "@/components/data-table"

export default function AccountingPage() {
  const [accountingData, setAccountingData] = useState([
    {
      id: 1,
      date: "2024-01-15",
      description: "Malzeme Alımı - Çimento",
      account: "150 - Hammaddeler",
      debit: 25000,
      credit: 0,
      project: "Konut Projesi A",
      reference: "FAT-2024-001",
      status: "Onaylandı",
    },
    {
      id: 2,
      date: "2024-01-15",
      description: "Banka Ödemesi",
      account: "100 - Kasa",
      debit: 0,
      credit: 25000,
      project: "Konut Projesi A",
      reference: "ÖDM-2024-001",
      status: "Onaylandı",
    },
    {
      id: 3,
      date: "2024-01-16",
      description: "Taşeron Ödemesi - İnşaat İşleri",
      account: "320 - Satıcılar",
      debit: 0,
      credit: 45000,
      project: "Konut Projesi B",
      reference: "TAŞ-2024-001",
      status: "Bekliyor",
    },
  ])

  const columns = [
    {
      key: "date",
      title: "Tarih",
      sortable: true,
      width: "120px",
      editable: true,
      type: "date" as const,
      required: true,
      render: (value: string) => new Date(value).toLocaleDateString("tr-TR"),
    },
    {
      key: "description",
      title: "Açıklama",
      filterable: true,
      width: "250px",
      editable: true,
      type: "textarea" as const,
      required: true,
    },
    {
      key: "account",
      title: "Hesap",
      filterable: true,
      filterType: "select" as const,
      width: "180px",
      editable: true,
      type: "select" as const,
      required: true,
      filterOptions: [
        { value: "100 - Kasa", label: "100 - Kasa" },
        { value: "150 - Hammaddeler", label: "150 - Hammaddeler" },
        { value: "320 - Satıcılar", label: "320 - Satıcılar" },
        { value: "600 - Satış Gelirleri", label: "600 - Satış Gelirleri" },
        { value: "770 - Genel Giderler", label: "770 - Genel Giderler" },
      ],
      selectOptions: [
        { value: "100 - Kasa", label: "100 - Kasa" },
        { value: "102 - Bankalar", label: "102 - Bankalar" },
        { value: "120 - Alıcılar", label: "120 - Alıcılar" },
        { value: "150 - Hammaddeler", label: "150 - Hammaddeler" },
        { value: "151 - Yarı Mamuller", label: "151 - Yarı Mamuller" },
        { value: "152 - Mamuller", label: "152 - Mamuller" },
        { value: "320 - Satıcılar", label: "320 - Satıcılar" },
        { value: "321 - Borç Senetleri", label: "321 - Borç Senetleri" },
        { value: "600 - Satış Gelirleri", label: "600 - Satış Gelirleri" },
        { value: "770 - Genel Giderler", label: "770 - Genel Giderler" },
      ],
    },
    {
      key: "debit",
      title: "Borç",
      sortable: true,
      align: "right" as const,
      width: "120px",
      editable: true,
      type: "number" as const,
      render: (value: number) => (
        <span className={value > 0 ? "font-medium" : "text-gray-400"}>
          {value > 0 ? `₺${value.toLocaleString()}` : "-"}
        </span>
      ),
    },
    {
      key: "credit",
      title: "Alacak",
      sortable: true,
      align: "right" as const,
      width: "120px",
      editable: true,
      type: "number" as const,
      render: (value: number) => (
        <span className={value > 0 ? "font-medium" : "text-gray-400"}>
          {value > 0 ? `₺${value.toLocaleString()}` : "-"}
        </span>
      ),
    },
    {
      key: "project",
      title: "Proje",
      filterable: true,
      filterType: "select" as const,
      width: "150px",
      editable: true,
      type: "select" as const,
      required: true,
      filterOptions: [
        { value: "Konut Projesi A", label: "Konut Projesi A" },
        { value: "Konut Projesi B", label: "Konut Projesi B" },
        { value: "Genel", label: "Genel" },
      ],
      selectOptions: [
        { value: "Konut Projesi A", label: "Konut Projesi A" },
        { value: "Konut Projesi B", label: "Konut Projesi B" },
        { value: "Ofis Kompleksi", label: "Ofis Kompleksi" },
        { value: "Villa Projesi", label: "Villa Projesi" },
        { value: "Genel", label: "Genel" },
      ],
    },
    {
      key: "reference",
      title: "Referans",
      width: "130px",
      editable: true,
      type: "text" as const,
      required: true,
    },
    {
      key: "status",
      title: "Durum",
      filterable: true,
      filterType: "select" as const,
      width: "100px",
      editable: true,
      type: "select" as const,
      required: true,
      filterOptions: [
        { value: "Onaylandı", label: "Onaylandı" },
        { value: "Bekliyor", label: "Bekliyor" },
      ],
      selectOptions: [
        { value: "Onaylandı", label: "Onaylandı" },
        { value: "Bekliyor", label: "Bekliyor" },
        { value: "İptal", label: "İptal" },
      ],
      render: (value: string) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            value === "Onaylandı"
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
  ]

  const handleAdd = (newRow: any) => {
    const newId = Math.max(...accountingData.map((item) => item.id), 0) + 1
    const newRecord = {
      ...newRow,
      id: newId,
      debit: Number(newRow.debit) || 0,
      credit: Number(newRow.credit) || 0,
    }
    setAccountingData([...accountingData, newRecord])
  }

  const handleUpdate = (id: number, updatedRow: any) => {
    setAccountingData(
      accountingData.map((item) =>
        item.id === id
          ? {
              ...updatedRow,
              id,
              debit: Number(updatedRow.debit) || 0,
              credit: Number(updatedRow.credit) || 0,
            }
          : item,
      ),
    )
  }

  const handleDelete = (id: number) => {
    setAccountingData(accountingData.filter((item) => item.id !== id))
  }

  const summaryData = [
    { title: "Toplam Gelir", amount: "₺2,450,000", change: "+12%", trend: "up" },
    { title: "Toplam Gider", amount: "₺1,890,000", change: "+8%", trend: "up" },
    { title: "Net Kar", amount: "₺560,000", change: "+18%", trend: "up" },
    { title: "KDV Borcu", amount: "₺89,000", change: "-5%", trend: "down" },
  ]

  // Calculate totals
  const totalDebit = accountingData.reduce((sum, item) => sum + item.debit, 0)
  const totalCredit = accountingData.reduce((sum, item) => sum + item.credit, 0)

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
                <h1 className="text-2xl font-bold text-gray-900">Genel Muhasebe</h1>
                <p className="text-sm text-gray-500">Finansal işlemler ve muhasebe kayıtları</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Dışa Aktar
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {summaryData.map((item, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{item.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{item.amount}</p>
                    <div className="flex items-center mt-1">
                      {item.trend === "up" ? (
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                      )}
                      <span className={`text-sm ${item.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                        {item.change}
                      </span>
                    </div>
                  </div>
                  <Calculator className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="transactions" className="space-y-6">
          <TabsList>
            <TabsTrigger value="transactions">Muhasebe Hareketleri</TabsTrigger>
            <TabsTrigger value="reports">Finansal Raporlar</TabsTrigger>
            <TabsTrigger value="settings">Hesap Planı</TabsTrigger>
          </TabsList>

          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle>Muhasebe Hareketleri</CardTitle>
                <CardDescription>
                  Hücreleri düzenlemek için çift tıklayın. "Satır Ekle" butonu ile yeni kayıt ekleyin.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  data={accountingData}
                  columns={columns}
                  title="Muhasebe Hareketleri"
                  height={500}
                  editable={true}
                  onAdd={handleAdd}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                  idField="id"
                  autoAddRow={true}
                />

                {/* Totals Summary */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">Toplam Borç</span>
                        <span className="text-lg font-bold text-red-600">₺{totalDebit.toLocaleString()}</span>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">Toplam Alacak</span>
                        <span className="text-lg font-bold text-green-600">₺{totalCredit.toLocaleString()}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Bilanço</CardTitle>
                  <CardDescription>Aktif ve pasif hesapların durumu</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span className="font-medium">Toplam Aktif</span>
                      <span className="font-bold">₺3,450,000</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span className="font-medium">Toplam Pasif</span>
                      <span className="font-bold">₺2,890,000</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                      <span className="font-medium">Öz Sermaye</span>
                      <span className="font-bold text-green-600">₺560,000</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Gelir Tablosu</CardTitle>
                  <CardDescription>Aylık gelir ve gider analizi</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                      <span className="font-medium">Brüt Satışlar</span>
                      <span className="font-bold text-green-600">₺2,450,000</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-red-50 rounded">
                      <span className="font-medium">Satışların Maliyeti</span>
                      <span className="font-bold text-red-600">₺1,890,000</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                      <span className="font-medium">Brüt Kar</span>
                      <span className="font-bold text-blue-600">₺560,000</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Hesap Planı</CardTitle>
                <CardDescription>Muhasebe hesaplarınızı yönetin</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Hesap Kategorileri</h3>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Yeni Hesap
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <div className="p-3 border rounded-lg">
                      <div className="font-medium">100 - Dönen Varlıklar</div>
                      <div className="text-sm text-gray-500 ml-4">
                        • 100 - Kasa
                        <br />• 102 - Bankalar
                        <br />• 120 - Alıcılar
                      </div>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="font-medium">150 - Stoklar</div>
                      <div className="text-sm text-gray-500 ml-4">
                        • 150 - Hammaddeler
                        <br />• 151 - Yarı Mamuller
                        <br />• 152 - Mamuller
                      </div>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="font-medium">320 - Ticari Borçlar</div>
                      <div className="text-sm text-gray-500 ml-4">
                        • 320 - Satıcılar
                        <br />• 321 - Borç Senetleri
                        <br />• 322 - Diğer Ticari Borçlar
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
