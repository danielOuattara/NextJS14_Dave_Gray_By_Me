//----------------------------------------------------------------

/* Static Route Handler : No request object*/

// export async function GET() {
//   return new Response("Hello Next.js ! ");
// }

//----------------------------------------------------------------

/* Dynamically evaluated route because of request Object */

// export async function GET(request: Request) {
//   return new Response("Hello Next.js !");
// }

//----------------------------------------------------------------

/* This is no more necessary, TypesScript issue has been resolved */

// import { NextResponse } from "next/server";
// export async function GET() {
//   return NextResponse.json({ message: "Hello Next.js ! " });
// }

//----------------------------------------------------------------

/* Below is simpler if using TypesCript 5.2+ */

// export async function GET() {
//   return Response.json({ message: "Hello Next.js ! " });
// }

//----------------------------------------------------------------

// export async function GET(request: Request) {
//   console.log("request = ", request);
//   return Response.json({ message: "Hello Next.js ! " });
// }

//----------------------------------------------------------------

import { NextRequest } from "next/server";
export async function GET(request: NextRequest) {
  console.log("request = ", request);
  return Response.json({ message: "Hello Next.js ! " });
}

//----------------------------------------------------------------
