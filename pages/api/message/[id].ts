import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "ID tidak valid" });
  }

  try {
    const client = await clientPromise;
    const db = client.db("tempmail");

    const message = await db.collection("emails").findOne({ _id: new ObjectId(id) });

    if (!message) return res.status(404).json({ error: "Pesan tidak ditemukan" });

    res.json({
      from: message.from,
      subject: message.subject,
      text: message.body || "",
      createdAt: message.timestamp || Date.now(),
    });
  } catch (err) {
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
}
