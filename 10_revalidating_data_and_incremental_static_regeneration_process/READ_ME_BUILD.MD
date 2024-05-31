# Revalidate with Next.js | On-Demand Revalidation in Nextjs 14

##  (00:30) Starter Code & Lesson Plan

- revalidate data with Next.js & ISR (incremental static regeneration)
- how to do it with and without the `fetch` api ?

##  (01:38) Application Overview

- inside the main `page.tsx` the `/components/Posts.tsx` component is
- here the posts have to be revalidated
  
- there, is `const posts = getSortedAllPostsFrontMatter();` with no `async`

- there is no `fetch()` there, but we can still revalidate with/without `fetch()`
- markdown are located in `/blogposts`

##  (03:40) Two Types of Revalidation

**Revalidation is the process of purging the `Data Cache` and re-fetching the latest data.**

This is useful when your data changes and you want
to ensure you show the latest information.

Cached data can be revalidated in two ways:

1. **Time-based revalidation:** Automatically revalidate data after a certain
   amount of time has passed. This is useful for data that changes
   infrequently and where freshness is not as critical.

2. **On-demand revalidation:** Manually revalidate data based on an event
   (e.g. form submission). On-demand revalidation can use a `tag-based` or
   `path-based` approach to revalidate groups of data at once. This is
   useful when you want to ensure the latest data is shown as soon as
   possible (e.g. when content from your headless CMS is updated).

##  (04:54) Route Segment Config Options

- docs

##  (05:45) dynamicParams config option

- docs

##  (06:03) revalidate config option

- docs

##  (06:36) Setting the route segment config option

```tsx
import Posts from "./components/Posts";

export const revalidate = 10; // 10 seconds

export default function Home() {
  return (
    <main className="px-6 mx-auto">
      <p className="mt-12 mb-12 text-3xl text-center dark:text-white">
        Hello and welcome ! &nbsp;
        <span className="whitespace-nowrap">
          I am <span className="font-bold">Daniel</span>
        </span>
      </p>
      <Posts />
    </main>
  );
}
```

##  (07:32) Build App & Try Revalidating

- then start a build to test this: `npm run build && npm run start`

- note  `/` page is `Static` and `/posts` page uses `SSG`

- then add a new blog in the `/blogposts`

- refresh the page to see the Data Cache revalidation

##  (10:50) How Background Revalidation & ISR works

- after adding the new blog post, it doesn't appear right away
   after page refresh or one page navigation then the revalidation process start
   and last the time specified in `export revalidate = 10;`

- while it is revalidating, the old data are still served
  
- after that any request (reload, or page change) let appear the updated Data Cache

- remember that revalidate on `fetch()` `**override**`any `export revalidate = number;`

##  (13:19) On-Demand Revalidation

- docs: (<https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating#on-demand-revalidation>)

- docs: (<https://nextjs.org/docs/app/building-your-application/caching#on-demand-revalidation>)

##  (14:08) Create & Store a Secret Token

- create `.env.local`
- add a similar content where you must keep `MY_SECRET_TOKEN`:

```bash
MY_SECRET_TOKEN=pizza_tomatoes_cheese
MY_SECRET_TOKEN_HEX=db95191ac6c1e13bad9529ed94d19973

```

##  (16:24) Revalidate API Route

- **caution:**solution here is for Next.js v13.3: this may be not still used in V14+

- create `/pages/` at the same level as the `app` directory
- create `/pages/api/revalidate.ts`

##  (17:55) Revalidate Request URL

- update there urls from doc from :
  - this : `https://<your-site.com>/api/revalidate?secret=<token>`
  - to :  `<http://localhost:3000/api/revalidate?path=/&secret=db95191ac6c1e13bad9529ed94d19973`>`

##  (19:51) Revalidate Request Handler

- content for `/pages/api/revalidate.ts` Rest API revalidation

```ts
// http://localhost:3000/api/revalidate?path=/&secret=db95191ac6c1e13bad9529ed94d19973

import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.query.secret !== process.env.MY_SECRET_TOKEN_HEX) {
    return res.status(401).json({ message: "invalid token" });
  }

  const path = req.query.path as string;
  await res.revalidate(path);
  return res.json({ revalidate: true });
}
```

- content for `/app/api/revalidate-app-router/route.ts` Route Handler revalidation
  
```ts
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
```

OR

```ts

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
```

- content for `/app/api/revalidate-server-actions/routes.ts`
  
```ts
//localhost:3000/api/revalidate-server-actions?path=/&secret=db95191ac6c1e13bad9529ed94d19973
http: import { revalidatePath } from "next/cache";

export default async function handler(req, res) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");

  if (secret !== process.env.MY_SECRET_TOKEN_HEX) {
    return res.json({ message: "invalid token" }, { status: 401 });
  }

  const path = searchParams.get("path") as string;
  try {
    revalidatePath(path, "page"); // Revalidate the path
    return res.json({ revalidated: true });
  } catch (err) {
    return res.json({ message: "Error revalidating" }, { status: 500 });
  }
}

```

OR

```ts
//localhost:3000/api/revalidate-server-actions?path=/&secret=db95191ac6c1e13bad9529ed94d19973

import { IncomingMessage, ServerResponse } from "http";
import { revalidatePath } from "next/cache";

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
) {
  const { searchParams } = new URL(req.url || "", "<http://localhost>");
  const secret = searchParams.get("secret");

  if (secret !== process.env.MY_SECRET_TOKEN_HEX) {
    return res.end(JSON.stringify({ message: "invalid token" }));
  }

  const path = searchParams.get("path") as string;
  try {
    revalidatePath(path, "page"); // Revalidate the path
    return res.end(JSON.stringify({ revalidated: true }));
  } catch (err) {
    return res.end(JSON.stringify({ message: "Error revalidating" }));
  }
}
```

##  (24:26) Trying out On-Demand Revalidation

- run a build version of the project :`npm run build && npm run start`
  
- a request for data revalidation will be made using this URL
  `http://localhost:3000/api/revalidate?path=/&secret=db95191ac6c1e13bad9529ed94d19973`

- drag the `new.md` test blog post to the `/blogposts` folder
  
- test a GET request with the above url using browser ,Thunder Client, Postman, etc...
  
- confirm network response
  
- back to project and refresh the page to see the data revalidation

##  (27:10) Blog Workflow & Wrap-up

- so add a new blog
- then send the revalidation request with re run a build
