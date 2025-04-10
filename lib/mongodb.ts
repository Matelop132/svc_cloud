import { MongoClient, Db } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = { appName: "devrel.template.nextjs" };

let client: MongoClient;
let db: Db;

if (process.env.NODE_ENV === "development") {
  let globalWithMongo = global as typeof globalThis & {
    _mongoClient?: MongoClient;
    _mongoDb?: Db;
  };

  if (!globalWithMongo._mongoClient) {
    globalWithMongo._mongoClient = new MongoClient(uri, options);
    globalWithMongo._mongoDb = globalWithMongo._mongoClient.db(); // Ajoute cette ligne
  }

  client = globalWithMongo._mongoClient;
  db = globalWithMongo._mongoDb!;
} else {
  client = new MongoClient(uri, options);
  db = client.db(); // Ajoute cette ligne
}

export { client, db }; // Exporte `db`
