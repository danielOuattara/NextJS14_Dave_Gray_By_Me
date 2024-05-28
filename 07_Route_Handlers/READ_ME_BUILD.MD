
# Next.js 13 Route Handlers | API Routes in Nextjs

##  (00:28) Note on src directory

- create a new  project
- `npx create-next-app  07-route-handlers`
- use the `src/` directory if you want to
- a new typescript project + Tailwind CSS

##  (01:23) New Route Handlers for API Routes

- doc : (<https://nextjs.org/docs/app/building-your-application/routing/route-handlers>)
  
![route](https://nextjs.org/_next/image?url=%2Fdocs%2Flight%2Froute-special-file.png&w=1920&q=75)

```text
Good to know: 
-------------

Route Handlers are only available inside the app directory. 

They are the equivalent of API Routes inside the pages 
directory meaning you do not need to use API Routes and 
Route Handlers together.
```

```bash
./07_Route_Handlers/
├── next.config.mjs
├── next-env.d.ts
├── package.json
├── package-lock.json
├── postcss.config.js
├── public
│   ├── next.svg
│   └── vercel.svg
├── READ_ME_BUILD.MD
├── README.md
├── src
│   └── app
│       ├── api
│       │   ├── echo
│       │   │   └── route.ts
│       │   ├── feedback
│       │   │   └── route.ts
│       │   ├── hello
│       │   │   └── route.ts
│       │   ├── posts
│       │   │   └── route.ts
│       │   └── route.ts
│       ├── favicon.ico
│       ├── feedback
│       │   └── page.tsx
│       ├── globals.css
│       ├── layout.tsx
│       ├── page.tsx
│       └── thank-you
│           └── page.tsx
├── tailwind.config.ts
└── tsconfig.json
```

##  (02:51) Example API endpoint

- look inside `07_Route_Handlers/src/app/api/hello/route.ts`
  
- use `Thunder Client` to test route
  
- get on `http://localhost:3000/api/hello`

##  (06:06) NextResponse

- static route handler

```ts
export async function GET() {
  return new Response("Hello Next.js ! ");
}
```

- Dynamically evaluated route because of `request` Object

- The following is no more necessary, `TypesScript issue` has been resolved

```ts
import { NextResponse } from "next/server";
export async function GET() {
  return NextResponse.json({ message: "Hello Next.js ! " });
}
```

##  (07:59) GET Params & echo endpoint

- work in `07_Route_Handlers/src/app/api/echo/route.ts`

```ts
//
export async function GET(request: Request, response: Response) {
  // console.log("-------------------------------------- 1");
  // console.log("request = ", request);

  console.log("----------------------------------------- 2");
  console.log("new URL(request.url) = ", new URL(request.url));

  console.log("---------------------------------------- 3");
  console.log(
    "new URLSearchParams(request.url) = ",
    new URLSearchParams(request.url),
  );
  console.log("---------------------------------------- 4");

  /*---------one way of getting params -------------*/

  const { searchParams } = new URL(request.url);
  console.log("searchParams = ", searchParams);

  const name = searchParams.get("name");
  console.log("name = ", name);

  const country = searchParams.get("country");
  console.log("country = ", country);

  console.log("----------------------------------------");
  /*--------  another efficient way of getting params ------*/

  console.log("searchParams.entries() = ", searchParams.entries());

  const obj = Object.fromEntries(searchParams.entries());
  console.log("obj = ", obj);

  return Response.json(obj);
}
```

- test in `Thunder Client`

- run `http://localhost:3000/api/echo?name=John Doe&instrument=guitar`

##  (13:30) Dynamically Evaluated Routes

- Route handler are evaluated dynamically when using :
  - the Request object with the GET method.
  - any of the other HTTP methods.
  - Dynamic Functions like cookies and headers.
  - any other request method (POST, PUT, ...)

##  (14:30) POST Route Handler for a Form

- frontend page in `07_Route_Handlers/src/app/feedback/page.tsx`

- and on  `07_Route_Handlers/src/app/thank-you/page.tsx`

- api route on `07_Route_Handlers/src/app/api/feedback/route.ts`

- start the sever: `npm run dev`
  
- go to `http://127.0.0.1:3000/feedback`
