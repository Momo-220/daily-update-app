import { getUpdateStats } from "@/lib/updates";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // Par défaut, on utilise l'ID utilisateur 1 (authentification simulée)
  const userId = "1";
  
  try {
    const stats = await getUpdateStats(userId);
    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
} 