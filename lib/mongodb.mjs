import mongoose from 'mongoose';

const cacheKey = Symbol.for('creek-view-academy.mongoose');
const globalCache = globalThis;
const cache = globalCache[cacheKey] || (globalCache[cacheKey] = { promise: null });

export async function connectToMongoDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not set. Add it to the private .env.local file.');
  }

  if (mongoose.connection.readyState === 1) return mongoose.connection;
  if (!cache.promise) {
    cache.promise = mongoose.connect(uri, {
      dbName: process.env.MONGODB_DB || 'creek_view_academy',
      serverSelectionTimeoutMS: 10000,
    }).then(() => mongoose.connection).catch((error) => {
      cache.promise = null;
      throw error;
    });
  }

  return cache.promise;
}
