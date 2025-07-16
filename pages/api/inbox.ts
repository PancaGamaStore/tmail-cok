import { MongoClient } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

interface Message {
  _id: string;
  from: string;
  subject: string;
  body: string;
  timestamp: number;
}

type ResponseData = {
  messages?: Message[];
  error?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email } = req.query;

  if (!email || typeof email !== "string") {
    return res.status(400).json({ error: "Email is required" });
  }

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    return res.status(500).json({ error: "MongoDB URI not configured" });
  }

  const client = new MongoClient(mongoUri);

  try {
    await client.connect();
    const db = client.db("tempmail");
    const emailsCol = db.collection("emails");

    const rawData = await emailsCol
      .find({ to: email.toLowerCase() })
      .sort({ timestamp: -1 })
      .toArray();

    const messages: Message[] = rawData.map((doc) => ({
      _id: doc._id.toString(),
      from: typeof doc.from === "string" && doc.from ? doc.from : "Unknown Sender",
      subject: typeof doc.subject === "string" && doc.subject ? doc.subject : "No Subject",
      body: typeof doc.body === "string" && doc.body ? doc.body : "No Content",
      timestamp: typeof doc.timestamp === "number" && doc.timestamp ? doc.timestamp : Date.now() / 1000,
    }));

    return res.status(200).json({ messages });
  } catch (err: any) {
    console.error("MongoDB error:", err);
    return res.status(500).json({ error: "Failed to fetch inbox" });
  } finally {
    await client.close();
  }
}
