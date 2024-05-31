// http://localhost:3000/api/revalidate-app-router?path=/&secret=db95191ac6c1e13bad9529ed94d19973

import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");

  if (secret !== process.env.MY_SECRET_TOKEN_HEX) {
    return NextResponse.json({ message: "invalid token" }, { status: 401 });
  }

  const path = searchParams.get("path") as string;
  try {
    revalidatePath(path); // Revalidate the path
    return NextResponse.json({ revalidated: true });
  } catch (err) {
    return NextResponse.json(
      { message: "Error revalidating" },
      { status: 500 },
    );
  }
}

// OR

/* 

// http://localhost:3000/api/revalidate-app-router?path=/&secret=db95191ac6c1e13bad9529ed94d19973

import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");

  if (secret !== process.env.MY_SECRET_TOKEN_HEX) {
    return new Response(JSON.stringify({ message: "invalid token" }), { status: 401 });
  }

  const path = searchParams.get("path") as string;
  try {
    revalidatePath(path); // Revalidate the path without await
    return new Response(JSON.stringify({ revalidated: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ message: "Error revalidating" }), { status: 500 });
  }
}


*/
