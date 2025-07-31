"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Plus, CreditCard, TrendingUp, TrendingDown, FileText } from "lucide-react"
import Link from "next/link"
import { DataTable } from "@/components/data-table"
import { useState, useEffect } from "react"

export default function BankingPage() {
  const [bankAccountData, setBankAccountData] = useState([])
  const [transactionData, setTransactionData] = useState([])
  const [loanData, setLoanData] = useState([])
  const [checkData, setCheckData] = useState([])
  const [receiptData, setReceiptData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    try {
      setLoading(true)
      const [accounts, transactions, loans, checks, receipts] = await Promise.all([
        fetch("/api/banking/accounts").then((res) => res.json()),
        fetch("/api/banking/transactions").then((res) => res.json()),
        fetch("/api/banking/loans").then((res) => res.json()),
        fetch("/api/banking/checks").then((res) => res.json()),
        fetch("/api/banking/receipts").then((res) => res.json()),
      ])

      setBankAccountData(accounts)
      setTransactionData(transactions)
      setLoanData(loans)
      setCheckData(checks)
      setReceiptData(receipts)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const bankColumns = [
    {
      key: "bank_name",
      title: "Banka",
      filterable: true,
      width: "150px",
      editable: true,
      type: "text",
      required: true,
    },
    {
      key: "branch_name",
      title: "Şube",
      width: "120px",
      editable: true,
      type: "text",
      required: true,
    },
    {
      key: "account_number",
      title: "Hesap No",
      width: "120px",
      editable: true,
      type: "text",
      required: true,
    },
    {
      key: "iban",
      title: "IBAN",
      width: "200px",
      editable: true,
      type: "text",
      required: true,
    },
    {
      key: "currency",
      title: "Para Birimi",
      filterable: true,
      filterType: "select" as const,
      width: "100px",
      editable: true,
      type: "select",
      required: true,
      selectOptions: [
        { value: "TRY", label: "TRY" },
        { value: "USD", label: "USD" },
        { value: "EUR", label: "EUR" },
      ],
      filterOptions: [
        { value: "TRY", label: "TRY" },
        { value: "USD", label: "USD" },
        { value: "EUR", label: "EUR" },
      ],
    },
    {
      key: "opening_date",
      title: "Açılış Tarihi",
      sortable: true,
      width: "120px",
      editable: true,
      type: "date",
      required: true,
      render: (value: string) => {
        if (!value) return "-"
        return new Date(value).toLocaleDateString("tr-TR")
      },
    },
    {
      key: "company_name",
      title: "Şirket",
      width: "150px",
      render: (value: string) => value || "Ana Şirket",
    },
  ]

  const transactionColumns = [
    {
      key: "transaction_date",
      title: "İşlem Tarihi",
      sortable: true,
      width: "120px",
      editable: true,
      type: "date",
      required: true,
      render: (value: string) => {
        if (!value) return "-"
        return new Date(value).toLocaleDateString("tr-TR")
      },
    },
    {
      key: "bank_name",
      title: "Banka",
      filterable: true,
      width: "120px",
    },
    {
      key: "type",
      title: "İşlem Tipi",
      filterable: true,
      filterType: "select" as const,
      width: "120px",
      editable: true,
      type: "select",
      required: true,
      selectOptions: [
        { value: "Havale", label: "Havale" },
        { value: "EFT", label: "EFT" },
        { value: "Çek", label: "Çek" },
        { value: "Senet", label: "Senet" },
        { value: "POS", label: "POS" },
        { value: "Kredi Giriş", label: "Kredi Giriş" },
        { value: "Kredi Taksit", label: "Kredi Taksit" },
        { value: "Faiz", label: "Faiz" },
        { value: "Masraf", label: "Masraf" },
        { value: "Diğer", label: "Diğer" },
      ],
      filterOptions: [
        { value: "Havale", label: "Havale" },
        { value: "EFT", label: "EFT" },
        { value: "Çek", label: "Çek" },
        { value: "Senet", label: "Senet" },
        { value: "POS", label: "POS" },
        { value: "Kredi Giriş", label: "Kredi Giriş" },
        { value: "Kredi Taksit", label: "Kredi Taksit" },
        { value: "Faiz", label: "Faiz" },
        { value: "Masraf", label: "Masraf" },
        { value: "Diğer", label: "Diğer" },
      ],
    },
    {
      key: "description",
      title: "Açıklama",
      filterable: true,
      width: "200px",
      editable: true,
      type: "textarea",
      required: true,
    },
    {
      key: "debit",
      title: "Çıkış",
      sortable: true,
      align: "right" as const,
      width: "120px",
      editable: true,
      type: "number",
      render: (value: number) => {
        if (!value || value === 0) return "-"
        return <span className="text-red-600 font-medium">-₺{value.toLocaleString()}</span>
      },
    },
    {
      key: "credit",
      title: "Giriş",
      sortable: true,
      align: "right" as const,
      width: "120px",
      editable: true,
      type: "number",
      render: (value: number) => {
        if (!value || value === 0) return "-"
        return <span className="text-green-600 font-medium">+₺{value.toLocaleString()}</span>
      },
    },
    {
      key: "balance_after",
      title: "Bakiye",
      sortable: true,
      align: "right" as const,
      width: "120px",
      editable: true,
      type: "number",
      render: (value: number) => `₺${(value || 0).toLocaleString()}`,
    },
    {
      key: "reference_no",
      title: "Referans",
      width: "120px",
      editable: true,
      type: "text",
    },
    {
      key: "accounting_code",
      title: "Muhasebe Kodu",
      width: "120px",
      editable: true,
      type: "text",
    },
  ]

  const loanColumns = [
    {
      key: "bank_name",
      title: "Banka",
      filterable: true,
      width: "150px",
    },
    {
      key: "loan_type",
      title: "Kredi Tipi",
      filterable: true,
      filterType: "select" as const,
      width: "120px",
      editable: true,
      type: "select",
      required: true,
      selectOptions: [
        { value: "Ticari", label: "Ticari" },
        { value: "Spot", label: "Spot" },
        { value: "İhtiyaç", label: "İhtiyaç" },
        { value: "Yatırım", label: "Yatırım" },
        { value: "Kredi Kartı", label: "Kredi Kartı" },
      ],
      filterOptions: [
        { value: "Ticari", label: "Ticari" },
        { value: "Spot", label: "Spot" },
        { value: "İhtiyaç", label: "İhtiyaç" },
        { value: "Yatırım", label: "Yatırım" },
        { value: "Kredi Kartı", label: "Kredi Kartı" },
      ],
    },
    {
      key: "loan_amount",
      title: "Kredi Tutarı",
      sortable: true,
      align: "right" as const,
      width: "120px",
      editable: true,
      type: "number",
      required: true,
      render: (value: number) => `₺${(value || 0).toLocaleString()}`,
    },
    {
      key: "remaining_balance",
      title: "Kalan Bakiye",
      sortable: true,
      align: "right" as const,
      width: "120px",
      editable: true,
      type: "number",
      required: true,
      render: (value: number) => `₺${(value || 0).toLocaleString()}`,
    },
    {
      key: "interest_rate",
      title: "Faiz Oranı",
      sortable: true,
      align: "center" as const,
      width: "100px",
      editable: true,
      type: "number",
      required: true,
      render: (value: number) => `%${value || 0}`,
    },
    {
      key: "start_date",
      title: "Başlangıç",
      sortable: true,
      width: "120px",
      editable: true,
      type: "date",
      required: true,
      render: (value: string) => {
        if (!value) return "-"
        return new Date(value).toLocaleDateString("tr-TR")
      },
    },
    {
      key: "maturity_date",
      title: "Vade Tarihi",
      sortable: true,
      width: "120px",
      editable: true,
      type: "date",
      required: true,
      render: (value: string) => {
        if (!value) return "-"
        return new Date(value).toLocaleDateString("tr-TR")
      },
    },
  ]

  const checkColumns = [
    {
      key: "check_number",
      title: "Çek No",
      filterable: true,
      width: "120px",
      editable: true,
      type: "text",
      required: true,
    },
    {
      key: "drawer",
      title: "Keşideci",
      filterable: true,
      width: "150px",
      editable: true,
      type: "text",
      required: true,
    },
    {
      key: "amount",
      title: "Tutar",
      sortable: true,
      align: "right" as const,
      width: "120px",
      editable: true,
      type: "number",
      required: true,
      render: (value: number) => `₺${(value || 0).toLocaleString()}`,
    },
    {
      key: "check_date",
      title: "Çek Tarihi",
      sortable: true,
      width: "120px",
      editable: true,
      type: "date",
      required: true,
      render: (value: string) => {
        if (!value) return "-"
        return new Date(value).toLocaleDateString("tr-TR")
      },
    },
    {
      key: "due_date",
      title: "Vade Tarihi",
      sortable: true,
      width: "120px",
      editable: true,
      type: "date",
      required: true,
      render: (value: string) => {
        if (!value) return "-"
        return new Date(value).toLocaleDateString("tr-TR")
      },
    },
    {
      key: "status",
      title: "Durum",
      filterable: true,
      filterType: "select" as const,
      width: "120px",
      editable: true,
      type: "select",
      required: true,
      selectOptions: [
        { value: "Giriş", label: "Giriş" },
        { value: "Çıkış", label: "Çıkış" },
        { value: "Tahsil Edildi", label: "Tahsil Edildi" },
        { value: "Karşılıksız", label: "Karşılıksız" },
        { value: "İade", label: "İade" },
      ],
      filterOptions: [
        { value: "Giriş", label: "Giriş" },
        { value: "Çıkış", label: "Çıkış" },
        { value: "Tahsil Edildi", label: "Tahsil Edildi" },
        { value: "Karşılıksız", label: "Karşılıksız" },
        { value: "İade", label: "İade" },
      ],
      render: (value: string) => {
        const status = value || "Giriş"
        const colorMap: Record<string, string> = {
          Giriş: "bg-blue-100 text-blue-800",
          Çıkış: "bg-orange-100 text-orange-800",
          "Tahsil Edildi": "bg-green-100 text-green-800",
          Karşılıksız: "bg-red-100 text-red-800",
          İade: "bg-gray-100 text-gray-800",
        }
        return (
          <span className={`px-2 py-1 rounded-full text-xs ${colorMap[status] || "bg-gray-100 text-gray-800"}`}>
            {status}
          </span>
        )
      },
    },
    {
      key: "bank_name",
      title: "Banka",
      width: "120px",
    },
    {
      key: "description",
      title: "Açıklama",
      width: "150px",
      editable: true,
      type: "textarea",
    },
  ]

  const receiptColumns = [
    {
      key: "receipt_date",
      title: "Tarih",
      sortable: true,
      width: "120px",
      editable: true,
      type: "date",
      required: true,
      render: (value: string) => {
        if (!value) return "-"
        return new Date(value).toLocaleDateString("tr-TR")
      },
    },
    {
      key: "receipt_type",
      title: "Tahsilat Tipi",
      filterable: true,
      filterType: "select" as const,
      width: "120px",
      editable: true,
      type: "select",
      required: true,
      selectOptions: [
        { value: "Nakit", label: "Nakit" },
        { value: "Banka", label: "Banka" },
        { value: "Çek", label: "Çek" },
        { value: "Senet", label: "Senet" },
        { value: "Diğer", label: "Diğer" },
      ],
      filterOptions: [
        { value: "Nakit", label: "Nakit" },
        { value: "Banka", label: "Banka" },
        { value: "Çek", label: "Çek" },
        { value: "Senet", label: "Senet" },
        { value: "Diğer", label: "Diğer" },
      ],
    },
    {
      key: "payment_method",
      title: "Ödeme Yöntemi",
      filterable: true,
      filterType: "select" as const,
      width: "120px",
      editable: true,
      type: "select",
      required: true,
      selectOptions: [
        { value: "EFT", label: "EFT" },
        { value: "Havale", label: "Havale" },
        { value: "Nakit", label: "Nakit" },
        { value: "Çek", label: "Çek" },
        { value: "POS", label: "POS" },
      ],
      filterOptions: [
        { value: "EFT", label: "EFT" },
        { value: "Havale", label: "Havale" },
        { value: "Nakit", label: "Nakit" },
        { value: "Çek", label: "Çek" },
        { value: "POS", label: "POS" },
      ],
    },
    {
      key: "payer_name",
      title: "Ödeyen",
      filterable: true,
      width: "150px",
      editable: true,
      type: "text",
      required: true,
    },
    {
      key: "amount",
      title: "Tutar",
      sortable: true,
      align: "right" as const,
      width: "120px",
      editable: true,
      type: "number",
      required: true,
      render: (value: number) => <span className="text-green-600 font-medium">₺{(value || 0).toLocaleString()}</span>,
    },
    {
      key: "bank_name",
      title: "Banka",
      width: "120px",
    },
    {
      key: "description",
      title: "Açıklama",
      width: "150px",
      editable: true,
      type: "textarea",
    },
    {
      key: "accounting_code",
      title: "Muhasebe Kodu",
      width: "120px",
      editable: true,
      type: "text",
    },
  ]

  // CRUD handlers
  const handleAddBankAccount = async (newAccount: any) => {
    try {
      const response = await fetch("/api/banking/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAccount),
      })
      if (response.ok) {
        fetchAllData()
      }
    } catch (error) {
      console.error("Error adding bank account:", error)
    }
  }

  const handleUpdateBankAccount = async (id: number, updatedAccount: any) => {
    try {
      const response = await fetch(`/api/banking/accounts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedAccount),
      })
      if (response.ok) {
        fetchAllData()
      }
    } catch (error) {
      console.error("Error updating bank account:", error)
    }
  }

  const handleDeleteBankAccount = async (id: number) => {
    try {
      const response = await fetch(`/api/banking/accounts/${id}`, {
        method: "DELETE",
      })
      if (response.ok) {
        fetchAllData()
      }
    } catch (error) {
      console.error("Error deleting bank account:", error)
    }
  }

  const handleAddTransaction = async (newTransaction: any) => {
    try {
      const response = await fetch("/api/banking/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTransaction),
      })
      if (response.ok) {
        fetchAllData()
      }
    } catch (error) {
      console.error("Error adding transaction:", error)
    }
  }

  const handleUpdateTransaction = async (id: number, updatedTransaction: any) => {
    try {
      const response = await fetch(`/api/banking/transactions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTransaction),
      })
      if (response.ok) {
        fetchAllData()
      }
    } catch (error) {
      console.error("Error updating transaction:", error)
    }
  }

  const handleDeleteTransaction = async (id: number) => {
    try {
      const response = await fetch(`/api/banking/transactions/${id}`, {
        method: "DELETE",
      })
      if (response.ok) {
        fetchAllData()
      }
    } catch (error) {
      console.error("Error deleting transaction:", error)
    }
  }

  const handleAddLoan = async (newLoan: any) => {
    try {
      const response = await fetch("/api/banking/loans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newLoan),
      })
      if (response.ok) {
        fetchAllData()
      }
    } catch (error) {
      console.error("Error adding loan:", error)
    }
  }

  const handleUpdateLoan = async (id: number, updatedLoan: any) => {
    try {
      const response = await fetch(`/api/banking/loans/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedLoan),
      })
      if (response.ok) {
        fetchAllData()
      }
    } catch (error) {
      console.error("Error updating loan:", error)
    }
  }

  const handleDeleteLoan = async (id: number) => {
    try {
      const response = await fetch(`/api/banking/loans/${id}`, {
        method: "DELETE",
      })
      if (response.ok) {
        fetchAllData()
      }
    } catch (error) {
      console.error("Error deleting loan:", error)
    }
  }

  const handleAddCheck = async (newCheck: any) => {
    try {
      const response = await fetch("/api/banking/checks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCheck),
      })
      if (response.ok) {
        fetchAllData()
      }
    } catch (error) {
      console.error("Error adding check:", error)
    }
  }

  const handleUpdateCheck = async (id: number, updatedCheck: any) => {
    try {
      const response = await fetch(`/api/banking/checks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedCheck),
      })
      if (response.ok) {
        fetchAllData()
      }
    } catch (error) {
      console.error("Error updating check:", error)
    }
  }

  const handleDeleteCheck = async (id: number) => {
    try {
      const response = await fetch(`/api/banking/checks/${id}`, {
        method: "DELETE",
      })
      if (response.ok) {
        fetchAllData()
      }
    } catch (error) {
      console.error("Error deleting check:", error)
    }
  }

  const handleAddReceipt = async (newReceipt: any) => {
    try {
      const response = await fetch("/api/banking/receipts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReceipt),
      })
      if (response.ok) {
        fetchAllData()
      }
    } catch (error) {
      console.error("Error adding receipt:", error)
    }
  }

  const handleUpdateReceipt = async (id: number, updatedReceipt: any) => {
    try {
      const response = await fetch(`/api/banking/receipts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedReceipt),
      })
      if (response.ok) {
        fetchAllData()
      }
    } catch (error) {
      console.error("Error updating receipt:", error)
    }
  }

  const handleDeleteReceipt = async (id: number) => {
    try {
      const response = await fetch(`/api/banking/receipts/${id}`, {
        method: "DELETE",
      })
      if (response.ok) {
        fetchAllData()
      }
    } catch (error) {
      console.error("Error deleting receipt:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Veriler yükleniyor...</p>
        </div>
      </div>
    )
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
                <h1 className="text-2xl font-bold text-gray-900">Banka & Finans Yönetimi</h1>
                <p className="text-sm text-gray-500">Banka hesapları, işlemler, krediler ve çek yönetimi</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline">Rapor Al</Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Yeni İşlem
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
                  <p className="text-sm font-medium text-gray-600">Toplam Hesap</p>
                  <p className="text-2xl font-bold text-gray-900">{bankAccountData.length}</p>
                  <p className="text-xs text-blue-600">Aktif banka hesabı</p>
                </div>
                <CreditCard className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Toplam İşlem</p>
                  <p className="text-2xl font-bold text-gray-900">{transactionData.length}</p>
                  <p className="text-xs text-green-600">Bu ay gerçekleşen</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Aktif Krediler</p>
                  <p className="text-2xl font-bold text-gray-900">{loanData.length}</p>
                  <p className="text-xs text-orange-600">Takip edilen</p>
                </div>
                <TrendingDown className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Çek Sayısı</p>
                  <p className="text-2xl font-bold text-gray-900">{checkData.length}</p>
                  <p className="text-xs text-purple-600">Takip edilen</p>
                </div>
                <FileText className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="accounts" className="space-y-6">
          <TabsList>
            <TabsTrigger value="accounts">Banka Hesapları</TabsTrigger>
            <TabsTrigger value="transactions">İşlem Geçmişi</TabsTrigger>
            <TabsTrigger value="loans">Krediler</TabsTrigger>
            <TabsTrigger value="checks">Çek Takibi</TabsTrigger>
            <TabsTrigger value="receipts">Tahsilat Makbuzları</TabsTrigger>
          </TabsList>

          <TabsContent value="accounts">
            <Card>
              <CardHeader>
                <CardTitle>Banka Hesapları</CardTitle>
                <CardDescription>Şirket banka hesaplarının yönetimi</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  data={bankAccountData}
                  columns={bankColumns}
                  title="Banka Hesapları"
                  height={500}
                  editable={true}
                  onAdd={handleAddBankAccount}
                  onUpdate={handleUpdateBankAccount}
                  onDelete={handleDeleteBankAccount}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle>Banka İşlem Geçmişi</CardTitle>
                <CardDescription>Tüm banka hareketlerinin detaylı takibi</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  data={transactionData}
                  columns={transactionColumns}
                  title="Banka İşlemleri"
                  height={500}
                  editable={true}
                  onAdd={handleAddTransaction}
                  onUpdate={handleUpdateTransaction}
                  onDelete={handleDeleteTransaction}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="loans">
            <Card>
              <CardHeader>
                <CardTitle>Kredi Yönetimi</CardTitle>
                <CardDescription>Banka kredilerinin takibi ve yönetimi</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  data={loanData}
                  columns={loanColumns}
                  title="Banka Kredileri"
                  height={500}
                  editable={true}
                  onAdd={handleAddLoan}
                  onUpdate={handleUpdateLoan}
                  onDelete={handleDeleteLoan}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="checks">
            <Card>
              <CardHeader>
                <CardTitle>Çek Takibi</CardTitle>
                <CardDescription>Gelen ve giden çeklerin durumu</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  data={checkData}
                  columns={checkColumns}
                  title="Çek İşlemleri"
                  height={500}
                  editable={true}
                  onAdd={handleAddCheck}
                  onUpdate={handleUpdateCheck}
                  onDelete={handleDeleteCheck}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="receipts">
            <Card>
              <CardHeader>
                <CardTitle>Tahsilat Makbuzları</CardTitle>
                <CardDescription>Nakit, banka ve diğer tahsilatlar</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  data={receiptData}
                  columns={receiptColumns}
                  title="Tahsilat Makbuzları"
                  height={500}
                  editable={true}
                  onAdd={handleAddReceipt}
                  onUpdate={handleUpdateReceipt}
                  onDelete={handleDeleteReceipt}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
