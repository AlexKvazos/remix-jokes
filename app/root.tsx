import {
  Links,
  LinksFunction,
  LiveReload,
  Meta,
  MetaFunction,
  Outlet,
  Scripts,
  useCatch,
} from "remix";

import globalStylesUrl from "~/styles/global.css";
import globalMediumStylesUrl from "~/styles/global-medium.css";
import globalLargeStylesUrl from "~/styles/global-large.css";
import { ReactNode } from "react";

export const links: LinksFunction = () => [
  {
    rel: "stylesheet",
    href: globalStylesUrl,
  },
  {
    rel: "stylesheet",
    href: globalMediumStylesUrl,
    media: "print, (min-width: 640px)",
  },
  {
    rel: "stylesheet",
    href: globalLargeStylesUrl,
    media: "screen (min-width: 1024px)",
  },
];

export const meta: MetaFunction = () => {
  const description = `Learn Remi and laugh at the same time!`;
  return {
    charset: "utf-8",
    description,
    keywoard: "Remix,Jokes",
    "twitter:image": "https://remix-jokes.lol/social.png",
    "twitter:card": "summary_large_image",
    "twitter:creator": "@remix_run",
    "twitter:site": "@remix_run",
    "twitter:title": "Remix Jokes",
    "twitter:description": description,
  };
};

type DocumentProps = {
  children: ReactNode;
  title?: string;
};

function Document({
  children,
  title = `Remix: So great, it's funny!`,
}: DocumentProps) {
  return (
    <html lang="en">
      <head>
        <Meta />
        <title>{title}</title>
        <Links />
      </head>
      <body>
        {children}
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <Document>
      <Outlet />
    </Document>
  );
}

export function CatchBoundary() {
  const caught = useCatch();

  return (
    <Document title={`${caught.status} ${caught.statusText}`}>
      <div className="error-container">
        <h1>
          {caught.status} {caught.statusText}
        </h1>
      </div>
    </Document>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <Document title="Uh-oh!">
      <div className="error-container">
        <h1>App Error</h1>
        <pre>{error.message}</pre>
      </div>
    </Document>
  );
}
