import mongoose from "mongoose";

const MONGO_URL = process.env.MONGO_URL;

if (!MONGO_URL) {
  // Isso já quebra no build/local se a env não estiver setada
  throw new Error("❌ MONGO_URL não definida nas variáveis de ambiente");
}

const connectToMongo = async () => {
  // 0 = desconectado, 1 = conectado, 2 = conectando, 3 = desconectando
  if (mongoose.connection.readyState === 1) {
    console.log("🟢 Mongo já conectado");
    return mongoose.connection;
  }
  if (mongoose.connection.readyState === 2) {
    console.log("🟡 Conexão Mongo em andamento");
    return mongoose.connection;
  }

  console.log("🔗 Conectando ao Mongo em:", MONGO_URL);
  const conn = await mongoose.connect(MONGO_URL);
  console.log("✅ Mongo conectado");
  return conn;
};

export default connectToMongo;
