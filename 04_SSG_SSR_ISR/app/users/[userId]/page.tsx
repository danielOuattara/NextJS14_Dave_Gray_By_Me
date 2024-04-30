import { getAllUsers, getSingleUser, getSingleUserAllPosts } from "@/libs";
import Link from "next/link";
import { SingleUserPosts } from "@/components";
import { Suspense } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params: { userId },
}: Params): Promise<Metadata> {
  const user = await getSingleUser(userId);
  return {
    title: `${user?.name} Page` || `User not found`,
    description:
      `This is the page of ${user?.name}` || `The user fetched is not found `,
  };
}

//-----------------------

export default async function SingleUserPage({ params: { userId } }: Params) {
  const userData = getSingleUser(userId);
  const postsData = getSingleUserAllPosts(userId);
  const user = await userData;

  if (!user) {
    notFound();
  }

  return (
    <section className="m-6 ">
      <h1 className="text-2xl font-semibold">All posts for {user.name} </h1>
      <h2>
        Author: {user.name} {user.username}
      </h2>

      <Link href={"/users"}>&#8592;&nbsp; Go back</Link>

      <br />
      <Suspense fallback={<h2>Loading posts data...</h2>}>
        <SingleUserPosts promise={postsData} />
      </Suspense>
    </section>
  );
}

//---------------------------------------

export async function generateStaticParams() {
  const users: User[] = await getAllUsers();
  return users.map((user) => ({ userId: user.id.toString() }));
}
