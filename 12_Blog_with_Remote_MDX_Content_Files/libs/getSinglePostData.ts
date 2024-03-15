import { Metadata } from "next";

type FileTree = {
  tree: [{ path: string }];
};

export async function getPostsMeta(
  id: string,
): Promise<TypeMeta[] | undefined> {
  const res = await fetch(
    "https://github.com/danielOuattara/Mdx_Posts_Source/tree/main?recursive=1",
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
