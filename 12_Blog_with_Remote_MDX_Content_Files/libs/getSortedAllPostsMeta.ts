import { getPostByName } from "./index";

export default async function getSortedAllPostsMeta(): Promise<
  TypeMeta[] | undefined
> {
  const res = await fetch(process.env.GITHUB_FETCH_URL as string, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  if (!res.ok) {
    return undefined;
  }

  const repoFileTree: FileTree = await res.json();
  // console.log("repoFileTree = ", repoFileTree);

  const filesNameArray = repoFileTree.tree
    .map((obj) => obj.path)
    .filter((path) => path.endsWith(".mdx"));

  // console.log("filesNameArray = ", filesNameArray);

  const posts: TypeMeta[] = [];

  for (const fileName of filesNameArray) {
    const post = await getPostByName(fileName);
    if (post) {
      posts.push(post.meta);
    }
  }

  // console.log("posts = ", posts);
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}
