import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await request.json()
    const projectId = params.id

    // Update main project
    const projectQuery = `
      UPDATE projects 
      SET title = ?, type = ?, purpose = ?, start_date = ?, end_date = ?, 
          summary = ?, internal_code = ?, external_reference = ?
      WHERE id = ?
    `
    await executeQuery(projectQuery, [
      data.title || "",
      data.type || "",
      data.purpose || "",
      data.start_date || null,
      data.end_date || null,
      data.summary || "",
      data.internal_code || "",
      data.external_reference || "",
      projectId,
    ])

    // Update or insert location
    const locationExists = await executeQuery("SELECT id FROM locations WHERE project_id = ?", [projectId])
    if ((locationExists as any[]).length > 0) {
      const locationQuery = `
        UPDATE locations 
        SET province = ?, district = ?, neighborhood = ?, address = ?
        WHERE project_id = ?
      `
      await executeQuery(locationQuery, [
        data.province || "",
        data.district || "",
        data.neighborhood || "",
        data.address || "",
        projectId,
      ])
    } else if (data.province || data.district) {
      const locationQuery = `
        INSERT INTO locations (project_id, province, district, neighborhood, address)
        VALUES (?, ?, ?, ?, ?)
      `
      await executeQuery(locationQuery, [
        projectId,
        data.province || "",
        data.district || "",
        data.neighborhood || "",
        data.address || "",
      ])
    }

    // Update or insert employer
    const employerExists = await executeQuery("SELECT id FROM employers WHERE project_id = ?", [projectId])
    if ((employerExists as any[]).length > 0) {
      const employerQuery = `
        UPDATE employers 
        SET name = ?, representative = ?, address = ?, phone = ?, email = ?
        WHERE project_id = ?
      `
      await executeQuery(employerQuery, [
        data.employer_name || "",
        data.employer_representative || "",
        data.employer_address || "",
        data.employer_phone || "",
        data.employer_email || "",
        projectId,
      ])
    } else if (data.employer_name) {
      const employerQuery = `
        INSERT INTO employers (project_id, name, representative, address, phone, email)
        VALUES (?, ?, ?, ?, ?, ?)
      `
      await executeQuery(employerQuery, [
        projectId,
        data.employer_name || "",
        data.employer_representative || "",
        data.employer_address || "",
        data.employer_phone || "",
        data.employer_email || "",
      ])
    }

    // Update or insert contractor
    const contractorExists = await executeQuery("SELECT id FROM contractors WHERE project_id = ?", [projectId])
    if ((contractorExists as any[]).length > 0) {
      const contractorQuery = `
        UPDATE contractors 
        SET company_name = ?, representative = ?, address = ?, phone = ?, email = ?, registration_no = ?
        WHERE project_id = ?
      `
      await executeQuery(contractorQuery, [
        data.contractor_name || "",
        data.contractor_representative || "",
        data.contractor_address || "",
        data.contractor_phone || "",
        data.contractor_email || "",
        data.contractor_registration || "",
        projectId,
      ])
    } else if (data.contractor_name) {
      const contractorQuery = `
        INSERT INTO contractors (project_id, company_name, representative, address, phone, email, registration_no)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `
      await executeQuery(contractorQuery, [
        projectId,
        data.contractor_name || "",
        data.contractor_representative || "",
        data.contractor_address || "",
        data.contractor_phone || "",
        data.contractor_email || "",
        data.contractor_registration || "",
      ])
    }

    // Update or insert project area
    const areaExists = await executeQuery("SELECT id FROM project_area WHERE project_id = ?", [projectId])
    if ((areaExists as any[]).length > 0) {
      const areaQuery = `
        UPDATE project_area 
        SET land_area = ?, construction_area = ?, floor_count = ?, block_count = ?
        WHERE project_id = ?
      `
      await executeQuery(areaQuery, [
        data.land_area || 0,
        data.construction_area || 0,
        data.floor_count || 0,
        data.block_count || 0,
        projectId,
      ])
    } else if (data.construction_area || data.floor_count) {
      const areaQuery = `
        INSERT INTO project_area (project_id, land_area, construction_area, floor_count, block_count)
        VALUES (?, ?, ?, ?, ?)
      `
      await executeQuery(areaQuery, [
        projectId,
        data.land_area || 0,
        data.construction_area || 0,
        data.floor_count || 0,
        data.block_count || 0,
      ])
    }

    // Update or insert contract info
    const contractExists = await executeQuery("SELECT id FROM contract_info WHERE project_id = ?", [projectId])
    if ((contractExists as any[]).length > 0) {
      const contractQuery = `
        UPDATE contract_info 
        SET contract_type = ?, contract_value = ?, financing_source = ?
        WHERE project_id = ?
      `
      await executeQuery(contractQuery, [
        data.contract_type || "",
        data.contract_value || 0,
        data.financing_source || "",
        projectId,
      ])
    } else if (data.contract_value || data.contract_type) {
      const contractQuery = `
        INSERT INTO contract_info (project_id, contract_type, contract_value, financing_source)
        VALUES (?, ?, ?, ?)
      `
      await executeQuery(contractQuery, [
        projectId,
        data.contract_type || "",
        data.contract_value || 0,
        data.financing_source || "",
      ])
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating project:", error)
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const projectId = params.id

    // Delete related records first (foreign key constraints)
    await executeQuery("DELETE FROM legal_status WHERE project_id = ?", [projectId])
    await executeQuery("DELETE FROM contract_info WHERE project_id = ?", [projectId])
    await executeQuery("DELETE FROM monitoring WHERE project_id = ?", [projectId])
    await executeQuery("DELETE FROM stakeholders WHERE project_id = ?", [projectId])
    await executeQuery("DELETE FROM permits WHERE project_id = ?", [projectId])
    await executeQuery("DELETE FROM project_area WHERE project_id = ?", [projectId])
    await executeQuery("DELETE FROM contractors WHERE project_id = ?", [projectId])
    await executeQuery("DELETE FROM employers WHERE project_id = ?", [projectId])
    await executeQuery("DELETE FROM locations WHERE project_id = ?", [projectId])

    // Delete main project
    await executeQuery("DELETE FROM projects WHERE id = ?", [projectId])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting project:", error)
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 })
  }
}
