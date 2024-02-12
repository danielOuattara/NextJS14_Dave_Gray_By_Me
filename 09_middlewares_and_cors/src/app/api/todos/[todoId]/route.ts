const DATA_SOURCE_URL = "https://jsonplaceholder.typicode.com/todos";

type Props = {
  params: {
    todoId: string;
  };
};


//------------------------------------------------------------------- # 1
// export async function GET(request: Request) {
//   console.log("request = ", request);
//   const id = request.url.slice(request.url.lastIndexOf("/") + 1);
//   const response = await fetch(`${DATA_SOURCE_URL}/${id}`);

//   const todo: TypeTodo = await response.json();
//   if (!todo) {
//     return Response.json({ message: `Not to found with id : ${id}` });
//   }

//   return Response.json(todo);
// }

//------------------------------------------------------------------- # 2
export async function GET(request: Request, { params }: Props) {
  const response = await fetch(`${DATA_SOURCE_URL}/${params.todoId}`);
  const todo: TypeTodo = await response.json();
  if (!todo.userId) {
    return Response.json({ message: `Not to found with todoId : ${params.todoId}` });
  }

  return Response.json(todo);
}

//------------------------------------------------------------------- # 3
/*--- todoId in params DELETE: http://localhost:3000/api/todos/123 ---*/

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


//------------------------------------------------------------------------
/*PUT: http://localhost:3000/api/todos/123 */
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

//--------------------------------------------------------------------------
/*PATCH: http://localhost:3000/api/todos/123 */
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