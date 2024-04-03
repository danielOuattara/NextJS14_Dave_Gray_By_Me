import { compileMDX } from "next-mdx-remote/rsc";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import Video from "@/components/Video";

export default async function getPostByName(
  fileName: string,
): Promise<TypeBlogPost | undefined> {
  const res = await fetch(
    `${process.env.GITHUB_FETCH_SINGLE_URL}/${fileName}`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
    },
  );

  if (!res.ok) {
    // console.log(res.statusText);
    return undefined;
  }

  const rawMDX = await res.text();

  if (rawMDX === "404: Not Found") {
    return undefined;
  }

  // console.log("rawMDX = ", rawMDX);
  // console.log("---------------------------------");

  const { frontmatter, content } = await compileMDX<TypeMetadata>({
    source: rawMDX,
    components: {
      Video,
    },
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        rehypePlugins: [
          rehypeHighlight,
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: "wrap" }],
        ],
      },
    },
  });

  const id = fileName.replace(/\.mdx$/, "");

  const blogPostObj: TypeBlogPost = {
    meta: {
      id,
      slug: frontmatter.slug,
      title: frontmatter.title,
      date: frontmatter.date,
      tags: frontmatter.tags,
      description: frontmatter.description,
    },
    content,
  };

  // console.log("blogPostObj = ", blogPostObj);
  return blogPostObj;
}
