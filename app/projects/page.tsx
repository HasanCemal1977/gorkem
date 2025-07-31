"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Plus, Building2, Calendar, DollarSign, TrendingUp } from "lucide-react"
import Link from "next/link"
import { DataTable } from "@/components/data-table"
import { useState, useEffect } from "react"

interface Project {
  id: number
  title: string
  type: string
  purpose: string
  start_date: string
  end_date: string
  summary: string
  internal_code: string
  external_reference: string
  province: string
  district: string
  neighborhood: string
  address: string
  employer_name: string
  contractor_name: string
  construction_area: number
  floor_count: number
  contract_value: number
  contract_type: string
}

export default function ProjectsPage() {
  const [projectData, setProjectData] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects")
      if (response.ok) {
        const data = await response.json()
        setProjectData(data)
      }
    } catch (error) {
      console.error("Error fetching projects:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddProject = async (newRow: any) => {
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newRow),
      })

      if (response.ok) {
        await fetchProjects() // Refresh data
      }
    } catch (error) {
      console.error("Error adding project:", error)
    }
  }

  const handleUpdateProject = async (id: number, updatedRow: any) => {
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedRow),
      })

      if (response.ok) {
        await fetchProjects() // Refresh data
      }
    } catch (error) {
      console.error("Error updating project:", error)
    }
  }

  const handleDeleteProject = async (id: number) => {
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchProjects() // Refresh data
      }
    } catch (error) {
      console.error("Error deleting project:", error)
    }
  }

  const projectColumns = [
    {
      key: "title",
      title: "Proje Başlığı",
      filterable: true,
      width: "200px",
      editable: true,
      required: true,
    },
    {
      key: "type",
      title: "Proje Tipi",
      filterable: true,
      filterType: "select" as const,
      width: "120px",
      editable: true,
      type: "select" as const,
      selectOptions: [
        { value: "Konut", label: "Konut" },
        { value: "Ticari", label: "Ticari" },
        { value: "Endüstriyel", label: "Endüstriyel" },
        { value: "Altyapı", label: "Altyapı" },
        { value: "Kamu", label: "Kamu" },
      ],
      filterOptions: [
        { value: "Konut", label: "Konut" },
        { value: "Ticari", label: "Ticari" },
        { value: "Endüstriyel", label: "Endüstriyel" },
        { value: "Altyapı", label: "Altyapı" },
        { value: "Kamu", label: "Kamu" },
      ],
    },
    {
      key: "province",
      title: "İl",
      filterable: true,
      width: "100px",
      editable: true,
    },
    {
      key: "district",
      title: "İlçe",
      filterable: true,
      width: "100px",
      editable: true,
    },
    {
      key: "start_date",
      title: "Başlangıç",
      sortable: true,
      width: "120px",
      editable: true,
      type: "date" as const,
      render: (value: string) => (value ? new Date(value).toLocaleDateString("tr-TR") : "-"),
    },
    {
      key: "end_date",
      title: "Bitiş",
      sortable: true,
      width: "120px",
      editable: true,
      type: "date" as const,
      render: (value: string) => (value ? new Date(value).toLocaleDateString("tr-TR") : "-"),
    },
    {
      key: "employer_name",
      title: "İşveren",
      filterable: true,
      width: "150px",
      editable: true,
    },
    {
      key: "contractor_name",
      title: "Yüklenici",
      filterable: true,
      width: "150px",
      editable: true,
    },
    {
      key: "contract_value",
      title: "Sözleşme Bedeli",
      sortable: true,
      align: "right" as const,
      width: "140px",
      editable: true,
      type: "number" as const,
      render: (value: number) => (value ? `₺${value.toLocaleString()}` : "-"),
    },
    {
      key: "contract_type",
      title: "Sözleşme Tipi",
      filterable: true,
      filterType: "select" as const,
      width: "120px",
      editable: true,
      type: "select" as const,
      selectOptions: [
        { value: "Götürü", label: "Götürü" },
        { value: "Birim Fiyat", label: "Birim Fiyat" },
        { value: "Karma", label: "Karma" },
        { value: "Maliyet Artı", label: "Maliyet Artı" },
      ],
      filterOptions: [
        { value: "Götürü", label: "Götürü" },
        { value: "Birim Fiyat", label: "Birim Fiyat" },
        { value: "Karma", label: "Karma" },
        { value: "Maliyet Artı", label: "Maliyet Artı" },
      ],
    },
    {
      key: "construction_area",
      title: "İnşaat Alanı (m²)",
      sortable: true,
      align: "right" as const,
      width: "130px",
      editable: true,
      type: "number" as const,
      render: (value: number) => (value ? `${value.toLocaleString()} m²` : "-"),
    },
    {
      key: "floor_count",
      title: "Kat Sayısı",
      sortable: true,
      align: "center" as const,
      width: "100px",
      editable: true,
      type: "number" as const,
      render: (value: number) => value || "-",
    },
    {
      key: "internal_code",
      title: "İç Kod",
      filterable: true,
      width: "100px",
      editable: true,
    },
    {
      key: "external_reference",
      title: "Dış Referans",
      filterable: true,
      width: "120px",
      editable: true,
    },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Projeler yükleniyor...</p>
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
                <h1 className="text-2xl font-bold text-gray-900">Proje Yönetimi</h1>
                <p className="text-sm text-gray-500">Şantiye bazlı finansal yönetim ve takip</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline">Rapor Al</Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Yeni Proje
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
                  <p className="text-sm font-medium text-gray-600">Toplam Proje</p>
                  <p className="text-2xl font-bold text-gray-900">{projectData.length}</p>
                  <p className="text-xs text-green-600">Aktif projeler</p>
                </div>
                <Building2 className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Toplam Değer</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ₺{(projectData.reduce((sum, p) => sum + (p.contract_value || 0), 0) / 1000000).toFixed(1)}M
                  </p>
                  <p className="text-xs text-blue-600">Sözleşme bedeli</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">İnşaat Alanı</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {(projectData.reduce((sum, p) => sum + (p.construction_area || 0), 0) / 1000).toFixed(0)}K
                  </p>
                  <p className="text-xs text-orange-600">m² toplam alan</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ortalama Kat</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {projectData.length > 0
                      ? Math.round(projectData.reduce((sum, p) => sum + (p.floor_count || 0), 0) / projectData.length)
                      : 0}
                  </p>
                  <p className="text-xs text-purple-600">Kat sayısı</p>
                </div>
                <Calendar className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList>
            <TabsTrigger value="projects">Proje Listesi</TabsTrigger>
            <TabsTrigger value="details">Detaylı Bilgiler</TabsTrigger>
            <TabsTrigger value="timeline">Zaman Çizelgesi</TabsTrigger>
            <TabsTrigger value="reports">Raporlar</TabsTrigger>
          </TabsList>

          <TabsContent value="projects">
            <Card>
              <CardHeader>
                <CardTitle>Proje Listesi</CardTitle>
                <CardDescription>Tüm projelerinizin genel durumu ve temel bilgileri</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  data={projectData}
                  columns={projectColumns}
                  title="Proje Listesi"
                  height={600}
                  editable={true}
                  onAdd={handleAddProject}
                  onUpdate={handleUpdateProject}
                  onDelete={handleDeleteProject}
                  idField="id"
                  autoAddRow={true}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Detaylı Proje Bilgileri</CardTitle>
                <CardDescription>Proje detayları, paydaşlar ve yasal durum</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {projectData.map((project) => (
                    <div key={project.id} className="border rounded-lg p-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                          <h3 className="font-semibold text-lg mb-4">{project.title}</h3>
                          <div className="space-y-2 text-sm">
                            <p>
                              <span className="font-medium">Tip:</span> {project.type || "-"}
                            </p>
                            <p>
                              <span className="font-medium">Amaç:</span> {project.purpose || "-"}
                            </p>
                            <p>
                              <span className="font-medium">Lokasyon:</span> {project.province} / {project.district}
                            </p>
                            <p>
                              <span className="font-medium">Adres:</span> {project.address || "-"}
                            </p>
                            <p>
                              <span className="font-medium">İç Kod:</span> {project.internal_code || "-"}
                            </p>
                            <p>
                              <span className="font-medium">Dış Referans:</span> {project.external_reference || "-"}
                            </p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-4">Proje Detayları</h4>
                          <div className="space-y-2 text-sm">
                            <p>
                              <span className="font-medium">İşveren:</span> {project.employer_name || "-"}
                            </p>
                            <p>
                              <span className="font-medium">Yüklenici:</span> {project.contractor_name || "-"}
                            </p>
                            <p>
                              <span className="font-medium">Sözleşme Tipi:</span> {project.contract_type || "-"}
                            </p>
                            <p>
                              <span className="font-medium">Sözleşme Bedeli:</span>{" "}
                              {project.contract_value ? `₺${project.contract_value.toLocaleString()}` : "-"}
                            </p>
                            <p>
                              <span className="font-medium">İnşaat Alanı:</span>{" "}
                              {project.construction_area ? `${project.construction_area.toLocaleString()} m²` : "-"}
                            </p>
                            <p>
                              <span className="font-medium">Kat Sayısı:</span> {project.floor_count || "-"}
                            </p>
                          </div>
                        </div>
                      </div>
                      {project.summary && (
                        <div className="mt-4 pt-4 border-t">
                          <h4 className="font-semibold mb-2">Özet</h4>
                          <p className="text-sm text-gray-600">{project.summary}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeline">
            <Card>
              <CardHeader>
                <CardTitle>Zaman Çizelgesi</CardTitle>
                <CardDescription>Proje takvimi ve kritik tarihler</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {projectData.map((project) => (
                    <div key={project.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-medium text-lg">{project.title}</h3>
                          <p className="text-sm text-gray-600">
                            {project.province} / {project.district}
                          </p>
                        </div>
                        <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">{project.type}</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <div>
                            <p className="text-xs text-gray-500">Başlangıç</p>
                            <p className="text-sm font-medium">
                              {project.start_date ? new Date(project.start_date).toLocaleDateString("tr-TR") : "-"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <div>
                            <p className="text-xs text-gray-500">Bitiş</p>
                            <p className="text-sm font-medium">
                              {project.end_date ? new Date(project.end_date).toLocaleDateString("tr-TR") : "-"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4 text-gray-500" />
                          <div>
                            <p className="text-xs text-gray-500">Sözleşme Bedeli</p>
                            <p className="text-sm font-medium">
                              {project.contract_value ? `₺${project.contract_value.toLocaleString()}` : "-"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {project.start_date && project.end_date && (
                        <div className="mt-4">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: "45%" }}></div>
                          </div>
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>{new Date(project.start_date).toLocaleDateString("tr-TR")}</span>
                            <span>{new Date(project.end_date).toLocaleDateString("tr-TR")}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Proje Raporları</CardTitle>
                <CardDescription>Proje istatistikleri ve analiz raporları</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Proje Tipi Dağılımı</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {["Konut", "Ticari", "Endüstriyel", "Altyapı", "Kamu"].map((type) => {
                          const count = projectData.filter((p) => p.type === type).length
                          const percentage = projectData.length > 0 ? (count / projectData.length) * 100 : 0
                          return (
                            <div key={type} className="flex justify-between items-center">
                              <span className="text-sm">{type}</span>
                              <div className="flex items-center space-x-2">
                                <div className="w-24 bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-blue-600 h-2 rounded-full"
                                    style={{ width: `${percentage}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm font-medium w-8">{count}</span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Finansal Özet</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm">Toplam Sözleşme Bedeli:</span>
                          <span className="font-medium">
                            ₺{projectData.reduce((sum, p) => sum + (p.contract_value || 0), 0).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Ortalama Proje Değeri:</span>
                          <span className="font-medium">
                            ₺
                            {projectData.length > 0
                              ? Math.round(
                                  projectData.reduce((sum, p) => sum + (p.contract_value || 0), 0) / projectData.length,
                                ).toLocaleString()
                              : 0}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Toplam İnşaat Alanı:</span>
                          <span className="font-medium">
                            {projectData.reduce((sum, p) => sum + (p.construction_area || 0), 0).toLocaleString()} m²
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Ortalama Alan:</span>
                          <span className="font-medium">
                            {projectData.length > 0
                              ? Math.round(
                                  projectData.reduce((sum, p) => sum + (p.construction_area || 0), 0) /
                                    projectData.length,
                                ).toLocaleString()
                              : 0}{" "}
                            m²
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
