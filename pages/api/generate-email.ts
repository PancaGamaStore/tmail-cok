import { MongoClient } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import { generateRandomUsername } from "@/lib/generateEmail";

type ResponseData = {
  email?: string;
  error?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { domain } = req.body;

  if (!domain || typeof domain !== "string") {
    return res.status(400).json({ error: "Domain is required" });
  }

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    return res.status(500).json({ error: "MongoDB URI not configured" });
  }

  const client = new MongoClient(mongoUri);

  try {
    await client.connect();
    const db = client.db("tempmail");
    const tempEmailsCol = db.collection("temp_emails");

    const username = generateRandomUsername();
    const email = `${username}@${domain}`;

    await tempEmailsCol.insertOne({
      email,
      createdAt: Date.now() / 1000,
    });

    return res.status(200).json({ email });
  } catch (err: any) {
    console.error("MongoDB error:", err);
    return res.status(500).json({ error: "Failed to generate email" });
  } finally {
    await client.close();
  }
}
