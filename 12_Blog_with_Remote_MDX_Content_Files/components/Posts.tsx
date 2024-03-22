import { getSortedAllPostsMeta } from "@/libs";
import ListItem from "./ListItem";

export default function Posts() {
  const posts = getSortedAllPostsMeta();

  return (
    <section className="mt-6 mx-auto max-w-2xl">
      <h2 className="text-4xl font-bold dark:text-white/90">Blogs List</h2>
      <ul className="w-full">
        {posts.map((post) => (
          <ListItem key={post.id} post={post} />
        ))}
      </ul>
    </section>
  );
}
