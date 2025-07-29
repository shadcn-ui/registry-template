import { NextRequest, NextResponse } from "next/server"
import { getComponentSource } from "@/lib/get-component-source"
import fs from "node:fs/promises"
import path from "node:path"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const name = searchParams.get("name")
  const src = searchParams.get("src")

  try {
    let code: string | undefined

    if (name) {
      code = getComponentSource(name)
    }

    if (src) {
      const file = await fs.readFile(path.join(process.cwd(), src), "utf-8")
      code = file
    }

    if (!code) {
      return NextResponse.json({ error: "Component not found" }, { status: 404 })
    }

    return NextResponse.json({ code })
  } catch (error) {
    console.error("Error loading component source:", error)
    return NextResponse.json({ error: "Failed to load component" }, { status: 500 })
  }
}