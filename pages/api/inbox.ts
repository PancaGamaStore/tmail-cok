import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email } = req.query;

  if (!email || typeof email !== "string") {
    return res.status(400).json({ error: "Email diperlukan" });
  }

  const client = await clientPromise;
  const db = client.db("tempmail");
  const messages = await db
    .collection("emails")
    .find({ email })
    .sort({ createdAt: -1 })
    .toArray();

  const response = messages.map((msg) => ({
    id: msg._id,
    from: msg.from,
    subject: msg.subject,
    preview: msg.preview,
    createdAt: msg.createdAt,
  }));

  res.json(response);
}
