import Link from "next/link";
import { getFormattedDate } from "@/libs";

type TypeProps = {
  post: TypeBlogPost;
};

export default function ListItem({ post }: TypeProps) {
  return (
    <li className="mt-4 text-2xl dark:text-white/90">
      <Link
        className="underline hover:text-black/70 dark:hover:text-white"
        href={`/posts/${post.id}`}
      >
        {post.title}
      </Link>
      <br />
      <p className="text-sm mt-1">{getFormattedDate(post.date)}</p>
    </li>
  );
}
