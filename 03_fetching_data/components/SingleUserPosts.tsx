// type TypeProps = {
//   posts: Post[];
// };

// export default async function SingleUserPost({ posts }: TypeProps) {
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

type TypeProps = {
  promise: Promise<Post[]>;
};
export default async function SingleUserPosts({ promise }: TypeProps) {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const posts = await promise;
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>
          <article>
            <h3 className="text-xl underline"> Title:&nbsp;{post.title}</h3>
            <p className="">{post.body}</p>
          </article>
        </li>
      ))}
    </ul>
  );
}
