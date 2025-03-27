import { MongoClient } from "mongodb";

const uri = "mongodb://matelop132:4rxxVFfgcHj9BcwW@clusterdatabaseapi-shard-00-00.jhxa9.mongodb.net:27017,clusterdatabaseapi-shard-00-01.jhxa9.mongodb.net:27017,clusterdatabaseapi-shard-00-02.jhxa9.mongodb.net:27017/?replicaSet=atlas-sr4yyt-shard-0&ssl=true&authSource=admin";
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    console.log("✅ Connexion réussie !");
  } catch (error) {
    console.error("❌ Erreur de connexion :", error);
  } finally {
    await client.close();
  }
}

run();