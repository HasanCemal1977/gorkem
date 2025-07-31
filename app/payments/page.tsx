"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Edit, Trash2, CreditCard, Calendar, TrendingUp, AlertTriangle } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface Vendor {
  id: number
  name: string
  tax_no: string
  phone: string
  email: string
  address: string
  iban: string
  currency: string
  total_invoiced: number
  total_paid: number
  remaining_balance: number
  last_updated: string
}

interface PurchaseInvoice {
  id: number
  vendor_id: number
  vendor_name: string
  vendor_tax_no: string
  invoice_no: string
  invoice_date: string
  due_date: string
  total_amount: number
  currency: string
  description: string
  accounting_code: string
  is_paid: boolean
  paid_amount: number
  remaining_amount: number
}

interface Payment {
  id: number
  vendor_id: number
  vendor_name: string
  payment_date: string
  amount: number
  payment_method: string
  bank_account_id: number
  invoice_id: number
  invoice_no: string
  payment_plan_id: number
  reference_no: string
  accounting_code: string
  description: string
  bank_name: string
  account_number: string
}

interface PaymentPlan {
  id: number
  invoice_id: number
  invoice_no: string
  invoice_total: number
  vendor_name: string
  due_date: string
  planned_amount: number
  status: "Bekliyor" | "Ödendi" | "Gecikmiş"
  days_overdue: number
}

interface BankAccount {
  id: number
  bank_name: string
  account_number: string
  iban: string
  currency: string
  balance: number
}

export default function PaymentsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [invoices, setInvoices] = useState<PurchaseInvoice[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [paymentPlans, setPaymentPlans] = useState<PaymentPlan[]>([])
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("vendors")

  // Form states
  const [vendorForm, setVendorForm] = useState({
    name: "",
    tax_no: "",
    phone: "",
    email: "",
    address: "",
    iban: "",
    currency: "TRY",
  })

  const [invoiceForm, setInvoiceForm] = useState({
    vendor_id: "",
    invoice_no: "",
    invoice_date: "",
    due_date: "",
    total_amount: "",
    currency: "TRY",
    description: "",
    accounting_code: "320",
  })

  const [paymentForm, setPaymentForm] = useState({
    vendor_id: "",
    payment_date: "",
    amount: "",
    payment_method: "Banka",
    bank_account_id: "",
    invoice_id: "",
    payment_plan_id: "",
    reference_no: "",
    accounting_code: "320",
    description: "",
  })

  const [planForm, setPlanForm] = useState({
    invoice_id: "",
    due_date: "",
    planned_amount: "",
    status: "Bekliyor",
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [vendorsRes, invoicesRes, paymentsRes, plansRes, bankRes] = await Promise.all([
        fetch("/api/vendors"),
        fetch("/api/purchase-invoices"),
        fetch("/api/payments"),
        fetch("/api/payment-plans"),
        fetch("/api/banking/accounts"),
      ])

      const [vendorsData, invoicesData, paymentsData, plansData, bankData] = await Promise.all([
        vendorsRes.json(),
        invoicesRes.json(),
        paymentsRes.json(),
        plansRes.json(),
        bankRes.json(),
      ])

      setVendors(vendorsData)
      setInvoices(invoicesData)
      setPayments(paymentsData)
      setPaymentPlans(plansData)
      setBankAccounts(bankData)
    } catch (error) {
      console.error("Error fetching data:", error)
      toast({
        title: "Hata",
        description: "Veriler yüklenirken hata oluştu",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (type: string) => {
    try {
      let url = ""
      let data = {}

      switch (type) {
        case "vendor":
          url = editingItem ? `/api/vendors/${editingItem.id}` : "/api/vendors"
          data = vendorForm
          break
        case "invoice":
          url = editingItem ? `/api/purchase-invoices/${editingItem.id}` : "/api/purchase-invoices"
          data = invoiceForm
          break
        case "payment":
          url = editingItem ? `/api/payments/${editingItem.id}` : "/api/payments"
          data = paymentForm
          break
        case "plan":
          url = editingItem ? `/api/payment-plans/${editingItem.id}` : "/api/payment-plans"
          data = planForm
          break
      }

      const method = editingItem ? "PUT" : "POST"
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast({
          title: "Başarılı",
          description: `${type === "vendor" ? "Tedarikçi" : type === "invoice" ? "Fatura" : type === "payment" ? "Ödeme" : "Plan"} ${editingItem ? "güncellendi" : "eklendi"}`,
        })
        setDialogOpen(false)
        setEditingItem(null)
        resetForms()
        fetchData()
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: "İşlem sırasında hata oluştu",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (type: string, id: number) => {
    if (!confirm("Bu kaydı silmek istediğinizden emin misiniz?")) return

    try {
      let url = ""
      switch (type) {
        case "vendor":
          url = `/api/vendors/${id}`
          break
        case "invoice":
          url = `/api/purchase-invoices/${id}`
          break
        case "payment":
          url = `/api/payments/${id}`
          break
        case "plan":
          url = `/api/payment-plans/${id}`
          break
      }

      const response = await fetch(url, { method: "DELETE" })

      if (response.ok) {
        toast({
          title: "Başarılı",
          description: "Kayıt silindi",
        })
        fetchData()
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: "Silme işlemi sırasında hata oluştu",
        variant: "destructive",
      })
    }
  }

  const resetForms = () => {
    setVendorForm({
      name: "",
      tax_no: "",
      phone: "",
      email: "",
      address: "",
      iban: "",
      currency: "TRY",
    })
    setInvoiceForm({
      vendor_id: "",
      invoice_no: "",
      invoice_date: "",
      due_date: "",
      total_amount: "",
      currency: "TRY",
      description: "",
      accounting_code: "320",
    })
    setPaymentForm({
      vendor_id: "",
      payment_date: "",
      amount: "",
      payment_method: "Banka",
      bank_account_id: "",
      invoice_id: "",
      payment_plan_id: "",
      reference_no: "",
      accounting_code: "320",
      description: "",
    })
    setPlanForm({
      invoice_id: "",
      due_date: "",
      planned_amount: "",
      status: "Bekliyor",
    })
  }

  const openEditDialog = (type: string, item: any) => {
    setEditingItem(item)

    switch (type) {
      case "vendor":
        setVendorForm({
          name: item.name || "",
          tax_no: item.tax_no || "",
          phone: item.phone || "",
          email: item.email || "",
          address: item.address || "",
          iban: item.iban || "",
          currency: item.currency || "TRY",
        })
        break
      case "invoice":
        setInvoiceForm({
          vendor_id: item.vendor_id?.toString() || "",
          invoice_no: item.invoice_no || "",
          invoice_date: item.invoice_date || "",
          due_date: item.due_date || "",
          total_amount: item.total_amount?.toString() || "",
          currency: item.currency || "TRY",
          description: item.description || "",
          accounting_code: item.accounting_code || "320",
        })
        break
      case "payment":
        setPaymentForm({
          vendor_id: item.vendor_id?.toString() || "",
          payment_date: item.payment_date || "",
          amount: item.amount?.toString() || "",
          payment_method: item.payment_method || "Banka",
          bank_account_id: item.bank_account_id?.toString() || "",
          invoice_id: item.invoice_id?.toString() || "",
          payment_plan_id: item.payment_plan_id?.toString() || "",
          reference_no: item.reference_no || "",
          accounting_code: item.accounting_code || "320",
          description: item.description || "",
        })
        break
      case "plan":
        setPlanForm({
          invoice_id: item.invoice_id?.toString() || "",
          due_date: item.due_date || "",
          planned_amount: item.planned_amount?.toString() || "",
          status: item.status || "Bekliyor",
        })
        break
    }

    setDialogOpen(true)
  }

  // Calculate dashboard stats
  const totalDebt = vendors.reduce((sum, vendor) => sum + (vendor.remaining_balance || 0), 0)
  const totalPaid = vendors.reduce((sum, vendor) => sum + (vendor.total_paid || 0), 0)
  const overdueInvoices = invoices.filter((inv) => new Date(inv.due_date) < new Date() && !inv.is_paid).length
  const overduePlans = paymentPlans.filter((plan) => plan.status === "Gecikmiş").length

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("tr-TR")
  }

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
      Bekliyor: "outline",
      Ödendi: "default",
      Gecikmiş: "destructive",
    }
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
          <p className="mt-4">Veriler yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Ödemeler & Borç Takibi</h1>
          <p className="text-muted-foreground">Tedarikçi borçları, faturalar ve ödeme planları</p>
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Borç</CardTitle>
            <TrendingUp className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(totalDebt)}</div>
            <p className="text-xs text-muted-foreground">Tüm tedarikçilere olan borç</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Ödenen</CardTitle>
            <CreditCard className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(totalPaid)}</div>
            <p className="text-xs text-muted-foreground">Yapılan ödemeler toplamı</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vadesi Geçen</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{overdueInvoices}</div>
            <p className="text-xs text-muted-foreground">Geciken fatura sayısı</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Geciken Planlar</CardTitle>
            <Calendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{overduePlans}</div>
            <p className="text-xs text-muted-foreground">Vadesi geçen ödeme planları</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="vendors">Tedarikçiler</TabsTrigger>
          <TabsTrigger value="invoices">Faturalar</TabsTrigger>
          <TabsTrigger value="payments">Ödemeler</TabsTrigger>
          <TabsTrigger value="plans">Ödeme Planları</TabsTrigger>
          <TabsTrigger value="reports">Raporlar</TabsTrigger>
        </TabsList>

        {/* Vendors Tab */}
        <TabsContent value="vendors" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Tedarikçiler</h2>
            <Dialog open={dialogOpen && activeTab === "vendors"} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setEditingItem(null)
                    resetForms()
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Yeni Tedarikçi
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>{editingItem ? "Tedarikçi Düzenle" : "Yeni Tedarikçi"}</DialogTitle>
                  <DialogDescription>Tedarikçi bilgilerini girin</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Firma Adı *</Label>
                      <Input
                        id="name"
                        value={vendorForm.name}
                        onChange={(e) => setVendorForm({ ...vendorForm, name: e.target.value })}
                        placeholder="Firma adı"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tax_no">Vergi No</Label>
                      <Input
                        id="tax_no"
                        value={vendorForm.tax_no}
                        onChange={(e) => setVendorForm({ ...vendorForm, tax_no: e.target.value })}
                        placeholder="Vergi numarası"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefon</Label>
                      <Input
                        id="phone"
                        value={vendorForm.phone}
                        onChange={(e) => setVendorForm({ ...vendorForm, phone: e.target.value })}
                        placeholder="Telefon numarası"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">E-posta</Label>
                      <Input
                        id="email"
                        type="email"
                        value={vendorForm.email}
                        onChange={(e) => setVendorForm({ ...vendorForm, email: e.target.value })}
                        placeholder="E-posta adresi"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Adres</Label>
                    <Textarea
                      id="address"
                      value={vendorForm.address}
                      onChange={(e) => setVendorForm({ ...vendorForm, address: e.target.value })}
                      placeholder="Firma adresi"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="iban">IBAN</Label>
                      <Input
                        id="iban"
                        value={vendorForm.iban}
                        onChange={(e) => setVendorForm({ ...vendorForm, iban: e.target.value })}
                        placeholder="TR00 0000 0000 0000 0000 0000 00"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currency">Para Birimi</Label>
                      <Select
                        value={vendorForm.currency}
                        onValueChange={(value) => setVendorForm({ ...vendorForm, currency: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="TRY">TRY</SelectItem>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={() => handleSubmit("vendor")}>
                    {editingItem ? "Güncelle" : "Kaydet"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Firma Adı</TableHead>
                    <TableHead>Vergi No</TableHead>
                    <TableHead>Telefon</TableHead>
                    <TableHead>Toplam Borç</TableHead>
                    <TableHead>Ödenen</TableHead>
                    <TableHead>Kalan</TableHead>
                    <TableHead>İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vendors.map((vendor) => (
                    <TableRow key={vendor.id}>
                      <TableCell className="font-medium">{vendor.name}</TableCell>
                      <TableCell>{vendor.tax_no}</TableCell>
                      <TableCell>{vendor.phone}</TableCell>
                      <TableCell>{formatCurrency(vendor.total_invoiced || 0)}</TableCell>
                      <TableCell className="text-green-600">{formatCurrency(vendor.total_paid || 0)}</TableCell>
                      <TableCell className="text-red-600 font-medium">
                        {formatCurrency(vendor.remaining_balance || 0)}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => openEditDialog("vendor", vendor)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDelete("vendor", vendor.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Invoices Tab */}
        <TabsContent value="invoices" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Satın Alma Faturaları</h2>
            <Dialog open={dialogOpen && activeTab === "invoices"} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setEditingItem(null)
                    resetForms()
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Yeni Fatura
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>{editingItem ? "Fatura Düzenle" : "Yeni Fatura"}</DialogTitle>
                  <DialogDescription>Satın alma faturası bilgilerini girin</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="vendor_id">Tedarikçi *</Label>
                      <Select
                        value={invoiceForm.vendor_id}
                        onValueChange={(value) => setInvoiceForm({ ...invoiceForm, vendor_id: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Tedarikçi seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          {vendors.map((vendor) => (
                            <SelectItem key={vendor.id} value={vendor.id.toString()}>
                              {vendor.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="invoice_no">Fatura No *</Label>
                      <Input
                        id="invoice_no"
                        value={invoiceForm.invoice_no}
                        onChange={(e) => setInvoiceForm({ ...invoiceForm, invoice_no: e.target.value })}
                        placeholder="FAT-2024-001"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="invoice_date">Fatura Tarihi *</Label>
                      <Input
                        id="invoice_date"
                        type="date"
                        value={invoiceForm.invoice_date}
                        onChange={(e) => setInvoiceForm({ ...invoiceForm, invoice_date: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="due_date">Vade Tarihi *</Label>
                      <Input
                        id="due_date"
                        type="date"
                        value={invoiceForm.due_date}
                        onChange={(e) => setInvoiceForm({ ...invoiceForm, due_date: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="total_amount">Tutar *</Label>
                      <Input
                        id="total_amount"
                        type="number"
                        step="0.01"
                        value={invoiceForm.total_amount}
                        onChange={(e) => setInvoiceForm({ ...invoiceForm, total_amount: e.target.value })}
                        placeholder="0.00"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currency">Para Birimi</Label>
                      <Select
                        value={invoiceForm.currency}
                        onValueChange={(value) => setInvoiceForm({ ...invoiceForm, currency: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="TRY">TRY</SelectItem>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accounting_code">Muhasebe Kodu</Label>
                    <Input
                      id="accounting_code"
                      value={invoiceForm.accounting_code}
                      onChange={(e) => setInvoiceForm({ ...invoiceForm, accounting_code: e.target.value })}
                      placeholder="320"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Açıklama</Label>
                    <Textarea
                      id="description"
                      value={invoiceForm.description}
                      onChange={(e) => setInvoiceForm({ ...invoiceForm, description: e.target.value })}
                      placeholder="Fatura açıklaması"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={() => handleSubmit("invoice")}>
                    {editingItem ? "Güncelle" : "Kaydet"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fatura No</TableHead>
                    <TableHead>Tedarikçi</TableHead>
                    <TableHead>Fatura Tarihi</TableHead>
                    <TableHead>Vade Tarihi</TableHead>
                    <TableHead>Tutar</TableHead>
                    <TableHead>Ödenen</TableHead>
                    <TableHead>Kalan</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead>İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.invoice_no}</TableCell>
                      <TableCell>{invoice.vendor_name}</TableCell>
                      <TableCell>{formatDate(invoice.invoice_date)}</TableCell>
                      <TableCell
                        className={
                          new Date(invoice.due_date) < new Date() && !invoice.is_paid ? "text-red-600 font-medium" : ""
                        }
                      >
                        {formatDate(invoice.due_date)}
                      </TableCell>
                      <TableCell>{formatCurrency(invoice.total_amount)}</TableCell>
                      <TableCell className="text-green-600">{formatCurrency(invoice.paid_amount || 0)}</TableCell>
                      <TableCell className="text-red-600">{formatCurrency(invoice.remaining_amount || 0)}</TableCell>
                      <TableCell>
                        {invoice.is_paid ? (
                          <Badge variant="default">Ödendi</Badge>
                        ) : new Date(invoice.due_date) < new Date() ? (
                          <Badge variant="destructive">Gecikmiş</Badge>
                        ) : (
                          <Badge variant="outline">Bekliyor</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => openEditDialog("invoice", invoice)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDelete("invoice", invoice.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Ödemeler</h2>
            <Dialog open={dialogOpen && activeTab === "payments"} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setEditingItem(null)
                    resetForms()
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Yeni Ödeme
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>{editingItem ? "Ödeme Düzenle" : "Yeni Ödeme"}</DialogTitle>
                  <DialogDescription>Ödeme bilgilerini girin</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="vendor_id">Tedarikçi *</Label>
                      <Select
                        value={paymentForm.vendor_id}
                        onValueChange={(value) => setPaymentForm({ ...paymentForm, vendor_id: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Tedarikçi seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          {vendors.map((vendor) => (
                            <SelectItem key={vendor.id} value={vendor.id.toString()}>
                              {vendor.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="payment_date">Ödeme Tarihi *</Label>
                      <Input
                        id="payment_date"
                        type="date"
                        value={paymentForm.payment_date}
                        onChange={(e) => setPaymentForm({ ...paymentForm, payment_date: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="amount">Tutar *</Label>
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        value={paymentForm.amount}
                        onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                        placeholder="0.00"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="payment_method">Ödeme Yöntemi *</Label>
                      <Select
                        value={paymentForm.payment_method}
                        onValueChange={(value) => setPaymentForm({ ...paymentForm, payment_method: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Nakit">Nakit</SelectItem>
                          <SelectItem value="Banka">Banka</SelectItem>
                          <SelectItem value="Çek">Çek</SelectItem>
                          <SelectItem value="Senet">Senet</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {paymentForm.payment_method === "Banka" && (
                    <div className="space-y-2">
                      <Label htmlFor="bank_account_id">Banka Hesabı</Label>
                      <Select
                        value={paymentForm.bank_account_id}
                        onValueChange={(value) => setPaymentForm({ ...paymentForm, bank_account_id: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Banka hesabı seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          {bankAccounts.map((account) => (
                            <SelectItem key={account.id} value={account.id.toString()}>
                              {account.bank_name} - {account.account_number}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="invoice_id">Fatura (Opsiyonel)</Label>
                      <Select
                        value={paymentForm.invoice_id}
                        onValueChange={(value) => setPaymentForm({ ...paymentForm, invoice_id: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Fatura seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          {invoices
                            .filter(
                              (inv) => !paymentForm.vendor_id || inv.vendor_id.toString() === paymentForm.vendor_id,
                            )
                            .map((invoice) => (
                              <SelectItem key={invoice.id} value={invoice.id.toString()}>
                                {invoice.invoice_no} - {formatCurrency(invoice.remaining_amount || 0)}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reference_no">Referans No</Label>
                      <Input
                        id="reference_no"
                        value={paymentForm.reference_no}
                        onChange={(e) => setPaymentForm({ ...paymentForm, reference_no: e.target.value })}
                        placeholder="HVL-2024-001"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accounting_code">Muhasebe Kodu</Label>
                    <Input
                      id="accounting_code"
                      value={paymentForm.accounting_code}
                      onChange={(e) => setPaymentForm({ ...paymentForm, accounting_code: e.target.value })}
                      placeholder="320"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Açıklama</Label>
                    <Textarea
                      id="description"
                      value={paymentForm.description}
                      onChange={(e) => setPaymentForm({ ...paymentForm, description: e.target.value })}
                      placeholder="Ödeme açıklaması"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={() => handleSubmit("payment")}>
                    {editingItem ? "Güncelle" : "Kaydet"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ödeme Tarihi</TableHead>
                    <TableHead>Tedarikçi</TableHead>
                    <TableHead>Tutar</TableHead>
                    <TableHead>Yöntem</TableHead>
                    <TableHead>Fatura</TableHead>
                    <TableHead>Referans</TableHead>
                    <TableHead>İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{formatDate(payment.payment_date)}</TableCell>
                      <TableCell>{payment.vendor_name}</TableCell>
                      <TableCell className="text-green-600 font-medium">{formatCurrency(payment.amount)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{payment.payment_method}</Badge>
                      </TableCell>
                      <TableCell>{payment.invoice_no || "-"}</TableCell>
                      <TableCell>{payment.reference_no || "-"}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => openEditDialog("payment", payment)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDelete("payment", payment.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Plans Tab */}
        <TabsContent value="plans" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Ödeme Planları</h2>
            <Dialog open={dialogOpen && activeTab === "plans"} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setEditingItem(null)
                    resetForms()
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Yeni Plan
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>{editingItem ? "Plan Düzenle" : "Yeni Ödeme Planı"}</DialogTitle>
                  <DialogDescription>Ödeme planı bilgilerini girin</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="invoice_id">Fatura *</Label>
                    <Select
                      value={planForm.invoice_id}
                      onValueChange={(value) => setPlanForm({ ...planForm, invoice_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Fatura seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        {invoices.map((invoice) => (
                          <SelectItem key={invoice.id} value={invoice.id.toString()}>
                            {invoice.invoice_no} - {invoice.vendor_name} - {formatCurrency(invoice.total_amount)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="due_date">Vade Tarihi *</Label>
                      <Input
                        id="due_date"
                        type="date"
                        value={planForm.due_date}
                        onChange={(e) => setPlanForm({ ...planForm, due_date: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="planned_amount">Tutar *</Label>
                      <Input
                        id="planned_amount"
                        type="number"
                        step="0.01"
                        value={planForm.planned_amount}
                        onChange={(e) => setPlanForm({ ...planForm, planned_amount: e.target.value })}
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Durum</Label>
                    <Select
                      value={planForm.status}
                      onValueChange={(value) => setPlanForm({ ...planForm, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Bekliyor">Bekliyor</SelectItem>
                        <SelectItem value="Ödendi">Ödendi</SelectItem>
                        <SelectItem value="Gecikmiş">Gecikmiş</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={() => handleSubmit("plan")}>
                    {editingItem ? "Güncelle" : "Kaydet"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fatura No</TableHead>
                    <TableHead>Tedarikçi</TableHead>
                    <TableHead>Vade Tarihi</TableHead>
                    <TableHead>Planlanan Tutar</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead>Gecikme</TableHead>
                    <TableHead>İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentPlans.map((plan) => (
                    <TableRow key={plan.id}>
                      <TableCell className="font-medium">{plan.invoice_no}</TableCell>
                      <TableCell>{plan.vendor_name}</TableCell>
                      <TableCell className={plan.status === "Gecikmiş" ? "text-red-600 font-medium" : ""}>
                        {formatDate(plan.due_date)}
                      </TableCell>
                      <TableCell>{formatCurrency(plan.planned_amount)}</TableCell>
                      <TableCell>{getStatusBadge(plan.status)}</TableCell>
                      <TableCell>
                        {plan.days_overdue > 0 && plan.status !== "Ödendi" ? (
                          <Badge variant="destructive">{plan.days_overdue} gün</Badge>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => openEditDialog("plan", plan)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDelete("plan", plan.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-4">
          <h2 className="text-xl font-semibold">Raporlar ve Analizler</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Vendor Balance Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Tedarikçi Borç Durumu</CardTitle>
                <CardDescription>En yüksek borçlu tedarikçiler</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {vendors
                    .filter((vendor) => vendor.remaining_balance > 0)
                    .sort((a, b) => (b.remaining_balance || 0) - (a.remaining_balance || 0))
                    .slice(0, 5)
                    .map((vendor) => (
                      <div key={vendor.id} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{vendor.name}</p>
                          <p className="text-sm text-muted-foreground">{vendor.tax_no}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-red-600">{formatCurrency(vendor.remaining_balance || 0)}</p>
                          <p className="text-sm text-muted-foreground">
                            Ödenen: {formatCurrency(vendor.total_paid || 0)}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Overdue Invoices */}
            <Card>
              <CardHeader>
                <CardTitle>Vadesi Geçen Faturalar</CardTitle>
                <CardDescription>Acil ödeme gerektiren faturalar</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {invoices
                    .filter((invoice) => new Date(invoice.due_date) < new Date() && !invoice.is_paid)
                    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
                    .slice(0, 5)
                    .map((invoice) => (
                      <div key={invoice.id} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{invoice.invoice_no}</p>
                          <p className="text-sm text-muted-foreground">{invoice.vendor_name}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-red-600">{formatCurrency(invoice.remaining_amount || 0)}</p>
                          <p className="text-sm text-red-600">Vade: {formatDate(invoice.due_date)}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Payment Method Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Ödeme Yöntemleri</CardTitle>
                <CardDescription>Son 30 günlük ödeme dağılımı</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["Banka", "Nakit", "Çek", "Senet"].map((method) => {
                    const methodPayments = payments.filter(
                      (p) =>
                        p.payment_method === method &&
                        new Date(p.payment_date) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                    )
                    const total = methodPayments.reduce((sum, p) => sum + p.amount, 0)
                    const count = methodPayments.length

                    return (
                      <div key={method} className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{method}</Badge>
                          <span className="text-sm text-muted-foreground">({count} işlem)</span>
                        </div>
                        <p className="font-medium">{formatCurrency(total)}</p>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Payments */}
            <Card>
              <CardHeader>
                <CardTitle>Yaklaşan Ödemeler</CardTitle>
                <CardDescription>Önümüzdeki 30 gün</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {paymentPlans
                    .filter((plan) => {
                      const dueDate = new Date(plan.due_date)
                      const today = new Date()
                      const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                      return dueDate >= today && dueDate <= thirtyDaysFromNow && plan.status === "Bekliyor"
                    })
                    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
                    .slice(0, 5)
                    .map((plan) => (
                      <div key={plan.id} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{plan.invoice_no}</p>
                          <p className="text-sm text-muted-foreground">{plan.vendor_name}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatCurrency(plan.planned_amount)}</p>
                          <p className="text-sm text-muted-foreground">{formatDate(plan.due_date)}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
