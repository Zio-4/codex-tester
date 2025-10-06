"use client";

import { FormEvent, useMemo, useState } from "react";

type Todo = {
  id: string;
  text: string;
  createdAt: number;
};

const createId = () => crypto.randomUUID?.() ?? Math.random().toString(36).slice(2);

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState("");

  const sortedTodos = useMemo(
    () => [...todos].sort((a, b) => b.createdAt - a.createdAt),
    [todos],
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = newTodo.trim();
    if (!text) return;

    setTodos((prev) => [
      ...prev,
      {
        id: createId(),
        text,
        createdAt: Date.now(),
      },
    ]);
    setNewTodo("");
  };

  const startEditing = (todo: Todo) => {
    setEditingId(todo.id);
    setEditingValue(todo.text);
  };

  const saveEdit = () => {
    const text = editingValue.trim();
    if (!editingId || !text) {
      cancelEdit();
      return;
    }

    setTodos((prev) =>
      prev.map((todo) => (todo.id === editingId ? { ...todo, text } : todo)),
    );
    cancelEdit();
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingValue("");
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
    if (editingId === id) {
      cancelEdit();
    }
  };

  return (
    <section className="rounded-2xl bg-white/90 p-6 shadow-lg ring-1 ring-black/5 backdrop-blur dark:bg-slate-900/70">
      <div className="mb-4">
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Tasks are stored in your browser and reset when you refresh the page.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mb-6 flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="todo-input">
          Add a to-do
        </label>
        <input
          id="todo-input"
          value={newTodo}
          onChange={(event) => setNewTodo(event.target.value)}
          placeholder="What do you need to get done?"
          className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-base shadow-sm transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-950/60 dark:text-white"
        />
        <button
          type="submit"
          className="rounded-xl bg-sky-500 px-5 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-200 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900"
        >
          Add task
        </button>
      </form>

      {sortedTodos.length === 0 ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          You don&apos;t have any tasks yet. Add one above to get started.
        </p>
      ) : (
        <ul className="space-y-3">
          {sortedTodos.map((todo) => {
            const isEditing = editingId === todo.id;
            return (
              <li
                key={todo.id}
                className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white/70 p-4 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-950/60 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex-1">
                  {isEditing ? (
                    <input
                      autoFocus
                      value={editingValue}
                      onChange={(event) => setEditingValue(event.target.value)}
                      onBlur={saveEdit}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          saveEdit();
                        }
                        if (event.key === "Escape") {
                          event.preventDefault();
                          cancelEdit();
                        }
                      }}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                    />
                  ) : (
                    <p className="text-base text-slate-800 dark:text-slate-100">{todo.text}</p>
                  )}
                </div>
                <div className="flex flex-shrink-0 items-center gap-2">
                  {isEditing ? (
                    <button
                      type="button"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={saveEdit}
                      className="rounded-lg bg-emerald-500 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => startEditing(todo)}
                      className="rounded-lg bg-slate-200 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-700 transition hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => deleteTodo(todo.id)}
                    className="rounded-lg bg-rose-500 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-200"
                  >
                    Delete
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
