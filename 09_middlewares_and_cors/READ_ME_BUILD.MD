# Next.js Middleware & Cors | Nextjs 14

##  (00:27) Starter Code

- complete code from the last n°8

##  (01:00) Quick follow-up on last lesson

- `/src/app/api/todos/[todoId]/route.ts`

```ts

type Props = {
  params: {
    todoId: string;
  };
};

export async function GET(request: Request, { params }: Props) {
  const response = await fetch(`${DATA_SOURCE_URL}/${params.todoId}`);
  const todo: TypeTodo = await response.json();
  if (!todo.userId) {
    return Response.json({
      message: `Not to found with todoId : ${params.todoId}`,
    });
  }

  return Response.json(todo);
}
```

##  (03:02) Next.js Middleware

- `https://nextjs.org/docs/app/building-your-application/routing/middleware`

##  (04:47) Middleware file

- `/src/middleware.ts`

```ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: Request) {
  console.log("Middleware !");
  console.log(request.method);
  console.log(request.url);
  const origin = request.headers.get("origin");
  console.log("origin = ", origin);
  console.log("---------------------------------");

  return NextResponse.next();
}

```

##  (07:17) Matching paths

- `https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher`

```ts
/*  applying our middleware matcher: version 1 */

 import { NextRequest, NextResponse } from "next/server";

 export const config = {
   matcher: ["/api/:path*"],
 };

 export function middleware(request: Request) {
   console.log("Middleware !");
   console.log(request.method);
   console.log(request.url);
   const origin = request.headers.get("origin");
   console.log("origin = ", origin);
   console.log("---------------------------------");

   return NextResponse.next();
 }

```

```ts
 /* matcher request URL : version 3 */
 import { NextRequest, NextResponse } from "next/server";

 export function middleware(request: Request) {
   const regex = new RegExp("/api/*");
   if (regex.test(request.url)) {
     console.log("conditional middleware call 2 OK");
     console.log("In Middleware ");
     console.log(request.method)
     console.log(request.url)
     const origin = request.headers.get("origin");
     console.log("origin = ", origin);
     console.log("---------------------------------");
   }

   return NextResponse.next();
 }
```

##  (11:20) Matching with conditionals

```ts
 /* matcher request URL : version 2 */

 import { NextRequest, NextResponse } from "next/server";

 export function middleware(request: Request) {
   if (request.url.includes("/api/")) {
     console.log("conditional middleware call 1 OK");
     console.log("In Middleware ");
     console.log(request.method);
     console.log(request.url);
     const origin = request.headers.get("origin");
     console.log("origin = ", origin);
     console.log("---------------------------------");
   }

   return NextResponse.next();
 }
```

##  (13:10) Rate limiting middleware

- `https://www.npmjs.com/package/limiter`

- `npm i limiter`
  
- create `/src/app/api/config/limiter.ts`
  
```ts
import { RateLimiter } from "limiter";

export const limiter = new RateLimiter({
  tokensPerInterval: 3,
  interval: "sec",
  fireImmediately: true,
});
```

- go to `/src/app/api/hello/route.ts` and update the content as follow:

```ts
import { NextResponse } from "next/server";
import { limiter } from "../config/limiter";

export async function GET(request: Request) {
  const origin = request.headers.get("origin");
  console.log("origin = ", origin);

  const remaining = await limiter.removeTokens(1);
  console.log("remaining = ", remaining);

  if (remaining < 0) {
    return new NextResponse(null, {
      status: 429,
      statusText: "Too many request, Try again latter",
      headers: {
        "Access-Control-Allow-Origin": origin || "*",
        "Content-Type": "text/plain",
      },
    });
  }

  return new Response("Hello Next.js !");
}
```

- create specific limiter for specific route to have a granular control on that route

##  (21:33) Cors & Next.js 13

- `https://www.npmjs.com/package/cors`

- `npm i cors`
- The default configuration is the equivalent of:

    ```ts
    {
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
    }
    ```

- `https://nextjs.org/docs/app/building-your-application/routing/route-handlers#cors`

##  (25:41) Applying Cors middleware features

```ts
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
```

- updated for CORS `/src/app/api/todos/[todoId]/route.ts`

```ts
 // before
export async function GET() {
    const secret = process.env.DATA_API_KEY;
    const res = await fetch(DATA_SOURCE_URL)
    const todos: TypeTodo[] = await res.json()
    return Response.json({ todos })
}
```

```ts
// after
export async function GET(request: Request) {
  const secret = process.env.DATA_API_KEY;
  const origin = request.headers.get("origin");

const res = await fetch(DATA_SOURCE_URL);
  const todos: TypeTodo[] = await res.json();

  return new NextResponse(JSON.stringify(todos), {
    headers: {
      "Access-Control-Allow-Origin": origin || "*",
      "Content-Type": "application/json",
    },
  });
}
```

##  (37:01) Wrap up
