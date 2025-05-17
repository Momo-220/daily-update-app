/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration pour autoriser les origines en développement
  // Utile pour le débogage et les tests
  experimental: {
    // Cette partie sera importante pour les requêtes cross-origin
    allowedDevOrigins: ['*'],
  },
  
  // Configuration pour les variables d'environnement
  env: {
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
    // Note: Ne pas exposer FIREBASE_PRIVATE_KEY ici car il sera visible côté client
    // Il est automatiquement disponible côté serveur via process.env
  }
};

module.exports = nextConfig; 