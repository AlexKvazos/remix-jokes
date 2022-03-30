import { json, Link, LoaderFunction, useCatch, useLoaderData } from "remix";
import { Joke } from "@prisma/client";
import { db } from "~/utils/db.server";

type LoaderData = {
  randomJoke: Joke;
};

export const loader: LoaderFunction = async () => {
  const count = await db.joke.count();
  const randomRowNumber = Math.floor(Math.random() * count);
  const [randomJoke] = await db.joke.findMany({
    take: 1,
    skip: randomRowNumber,
  });
  if (!randomJoke) {
    throw new Response("No random joke found", {
      status: 404,
    });
  }

  const data = { randomJoke };
  return json<LoaderData>(data);
};

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return (
      <div className="error-container">There are no jokes to display.</div>
    );
  }
  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}

export default function JokesIndexRoute() {
  const { randomJoke } = useLoaderData<LoaderData>();

  return (
    <div>
      <p>Here's a random joke</p>
      <p>{randomJoke.content}</p>
      <Link to={randomJoke.id}>"{randomJoke.name}" Permalink</Link>
    </div>
  );
}
