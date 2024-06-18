import Todo from "./Todo";
import fetchTodos from "@/lib/fetchTodos";

export default async function TodoList() {
  const todos = await fetchTodos();

  if (!todos || todos.length === 0) {
    return <p>No Todos Available</p>;
  }

  return (
    <>
      {todos.reverse().map((todo) => (
        <Todo key={todo.id} {...todo} />
      ))}
    </>
  );
}
