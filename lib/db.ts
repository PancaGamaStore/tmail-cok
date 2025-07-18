import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;
const options = {};

if (!uri) {
  throw new Error("❌ MONGODB_URI tidak ditemukan di environment.");
}

// Gunakan cache di development agar tidak membuat koneksi ulang
let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  // Untuk cache di Next.js (khusus dev mode)
  // @ts-ignore
  var _mongoClientPromise: Promise<MongoClient>;
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
