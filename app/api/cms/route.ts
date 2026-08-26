import { NextRequest, NextResponse } from "next/server";
import { getCMSData, saveCMSData, PortfolioCMSData } from "@/lib/cms";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getCMSData();
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to retrieve CMS data" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as PortfolioCMSData;

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, error: "Invalid payload provided" },
        { status: 400 }
      );
    }

    const saveResult = await saveCMSData(body);

    if (!saveResult.success) {
      return NextResponse.json(
        { success: false, error: saveResult.error || "Failed to persist data" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "CMS data successfully updated", data: body },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("API CMS POST Error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
