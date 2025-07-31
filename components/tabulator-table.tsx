"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, RefreshCw } from "lucide-react"

interface TabulatorTableProps {
  data: any[]
  columns: any[]
  options?: any
  height?: string | number
  title?: string
  showExport?: boolean
  onRowClick?: (row: any) => void
}

export function TabulatorTable({
  data,
  columns,
  options = {},
  height = 400,
  title,
  showExport = true,
  onRowClick,
}: TabulatorTableProps) {
  const tableRef = useRef<HTMLDivElement>(null)
  const [tabulator, setTabulator] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadTabulator = async () => {
      if (typeof window !== "undefined" && tableRef.current) {
        try {
          // Dynamic import of Tabulator
          const TabulatorModule = await import("tabulator-tables")
          const TabulatorFull = TabulatorModule.TabulatorFull || TabulatorModule.default

          if (!TabulatorFull) {
            throw new Error("Tabulator could not be loaded")
          }

          const defaultOptions = {
            data: data,
            columns: columns,
            layout: "fitColumns",
            responsiveLayout: "hide",
            pagination: "local",
            paginationSize: 15,
            paginationSizeSelector: [10, 15, 25, 50, 100],
            movableColumns: true,
            resizableRows: true,
            height: height,
            locale: "tr-tr",
            langs: {
              "tr-tr": {
                pagination: {
                  page_size: "Sayfa Boyutu",
                  first: "İlk",
                  first_title: "İlk Sayfa",
                  last: "Son",
                  last_title: "Son Sayfa",
                  prev: "Önceki",
                  prev_title: "Önceki Sayfa",
                  next: "Sonraki",
                  next_title: "Sonraki Sayfa",
                  all: "Tümü",
                  counter: {
                    showing: "Gösterilen",
                    of: "/",
                    rows: "kayıt",
                  },
                },
                data: {
                  loading: "Yükleniyor...",
                  error: "Hata",
                },
                columns: {
                  name: "Ad",
                },
              },
            },
            rowClick: onRowClick ? (e: any, row: any) => onRowClick(row.getData()) : undefined,
            ...options,
          }

          const table = new TabulatorFull(tableRef.current, defaultOptions)

          // Wait for table to be built
          await table.setData(data)

          setTabulator(table)
          setLoading(false)
          setError(null)
        } catch (error) {
          console.error("Tabulator yükleme hatası:", error)
          setError("Tablo yüklenirken bir hata oluştu")
          setLoading(false)
        }
      }
    }

    loadTabulator()

    return () => {
      if (tabulator) {
        try {
          tabulator.destroy()
        } catch (e) {
          console.warn("Tabulator destroy error:", e)
        }
      }
    }
  }, [])

  // Update data when props change
  useEffect(() => {
    if (tabulator && data) {
      tabulator.setData(data)
    }
  }, [data, tabulator])

  const exportToCSV = () => {
    if (tabulator) {
      try {
        tabulator.download("csv", `${title || "tablo"}.csv`)
      } catch (error) {
        console.error("CSV export error:", error)
      }
    }
  }

  const exportToExcel = () => {
    if (tabulator) {
      try {
        tabulator.download("xlsx", `${title || "tablo"}.xlsx`, { sheetName: title || "Veri" })
      } catch (error) {
        console.error("Excel export error:", error)
      }
    }
  }

  const refreshData = () => {
    if (tabulator && data) {
      tabulator.setData(data)
    }
  }

  if (error) {
    return (
      <div className="space-y-4">
        {(title || showExport) && (
          <div className="flex justify-between items-center">
            {title && <h3 className="text-lg font-medium">{title}</h3>}
          </div>
        )}
        <div className="border rounded-lg p-8 text-center">
          <div className="text-red-500 mb-2">⚠️ Tablo Yükleme Hatası</div>
          <p className="text-sm text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline" size="sm">
            Sayfayı Yenile
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {(title || showExport) && (
        <div className="flex justify-between items-center">
          {title && <h3 className="text-lg font-medium">{title}</h3>}
          {showExport && !loading && (
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={refreshData}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Yenile
              </Button>
              <Button variant="outline" size="sm" onClick={exportToCSV}>
                <Download className="h-4 w-4 mr-2" />
                CSV
              </Button>
              <Button variant="outline" size="sm" onClick={exportToExcel}>
                <Download className="h-4 w-4 mr-2" />
                Excel
              </Button>
            </div>
          )}
        </div>
      )}

      <div className="border rounded-lg overflow-hidden">
        {loading && (
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
              <p className="text-sm text-gray-500">Tablo yükleniyor...</p>
            </div>
          </div>
        )}
        <div ref={tableRef} className={loading ? "hidden" : ""}></div>
      </div>
    </div>
  )
}
