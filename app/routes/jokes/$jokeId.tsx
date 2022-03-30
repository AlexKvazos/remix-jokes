import {
  json,
  Link,
  LoaderFunction,
  MetaFunction,
  useCatch,
  useLoaderData,
  useParams,
} from "remix";
import { Joke } from "@prisma/client";

import { db } from "~/utils/db.server";

type LoaderData = {
  joke: Joke;
};

export const meta: MetaFunction = ({
  data,
}: {
  data: LoaderData | undefined;
}) => {
  if (!data) {
    return {
      title: "No joke",
      description: "No joke found",
    };
  }
  return {
    title: `${data.joke.name} joke`,
    description: `Enjoy the ${data.joke.name} joke and much more`,
  };
};

export const loader: LoaderFunction = async ({ params }) => {
  const joke = await db.joke.findUnique({ where: { id: params.jokeId } });
  if (!joke) {
    throw new Response("What a joke! Not found.", {
      status: 404,
    });
  }

  const data = { joke };
  return json<LoaderData>(data);
};

export default function JokeRoute() {
  const { joke } = useLoaderData<LoaderData>();

  return (
    <div>
      <p>Here's your hilarious joke:</p>
      <p>{joke.content}</p>
      <Link to=".">{joke.name} Permalink</Link>
    </div>
  );
}

export function CatchBoundary() {
  const caught = useCatch();
  const params = useParams();
  if (caught.status === 404) {
    return (
      <div className="error-container">
        Huh? What the heck is "{params.jokeId}"?
      </div>
    );
  }
  throw new Error(`Unhandled error: ${caught.status}`);
}

export function ErrorBoundary() {
  const { jokeId } = useParams();
  return (
    <div className="error-container">{`There was an error loading joke by the id ${jokeId}. Sorry.`}</div>
  );
}
