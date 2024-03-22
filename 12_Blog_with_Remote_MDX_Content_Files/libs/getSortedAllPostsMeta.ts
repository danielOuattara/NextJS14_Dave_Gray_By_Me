import { Metadata } from "next";
import { compileMDX } from "next-mdx-remote/rsc";

type FileTree = {
  tree: [{ path: string }];
};

export async function getPostByName(
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
    console.log(res.statusText);
    return undefined;
  }

  const rawMDX = await res.text();

  if (rawMDX === "404: Not Found") {
    return undefined;
  }

  const { frontmatter, content } = await compileMDX<{
    title: string;
    date: string;
    tags: string[];
  }>({
    source: rawMDX,
  });

  const id = fileName.replace(/\.mdx$/, "");

  const blogPostObj: TypeBlogPost = {
    meta: {
      id,
      title: frontmatter.title,
      date: frontmatter.date,
      tags: frontmatter.tags,
    },
    content,
  };
  return blogPostObj;
}

//---------------------------------------------------------------------------------

export async function getSortedAllPostsMeta(): Promise<TypeMeta[] | undefined> {
  const res = await fetch(process.env.GITHUB_FETCH_URL as string, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
  if (!res.ok) {
    console.log(res.statusText);
    return undefined;
  }

  const repoFileTree: FileTree = await res.json();

  const filesArray = repoFileTree.tree
    .map((obj) => obj.path)
    .filter((path) => path.endsWith(".mdx"));

  const posts: TypeMeta[] = [];

  for (const file of filesArray) {
    const post = await getPostByName(file);
    if (post) {
      posts.push(post.meta);
    }
  }
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}
