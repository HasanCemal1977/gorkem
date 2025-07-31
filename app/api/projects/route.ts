import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"

export async function GET() {
  try {
    const query = `
      SELECT 
        p.*,
        l.province,
        l.district,
        l.neighborhood,
        l.address,
        e.name as employer_name,
        c.company_name as contractor_name,
        pa.construction_area,
        pa.floor_count,
        ci.contract_value,
        ci.contract_type
      FROM projects p
      LEFT JOIN locations l ON p.id = l.project_id
      LEFT JOIN employers e ON p.id = e.project_id
      LEFT JOIN contractors c ON p.id = c.project_id
      LEFT JOIN project_area pa ON p.id = pa.project_id
      LEFT JOIN contract_info ci ON p.id = ci.project_id
      ORDER BY p.id DESC
    `

    const projects = await executeQuery(query)
    return NextResponse.json(projects)
  } catch (error) {
    console.error("Error fetching projects:", error)
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Insert main project
    const projectQuery = `
      INSERT INTO projects (title, type, purpose, start_date, end_date, summary, internal_code, external_reference)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `
    const projectResult: any = await executeQuery(projectQuery, [
      data.title || "",
      data.type || "",
      data.purpose || "",
      data.start_date || null,
      data.end_date || null,
      data.summary || "",
      data.internal_code || "",
      data.external_reference || "",
    ])

    const projectId = projectResult.insertId

    // Insert location if provided
    if (data.province || data.district) {
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

    // Insert employer if provided
    if (data.employer_name) {
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

    // Insert contractor if provided
    if (data.contractor_name) {
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

    // Insert project area if provided
    if (data.construction_area || data.floor_count) {
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

    // Insert contract info if provided
    if (data.contract_value || data.contract_type) {
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

    return NextResponse.json({ success: true, id: projectId })
  } catch (error) {
    console.error("Error creating project:", error)
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
  }
}
