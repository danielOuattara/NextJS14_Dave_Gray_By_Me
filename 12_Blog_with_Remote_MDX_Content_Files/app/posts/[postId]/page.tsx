import { notFound } from "next/navigation";
import Link from "next/link";
import { getFormattedDate, getPostByName, getSortedAllPostsMeta } from "@/libs";

export const revalidate = 0;
//---
type Props = {
  params: {
    postId: string;
  };
};

//--------------------------------------------------------------
// this function SSR to SSG for all request for each blog
// export async function generateStaticParams() {
//   const posts = await getSortedAllPostsMeta();

//   if (!posts) {
//     return [];
//   }

//   return posts.map((post) => ({
//     postId: post.id,
//   }));
// }

//--------------------------------------------------------------
export async function generateMetadata({ params }: Props) {
  const post = await getPostByName(`${params.postId}.mdx`);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: post.meta.title,
    // description: post.description,
  };
}

//--------------------------------------------------------------
export default async function Post({ params }: Props) {
  // check post exist !
  const post = await getPostByName(`${params.postId}.mdx`);

  if (!post) {
    notFound();
  }

  // get post data & render it
  const { meta, content } = post;

  const publicationDate = getFormattedDate(meta.date);
  const tags = meta.tags.map((tag, index) => (
    <Link key={index} href={`/tags/${tag}`}>
      {tag}
    </Link>
  ));

  return (
    <>
      <h2 className="text-3xl mt-4 mb-0">{meta.tile}</h2>
      <p className="mt-0 text-sm">{publicationDate}</p>
      <article>{content}</article>
      <section>
        <h3>Related: </h3>
        <div className="flex flex-row gap-4">{tags}</div>
      </section>
      <p className="mb-10">
        <Link href={"/"}>← Back to home</Link>
      </p>
    </>
  );
}
