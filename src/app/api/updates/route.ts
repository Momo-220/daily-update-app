import { getUpdatesByUser, saveUpdate } from "@/lib/updates";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // Par défaut, on utilise l'ID utilisateur 1 (authentification simulée)
  const userId = "1";
  
  try {
    console.log("GET /api/updates: Récupération des mises à jour pour l'utilisateur", userId);
    const updates = await getUpdatesByUser(userId);
    console.log(`GET /api/updates: ${updates.length} mises à jour récupérées`);
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
    console.log("POST /api/updates: Début de la création d'une mise à jour");
    const body = await request.json();
    const { content } = body;
    
    console.log("POST /api/updates: Contenu reçu:", content);
    
    if (!content || typeof content !== "string" || content.trim() === "") {
      console.log("POST /api/updates: Contenu invalide");
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }
    
    console.log("POST /api/updates: Sauvegarde de la mise à jour");
    const newUpdate = await saveUpdate(content, userId);
    console.log("POST /api/updates: Mise à jour créée avec succès", newUpdate);
    return NextResponse.json(newUpdate, { status: 201 });
  } catch (error) {
    console.error("Error creating update:", error);
    
    // Log détaillé de l'erreur
    if (error instanceof Error) {
      console.error("Message d'erreur:", error.message);
      console.error("Stack trace:", error.stack);
    }
    
    return NextResponse.json(
      { 
        error: "Failed to create update",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 