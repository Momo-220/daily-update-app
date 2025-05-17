import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Vérifier si nous sommes en environnement de développement
const isDevelopment = process.env.NODE_ENV === 'development';
console.log("Firebase Admin Init - Mode:", isDevelopment ? "développement" : "production");

// Configuration pour Firebase Admin
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID || "daily-update-app",
  // En production, ces valeurs doivent être définies dans les variables d'environnement
  // Pour le développement, nous utilisons des valeurs fictives
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL || "firebase-adminsdk@example.com",
  privateKey: process.env.FIREBASE_PRIVATE_KEY ? 
    process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : 
    "-----BEGIN PRIVATE KEY-----\nMockPrivateKey\n-----END PRIVATE KEY-----\n"
};

console.log("Firebase Admin Config - Project ID:", serviceAccount.projectId);
console.log("Firebase Admin Config - Client Email:", serviceAccount.clientEmail ? "défini" : "non défini");
console.log("Firebase Admin Config - Private Key:", serviceAccount.privateKey ? "défini (masqué)" : "non défini");

// Stockage de données en mémoire pour le mock Firestore
const mockCollections: Record<string, any[]> = {
  'updates': []
};

// Si nous n'avons pas les informations Firebase en dev, utiliser un mock
const mockFirestore = () => {
  console.log("⚠️ Utilisation d'un mock Firestore en développement");
  console.log("État actuel des collections:", JSON.stringify(mockCollections));
  
  // Créer une fonction mock pour simuler l'API Firestore
  return {
    collection: (name: string) => ({
      add: async (data: any) => {
        const id = `mock-${Date.now()}`;
        const newDoc = { id, ...data };
        mockCollections[name] = mockCollections[name] || [];
        mockCollections[name].push(newDoc);
        console.log(`Mock: Ajout d'un document à la collection ${name}:`, newDoc);
        return {
          id,
          get: async () => ({
            id,
            data: () => newDoc,
            exists: true
          })
        };
      },
      doc: (id: string) => ({
        get: async () => {
          const doc = mockCollections[name]?.find(d => d.id === id);
          return {
            id,
            data: () => doc || null,
            exists: !!doc
          };
        },
        set: async (data: any) => {
          const index = mockCollections[name]?.findIndex(d => d.id === id);
          if (index >= 0) {
            mockCollections[name][index] = { id, ...data };
          } else {
            mockCollections[name] = mockCollections[name] || [];
            mockCollections[name].push({ id, ...data });
          }
        },
        update: async (data: any) => {
          const index = mockCollections[name]?.findIndex(d => d.id === id);
          if (index >= 0) {
            mockCollections[name][index] = { ...mockCollections[name][index], ...data };
          }
        },
        delete: async () => {
          const index = mockCollections[name]?.findIndex(d => d.id === id);
          if (index >= 0) {
            mockCollections[name].splice(index, 1);
          }
        }
      }),
      orderBy: () => ({
        get: async () => ({
          empty: mockCollections[name]?.length === 0,
          docs: (mockCollections[name] || []).map(doc => ({
            id: doc.id,
            data: () => doc,
            exists: true
          }))
        }),
        where: () => ({
          get: async () => ({
            empty: mockCollections[name]?.length === 0,
            docs: (mockCollections[name] || []).map(doc => ({
              id: doc.id,
              data: () => doc,
              exists: true
            }))
          })
        })
      }),
      where: () => ({
        orderBy: () => ({
          get: async () => {
            console.log(`Mock: Lecture de la collection ${name}:`, mockCollections[name] || []);
            return {
              empty: mockCollections[name]?.length === 0,
              docs: (mockCollections[name] || []).map(doc => ({
                id: doc.id,
                data: () => doc,
                exists: true
              }))
            };
          }
        })
      })
    })
  };
};

// Initialiser l'application Firebase si elle n'est pas déjà initialisée
export function getFirebaseAdmin() {
  // En développement, utiliser une implémentation simulée pour les tests
  if (isDevelopment) {
    console.log("getFirebaseAdmin: Utilisation du mock Firestore en développement");
    return mockFirestore() as any;
  }

  if (getApps().length === 0) {
    try {
      console.log("getFirebaseAdmin: Initialisation de Firebase Admin");
      initializeApp({
        credential: cert(serviceAccount as any)
      });
      console.log("getFirebaseAdmin: Firebase Admin initialisé avec succès");
    } catch (error) {
      console.error("Erreur d'initialisation de Firebase Admin:", error);
      // En cas d'échec, retourner le mock en développement
      if (isDevelopment) {
        console.log("getFirebaseAdmin: Fallback sur mock après erreur");
        return mockFirestore() as any;
      }
      throw error;
    }
  } else {
    console.log("getFirebaseAdmin: Firebase App déjà initialisé");
  }
  
  console.log("getFirebaseAdmin: Retour de l'instance Firestore");
  return getFirestore();
}

// Obtenir une référence à la collection 'updates'
export function getUpdatesCollection() {
  const db = getFirebaseAdmin();
  return db.collection('updates');
}

// Convertir un document Firestore en objet Update
export function convertFirestoreDate<T>(doc: FirebaseFirestore.DocumentData): T {
  const data = doc.data();
  console.log("convertFirestoreDate - data brute:", JSON.stringify(data));
  
  if (!data) {
    console.error("convertFirestoreDate - Aucune donnée dans le document!");
    return { id: doc.id } as T;
  }
  
  // Gérer le cas où createdAt est déjà une chaîne (cas du mock)
  let createdAtIso: string;
  if (typeof data.createdAt === 'string') {
    createdAtIso = data.createdAt;
  } else if (data.createdAt instanceof Date) {
    createdAtIso = data.createdAt.toISOString();
  } else if (typeof data.createdAt?.toDate === 'function') {
    createdAtIso = data.createdAt.toDate().toISOString();
  } else {
    // Fallback si createdAt n'est pas défini correctement
    createdAtIso = new Date().toISOString();
    console.warn("convertFirestoreDate - Format de date inconnu, utilisation de la date actuelle");
  }
  
  const result = {
    ...data,
    id: doc.id,
    createdAt: createdAtIso
  } as T;
  
  console.log("convertFirestoreDate - résultat:", JSON.stringify(result));
  return result;
} 