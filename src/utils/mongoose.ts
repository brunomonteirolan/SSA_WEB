import mongoose from "mongoose";

declare global {
  var mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

// Inicializar global.mongoose se não existir
if (!global.mongoose) {
  global.mongoose = { conn: null, promise: null };
}

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URL;

if (!MONGODB_URI) {
  throw new Error(
    "Please define MONGODB_URI or MONGO_URL environment variable"
  );
}

async function connectToMongo(): Promise<typeof mongoose> {
  // Se já existe conexão ativa, retornar
  if (global.mongoose.conn) {
    console.log("✅ [MongoDB] Using existing connection");
    return global.mongoose.conn;
  }

  // Se não existe promise de conexão, criar uma
  if (!global.mongoose.promise) {
    console.log("🔄 [MongoDB] Creating new connection...");
    
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      minPoolSize: 2,
      socketTimeoutMS: 45000,
      family: 4, // Use IPv4
    };

    global.mongoose.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log("✅ [MongoDB] Connected successfully");
        console.log("📊 [MongoDB] Database:", mongoose.connection.db.databaseName);
        return mongoose;
      })
      .catch((error) => {
        console.error("❌ [MongoDB] Connection error:", error);
        global.mongoose.promise = null; // Reset promise on error
        throw error;
      });
  }

  try {
    global.mongoose.conn = await global.mongoose.promise;
  } catch (error) {
    global.mongoose.promise = null;
    throw error;
  }

  return global.mongoose.conn;
}

export default connectToMongo;
