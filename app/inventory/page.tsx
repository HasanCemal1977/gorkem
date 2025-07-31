"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Plus, Package, AlertTriangle, TrendingDown, Truck } from "lucide-react"
import Link from "next/link"
import { DataTable } from "@/components/data-table"
import { useState } from "react"

export default function InventoryPage() {
  const [inventoryData, setInventoryData] = useState([
    {
      id: 1,
      itemCode: "MAL-001",
      itemName: "Çimento Portland",
      category: "İnşaat Malzemeleri",
      unit: "Ton",
      currentStock: 45,
      minStock: 20,
      maxStock: 100,
      unitPrice: 850,
      totalValue: 38250,
      supplier: "Akçansa Çimento",
      location: "Depo A",
      lastOrderDate: "2024-01-15",
      status: "Normal",
    },
    {
      id: 2,
      itemCode: "MAL-002",
      itemName: "Demir 12mm",
      category: "İnşaat Malzemeleri",
      unit: "Ton",
      currentStock: 8,
      minStock: 15,
      maxStock: 50,
      unitPrice: 18500,
      totalValue: 148000,
      supplier: "Ereğli Demir Çelik",
      location: "Depo B",
      lastOrderDate: "2024-01-10",
      status: "Kritik",
    },
    {
      id: 3,
      itemCode: "ELK-001",
      itemName: "Kablo 2.5mm NYA",
      category: "Elektrik Malzemeleri",
      unit: "Metre",
      currentStock: 2500,
      minStock: 1000,
      maxStock: 5000,
      unitPrice: 12,
      totalValue: 30000,
      supplier: "Bosch Elektrik",
      location: "Depo C",
      lastOrderDate: "2024-01-18",
      status: "Normal",
    },
    {
      id: 4,
      itemCode: "SER-001",
      itemName: "Seramik 60x60",
      category: "Seramik & Fayans",
      unit: "m²",
      currentStock: 150,
      minStock: 100,
      maxStock: 500,
      unitPrice: 85,
      totalValue: 12750,
      supplier: "Eczacıbaşı Yapı",
      location: "Depo D",
      lastOrderDate: "2024-01-20",
      status: "Normal",
    },
    {
      id: 5,
      itemCode: "BAN-001",
      itemName: "Klozet Takımı",
      category: "Banyo Gereçleri",
      unit: "Adet",
      currentStock: 5,
      minStock: 10,
      maxStock: 30,
      unitPrice: 1200,
      totalValue: 6000,
      supplier: "Vitra Banyo",
      location: "Depo E",
      lastOrderDate: "2024-01-12",
      status: "Düşük",
    },
    {
      id: 6,
      itemCode: "BOY-001",
      itemName: "İç Cephe Boyası",
      category: "Boya & Kimyasallar",
      unit: "Litre",
      currentStock: 200,
      minStock: 50,
      maxStock: 300,
      unitPrice: 45,
      totalValue: 9000,
      supplier: "Marshall Boya",
      location: "Depo F",
      lastOrderDate: "2024-01-22",
      status: "Normal",
    },
  ])

  const [orderData, setOrderData] = useState([
    {
      id: 1,
      orderNumber: "SIP-2024-001",
      orderDate: "2024-01-25",
      supplier: "Akçansa Çimento",
      totalAmount: 85000,
      status: "Onaylandı",
      expectedDelivery: "2024-02-05",
      items: [{ itemCode: "MAL-001", itemName: "Çimento Portland", quantity: 100, unit: "Ton", unitPrice: 850 }],
    },
    {
      id: 2,
      orderNumber: "SIP-2024-002",
      orderDate: "2024-01-26",
      supplier: "Ereğli Demir Çelik",
      totalAmount: 370000,
      status: "Bekliyor",
      expectedDelivery: "2024-02-10",
      items: [{ itemCode: "MAL-002", itemName: "Demir 12mm", quantity: 20, unit: "Ton", unitPrice: 18500 }],
    },
    {
      id: 3,
      orderNumber: "SIP-2024-003",
      orderDate: "2024-01-27",
      supplier: "Bosch Elektrik",
      totalAmount: 60000,
      status: "Teslim Edildi",
      expectedDelivery: "2024-02-01",
      items: [{ itemCode: "ELK-001", itemName: "Kablo 2.5mm NYA", quantity: 5000, unit: "Metre", unitPrice: 12 }],
    },
  ])

  const [movementData, setMovementData] = useState([
    {
      id: 1,
      date: "2024-01-25",
      itemCode: "MAL-001",
      itemName: "Çimento Portland",
      type: "Giriş",
      quantity: 50,
      unit: "Ton",
      project: "Konut Projesi A",
      reference: "SIP-2024-001",
      user: "Ahmet Yılmaz",
      notes: "Yeni sipariş teslimatı",
    },
    {
      id: 2,
      date: "2024-01-26",
      itemCode: "MAL-001",
      itemName: "Çimento Portland",
      type: "Çıkış",
      quantity: 25,
      unit: "Ton",
      project: "Konut Projesi A",
      reference: "ÇIK-2024-001",
      user: "Mehmet Demir",
      notes: "Şantiye sevkiyatı",
    },
    {
      id: 3,
      date: "2024-01-27",
      itemCode: "ELK-001",
      itemName: "Kablo 2.5mm NYA",
      type: "Giriş",
      quantity: 1000,
      unit: "Metre",
      project: "Konut Projesi B",
      reference: "SIP-2024-003",
      user: "Ali Kaya",
      notes: "Elektrik malzemesi teslimatı",
    },
  ])

  const inventoryColumns = [
    {
      key: "itemCode",
      title: "Ürün Kodu",
      filterable: true,
      width: "120px",
    },
    {
      key: "itemName",
      title: "Ürün Adı",
      filterable: true,
      width: "200px",
    },
    {
      key: "category",
      title: "Kategori",
      filterable: true,
      filterType: "select" as const,
      width: "150px",
      filterOptions: [
        { value: "İnşaat Malzemeleri", label: "İnşaat Malzemeleri" },
        { value: "Elektrik Malzemeleri", label: "Elektrik Malzemeleri" },
        { value: "Seramik & Fayans", label: "Seramik & Fayans" },
        { value: "Banyo Gereçleri", label: "Banyo Gereçleri" },
        { value: "Boya & Kimyasallar", label: "Boya & Kimyasallar" },
      ],
    },
    {
      key: "currentStock",
      title: "Mevcut Stok",
      sortable: true,
      align: "center" as const,
      width: "120px",
      render: (value: number, row: any) => (
        <div>
          <span className={value <= row.minStock ? "text-red-600 font-medium" : ""}>{value}</span>
          <span className="text-xs text-gray-500 ml-1">{row.unit}</span>
        </div>
      ),
    },
    {
      key: "minStock",
      title: "Min. Stok",
      sortable: true,
      align: "center" as const,
      width: "100px",
      render: (value: number, row: any) => `${value} ${row.unit}`,
    },
    {
      key: "unitPrice",
      title: "Birim Fiyat",
      sortable: true,
      align: "right" as const,
      width: "120px",
      render: (value: number) => `₺${value.toLocaleString()}`,
    },
    {
      key: "totalValue",
      title: "Toplam Değer",
      sortable: true,
      align: "right" as const,
      width: "130px",
      render: (value: number) => `₺${value.toLocaleString()}`,
    },
    {
      key: "supplier",
      title: "Tedarikçi",
      filterable: true,
      width: "150px",
    },
    {
      key: "location",
      title: "Konum",
      filterable: true,
      filterType: "select" as const,
      width: "100px",
      filterOptions: [
        { value: "Depo A", label: "Depo A" },
        { value: "Depo B", label: "Depo B" },
        { value: "Depo C", label: "Depo C" },
        { value: "Depo D", label: "Depo D" },
        { value: "Depo E", label: "Depo E" },
        { value: "Depo F", label: "Depo F" },
      ],
    },
    {
      key: "status",
      title: "Durum",
      filterable: true,
      filterType: "select" as const,
      width: "100px",
      filterOptions: [
        { value: "Normal", label: "Normal" },
        { value: "Düşük", label: "Düşük" },
        { value: "Kritik", label: "Kritik" },
        { value: "Fazla", label: "Fazla" },
      ],
      render: (value: string) => {
        const colorClass =
          value === "Normal"
            ? "bg-green-100 text-green-800"
            : value === "Düşük"
              ? "bg-yellow-100 text-yellow-800"
              : value === "Kritik"
                ? "bg-red-100 text-red-800"
                : "bg-blue-100 text-blue-800"
        return <span className={`px-2 py-1 rounded-full text-xs ${colorClass}`}>{value}</span>
      },
    },
    {
      key: "lastOrderDate",
      title: "Son Sipariş",
      sortable: true,
      width: "120px",
      render: (value: string) => new Date(value).toLocaleDateString("tr-TR"),
    },
  ]

  const orderColumns = [
    {
      key: "orderNumber",
      title: "Sipariş No",
      filterable: true,
      width: "130px",
    },
    {
      key: "orderDate",
      title: "Sipariş Tarihi",
      sortable: true,
      width: "120px",
      render: (value: string) => new Date(value).toLocaleDateString("tr-TR"),
    },
    {
      key: "supplier",
      title: "Tedarikçi",
      filterable: true,
      width: "180px",
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
      key: "status",
      title: "Durum",
      filterable: true,
      filterType: "select" as const,
      width: "120px",
      filterOptions: [
        { value: "Onaylandı", label: "Onaylandı" },
        { value: "Bekliyor", label: "Bekliyor" },
        { value: "Teslim Edildi", label: "Teslim Edildi" },
        { value: "İptal", label: "İptal" },
      ],
      render: (value: string) => {
        const colorClass =
          value === "Teslim Edildi"
            ? "bg-green-100 text-green-800"
            : value === "Onaylandı"
              ? "bg-blue-100 text-blue-800"
              : value === "Bekliyor"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
        return <span className={`px-2 py-1 rounded-full text-xs ${colorClass}`}>{value}</span>
      },
    },
    {
      key: "expectedDelivery",
      title: "Beklenen Teslimat",
      sortable: true,
      width: "140px",
      render: (value: string) => new Date(value).toLocaleDateString("tr-TR"),
    },
  ]

  const movementColumns = [
    {
      key: "date",
      title: "Tarih",
      sortable: true,
      width: "120px",
      render: (value: string) => new Date(value).toLocaleDateString("tr-TR"),
    },
    {
      key: "itemCode",
      title: "Ürün Kodu",
      filterable: true,
      width: "120px",
    },
    {
      key: "itemName",
      title: "Ürün Adı",
      filterable: true,
      width: "180px",
    },
    {
      key: "type",
      title: "İşlem Tipi",
      filterable: true,
      filterType: "select" as const,
      width: "100px",
      filterOptions: [
        { value: "Giriş", label: "Giriş" },
        { value: "Çıkış", label: "Çıkış" },
        { value: "Transfer", label: "Transfer" },
        { value: "Sayım", label: "Sayım" },
      ],
      render: (value: string) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            value === "Giriş"
              ? "bg-green-100 text-green-800"
              : value === "Çıkış"
                ? "bg-red-100 text-red-800"
                : value === "Transfer"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-purple-100 text-purple-800"
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      key: "quantity",
      title: "Miktar",
      sortable: true,
      align: "center" as const,
      width: "100px",
      render: (value: number, row: any) => `${value} ${row.unit}`,
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
      key: "reference",
      title: "Referans",
      width: "130px",
    },
    {
      key: "user",
      title: "Kullanıcı",
      filterable: true,
      width: "120px",
    },
    {
      key: "notes",
      title: "Notlar",
      width: "200px",
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
                <h1 className="text-2xl font-bold text-gray-900">Sipariş & Stok Yönetimi</h1>
                <p className="text-sm text-gray-500">Malzeme siparişleri ve stok takibi</p>
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
                  <p className="text-sm font-medium text-gray-600">Toplam Ürün</p>
                  <p className="text-2xl font-bold text-gray-900">{inventoryData.length}</p>
                  <p className="text-xs text-green-600">
                    ₺{inventoryData.reduce((sum, item) => sum + item.totalValue, 0).toLocaleString()} değer
                  </p>
                </div>
                <Package className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Kritik Stok</p>
                  <p className="text-2xl font-bold text-red-600">
                    {inventoryData.filter((item) => item.status === "Kritik").length}
                  </p>
                  <p className="text-xs text-red-600">Acil sipariş gerekli</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Düşük Stok</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {inventoryData.filter((item) => item.status === "Düşük").length}
                  </p>
                  <p className="text-xs text-orange-600">Sipariş önerilir</p>
                </div>
                <TrendingDown className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Bekleyen Sipariş</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {orderData.filter((order) => order.status === "Bekliyor").length}
                  </p>
                  <p className="text-xs text-purple-600">
                    ₺
                    {orderData
                      .filter((order) => order.status === "Bekliyor")
                      .reduce((sum, order) => sum + order.totalAmount, 0)
                      .toLocaleString()}
                  </p>
                </div>
                <Truck className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="inventory" className="space-y-6">
          <TabsList>
            <TabsTrigger value="inventory">Stok Durumu</TabsTrigger>
            <TabsTrigger value="orders">Siparişler</TabsTrigger>
            <TabsTrigger value="movements">Stok Hareketleri</TabsTrigger>
            <TabsTrigger value="reports">Raporlar</TabsTrigger>
          </TabsList>

          <TabsContent value="inventory">
            <Card>
              <CardHeader>
                <CardTitle>Stok Durumu</CardTitle>
                <CardDescription>Tüm malzemelerin mevcut stok durumu ve değerleri</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  data={inventoryData}
                  columns={inventoryColumns}
                  title="Stok Listesi"
                  height={500}
                  onRowClick={(row) => console.log("Seçilen ürün:", row)}
                />

                {/* Critical Stock Alerts */}
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4">Stok Uyarıları</h3>
                  <div className="space-y-3">
                    {inventoryData
                      .filter((item) => item.status === "Kritik" || item.status === "Düşük")
                      .map((item) => (
                        <div
                          key={item.id}
                          className={`flex items-center justify-between p-3 rounded border ${
                            item.status === "Kritik" ? "bg-red-50 border-red-200" : "bg-yellow-50 border-yellow-200"
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <AlertTriangle
                              className={`h-5 w-5 ${item.status === "Kritik" ? "text-red-500" : "text-yellow-500"}`}
                            />
                            <div>
                              <span className="font-medium">{item.itemName}</span>
                              <p className="text-sm text-gray-600">
                                Mevcut: {item.currentStock} {item.unit} | Min: {item.minStock} {item.unit}
                              </p>
                            </div>
                          </div>
                          <Button size="sm" variant="outline">
                            Sipariş Ver
                          </Button>
                        </div>
                      ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Sipariş Yönetimi</CardTitle>
                <CardDescription>Malzeme siparişleri ve teslimat takibi</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  data={orderData}
                  columns={orderColumns}
                  title="Siparişler"
                  height={500}
                  onRowClick={(row) => console.log("Seçilen sipariş:", row)}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="movements">
            <Card>
              <CardHeader>
                <CardTitle>Stok Hareketleri</CardTitle>
                <CardDescription>Tüm stok giriş-çıkış hareketleri</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  data={movementData}
                  columns={movementColumns}
                  title="Stok Hareketleri"
                  height={500}
                  onRowClick={(row) => console.log("Seçilen hareket:", row)}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Stok Raporları</CardTitle>
                <CardDescription>Stok analizi ve raporları</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Kategori Bazlı Stok Değeri</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          "İnşaat Malzemeleri",
                          "Elektrik Malzemeleri",
                          "Seramik & Fayans",
                          "Banyo Gereçleri",
                          "Boya & Kimyasallar",
                        ].map((category) => {
                          const items = inventoryData.filter((item) => item.category === category)
                          const totalValue = items.reduce((sum, item) => sum + item.totalValue, 0)
                          const itemCount = items.length

                          return (
                            <div key={category} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                              <div>
                                <span className="font-medium">{category}</span>
                                <p className="text-xs text-gray-500">{itemCount} ürün</p>
                              </div>
                              <span className="font-bold">₺{totalValue.toLocaleString()}</span>
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Stok Durumu Özeti</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                          <span className="font-medium">Normal Stok</span>
                          <span className="font-bold text-green-600">
                            {inventoryData.filter((item) => item.status === "Normal").length} ürün
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-yellow-50 rounded">
                          <span className="font-medium">Düşük Stok</span>
                          <span className="font-bold text-yellow-600">
                            {inventoryData.filter((item) => item.status === "Düşük").length} ürün
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-red-50 rounded">
                          <span className="font-medium">Kritik Stok</span>
                          <span className="font-bold text-red-600">
                            {inventoryData.filter((item) => item.status === "Kritik").length} ürün
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                          <span className="font-medium">Fazla Stok</span>
                          <span className="font-bold text-blue-600">
                            {inventoryData.filter((item) => item.status === "Fazla").length} ürün
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
