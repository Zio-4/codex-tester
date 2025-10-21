import TodoApp from "./components/TodoApp";
import WeatherWidget from "./components/WeatherWidget";

export default function Home() {
  return (
    <div className="min-h-screen bg-blue-500 px-4 py-10 dark:bg-blue-950">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
        <header className="space-y-2 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Weather &amp; Tasks
          </h1>
          <p className="text-base text-blue-100">
            Stay on top of the forecast and your to-do list in one place.
          </p>
        </header>

        <WeatherWidget />
        <TodoApp />
      </div>
    </div>
  );
}
