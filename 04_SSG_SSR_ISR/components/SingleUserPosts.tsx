// type Props = {
//   posts: Post[];
// };

// export default async function SingleUserPost({ posts }: Props) {
//   return (
//     <ul>
//       {posts.map((post) => (
//         <li key={post.id}>
//           <h3> Title:&nbsp;{post.title}</h3>
//           <p>{post.body}</p>
//         </li>
//       ))}
//     </ul>
//   );
// }

//--------------------------------------------------------------------------

type Props = {
  promise: Promise<Post[]>;
};
export default async function SingleUserPosts({ promise }: Props) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const posts = await promise;
  return (
    <ul className="my-6">
      {posts.map((post) => (
        <li key={post.id} className="my-6">
          <article>
            <h3 className="text-xl underline"> Title:&nbsp;{post.title}</h3>
            <p className="">{post.body}</p>
          </article>
        </li>
      ))}
    </ul>
  );
}
