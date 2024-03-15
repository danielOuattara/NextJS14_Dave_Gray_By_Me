import Todo from "./Todo";
import fetchTodos from "@/lib/fetchTodos";

export default async function TodoList() {
  const todos = await fetchTodos();
  const sortedTodos = todos.reverse();

  return (
    <>
      {sortedTodos.map((todo) => (
        <Todo key={todo.id} {...todo} />
      ))}
    </>
  );
}
