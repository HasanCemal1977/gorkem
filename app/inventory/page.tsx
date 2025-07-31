"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Plus, Package, AlertTriangle, TrendingDown, Truck, WarehouseIcon } from "lucide-react"
import Link from "next/link"
import { DataTable } from "@/components/data-table"
import { useState, useEffect } from "react"

interface Product {
  id: number
  product_code: string
  barcode?: string
  name: string
  description?: string
  category_name?: string
  unit: string
  purchase_price: number
  sales_price: number
  critical_stock: number
  total_stock: number
  stock_status: "Normal" | "Düşük" | "Kritik"
  status: "Aktif" | "Pasif"
}

interface StockLevel {
  id: number
  product_id: number
  warehouse_id: number
  quantity: number
  product_name: string
  product_code: string
  unit: string
  warehouse_name: string
  stock_status: "Normal" | "Düşük" | "Kritik"
}

interface StockMovement {
  id: number
  product_id: number
  warehouse_id: number
  movement_type: "Giriş" | "Çıkış" | "İade" | "Fire" | "Düzeltme" | "Transfer"
  reference_type: "Satın Alma" | "Satış" | "İade" | "Manuel" | "Transfer" | "Düzeltme"
  quantity: number
  movement_date: string
  description?: string
  user_name?: string
  product_name: string
  product_code: string
  unit: string
  warehouse_name: string
}

interface PurchaseOrder {
  id: number
  order_number: string
  vendor_name?: string
  order_date: string
  expected_delivery_date?: string
  status: "Bekliyor" | "Onaylandı" | "Kısmen Teslim" | "Tamamlandı" | "İptal"
  total_amount: number
  item_count: number
}

interface Category {
  id: number
  name: string
  description?: string
}

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [warehouses, setWarehouses] = useState<any[]>([])
  const [stockLevels, setStockLevels] = useState<StockLevel[]>([])
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([])
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  // Modal states
  const [showProductModal, setShowProductModal] = useState(false)
  const [showMovementModal, setShowMovementModal] = useState(false)
  const [showWarehouseModal, setShowWarehouseModal] = useState(false)

  // Form states
  const [newProduct, setNewProduct] = useState({
    product_code: "",
    barcode: "",
    name: "",
    description: "",
    category_id: "",
    unit: "Adet",
    purchase_price: 0,
    sales_price: 0,
    critical_stock: 0,
  })

  const [newMovement, setNewMovement] = useState({
    product_id: "",
    warehouse_id: "",
    movement_type: "Giriş",
    reference_type: "Manuel",
    quantity: 0,
    movement_date: new Date().toISOString().split("T")[0],
    description: "",
    user_name: "Sistem Kullanıcısı",
  })

  const [newWarehouse, setNewWarehouse] = useState({
    name: "",
    location: "",
    manager_name: "",
    phone: "",
  })

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    try {
      setLoading(true)
      const [productsRes, warehousesRes, stockLevelsRes, movementsRes, ordersRes, categoriesRes] = await Promise.all([
        fetch("/api/inventory/products"),
        fetch("/api/inventory/warehouses"),
        fetch("/api/inventory/stock-levels"),
        fetch("/api/inventory/stock-movements"),
        fetch("/api/inventory/purchase-orders"),
        fetch("/api/inventory/categories"),
      ])

      const [productsData, warehousesData, stockLevelsData, movementsData, ordersData, categoriesData] =
        await Promise.all([
          productsRes.json(),
          warehousesRes.json(),
          stockLevelsRes.json(),
          movementsRes.json(),
          ordersRes.json(),
          categoriesRes.json(),
        ])

      setProducts(productsData)
      setWarehouses(warehousesData)
      setStockLevels(stockLevelsData)
      setStockMovements(movementsData)
      setPurchaseOrders(ordersData)
      setCategories(categoriesData)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddProduct = async () => {
    try {
      const response = await fetch("/api/inventory/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      })

      if (response.ok) {
        setShowProductModal(false)
        setNewProduct({
          product_code: "",
          barcode: "",
          name: "",
          description: "",
          category_id: "",
          unit: "Adet",
          purchase_price: 0,
          sales_price: 0,
          critical_stock: 0,
        })
        fetchAllData()
      }
    } catch (error) {
      console.error("Error adding product:", error)
    }
  }

  const handleAddMovement = async () => {
    try {
      const response = await fetch("/api/inventory/stock-movements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMovement),
      })

      if (response.ok) {
        setShowMovementModal(false)
        setNewMovement({
          product_id: "",
          warehouse_id: "",
          movement_type: "Giriş",
          reference_type: "Manuel",
          quantity: 0,
          movement_date: new Date().toISOString().split("T")[0],
          description: "",
          user_name: "Sistem Kullanıcısı",
        })
        fetchAllData()
      }
    } catch (error) {
      console.error("Error adding movement:", error)
    }
  }

  const handleAddWarehouse = async () => {
    try {
      const response = await fetch("/api/inventory/warehouses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newWarehouse),
      })

      if (response.ok) {
        setShowWarehouseModal(false)
        setNewWarehouse({
          name: "",
          location: "",
          manager_name: "",
          phone: "",
        })
        fetchAllData()
      }
    } catch (error) {
      console.error("Error adding warehouse:", error)
    }
  }

  // Table columns
  const productColumns = [
    {
      key: "product_code",
      title: "Ürün Kodu",
      filterable: true,
      width: "120px",
    },
    {
      key: "name",
      title: "Ürün Adı",
      filterable: true,
      width: "200px",
    },
    {
      key: "category_name",
      title: "Kategori",
      filterable: true,
      width: "150px",
    },
    {
      key: "total_stock",
      title: "Toplam Stok",
      sortable: true,
      align: "center" as const,
      width: "120px",
      render: (value: number, row: Product) => (
        <div>
          <span className={value <= row.critical_stock ? "text-red-600 font-medium" : ""}>{value}</span>
          <span className="text-xs text-gray-500 ml-1">{row.unit}</span>
        </div>
      ),
    },
    {
      key: "critical_stock",
      title: "Kritik Stok",
      sortable: true,
      align: "center" as const,
      width: "100px",
      render: (value: number, row: Product) => `${value} ${row.unit}`,
    },
    {
      key: "purchase_price",
      title: "Alış Fiyatı",
      sortable: true,
      align: "right" as const,
      width: "120px",
      render: (value: number) => `₺${value.toLocaleString()}`,
    },
    {
      key: "sales_price",
      title: "Satış Fiyatı",
      sortable: true,
      align: "right" as const,
      width: "120px",
      render: (value: number) => `₺${value.toLocaleString()}`,
    },
    {
      key: "stock_status",
      title: "Stok Durumu",
      filterable: true,
      filterType: "select" as const,
      width: "120px",
      filterOptions: [
        { value: "Normal", label: "Normal" },
        { value: "Düşük", label: "Düşük" },
        { value: "Kritik", label: "Kritik" },
      ],
      render: (value: string) => {
        const colorClass =
          value === "Normal"
            ? "bg-green-100 text-green-800"
            : value === "Düşük"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
        return <span className={`px-2 py-1 rounded-full text-xs ${colorClass}`}>{value}</span>
      },
    },
  ]

  const stockLevelColumns = [
    {
      key: "product_code",
      title: "Ürün Kodu",
      filterable: true,
      width: "120px",
    },
    {
      key: "product_name",
      title: "Ürün Adı",
      filterable: true,
      width: "200px",
    },
    {
      key: "warehouse_name",
      title: "Depo",
      filterable: true,
      filterType: "select" as const,
      width: "150px",
      filterOptions: warehouses.map((w) => ({ value: w.name, label: w.name })),
    },
    {
      key: "quantity",
      title: "Miktar",
      sortable: true,
      align: "center" as const,
      width: "100px",
      render: (value: number, row: StockLevel) => `${value} ${row.unit}`,
    },
    {
      key: "stock_status",
      title: "Durum",
      filterable: true,
      filterType: "select" as const,
      width: "100px",
      filterOptions: [
        { value: "Normal", label: "Normal" },
        { value: "Düşük", label: "Düşük" },
        { value: "Kritik", label: "Kritik" },
      ],
      render: (value: string) => {
        const colorClass =
          value === "Normal"
            ? "bg-green-100 text-green-800"
            : value === "Düşük"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
        return <span className={`px-2 py-1 rounded-full text-xs ${colorClass}`}>{value}</span>
      },
    },
  ]

  const movementColumns = [
    {
      key: "movement_date",
      title: "Tarih",
      sortable: true,
      width: "120px",
      render: (value: string) => new Date(value).toLocaleDateString("tr-TR"),
    },
    {
      key: "product_code",
      title: "Ürün Kodu",
      filterable: true,
      width: "120px",
    },
    {
      key: "product_name",
      title: "Ürün Adı",
      filterable: true,
      width: "180px",
    },
    {
      key: "warehouse_name",
      title: "Depo",
      filterable: true,
      width: "120px",
    },
    {
      key: "movement_type",
      title: "İşlem Tipi",
      filterable: true,
      filterType: "select" as const,
      width: "100px",
      filterOptions: [
        { value: "Giriş", label: "Giriş" },
        { value: "Çıkış", label: "Çıkış" },
        { value: "İade", label: "İade" },
        { value: "Fire", label: "Fire" },
        { value: "Transfer", label: "Transfer" },
        { value: "Düzeltme", label: "Düzeltme" },
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
      render: (value: number, row: StockMovement) => `${value} ${row.unit}`,
    },
    {
      key: "reference_type",
      title: "Referans Tipi",
      filterable: true,
      width: "120px",
    },
    {
      key: "user_name",
      title: "Kullanıcı",
      filterable: true,
      width: "120px",
    },
    {
      key: "description",
      title: "Açıklama",
      width: "200px",
    },
  ]

  const purchaseOrderColumns = [
    {
      key: "order_number",
      title: "Sipariş No",
      filterable: true,
      width: "130px",
    },
    {
      key: "order_date",
      title: "Sipariş Tarihi",
      sortable: true,
      width: "120px",
      render: (value: string) => new Date(value).toLocaleDateString("tr-TR"),
    },
    {
      key: "vendor_name",
      title: "Tedarikçi",
      filterable: true,
      width: "180px",
    },
    {
      key: "item_count",
      title: "Kalem Sayısı",
      sortable: true,
      align: "center" as const,
      width: "100px",
    },
    {
      key: "total_amount",
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
        { value: "Tamamlandı", label: "Tamamlandı" },
        { value: "Onaylandı", label: "Onaylandı" },
        { value: "Bekliyor", label: "Bekliyor" },
        { value: "Kısmen Teslim", label: "Kısmen Teslim" },
        { value: "İptal", label: "İptal" },
      ],
      render: (value: string) => {
        const colorClass =
          value === "Tamamlandı"
            ? "bg-green-100 text-green-800"
            : value === "Onaylandı"
              ? "bg-blue-100 text-blue-800"
              : value === "Bekliyor"
                ? "bg-yellow-100 text-yellow-800"
                : value === "Kısmen Teslim"
                  ? "bg-orange-100 text-orange-800"
                  : "bg-red-100 text-red-800"
        return <span className={`px-2 py-1 rounded-full text-xs ${colorClass}`}>{value}</span>
      },
    },
    {
      key: "expected_delivery_date",
      title: "Beklenen Teslimat",
      sortable: true,
      width: "140px",
      render: (value: string) => (value ? new Date(value).toLocaleDateString("tr-TR") : "-"),
    },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Veriler yükleniyor...</p>
        </div>
      </div>
    )
  }

  const criticalStockCount = products.filter((p) => p.stock_status === "Kritik").length
  const lowStockCount = products.filter((p) => p.stock_status === "Düşük").length
  const totalStockValue = products.reduce((sum, p) => sum + p.total_stock * p.purchase_price, 0)
  const pendingOrdersCount = purchaseOrders.filter((o) => o.status === "Bekliyor").length

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
                <h1 className="text-2xl font-bold text-gray-900">Stok & Envanter Yönetimi</h1>
                <p className="text-sm text-gray-500">Ürün, stok ve sipariş takibi</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline">Rapor Al</Button>
              <Dialog open={showProductModal} onOpenChange={setShowProductModal}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Yeni Ürün
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Yeni Ürün Ekle</DialogTitle>
                    <DialogDescription>Sisteme yeni bir ürün ekleyin</DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="product_code">Ürün Kodu *</Label>
                      <Input
                        id="product_code"
                        value={newProduct.product_code}
                        onChange={(e) => setNewProduct({ ...newProduct, product_code: e.target.value })}
                        placeholder="MAL-001"
                      />
                    </div>
                    <div>
                      <Label htmlFor="barcode">Barkod</Label>
                      <Input
                        id="barcode"
                        value={newProduct.barcode}
                        onChange={(e) => setNewProduct({ ...newProduct, barcode: e.target.value })}
                        placeholder="8690123456789"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="name">Ürün Adı *</Label>
                      <Input
                        id="name"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        placeholder="Ürün adını girin"
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Kategori</Label>
                      <Select
                        value={newProduct.category_id}
                        onValueChange={(value) => setNewProduct({ ...newProduct, category_id: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Kategori seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id.toString()}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="unit">Birim *</Label>
                      <Select
                        value={newProduct.unit}
                        onValueChange={(value) => setNewProduct({ ...newProduct, unit: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Adet">Adet</SelectItem>
                          <SelectItem value="Kg">Kg</SelectItem>
                          <SelectItem value="Litre">Litre</SelectItem>
                          <SelectItem value="Metre">Metre</SelectItem>
                          <SelectItem value="Kutu">Kutu</SelectItem>
                          <SelectItem value="Paket">Paket</SelectItem>
                          <SelectItem value="Ton">Ton</SelectItem>
                          <SelectItem value="m²">m²</SelectItem>
                          <SelectItem value="m³">m³</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="purchase_price">Alış Fiyatı</Label>
                      <Input
                        id="purchase_price"
                        type="number"
                        value={newProduct.purchase_price}
                        onChange={(e) =>
                          setNewProduct({ ...newProduct, purchase_price: Number.parseFloat(e.target.value) || 0 })
                        }
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <Label htmlFor="sales_price">Satış Fiyatı</Label>
                      <Input
                        id="sales_price"
                        type="number"
                        value={newProduct.sales_price}
                        onChange={(e) =>
                          setNewProduct({ ...newProduct, sales_price: Number.parseFloat(e.target.value) || 0 })
                        }
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <Label htmlFor="critical_stock">Kritik Stok Seviyesi</Label>
                      <Input
                        id="critical_stock"
                        type="number"
                        value={newProduct.critical_stock}
                        onChange={(e) =>
                          setNewProduct({ ...newProduct, critical_stock: Number.parseInt(e.target.value) || 0 })
                        }
                        placeholder="0"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="description">Açıklama</Label>
                      <Textarea
                        id="description"
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        placeholder="Ürün açıklaması"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 mt-4">
                    <Button variant="outline" onClick={() => setShowProductModal(false)}>
                      İptal
                    </Button>
                    <Button onClick={handleAddProduct}>Kaydet</Button>
                  </div>
                </DialogContent>
              </Dialog>
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
                  <p className="text-2xl font-bold text-gray-900">{products.length}</p>
                  <p className="text-xs text-green-600">₺{totalStockValue.toLocaleString()} değer</p>
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
                  <p className="text-2xl font-bold text-red-600">{criticalStockCount}</p>
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
                  <p className="text-2xl font-bold text-orange-600">{lowStockCount}</p>
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
                  <p className="text-2xl font-bold text-gray-900">{pendingOrdersCount}</p>
                  <p className="text-xs text-purple-600">Onay bekliyor</p>
                </div>
                <Truck className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList>
            <TabsTrigger value="products">Ürünler</TabsTrigger>
            <TabsTrigger value="stock-levels">Stok Seviyeleri</TabsTrigger>
            <TabsTrigger value="movements">Stok Hareketleri</TabsTrigger>
            <TabsTrigger value="purchase-orders">Satın Alma Siparişleri</TabsTrigger>
            <TabsTrigger value="warehouses">Depolar</TabsTrigger>
            <TabsTrigger value="reports">Raporlar</TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle>Ürün Listesi</CardTitle>
                <CardDescription>Tüm ürünlerin listesi ve stok durumları</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  data={products}
                  columns={productColumns}
                  title="Ürünler"
                  height={500}
                  onRowClick={(row) => console.log("Seçilen ürün:", row)}
                />

                {/* Critical Stock Alerts */}
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4">Stok Uyarıları</h3>
                  <div className="space-y-3">
                    {products
                      .filter((item) => item.stock_status === "Kritik" || item.stock_status === "Düşük")
                      .map((item) => (
                        <div
                          key={item.id}
                          className={`flex items-center justify-between p-3 rounded border ${
                            item.stock_status === "Kritik"
                              ? "bg-red-50 border-red-200"
                              : "bg-yellow-50 border-yellow-200"
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <AlertTriangle
                              className={`h-5 w-5 ${item.stock_status === "Kritik" ? "text-red-500" : "text-yellow-500"}`}
                            />
                            <div>
                              <span className="font-medium">{item.name}</span>
                              <p className="text-sm text-gray-600">
                                Mevcut: {item.total_stock} {item.unit} | Kritik: {item.critical_stock} {item.unit}
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

          <TabsContent value="stock-levels">
            <Card>
              <CardHeader>
                <CardTitle>Stok Seviyeleri</CardTitle>
                <CardDescription>Depo bazlı stok miktarları</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  data={stockLevels}
                  columns={stockLevelColumns}
                  title="Stok Seviyeleri"
                  height={500}
                  onRowClick={(row) => console.log("Seçilen stok:", row)}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="movements">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Stok Hareketleri</CardTitle>
                    <CardDescription>Tüm stok giriş-çıkış hareketleri</CardDescription>
                  </div>
                  <Dialog open={showMovementModal} onOpenChange={setShowMovementModal}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Yeni Hareket
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Yeni Stok Hareketi</DialogTitle>
                        <DialogDescription>Manuel stok hareketi ekleyin</DialogDescription>
                      </DialogHeader>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="product">Ürün *</Label>
                          <Select
                            value={newMovement.product_id}
                            onValueChange={(value) => setNewMovement({ ...newMovement, product_id: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Ürün seçin" />
                            </SelectTrigger>
                            <SelectContent>
                              {products.map((product) => (
                                <SelectItem key={product.id} value={product.id.toString()}>
                                  {product.product_code} - {product.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="warehouse">Depo *</Label>
                          <Select
                            value={newMovement.warehouse_id}
                            onValueChange={(value) => setNewMovement({ ...newMovement, warehouse_id: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Depo seçin" />
                            </SelectTrigger>
                            <SelectContent>
                              {warehouses.map((warehouse) => (
                                <SelectItem key={warehouse.id} value={warehouse.id.toString()}>
                                  {warehouse.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="movement_type">Hareket Tipi *</Label>
                          <Select
                            value={newMovement.movement_type}
                            onValueChange={(value) => setNewMovement({ ...newMovement, movement_type: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Giriş">Giriş</SelectItem>
                              <SelectItem value="Çıkış">Çıkış</SelectItem>
                              <SelectItem value="İade">İade</SelectItem>
                              <SelectItem value="Fire">Fire</SelectItem>
                              <SelectItem value="Transfer">Transfer</SelectItem>
                              <SelectItem value="Düzeltme">Düzeltme</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="reference_type">Referans Tipi</Label>
                          <Select
                            value={newMovement.reference_type}
                            onValueChange={(value) => setNewMovement({ ...newMovement, reference_type: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Manuel">Manuel</SelectItem>
                              <SelectItem value="Satın Alma">Satın Alma</SelectItem>
                              <SelectItem value="Satış">Satış</SelectItem>
                              <SelectItem value="İade">İade</SelectItem>
                              <SelectItem value="Transfer">Transfer</SelectItem>
                              <SelectItem value="Düzeltme">Düzeltme</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="quantity">Miktar *</Label>
                          <Input
                            id="quantity"
                            type="number"
                            value={newMovement.quantity}
                            onChange={(e) =>
                              setNewMovement({ ...newMovement, quantity: Number.parseInt(e.target.value) || 0 })
                            }
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <Label htmlFor="movement_date">Tarih *</Label>
                          <Input
                            id="movement_date"
                            type="date"
                            value={newMovement.movement_date}
                            onChange={(e) => setNewMovement({ ...newMovement, movement_date: e.target.value })}
                          />
                        </div>
                        <div className="col-span-2">
                          <Label htmlFor="description">Açıklama</Label>
                          <Textarea
                            id="description"
                            value={newMovement.description}
                            onChange={(e) => setNewMovement({ ...newMovement, description: e.target.value })}
                            placeholder="Hareket açıklaması"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2 mt-4">
                        <Button variant="outline" onClick={() => setShowMovementModal(false)}>
                          İptal
                        </Button>
                        <Button onClick={handleAddMovement}>Kaydet</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <DataTable
                  data={stockMovements}
                  columns={movementColumns}
                  title="Stok Hareketleri"
                  height={500}
                  onRowClick={(row) => console.log("Seçilen hareket:", row)}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="purchase-orders">
            <Card>
              <CardHeader>
                <CardTitle>Satın Alma Siparişleri</CardTitle>
                <CardDescription>Tedarikçilerden alınan siparişler</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  data={purchaseOrders}
                  columns={purchaseOrderColumns}
                  title="Satın Alma Siparişleri"
                  height={500}
                  onRowClick={(row) => console.log("Seçilen sipariş:", row)}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="warehouses">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Depo Yönetimi</CardTitle>
                    <CardDescription>Depo listesi ve bilgileri</CardDescription>
                  </div>
                  <Dialog open={showWarehouseModal} onOpenChange={setShowWarehouseModal}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Yeni Depo
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Yeni Depo Ekle</DialogTitle>
                        <DialogDescription>Sisteme yeni bir depo ekleyin</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="warehouse_name">Depo Adı *</Label>
                          <Input
                            id="warehouse_name"
                            value={newWarehouse.name}
                            onChange={(e) => setNewWarehouse({ ...newWarehouse, name: e.target.value })}
                            placeholder="Ana Depo"
                          />
                        </div>
                        <div>
                          <Label htmlFor="location">Konum</Label>
                          <Textarea
                            id="location"
                            value={newWarehouse.location}
                            onChange={(e) => setNewWarehouse({ ...newWarehouse, location: e.target.value })}
                            placeholder="Depo adresi"
                          />
                        </div>
                        <div>
                          <Label htmlFor="manager_name">Sorumlu Kişi</Label>
                          <Input
                            id="manager_name"
                            value={newWarehouse.manager_name}
                            onChange={(e) => setNewWarehouse({ ...newWarehouse, manager_name: e.target.value })}
                            placeholder="Ahmet Yılmaz"
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Telefon</Label>
                          <Input
                            id="phone"
                            value={newWarehouse.phone}
                            onChange={(e) => setNewWarehouse({ ...newWarehouse, phone: e.target.value })}
                            placeholder="0532 123 4567"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2 mt-4">
                        <Button variant="outline" onClick={() => setShowWarehouseModal(false)}>
                          İptal
                        </Button>
                        <Button onClick={handleAddWarehouse}>Kaydet</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {warehouses.map((warehouse) => (
                    <Card key={warehouse.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{warehouse.name}</CardTitle>
                          <WarehouseIcon className="h-5 w-5 text-gray-500" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <p className="text-sm text-gray-600">
                            <strong>Konum:</strong> {warehouse.location || "Belirtilmemiş"}
                          </p>
                          {warehouse.manager_name && (
                            <p className="text-sm text-gray-600">
                              <strong>Sorumlu:</strong> {warehouse.manager_name}
                            </p>
                          )}
                          {warehouse.phone && (
                            <p className="text-sm text-gray-600">
                              <strong>Telefon:</strong> {warehouse.phone}
                            </p>
                          )}
                          <div className="pt-2">
                            <p className="text-xs text-gray-500">
                              Stok Çeşidi: {stockLevels.filter((sl) => sl.warehouse_id === warehouse.id).length} ürün
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
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
                        {categories.map((category) => {
                          const categoryProducts = products.filter((item) => item.category_name === category.name)
                          const totalValue = categoryProducts.reduce(
                            (sum, item) => sum + item.total_stock * item.purchase_price,
                            0,
                          )
                          const itemCount = categoryProducts.length

                          return (
                            <div key={category.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                              <div>
                                <span className="font-medium">{category.name}</span>
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
                            {products.filter((item) => item.stock_status === "Normal").length} ürün
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-yellow-50 rounded">
                          <span className="font-medium">Düşük Stok</span>
                          <span className="font-bold text-yellow-600">
                            {products.filter((item) => item.stock_status === "Düşük").length} ürün
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-red-50 rounded">
                          <span className="font-medium">Kritik Stok</span>
                          <span className="font-bold text-red-600">
                            {products.filter((item) => item.stock_status === "Kritik").length} ürün
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Depo Bazlı Stok Dağılımı</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {warehouses.map((warehouse) => {
                          const warehouseStock = stockLevels.filter((sl) => sl.warehouse_id === warehouse.id)
                          const totalItems = warehouseStock.reduce((sum, sl) => sum + sl.quantity, 0)
                          const uniqueProducts = warehouseStock.length

                          return (
                            <div
                              key={warehouse.id}
                              className="flex justify-between items-center p-3 bg-gray-50 rounded"
                            >
                              <div>
                                <span className="font-medium">{warehouse.name}</span>
                                <p className="text-xs text-gray-500">{uniqueProducts} çeşit ürün</p>
                              </div>
                              <span className="font-bold">{totalItems.toLocaleString()} adet</span>
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Son Hareketler</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {stockMovements.slice(0, 5).map((movement) => (
                          <div key={movement.id} className="flex items-center justify-between p-2 border-b">
                            <div className="flex items-center space-x-2">
                              <span
                                className={`w-2 h-2 rounded-full ${
                                  movement.movement_type === "Giriş" ? "bg-green-500" : "bg-red-500"
                                }`}
                              ></span>
                              <div>
                                <span className="text-sm font-medium">{movement.product_name}</span>
                                <p className="text-xs text-gray-500">{movement.warehouse_name}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-sm font-medium">
                                {movement.movement_type === "Giriş" ? "+" : "-"}
                                {movement.quantity} {movement.unit}
                              </span>
                              <p className="text-xs text-gray-500">
                                {new Date(movement.movement_date).toLocaleDateString("tr-TR")}
                              </p>
                            </div>
                          </div>
                        ))}
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
