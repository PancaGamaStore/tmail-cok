import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  const client = await clientPromise;
  const db = client.db("tempmail");
  const message = await db.collection("emails").findOne({ _id: new ObjectId(id as string) });

  if (!message) return res.status(404).json({ error: "Pesan tidak ditemukan" });

  res.json({
    from: message.from,
    subject: message.subject,
    text: message.text,
    html: message.html,
    createdAt: message.createdAt,
  });
}
