import Link from "next/link";

export default function NotFound() {
  return (
    <section className="min-h-screen bg-slate-200 flex flex-col justify-center items-center ">
      <h1 className="text-3xl m-12"> The requested user does not exists</h1>
      <p className="border rounded p-2 border-slate-700">
        <Link href={"/users"}> &#8592;&nbsp; go back to users page</Link>
      </p>
    </section>
  );
}
