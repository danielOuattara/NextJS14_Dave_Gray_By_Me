import Link from "next/link";

type Props = {
  promise: Promise<User[]>;
};

export default async function UsersList({ promise }: Props) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
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
