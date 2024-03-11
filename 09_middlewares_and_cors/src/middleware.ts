// import { NextRequest, NextResponse } from "next/server";

// export function middleware(request: Request) {
//   console.log("Middleware !");
//   console.log(request.method);
//   console.log(request.url);
//   const origin = request.headers.get("origin");
//   console.log("origin = ", origin);
//   console.log("---------------------------------");

//   return NextResponse.next();
// }

//--------------------------------------------------------------------------

/*  applying our middleware matcher: version 1 */

// import { NextRequest, NextResponse } from "next/server";

// export const config = {
//   matcher: ["/api/:path*"],
// };

// export function middleware(request: Request) {
//   console.log("Middleware !");
//   console.log(request.method);
//   console.log(request.url);
//   const origin = request.headers.get("origin");
//   console.log("origin = ", origin);
//   console.log("---------------------------------");

//   return NextResponse.next();
// }

//-------------------------------------------------------------------------

// /* matcher request URL : version 2 */

// import { NextRequest, NextResponse } from "next/server";

// export function middleware(request: Request) {
//   if (request.url.includes("/api/")) {
//     console.log("conditional middleware call 1 OK");
//     console.log("In Middleware ");
//     console.log(request.method);
//     console.log(request.url);
//     const origin = request.headers.get("origin");
//     console.log("origin = ", origin);
//     console.log("---------------------------------");
//   }

//   return NextResponse.next();
// }

//-------------------------------------------------------------------------

// /* matcher request URL : version 3 */
// import { NextRequest, NextResponse } from "next/server";

// export function middleware(request: Request) {
//   const regex = new RegExp("/api/*");
//   if (regex.test(request.url)) {
//     console.log("conditional middleware call 2 OK");
//     console.log("In Middleware ");
//     console.log(request.method)
//     console.log(request.url)
//     const origin = request.headers.get("origin");
//     console.log("origin = ", origin);
//     console.log("---------------------------------");
//   }

//   return NextResponse.next();
// }

//--------------------------------------------------------------------------
import { NextRequest, NextResponse } from "next/server";

// applying our middleware matcher
export const config = {
  matcher: "/api/:path*",
};

const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? ["https://www.yoursite.com", "http://www.yoursite.com"]
    : [
        "http://localhost:3000",
        "https://www.google.com",
        "https://duckduckgo.com/",
      ];

export function middleware(request: Request) {
  const origin = request.headers.get("origin");
  console.log("origin = ", origin);

  if (/* !origin ||  */ origin && !allowedOrigins.includes(origin)) {
    return new NextResponse(null, {
      status: 400,
      statusText: "Bad request",
      headers: {
        "Content-Type": "text/plain",
      },
    });
  }

  // setTimeout(() => {
  //   return NextResponse.next();
  // }, 3000);

  return NextResponse.next();
}
