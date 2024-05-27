import Link from "next/link";

type TypeProps = {
  promise: Promise<User[]>;
};

export default async function UsersList({ promise }: TypeProps) {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const users = await promise;
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>
          <Link href={`/users/${user.id}`}>{user.name}</Link>
        </li>
      ))}
    </ul>
  );
}
