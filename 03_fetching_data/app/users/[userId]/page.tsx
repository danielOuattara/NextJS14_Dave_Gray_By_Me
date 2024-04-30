// import { getSingleUser, getSingleUserAllPosts } from "@/libs";
// import Link from "next/link";
// import { SingleUserPosts } from "./components";
// import { Metadata } from "next";

// export async function generateMetadata({
//   params: { userId },
// }: Params): Promise<Metadata> {
//   const userData = getSingleUser(userId);
//   const user: User = await userData;

//   return {
//     title: `${user.name} Page`,
//     description: `This is the page of ${user.name}`,
//   };
// }

// // -----------------------

// export default async function SingleUserPage({ params: { userId } }: Params) {
//   const userData = getSingleUser(userId);
//   const postsData = getSingleUserAllPosts(userId);
//   const [user, posts] = await Promise.all([userData, postsData]);

//   return (
//     <>
//       <h1>Single User all posts </h1>
//       <Link href={"/users"}>Go back</Link>
//       <h2>
//         Author: {user.name} {user.username}
//       </h2>
//       <br />
//       <SingleUserPosts posts={posts} />
//     </>
//   );
// }

/* ------------------------------------------------------------------  OR */

import { getSingleUser, getSingleUserAllPosts } from "@/libs";
import Link from "next/link";
import { SingleUserPosts } from "@/components";
import { Suspense } from "react";
import { Metadata } from "next";

export async function generateMetadata({
  params: { userId },
}: Params): Promise<Metadata> {
  const user = await getSingleUser(userId);
  return {
    title: `${user.name} Page`,
    description: `This is the page of ${user.name}`,
  };
}

//-----------------------

export default async function SingleUserPage({ params: { userId } }: Params) {
  const userData = getSingleUser(userId);
  const postsData = getSingleUserAllPosts(userId);
  const user = await userData;

  return (
    <>
      <h1>Single User all posts </h1>

      <Link href={"/users"}>Go back</Link>
      <h2>
        Author: {user.name} {user.username}
      </h2>

      <br />
      <Suspense fallback={<h2>Loading posts data...</h2>}>
        <SingleUserPosts promise={postsData} />
      </Suspense>
    </>
  );
}
