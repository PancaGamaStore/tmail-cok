// pages/api/test-db.ts
import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = await clientPromise;
    const db = client.db("tempmail");

    const collections = await db.listCollections().toArray();

    res.status(200).json({
      success: true,
      message: "✅ Berhasil terkoneksi ke MongoDB",
      collections: collections.map((c) => c.name),
    });
  } catch (error: any) {
    console.error("❌ Gagal konek MongoDB:", error.message);
    res.status(500).json({
      success: false,
      message: "❌ Gagal terkoneksi ke MongoDB",
      error: error.message,
    });
  }
}
