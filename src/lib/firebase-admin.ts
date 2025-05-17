import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Vérifier si nous sommes en environnement de développement
const isDevelopment = process.env.NODE_ENV === 'development';

// Configuration pour Firebase Admin
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID || "daily-updates-app",
  // En production, ces valeurs doivent être définies dans les variables d'environnement
  // Pour le développement, nous utilisons des valeurs fictives
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL || "firebase-adminsdk@example.com",
  privateKey: process.env.FIREBASE_PRIVATE_KEY ? 
    process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : 
    "-----BEGIN PRIVATE KEY-----\nMockPrivateKey\n-----END PRIVATE KEY-----\n"
};

// Si nous n'avons pas les informations Firebase en dev, utiliser un mock
const mockFirestore = () => {
  console.log("⚠️ Utilisation d'un mock Firestore en développement");
  
  // Stockage local des données
  const collections: Record<string, any[]> = {
    'updates': []
  };
  
  // Créer une fonction mock pour simuler l'API Firestore
  return {
    collection: (name: string) => ({
      add: async (data: any) => {
        const id = `mock-${Date.now()}`;
        const newDoc = { id, ...data };
        collections[name] = collections[name] || [];
        collections[name].push(newDoc);
        return {
          id,
          get: async () => ({
            id,
            data: () => data,
            exists: true
          })
        };
      },
      doc: (id: string) => ({
        get: async () => {
          const doc = collections[name]?.find(d => d.id === id);
          return {
            id,
            data: () => doc || null,
            exists: !!doc
          };
        },
        set: async (data: any) => {
          const index = collections[name]?.findIndex(d => d.id === id);
          if (index >= 0) {
            collections[name][index] = { id, ...data };
          } else {
            collections[name] = collections[name] || [];
            collections[name].push({ id, ...data });
          }
        },
        update: async (data: any) => {
          const index = collections[name]?.findIndex(d => d.id === id);
          if (index >= 0) {
            collections[name][index] = { ...collections[name][index], ...data };
          }
        },
        delete: async () => {
          const index = collections[name]?.findIndex(d => d.id === id);
          if (index >= 0) {
            collections[name].splice(index, 1);
          }
        }
      }),
      orderBy: () => ({
        get: async () => ({
          empty: collections[name]?.length === 0,
          docs: (collections[name] || []).map(doc => ({
            id: doc.id,
            data: () => doc,
            exists: true
          }))
        }),
        where: () => ({
          get: async () => ({
            empty: collections[name]?.length === 0,
            docs: (collections[name] || []).map(doc => ({
              id: doc.id,
              data: () => doc,
              exists: true
            }))
          })
        })
      }),
      where: () => ({
        orderBy: () => ({
          get: async () => ({
            empty: collections[name]?.length === 0,
            docs: (collections[name] || []).map(doc => ({
              id: doc.id,
              data: () => doc,
              exists: true
            }))
          })
        })
      })
    })
  };
};

// Initialiser l'application Firebase si elle n'est pas déjà initialisée
export function getFirebaseAdmin() {
  // En développement, si les variables d'environnement ne sont pas définies, 
  // utiliser une implémentation simulée pour les tests
  if (isDevelopment && (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_PRIVATE_KEY)) {
    return mockFirestore() as any;
  }

  if (getApps().length === 0) {
    try {
      initializeApp({
        credential: cert(serviceAccount as any)
      });
    } catch (error) {
      console.error("Erreur d'initialisation de Firebase Admin:", error);
      // En cas d'échec, retourner le mock en développement
      if (isDevelopment) {
        return mockFirestore() as any;
      }
      throw error;
    }
  }
  
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
  return {
    ...data,
    id: doc.id,
    // Convertir les timestamps Firestore en chaînes de date ISO
    createdAt: data.createdAt instanceof Date 
      ? data.createdAt.toISOString() 
      : typeof data.createdAt?.toDate === 'function' 
        ? data.createdAt.toDate().toISOString()
        : data.createdAt
  } as T;
} 