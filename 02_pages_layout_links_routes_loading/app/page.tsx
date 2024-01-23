import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <main className={styles.main}>
      <h1>Hello world Next.js 14 !</h1>
      <Link href={"/about"}>to about page</Link>
    </main>
  );
}
