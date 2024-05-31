// https://<your-site.com>/api/revalidate?secret=<token>

// http://localhost:3000/api/revalidate?path=/&secret=db95191ac6c1e13bad9529ed94d19973

import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.query.secret !== process.env.MY_SECRET_TOKEN_HEX) {
    return res.status(401).json({ message: "Invalid token" });
  }

  const path = req.query.path as string;
  try {
    await res.revalidate(path);
    return res.json({ revalidated: true });
  } catch (err) {
    return res.status(500).json({ message: "Error revalidating" });
  }
}
