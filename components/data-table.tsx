"use client"

import type React from "react"
import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Plus,
  Trash2,
  Save,
  X,
} from "lucide-react"

interface Column {
  key: string
  title: string
  render?: (value: any, row: any) => React.ReactNode
  sortable?: boolean
  filterable?: boolean
  filterType?: "text" | "select"
  filterOptions?: { value: string; label: string }[]
  width?: string
  align?: "left" | "center" | "right"
  editable?: boolean
  type?: "text" | "number" | "date" | "select" | "textarea"
  selectOptions?: { value: string; label: string }[]
  required?: boolean
}

interface DataTableProps {
  data: any[]
  columns: Column[]
  title?: string
  pageSize?: number
  onRowClick?: (row: any) => void
  showExport?: boolean
  height?: number
  editable?: boolean
  onAdd?: (newRow: any) => void
  onUpdate?: (id: any, updatedRow: any) => void
  onDelete?: (id: any) => void
  idField?: string
  autoAddRow?: boolean
}

export function DataTable({
  data,
  columns,
  title,
  pageSize = 15,
  onRowClick,
  showExport = true,
  height,
  editable = false,
  onAdd,
  onUpdate,
  onDelete,
  idField = "id",
  autoAddRow = true,
}: DataTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [filters, setFilters] = useState<Record<string, string>>({})
  const [editingCell, setEditingCell] = useState<{ rowId: any; columnKey: string } | null>(null)
  const [editValue, setEditValue] = useState<any>("")

  // Filter data
  const filteredData = useMemo(() => {
    return data.filter((row) => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value || value === "all") return true
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

      // Handle numbers
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue
      }

      // Handle strings and dates
      const aStr = String(aValue || "").toLowerCase()
      const bStr = String(bValue || "").toLowerCase()

      if (aStr < bStr) return sortDirection === "asc" ? -1 : 1
      if (aStr > bStr) return sortDirection === "asc" ? 1 : -1
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
      ...sortedData.map((row) =>
        columns
          .map((col) => {
            const value = row[col.key]
            return typeof value === "string" && value.includes(",") ? `"${value}"` : value || ""
          })
          .join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${title || "tablo"}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const getSortIcon = (columnKey: string) => {
    if (sortColumn !== columnKey) {
      return <ArrowUpDown className="h-4 w-4 text-gray-400" />
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="h-4 w-4 text-blue-600" />
    ) : (
      <ArrowDown className="h-4 w-4 text-blue-600" />
    )
  }

  const handleAddRow = () => {
    if (onAdd) {
      // Create a new empty row with default values
      const newRow: any = {}
      columns.forEach((col) => {
        if (col.editable) {
          switch (col.type) {
            case "number":
              newRow[col.key] = 0
              break
            case "date":
              newRow[col.key] = new Date().toISOString().split("T")[0]
              break
            case "select":
              newRow[col.key] = col.selectOptions?.[0]?.value || ""
              break
            default:
              newRow[col.key] = ""
          }
        }
      })
      onAdd(newRow)
    }
  }

  const handleCellDoubleClick = (row: any, column: Column) => {
    if (editable && column.editable) {
      setEditingCell({ rowId: row[idField], columnKey: column.key })
      setEditValue(row[column.key] || "")
    }
  }

  const handleSaveCell = () => {
    if (editingCell && onUpdate) {
      const updatedRow = { ...data.find((row) => row[idField] === editingCell.rowId) }

      // Convert value based on column type
      let finalValue = editValue
      const column = columns.find((col) => col.key === editingCell.columnKey)
      if (column?.type === "number") {
        finalValue = Number(editValue) || 0
      }

      updatedRow[editingCell.columnKey] = finalValue
      onUpdate(editingCell.rowId, updatedRow)
    }
    setEditingCell(null)
    setEditValue("")
  }

  const handleCancelEdit = () => {
    setEditingCell(null)
    setEditValue("")
  }

  const handleDelete = (row: any) => {
    if (onDelete && window.confirm("Bu kaydı silmek istediğinizden emin misiniz?")) {
      onDelete(row[idField])
    }
  }

  const renderCell = (row: any, column: Column) => {
    const isEditing = editingCell?.rowId === row[idField] && editingCell?.columnKey === column.key
    const value = row[column.key]

    if (isEditing) {
      switch (column.type) {
        case "select":
          return (
            <div className="flex items-center space-x-1">
              <Select value={editValue || ""} onValueChange={setEditValue}>
                <SelectTrigger className="h-8 text-xs min-w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {column.selectOptions?.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button size="sm" variant="ghost" onClick={handleSaveCell} className="h-6 w-6 p-0">
                <Save className="h-3 w-3 text-green-600" />
              </Button>
              <Button size="sm" variant="ghost" onClick={handleCancelEdit} className="h-6 w-6 p-0">
                <X className="h-3 w-3 text-red-600" />
              </Button>
            </div>
          )
        case "textarea":
          return (
            <div className="flex items-center space-x-1">
              <Textarea
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="h-8 text-xs resize-none min-w-[150px]"
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSaveCell()
                  } else if (e.key === "Escape") {
                    handleCancelEdit()
                  }
                }}
                autoFocus
              />
              <Button size="sm" variant="ghost" onClick={handleSaveCell} className="h-6 w-6 p-0">
                <Save className="h-3 w-3 text-green-600" />
              </Button>
              <Button size="sm" variant="ghost" onClick={handleCancelEdit} className="h-6 w-6 p-0">
                <X className="h-3 w-3 text-red-600" />
              </Button>
            </div>
          )
        case "number":
          return (
            <div className="flex items-center space-x-1">
              <Input
                type="number"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="h-8 text-xs min-w-[100px]"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSaveCell()
                  } else if (e.key === "Escape") {
                    handleCancelEdit()
                  }
                }}
                autoFocus
              />
              <Button size="sm" variant="ghost" onClick={handleSaveCell} className="h-6 w-6 p-0">
                <Save className="h-3 w-3 text-green-600" />
              </Button>
              <Button size="sm" variant="ghost" onClick={handleCancelEdit} className="h-6 w-6 p-0">
                <X className="h-3 w-3 text-red-600" />
              </Button>
            </div>
          )
        case "date":
          return (
            <div className="flex items-center space-x-1">
              <Input
                type="date"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="h-8 text-xs min-w-[130px]"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSaveCell()
                  } else if (e.key === "Escape") {
                    handleCancelEdit()
                  }
                }}
                autoFocus
              />
              <Button size="sm" variant="ghost" onClick={handleSaveCell} className="h-6 w-6 p-0">
                <Save className="h-3 w-3 text-green-600" />
              </Button>
              <Button size="sm" variant="ghost" onClick={handleCancelEdit} className="h-6 w-6 p-0">
                <X className="h-3 w-3 text-red-600" />
              </Button>
            </div>
          )
        default:
          return (
            <div className="flex items-center space-x-1">
              <Input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="h-8 text-xs min-w-[120px]"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSaveCell()
                  } else if (e.key === "Escape") {
                    handleCancelEdit()
                  }
                }}
                autoFocus
              />
              <Button size="sm" variant="ghost" onClick={handleSaveCell} className="h-6 w-6 p-0">
                <Save className="h-3 w-3 text-green-600" />
              </Button>
              <Button size="sm" variant="ghost" onClick={handleCancelEdit} className="h-6 w-6 p-0">
                <X className="h-3 w-3 text-red-600" />
              </Button>
            </div>
          )
      }
    }

    // Normal cell display
    return (
      <div
        className={`${column.editable ? "cursor-pointer hover:bg-blue-50 p-1 rounded" : ""} ${
          column.editable ? "border-dashed border border-transparent hover:border-blue-300" : ""
        }`}
        onDoubleClick={() => handleCellDoubleClick(row, column)}
        title={column.editable ? "Düzenlemek için çift tıklayın" : ""}
      >
        {column.render ? column.render(value, row) : value}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        {title && <h3 className="text-lg font-medium">{title}</h3>}
        <div className="flex items-center space-x-2">
          {editable && onAdd && autoAddRow && (
            <Button size="sm" onClick={handleAddRow}>
              <Plus className="h-4 w-4 mr-2" />
              Satır Ekle
            </Button>
          )}
          {showExport && (
            <Button variant="outline" size="sm" onClick={exportToCSV}>
              <Download className="h-4 w-4 mr-2" />
              CSV İndir
            </Button>
          )}
        </div>
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
        <div className="overflow-x-auto" style={height ? { maxHeight: `${height}px`, overflowY: "auto" } : {}}>
          <table className="data-table w-full">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={`${
                      column.sortable ? "cursor-pointer hover:bg-gray-100" : ""
                    } ${column.align === "center" ? "text-center" : column.align === "right" ? "text-right" : "text-left"}`}
                    style={column.width ? { width: column.width } : {}}
                    onClick={() => column.sortable && handleSort(column.key)}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{column.title}</span>
                      {column.editable && <span className="text-xs text-blue-500">(çift tık)</span>}
                      {column.sortable && getSortIcon(column.key)}
                    </div>
                  </th>
                ))}
                {editable && onDelete && (
                  <th className="text-center" style={{ width: "80px" }}>
                    İşlemler
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((row, index) => (
                  <tr
                    key={index}
                    className={`hover:bg-gray-50 transition-colors ${onRowClick && !editable ? "cursor-pointer" : ""}`}
                    onClick={() => !editable && onRowClick?.(row)}
                  >
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className={`${column.align === "center" ? "text-center" : column.align === "right" ? "text-right" : "text-left"}`}
                      >
                        {renderCell(row, column)}
                      </td>
                    ))}
                    {editable && onDelete && (
                      <td className="text-center">
                        <Button size="sm" variant="ghost" onClick={() => handleDelete(row)}>
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length + (editable && onDelete ? 1 : 0)}
                    className="text-center py-8 text-gray-500"
                  >
                    {editable ? (
                      <div className="space-y-2">
                        <p>Henüz veri yok</p>
                        <Button size="sm" onClick={handleAddRow}>
                          <Plus className="h-4 w-4 mr-2" />
                          İlk Kaydı Ekle
                        </Button>
                      </div>
                    ) : (
                      "Veri bulunamadı"
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t">
            <div className="text-sm text-gray-700">
              Toplam {sortedData.length} kayıttan {Math.min((currentPage - 1) * pageSize + 1, sortedData.length)}-
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
        )}
      </div>

      {/* Summary */}
      <div className="text-sm text-gray-600 flex justify-between items-center">
        <span>
          Toplam {data.length} kayıt{filteredData.length !== data.length && ` (${filteredData.length} filtrelenmiş)`}
        </span>
        {editable && (
          <span className="text-blue-600 text-xs">
            💡 İpucu: Hücreleri düzenlemek için çift tıklayın, Enter ile kaydedin, Escape ile iptal edin
          </span>
        )}
      </div>
    </div>
  )
}
