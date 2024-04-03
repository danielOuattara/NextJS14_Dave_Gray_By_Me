import { getSortedAllPostsMetadata } from "@/libs";
import ListItem from "@/components/ListItem";
import Link from "next/link";

// export const revalidate = 21600; // 1/4 day, in production
// export const revalidate = 0; // in dev. mode
//
//----------------------------------------------------

/** For development mode here*/
// export async function generateStaticParams() {
//   const allPostsMetadata = await getSortedAllPostsMetadata();
//   if (!allPostsMetadata) return [];
//   const tags = new Set(allPostsMetadata.map((post) => post.tags).flat());

//   const results = Array.from(tags).map((tag) => ({ tag }));
//   console.log("results = ", results);

//   return results;
// }

// ----------------------------------------------------

export async function generateMetadata({ params }: TypeDynamicTagProps) {
  return {
    title: `Posts about ${params.tag}`,
  };
}

//----------------------------------------------------

export default async function TagPostLists({ params }: TypeDynamicTagProps) {
  const allPostsMetadata = await getSortedAllPostsMetadata();

  if (!allPostsMetadata)
    return <p className="mt-10 text-center"> Sorry, no post tags found</p>;

  // console.log("allPostsMetadata = ", allPostsMetadata);

  const allPostsMetadataWithTag = allPostsMetadata.filter((postMetadata) =>
    postMetadata.tags.includes(params.tag),
  );

  // console.log("allPostsMetadataWithTag = ", allPostsMetadataWithTag);

  if (allPostsMetadataWithTag.length === 0) {
    return (
      <div className="text-center">
        <p className="mt-10">
          Sorry, no allPostsMetadata for that keyword {params.tag}
        </p>
        <Link href={"/"}>Back to Home</Link>
      </div>
    );
  }
  return (
    <>
      <h2 className="text-3xl mt-4 mb-0"> Results for : {params.tag}</h2>
      <section className="mt-6 mx-auto maw-w-2xl">
        <ul className="w-full list-none p-0">
          {allPostsMetadataWithTag.map((post) => (
            <ListItem key={post.id} post={post} />
          ))}
        </ul>
      </section>
    </>
  );
}
