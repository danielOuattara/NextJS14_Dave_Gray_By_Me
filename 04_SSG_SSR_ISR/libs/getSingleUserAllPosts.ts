export default async function getSingleUserAllPosts(
  userId: string,
): Promise<Post[]> {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts?userId=${userId}`,
    {
      // cache: "force-cache", // <-- default
      // cache: "no-store", // <-- means always dynamic
      next: {
        revalidate: 60, // <-- This is ISR !!! Working on SSG, or on SSR component:
      },
    },
  );

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }
  const posts: Promise<Post[]> = res.json();
  return posts;
}
