import mongoose from "mongoose";

// Tipo explícito para evitar referência circular no declare global
type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

// Inicializar cache global se não existir
if (!global.mongooseCache) {
  global.mongooseCache = { conn: null, promise: null };
}

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URL;

if (!MONGODB_URI) {
  throw new Error(
    "Please define MONGODB_URI or MONGO_URL environment variable"
  );
}

async function connectToMongo(): Promise<typeof mongoose> {
  const cache = global.mongooseCache!;

  // Se já existe conexão ativa, retornar
  if (cache.conn) {
    console.log("✅ [MongoDB] Using existing connection");
    return cache.conn;
  }

  // Se não existe promise de conexão, criar uma
  if (!cache.promise) {
    console.log("🔄 [MongoDB] Creating new connection...");

    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      minPoolSize: 2,
      socketTimeoutMS: 45000,
      family: 4, // Use IPv4
    };

    cache.promise = mongoose
      .connect(MONGODB_URI!, opts)
      .then((m) => {
        console.log("✅ [MongoDB] Connected successfully");
        console.log("📊 [MongoDB] Database:", m.connection.db?.databaseName);
        return m;
      })
      .catch((error) => {
        console.error("❌ [MongoDB] Connection error:", error);
        cache.promise = null; // Reset promise on error
        throw error;
      });
  }

  try {
    cache.conn = await cache.promise;
  } catch (error) {
    cache.promise = null;
    throw error;
  }

  return cache.conn;
}

export default connectToMongo;
