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
  const updatesCol = getUpdatesCollection();
  
  const newUpdate = {
    userId,
    content,
    createdAt: Timestamp.now(),
  };
  
  try {
    const docRef = await updatesCol.add(newUpdate);
    const doc = await docRef.get();
    
    return convertFirestoreDate<Update>(doc);
  } catch (error) {
    console.error("Error saving update to Firestore:", error);
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