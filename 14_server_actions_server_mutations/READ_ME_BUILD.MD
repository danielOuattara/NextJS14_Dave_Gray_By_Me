#  Next.js Server Actions Server Mutations

## (00:26) Getting Started

- read the doc: (<https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations>)

## (01:06) What Do Server Actions Provide?

- Server Actions are asynchronous functions that are executed on the server.

- They can be used in Server and Client Components to handle form submissions
  and data mutations in Next.js applications.

- the enable server-side data mutations, reduce client-side JavaScript,
  and progressively enhanced forms

## (01:33) Project Setup & Config

- `npx create-next-app@latest 13_server_actions_server_mutations`

- `yes` to all, and `No` to customizing option

- No need to update `next.config.mjs`: because server actions are no more
  in beta or development
  
- inspect `package.json` to check installed packages

- copy project files & folders from Dave's github repo src/ folder:
   `https://github.com/gitdagray/nextjs-server-actions`

## (03:54) Server Action with action prop in form

- main `page.tsx` of the project

  ```tsx
  import TodoList from "@/components/TodoList";
  import AddTodo from "@/components/AddTodo";

  export default function Home() {
    return (
      <>
        <AddTodo />
        <TodoList />
      </>
    );
  }
  ```

- AddTodo app

  ```tsx
  import { addTodo } from "@/lib/actions";

  export default function AddTodo() {
    const content = (
      <form action={addTodo} className="flex gap-2 items-center">
        <input
          type="text"
          name="title"
          className="text-2xl p-1 rounded-lg flex-grow w-full"
          placeholder="New Todo"
          autoFocus
        />

        <button
          type="submit"
          className="p-2 text-xl rounded-2xl text-black border-solid border-black border-2 max-w-xs bg-green-500 hover:cursor-pointer hover:bg-green-400"
        >
          Submit
        </button>
      </form>
    );

    return content;
  }
  ```

## (05:17) Ways to Invoke a Server Action (? still valid as Next.js evolved ??)

- using `action`: React's action prop allows invoking a Server Action
  on a `<form/>`

- using `formAction`: React's `formAction` prop allows handling `<button>`
  , `<input type="submit">`, `<input type="image">` elements in a `<form>`
  
- custom Invocation with `startTransition`: invoke Server Actions using `action` or `formAction` by using `startTransition`. This method disables `Progressive Enhancement`

- custom Invocation with `useOptimistic` from `react`. This method also disables
  `Progressive Enhancement`

## (06:16) "addTodo" Server Action

- actions.ts & discussion
  
  ```ts
  "use server";

  import { revalidatePath } from "next/cache";

  export async function addTodo(data: FormData) {
    const title = data.get("title");

    await fetch("<http://127.0.0.1:3500/todos>", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: 1,
        title,
        completed: false,
      }),
    });

    revalidatePath("/");
  }
  ```

## (08:36) What is Progressive Enhancement?

- Progressive Enhancement allows a `<form>` to work properly without
  Javascript, or with Javascript disabled. This allows users to interact
  with the form and submit data even if the JavaScript for the form
  has not been loaded yet or if it failed to load

- both `Server Form Actions` & `Client Form Actions` support Progressive
  Enhancement

## (09:27) Progressive Enhancement Example

- run the json server: `npx json-server -w db.json -p 3500 -h 127.0.0.1`

- deactivate Javascript on the browser and add a new todo
  
- confirm Progressive Enhancement Example

## (11:54) Server Action with formAction prop

- `TodoList`

  ```tsx
  import Todo from "./Todo";
  import fetchTodos from "@/lib/fetchTodos";

  export default async function TodoList() {
    const todos = await fetchTodos();

    if (!todos || todos.length === 0) {
      return <p>No Todos Available</p>;
    }

    return (
      <>
        {todos.reversed().map((todo) => (
          <Todo key={todo.id} {...todo} />
        ))}
      </>
    );
  }
  ```

- use of `formAction` in `Todo`

  ```tsx
  import { FaTrash } from "react-icons/fa";
  import Link from "next/link";
  import { deleteTodo } from "@/lib/actions";
  import UpdateCheckbox from "./UpdateCheckbox";

  export default function Todo(todo: Todo) {
    return (
      <form className="my-4 flex justify-between items-center">
        <label htmlFor="completed" className="text-2xl hover:underline">
          <Link href={`/edit/${todo.id}`}>{todo.title}</Link>
        </label>

        <div className="flex items-center gap-4">
          <UpdateCheckbox todo={todo} />

          <button
            className="p-3 text-xl rounded-2xl text-black border-solid border-black border-2 max-w-xs bg-red-400 hover:cursor-pointer hover:bg-red-300"
            formAction={async () => {
              "use server";
              await deleteTodo(todo);
            }}
          >
            <FaTrash />
          </button>
        </div>
      </form>
    );
  }
  ```

  - this function also works with Progressive Enhancement for form

## (15:27) Server Mutations definition

- <https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations#redirecting>

- (<https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations#revalidating-data>)

## (15:58) deleteTodo & updateTodo Server Actions

- `deleteTodo`

  ```tsx
  import { revalidatePath } from "next/cache";

  export async function deleteTodo(todo: Todo) {
  const res = await fetch(`http://127.0.0.1:3500/todos/${todo.id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: todo.id,
    }),
  });

  await res.json();
  revalidatePath("/");
  }
  ```

- `updateTodo`

  ```tsx
  import { revalidatePath } from "next/cache";

  export async function updateTodo(todo: Todo) {
  const res = await fetch(`http://127.0.0.1:3500/todos/${todo.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...todo,
      completed: !todo.completed,
    }),
  });

  await res.json();
  revalidatePath("/");
  }
  ```

  - note `revalidatePath()` fro the both

## (16:43) Server Action with startTransition

- `UpdateCheckbox`
  
  ```tsx
  "use client";

  import { updateTodo } from "@/lib/actions";
  import { useTransition } from "react";

  type TypeProps = { todo: Todo };

  export default function UpdateCheckbox({ todo }: TypeProps) {
    const [isPending, startTransition] = useTransition();

    return (
      <input
        type="checkbox"
        checked={todo.completed}
        id="completed"
        name="completed"
        onChange={() => startTransition(() => updateTodo(todo))}
        disabled={isPending}
        className="min-w-[2rem] min-h-[2rem]"
      />
    );
  }
  ```

- verify that checking & unchecking todo plus page refresh is ok.
  
- Verify it still work OK on the same page
  
## (18:38) Server Mutation Navigation Issue

- Checking & unchecking todo using different page might not work
  properly: not synchronized
  
1. we are mutating data on server
2. we do not keep any client side data
3. one path is revalidated not the other
4. Next.js has a client side cache
5. the difference between `hard` and `soft` navigation

## (20:12) Fix for the Navigation Issue

```tsx

"use client";

import { updateTodo } from "@/lib/actions";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";

type TypeProps = { todo: Todo };

export default function UpdateCheckbox({ todo }: TypeProps) {
  const router = useRouter();
  const { pending } = useFormStatus();

  return (
    <input
      type="checkbox"
      checked={todo.completed}
      id="completed"
      name="completed"
      onChange={async () => {
        await updateTodo(todo);
        router.refresh(); // updates client-side cache
      }}
      disabled={pending}
      className="min-w-[2rem] min-h-[2rem]"
    />
  );
}
```

## (23:28) useOptimistic for Optimistic Updates

```tsx
"use client";

import { updateTodo } from "@/lib/actions";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { useOptimistic } from "react";

type TypeProps = { todo: Todo };

export default function UpdateCheckbox({ todo }: TypeProps) {
  const router = useRouter();
  const { pending } = useFormStatus();
  const [optimisticTodo, addOptimisticTodo] = useOptimistic(
    todo,
    (state: Todo, completed: boolean) => ({ ...state, completed }),
  );

  return (
    <input
      type="checkbox"
      checked={optimisticTodo.completed}
      id="completed"
      name="completed"
      onChange={async () => {
        addOptimisticTodo(!todo.completed);
        await updateTodo(todo);
        router.refresh(); // updates client-side cache
      }}
      disabled={pending}
      className="min-w-[2rem] min-h-[2rem]"
    />
  );
}
```
