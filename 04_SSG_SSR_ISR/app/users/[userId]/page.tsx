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

import { getAllUsers, getSingleUser, getSingleUserAllPosts } from "@/libs";
import Link from "next/link";
import { SingleUserPosts } from "./components";
import { Suspense } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";

//-----------------------

export async function generateMetadata({
  params: { userId },
}: Params): Promise<Metadata> {
  const user = await getSingleUser(userId);
  if (!user) {
    return {
      title: "User Not Found !! ",
    };
  }

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

  if (!user) {
    return notFound();
  }

  return (
    <>
      <h1>Single User all posts </h1>

      <Link href={"/users"}>Go back</Link>
      <h2>
        Author: {user.name} {user.username}
      </h2>

      <br />
      <Suspense fallback={<h2>Loading data here ...</h2>}>
        <SingleUserPosts promise={postsData} />
      </Suspense>
    </>
  );
}

//---------------------------------------

export async function generateStaticParams() {
  const users: User[] = await getAllUsers();
  return users.map((user) => ({ userId: user.id.toString() }));
}
