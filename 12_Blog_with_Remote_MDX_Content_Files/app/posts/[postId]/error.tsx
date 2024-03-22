"use client"; // Error components must be Client Components

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <main className="bg-slate-200 mx-auto max-w-lg py-1 px-4">
      <h2 className="my-4 text-2xl font-bold">Something went wrong!</h2>

      <button
        className="my-4 p-4 bg-red-500 text-white rounded-xl "
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </button>
      <p className="text-xl">
        <Link href={"/"}>← Back to home</Link>{" "}
      </p>
    </main>
  );
}
