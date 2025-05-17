import { Update, UpdateStats } from "@/types";
import { format } from "date-fns";
import { getUpdatesCollection, convertFirestoreDate } from "./firebase-admin";
import { Timestamp, QueryDocumentSnapshot, DocumentData } from "firebase-admin/firestore";

// Simulation d'une base de données avec localStorage
const STORAGE_KEY = "daily-updates";

// Fonction pour vérifier si le code s'exécute côté client
const isClient = typeof window !== 'undefined';

// Récupérer toutes les mises à jour depuis Firestore
export async function getUpdates(): Promise<Update[]> {
  try {
    const updatesCol = getUpdatesCollection();
    const snapshot = await updatesCol.orderBy("createdAt", "desc").get();
    
    if (snapshot.empty) {
      return [];
    }
    
    return snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => 
      convertFirestoreDate<Update>(doc)
    );
  } catch (error) {
    console.error("Error fetching updates from Firestore:", error);
    return [];
  }
}

// Enregistrer une nouvelle mise à jour dans Firestore
export async function saveUpdate(content: string, userId: string = "1"): Promise<Update> {
  console.log("saveUpdate: Début avec content =", content, "et userId =", userId);
  
  try {
    const updatesCol = getUpdatesCollection();
    console.log("saveUpdate: Collection updates récupérée");
    
    const newUpdate = {
      userId,
      content,
      createdAt: Timestamp.now(),
    };
    console.log("saveUpdate: Objet mise à jour créé:", newUpdate);
    
    try {
      console.log("saveUpdate: Tentative d'ajout à Firestore");
      const docRef = await updatesCol.add(newUpdate);
      console.log("saveUpdate: Document ajouté avec succès, id =", docRef.id);
      
      const doc = await docRef.get();
      console.log("saveUpdate: Document récupéré après ajout");
      
      const result = convertFirestoreDate<Update>(doc);
      console.log("saveUpdate: Document converti avec succès:", result);
      return result;
    } catch (innerError) {
      console.error("saveUpdate: Erreur lors de l'ajout à Firestore:", innerError);
      if (innerError instanceof Error) {
        console.error("saveUpdate: Message d'erreur:", innerError.message);
        console.error("saveUpdate: Stack trace:", innerError.stack);
      }
      throw innerError;
    }
  } catch (error) {
    console.error("saveUpdate: Erreur générale:", error);
    if (error instanceof Error) {
      console.error("saveUpdate: Message d'erreur:", error.message);
      console.error("saveUpdate: Stack trace:", error.stack);
    }
    throw error;
  }
}

// Récupérer les mises à jour par utilisateur
export async function getUpdatesByUser(userId: string = "1"): Promise<Update[]> {
  try {
    const updatesCol = getUpdatesCollection();
    const snapshot = await updatesCol
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .get();
    
    if (snapshot.empty) {
      return [];
    }
    
    return snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => 
      convertFirestoreDate<Update>(doc)
    );
  } catch (error) {
    console.error("Error fetching updates by user from Firestore:", error);
    return [];
  }
}

// Calculer les statistiques des mises à jour
export async function getUpdateStats(userId: string = "1"): Promise<UpdateStats> {
  try {
    const updates = await getUpdatesByUser(userId);
    
    // Nombre total de mises à jour
    const total = updates.length;
    
    // Mises à jour par jour
    const byDay: Record<string, number> = {};
    updates.forEach((update: Update) => {
      const day = format(new Date(update.createdAt), "yyyy-MM-dd");
      byDay[day] = (byDay[day] || 0) + 1;
    });
    
    // Mots fréquemment utilisés
    const wordCounts: Record<string, number> = {};
    updates.forEach((update: Update) => {
      const words = update.content
        .toLowerCase()
        .split(/\s+/)
        .filter(word => word.length > 3); // Ignorer les mots courts
      
      words.forEach((word: string) => {
        wordCounts[word] = (wordCounts[word] || 0) + 1;
      });
    });
    
    const frequentWords = Object.entries(wordCounts)
      .map(([word, count]) => ({ word, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    return {
      total,
      byDay,
      frequentWords,
    };
  } catch (error) {
    console.error("Error calculating update stats:", error);
    return {
      total: 0,
      byDay: {},
      frequentWords: []
    };
  }
} 