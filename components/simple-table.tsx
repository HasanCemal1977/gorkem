"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, Download, Search } from "lucide-react"

interface Column {
  key: string
  title: string
  render?: (value: any, row: any) => React.ReactNode
  sortable?: boolean
  filterable?: boolean
  filterType?: "text" | "select"
  filterOptions?: { value: string; label: string }[]
}

interface SimpleTableProps {
  data: any[]
  columns: Column[]
  title?: string
  pageSize?: number
  onRowClick?: (row: any) => void
}

export function SimpleTable({ data, columns, title, pageSize = 15, onRowClick }: SimpleTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [filters, setFilters] = useState<Record<string, string>>({})

  // Filter data
  const filteredData = useMemo(() => {
    return data.filter((row) => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true
        const cellValue = row[key]?.toString().toLowerCase() || ""
        return cellValue.includes(value.toLowerCase())
      })
    })
  }, [data, filters])

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortColumn) return filteredData

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortColumn]
      const bValue = b[sortColumn]

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
      return 0
    })
  }, [filteredData, sortColumn, sortDirection])

  // Paginate data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return sortedData.slice(startIndex, startIndex + pageSize)
  }, [sortedData, currentPage, pageSize])

  const totalPages = Math.ceil(sortedData.length / pageSize)

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(columnKey)
      setSortDirection("asc")
    }
  }

  const handleFilter = (columnKey: string, value: string) => {
    setFilters((prev) => ({ ...prev, [columnKey]: value }))
    setCurrentPage(1)
  }

  const exportToCSV = () => {
    const csvContent = [
      columns.map((col) => col.title).join(","),
      ...sortedData.map((row) => columns.map((col) => row[col.key] || "").join(",")),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${title || "tablo"}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        {title && <h3 className="text-lg font-medium">{title}</h3>}
        <Button variant="outline" size="sm" onClick={exportToCSV}>
          <Download className="h-4 w-4 mr-2" />
          CSV İndir
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {columns
          .filter((col) => col.filterable)
          .map((column) => (
            <div key={column.key}>
              <label className="text-sm font-medium text-gray-700 mb-1 block">{column.title}</label>
              {column.filterType === "select" && column.filterOptions ? (
                <Select onValueChange={(value) => handleFilter(column.key, value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seçin..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tümü</SelectItem>
                    {column.filterOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Filtrele..."
                    className="pl-10"
                    onChange={(e) => handleFilter(column.key, e.target.value)}
                  />
                </div>
              )}
            </div>
          ))}
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={`px-4 py-3 text-left text-sm font-medium text-gray-700 ${
                      column.sortable ? "cursor-pointer hover:bg-gray-100" : ""
                    }`}
                    onClick={() => column.sortable && handleSort(column.key)}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{column.title}</span>
                      {column.sortable && sortColumn === column.key && (
                        <span className="text-blue-600">{sortDirection === "asc" ? "↑" : "↓"}</span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedData.map((row, index) => (
                <tr
                  key={index}
                  className={`hover:bg-gray-50 ${onRowClick ? "cursor-pointer" : ""}`}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((column) => (
                    <td key={column.key} className="px-4 py-3 text-sm text-gray-900">
                      {column.render ? column.render(row[column.key], row) : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t">
          <div className="text-sm text-gray-700">
            Toplam {sortedData.length} kayıttan {(currentPage - 1) * pageSize + 1}-
            {Math.min(currentPage * pageSize, sortedData.length)} arası gösteriliyor
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Önceki
            </Button>
            <span className="text-sm text-gray-700">
              Sayfa {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              Sonraki
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
