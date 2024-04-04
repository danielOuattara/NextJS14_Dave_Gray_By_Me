import { notFound } from "next/navigation";
import Link from "next/link";
import { getFormattedDate, getPostByName } from "@/libs";
import "highlight.js/styles/github-dark.css";
import getSortedAllPostsMeta from "@/libs/getSortedAllPostsMetadata";

export const revalidate = 10;
//--------------------
/**
 * This function SSR to SSG for all request for each blog.
 * This function is commented because of `export const revalidate = 0;`
 */

export async function generateStaticParams() {
  const posts = await getSortedAllPostsMeta();

  if (!posts) {
    return [];
  }

  return posts.map((post) => ({
    postId: post.id,
  }));
}

//-----

export async function generateMetadata({ params }: TypeGenerateMetadataProps) {
  const post = await getPostByName(`${params.postId}.mdx`);
  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: post.meta.title,
    description: post.meta.description,
  };
}

//-----

export default async function Post({ params }: TypeGenerateMetadataProps) {
  const post = await getPostByName(`${params.postId}.mdx`);
  if (!post) notFound();

  return (
    <>
      <h2 className="text-3xl mt-4 mb-0">{post.meta.title}</h2>
      <p className="mt-0 text-sm">{getFormattedDate(post.meta.date)}</p>
      <article>{post.content}</article>
      <section>
        <h3>Related: </h3>
        <div className="flex flex-row gap-4">
          {post.meta.tags.map((tag, index) => (
            <Link key={index} href={`/tags/${tag}`}>
              {tag}
            </Link>
          ))}
        </div>
      </section>
      <p className="mb-10">
        <Link href={"/"}>← Back to home</Link>
      </p>
    </>
  );
}
