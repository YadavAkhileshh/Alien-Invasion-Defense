const CACHE_NAME = 'alien-defense-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/game/alien-defense-styles.css',
  '/game/alien-defense-engine.js',
  '/game/game-patch.js',
  '/game/shooting-fix.js',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/favicon.png',
  '/assets/images/alien.png'
];


self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
      .catch(err => console.error(err))