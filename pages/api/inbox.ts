import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email } = req.query;

  if (!email || typeof email !== "string") {
    return res.status(400).json({ error: "Email diperlukan" });
  }

  try {
    const client = await clientPromise;
    const db = client.db("tempmail");

    const messages = await db
      .collection("emails")
      .find({ to: email })
      .sort({ timestamp: -1 })
      .toArray();

    const response = messages.map((msg) => ({
      id: msg._id,
      from: msg.from,
      subject: msg.subject,
      preview: msg.body?.slice(0, 100) || "(Tidak ada isi)",
      createdAt: msg.timestamp || Date.now(),
    }));

    res.json(response);
  } catch (err) {
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
}
