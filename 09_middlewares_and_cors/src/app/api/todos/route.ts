import { limiter } from "../config/limiter";
import { NextResponse } from "next/server";

const DATA_SOURCE_URL = "https://jsonplaceholder.typicode.com/todos";

//-------------------------------------------------
// export async function GET() {
//     const secret = process.env.DATA_API_KEY;
//     console.log("secret = ", secret);

//     const res = await fetch(DATA_SOURCE_URL)
//     const todos: TypeTodo[] = await res.json()
//     console.log("todos = ", todos);

//     return Response.json({ todos })
// }

//--- updated for CORS
export async function GET(request: Request) {
  const secret = process.env.DATA_API_KEY;
  console.log("secret = ", secret);

  const origin = request.headers.get("origin");
  console.log("origin = ", origin);

  const res = await fetch(DATA_SOURCE_URL);
  const todos: TypeTodo[] = await res.json();
  console.log("todos = ", todos);

  // return Response.json({ todos })

  return new NextResponse(JSON.stringify(todos), {
    headers: {
      "Access-Control-Allow-Origin": origin || "*",
      "Content-Type": "application/json",
    },
  });
}
//-------------------------------------------------

/*--- 
id in request body: {"title": "feed the cat"}
---*/
// export async function DELETE(request: Request) {
//     console.log(request)
//     const { id }: Partial<TypeTodo> = await request.json()

//     if (!id) {
//         return Response.json({ message: "Id is required from the body request" });
//     }

//     await fetch(`${DATA_SOURCE_URL}/${id}`, {
//         method: "DELETE",
//         headers: {
//             "Content-Type": "application/json",
//             "API-Key": process.env.DATA_API_KEY as string,
//         },
//     });

//     return Response.json({ message: `Todo ${id} is deleted` });
// }

/*--- 
id in URL body: http://loclahost:3000/api/todos?id=124 
---*/

// export async function DELETE(request: Request) {
//     const { searchParams } = new URL(request.url)
//     const id = searchParams.get("id")

//     if (!id) {
//         return Response.json({ message: "Id is required from the url" });
//     }
//     await fetch(`${DATA_SOURCE_URL}/${id}`, {
//         method: "DELETE",
//         headers: {
//             "Content-Type": "application/json",
//             "API-Key": process.env.DATA_API_KEY as string,
//         },
//     });

//     return Response.json({ message: `Todo ${id} is deleted` });
// }

//

//------------------------------------------------------------------------
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

//--------------------------------------------------------------------------
// export async function PUT(request: Request) {
//     const { userId, title, id, completed }: TypeTodo = await request.json();
//     if (!userId || !title || !id || typeof completed !== "boolean") {
//         return Response.json({ message: "Missing userId OR title" });
//     }
//     const response = await fetch(`${DATA_SOURCE_URL}/${id}`, {
//         method: "PUT",
//         headers: {
//             "Content-Type": "application/json",
//             "API-Key": process.env.DATA_API_KEY as string,
//         },
//         body: JSON.stringify({ userId, title, completed }),
//     });
//     const updatedTodo: TypeTodo = await response.json();
//     return Response.json(updatedTodo);
// }

//--------------------------------------------------------------------------
// export async function PATCH(request: Request) {
//     const todo: Partial<TypeTodo> = await request.json();

//     if (todo.completed && typeof todo.completed !== "boolean") {
//         return Response.json({
//             message: "Completed must be a boolean",
//         });
//     }
//     const response = await fetch(`${DATA_SOURCE_URL}/${todo.id}`, {
//         method: "PATCH",
//         headers: {
//             "Content-Type": "application/json",
//             "API-Key": process.env.DATA_API_KEY as string,
//         },
//         body: JSON.stringify(todo),
//     });
//     const updatedTodo: TypeTodo = await response.json();
//     return Response.json(updatedTodo);
// }
