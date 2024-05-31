//localhost:3000/api/revalidate-server-actions?path=/&secret=db95191ac6c1e13bad9529ed94d19973
// http: import { revalidatePath } from "next/cache";

// export default async function handler(req, res) {
//   const { searchParams } = new URL(req.url);
//   const secret = searchParams.get("secret");

//   if (secret !== process.env.MY_SECRET_TOKEN_HEX) {
//     return res.json({ message: "invalid token" }, { status: 401 });
//   }

//   const path = searchParams.get("path") as string;
//   try {
//     revalidatePath(path, "page"); // Revalidate the path
//     return res.json({ revalidated: true });
//   } catch (err) {
//     return res.json({ message: "Error revalidating" }, { status: 500 });
//   }
// }

// OR

//localhost:3000/api/revalidate-server-actions?path=/&secret=db95191ac6c1e13bad9529ed94d19973

import { IncomingMessage, ServerResponse } from "http";
import { revalidatePath } from "next/cache";

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
) {
  const { searchParams } = new URL(req.url || "", "http://localhost");
  const secret = searchParams.get("secret");

  if (secret !== process.env.MY_SECRET_TOKEN_HEX) {
    return res.end(JSON.stringify({ message: "invalid token" }));
  }

  const path = searchParams.get("path") as string;
  try {
    revalidatePath(path, "page"); // Revalidate the path
    return res.end(JSON.stringify({ revalidated: true }));
  } catch (err) {
    return res.end(JSON.stringify({ message: "Error revalidating" }));
  }
}
