// https://<your-site.com>/api/revalidate?secret=<token>

// http://localhost:3000/api/revalidate?path=/&secret=db95191ac6c1e13bad9529ed94d19973

import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.query.secret !== process.env.MY_SECRET_TOKEN_HEX) {
    return res.status(401).json({ message: "invalid token" });
  }

  const path = req.query.path as string;
  await res.revalidate(path);
  return res.json({ revalidate: true });
}

//-------------------------------------------------------------------------

// import { NextApiRequest, NextApiResponse } from "next";
// import { revalidatePath } from "next/cache";

// export default function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.query.secret !== process.env.MY_SECRET_TOKEN_HEX) {
//     return res.status(401).json({ message: "invalid token" });
//   }

//   revalidatePath("/", "page"); // Revalidate the root path
//   return res.json("OK");
// }

//---------------------------------------------------------------------------

// http://localhost:3000/api/revalidate?tag=my_cache_tag&secret=db95191ac6c1e13bad9529ed94d19973

// import { NextApiRequest, NextApiResponse } from "next";
// import { revalidateTag } from "next/cache";

// export default function handler(req: NextApiRequest, res: NextApiResponse) {
//   try {
//     if (req.query.secret !== process.env.MY_SECRET_TOKEN_HEX) {
//       return res.status(401).json({ message: "invalid token" });
//     }

//     // Assuming your data is associated with a specific cache tag
//     const tag = req.query.tag as string; // Assuming the tag is provided as a query parameter
//     if (!tag) {
//       return res.status(400).json({ message: "Tag parameter is missing" });
//     }

//     revalidateTag(tag);
//     return res.json("OK");
//   } catch (error: any) {
//     console.log(error.message as string);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// }
