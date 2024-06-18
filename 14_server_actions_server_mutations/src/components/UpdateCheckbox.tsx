// "use client";

// import { updateTodo } from "@/lib/actions";
// import { useTransition } from "react";

// type TypeProps = { todo: Todo };

// export default function UpdateCheckbox({ todo }: TypeProps) {
//   const [isPending, startTransition] = useTransition();

//   return (
//     <input
//       type="checkbox"
//       checked={todo.completed}
//       id="completed"
//       name="completed"
//       onChange={() => startTransition(() => updateTodo(todo))}
//       disabled={isPending}
//       className="min-w-[2rem] min-h-[2rem]"
//     />
//   );
// }
//-------------------------------------------------------

// "use client";

// import { updateTodo } from "@/lib/actions";
// import { useFormStatus } from "react-dom";
// import { useRouter } from "next/navigation";

// type TypeProps = { todo: Todo };

// export default function UpdateCheckbox({ todo }: TypeProps) {
//   const router = useRouter();
//   const { pending } = useFormStatus();

//   return (
//     <input
//       type="checkbox"
//       checked={todo.completed}
//       id="completed"
//       name="completed"
//       onChange={async () => {
//         await updateTodo(todo);
//         router.refresh(); // updates client-side cache
//       }}
//       disabled={pending}
//       className="min-w-[2rem] min-h-[2rem]"
//     />
//   );
// }

//-------------------------------------------------------

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
