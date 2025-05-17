import { getUpdatesByUser, saveUpdate } from "@/lib/updates";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // Par défaut, on utilise l'ID utilisateur 1 (authentification simulée)
  const userId = "1";
  
  try {
    const updates = await getUpdatesByUser(userId);
    return NextResponse.json(updates);
  } catch (error) {
    console.error("Error fetching updates:", error);
    return NextResponse.json(
      { error: "Failed to fetch updates" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  // Par défaut, on utilise l'ID utilisateur 1 (authentification simulée)
  const userId = "1";
  
  try {
    const { content } = await request.json();
    
    if (!content || typeof content !== "string" || content.trim() === "") {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }
    
    const newUpdate = await saveUpdate(content, userId);
    return NextResponse.json(newUpdate, { status: 201 });
  } catch (error) {
    console.error("Error creating update:", error);
    return NextResponse.json(
      { error: "Failed to create update" },
      { status: 500 }
    );
  }
} 