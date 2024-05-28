# How to Build a REST API with Next.js 14

##  (00:25) Next.js New Route Handlers

- previously we learnt the new `Route Handlers in Next.js App Router`

- Route Handlers help build API Routes

- Here we'll build  a REST API with Next.js 14+

##  (00:43) When to use API Routes for your app & when not to

- read this doc: `https://nextjs.org/docs/pages/building-your-application/routing/api-routes`

- No need to use REST API if fetching from a `Server Component`

- Do not use REST API if data are generated on build-time

- Good to know: If you are using the `App Router`, you can use `Server Components` or
  `Route Handlers` instead of API Routes.

- If no security issue (secret key, secret resources url, etc,...)
  you can fetch directly on client

##  (02:24) Create a new project & Next 14+

- `npx create-next-app@latest 08-build-rest-api`

- `Yes` to all, except the last

##  (05:15) Environment variables & API keys

- create `/.env.local`
  
- add content `DATA_API_KEY=My_super_SecretCode`
  
- double check that `.env.local` is declare into the `.gitignore`

##  (07:51) GET route handler

- create `/src/app/api/todos/route.ts`

- create  `/src/type.d.ts`
  
```ts
type TypeTodo = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};
```

```ts
// The following syntax is no more accepted in Next.js App Router 
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const secret = process.env.DATA_API_KEY;
  console.log("secret = ", secret);

  if (req.method === "GET") {
    // Fetch and return user data
    const response = await fetch(DATA_SOURCE_URL);
    const todos: TypeTodo[] = await response.json();
    res.status(200).json({ todos });
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
```

```ts
// The following syntax (Route Handlers) is accepted in Next.js App Router 
export async function GET() {
  const secret = process.env.DATA_API_KEY;
  console.log("secret = ", secret);

  const res = await fetch(DATA_SOURCE_URL);
  const todos: TypeTodo[] = await res.json();

  return Response.json({ todos });
}
```

- test using `Thunder Client` on `http://localhost:3000/api/todos`

##  (12:43) DELETE route handler

```ts
export async function DELETE(request: Request) {
  console.log(request);
  const { id }: Partial<TypeTodo> = await request.json();

  if (!id) {
    return Response.json({ message: "Id is required from the body request" });
  }

  await fetch(`${DATA_SOURCE_URL}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "API-Key": process.env.DATA_API_KEY as string,
    },
  });

  return Response.json({ message: `Todo ${id} is deleted` });
}
```

- test it `DELETE http://localhost:3000/api/todos/` with body request`{"id": 123}`

- or use and test the following DELETE logic:

```ts
 
// `id` to delete in URL: http://loclahost:3000/api/todos?id=124 

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
        return Response.json({ message: "Id is required from the url" });
    }
    await fetch(`${DATA_SOURCE_URL}/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "API-Key": process.env.DATA_API_KEY as string,
        },
    });

    return Response.json({ message: `Todo ${id} is deleted` });
}
```

##  (18:34) POST route handler

- use the following data:
`{
  "userId": "12",
  "title": "walk the fish"
}`

- and test the following POST logic at `POST http://localhost:3000/api/todos`
  
```ts
export async function POST(request: Request) {
  const { userId, title }: Partial<TypeTodo> = await request.json();
  if (!userId || !title) {
    return Response.json({ message: "Missing userId OR title" });
  }

  const res = await fetch(`${DATA_SOURCE_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "API-Key": process.env.DATA_API_KEY as string,
    },
    body: JSON.stringify({ userId, title, completed: false }),
  });

  const newTodo: TypeTodo = await res.json();
  return Response.json(newTodo);
}
```

##  (21:55) PUT & PATCH routes handlers

- use the data: `{
  "title": "Fishing",
  "userId":"12",
  "completed": true
}`
  
- test at `PUT http://localhost:3000/api/todos/`

```ts
export async function PUT(request: Request) {
  const { userId, title, id, completed }: TypeTodo = await request.json();
  if (!userId || !title || !id || typeof completed !== "boolean") {
    return Response.json({ message: "Missing userId OR title" });
  }
  const response = await fetch(`${DATA_SOURCE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "API-Key": process.env.DATA_API_KEY as string,
    },
    body: JSON.stringify({ userId, title, completed }),
  });
  const updatedTodo: TypeTodo = await response.json();
  return Response.json(updatedTodo);
}
```

- it a `PATCH` verb, all the data is not required
- use this data : `{
  "title": "Fishing"
}`
  
- test at `PATCH http://localhost:3000/api/todos/`

```ts
export async function PATCH(request: Request) {
  const todo: Partial<TypeTodo> = await request.json();

  if (todo.completed && typeof todo.completed !== "boolean") {
    return Response.json({
      message: "Completed must be a boolean",
    });
  }
  const response = await fetch(`${DATA_SOURCE_URL}/${todo.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "API-Key": process.env.DATA_API_KEY as string,
    },
    body: JSON.stringify(todo),
  });
  const updatedTodo: TypeTodo = await response.json();
  return Response.json(updatedTodo);
}
```

##  (26:03) Dynamic API route

create a dynamic route `/src/app/api/todos/[todoId]/route.ts`

##  (29:57) Next steps

```ts
// --> 1
export async function GET(request: Request) {
  console.log("request = ", request);
  const id = request.url.slice(request.url.lastIndexOf("/") + 1);
  const response = await fetch(`${DATA_SOURCE_URL}/${id}`);

  const todo: TypeTodo = await response.json();
  if (!todo) {
    return Response.json({ message: `Not to found with id : ${id}` });
  }

  return Response.json(todo);
}

```

```ts

// 2
export async function GET(request: Request, { params }: Props) {
  const response = await fetch(`${DATA_SOURCE_URL}/${params.todoId}`);
  const todo: TypeTodo = await response.json();
  if (!todo.userId) {
    return Response.json({ message: `Not to found with todoId : ${params.todoId}` });
  }

  return Response.json(todo);
}
```

```ts
//3
/*--- todoId in params DELETE: <http://localhost:3000/api/todos/123> ---*/

export async function DELETE(request: Request, { params }: Props) {
  console.log("in [todoId]")
  if (!params.todoId) {
    return Response.json({ message: "Id is required from the url" });
  }

  console.log(params.todoId)
  await fetch(`${DATA_SOURCE_URL}/${params.todoId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "API-Key": process.env.DATA_API_KEY as string,
    },
  });

  return Response.json({ message: `Todo ${params.todoId} is deleted` });
}

```

```ts
/*PUT: <http://localhost:3000/api/todos/123>*/
export async function PUT(request: Request, { params }: Props) {
  const { userId, title, completed }: TypeTodo = await request.json();

  // if (!userId || !title || typeof completed !== "boolean") {
  //   return Response.json({ message: "Missing userId OR title" });
  // }
  const response = await fetch(`${DATA_SOURCE_URL}/${params.todoId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "API-Key": process.env.DATA_API_KEY as string,
    },
    body: JSON.stringify({ userId, title, completed }),
  });
  const updatedTodo: TypeTodo = await response.json();
  return Response.json(updatedTodo);
}
```

```ts
/*PATCH: <http://localhost:3000/api/todos/123>*/
export async function PATCH(request: Request, { params }: Props) {
  const todo: Partial<TypeTodo> = await request.json();

  if (todo.completed && typeof todo.completed !== "boolean") {
    return Response.json({
      message: "Completed must be a boolean",
    });
  }
  const response = await fetch(`${DATA_SOURCE_URL}/${params.todoId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "API-Key": process.env.DATA_API_KEY as string,
    },
    body: JSON.stringify(todo),
  });
  const updatedTodo: TypeTodo = await response.json();
  return Response.json(updatedTodo);
}
```
