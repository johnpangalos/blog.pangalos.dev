import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  redirect,
  Form,
  useLoaderData,
} from "remix";
import type { MetaFunction } from "remix";
import styles from "./styles/app.css";
import cn from "clsx";
import { Button } from "./components/Button";

const DARK_KEY = "dark-key";
const LIGHT = "light";
const DARK = "dark";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export const meta: MetaFunction = () => {
  return { title: "New Remix App" };
};

export const loader: LoaderFunction = async ({
  request,
  context,
}): Promise<boolean> => {
  const session = await context.env.getSession(request.headers.get("cookie"));

  console.log(session.get(DARK_KEY));
  return session.get(DARK_KEY) === DARK;
};

export const action: ActionFunction = async ({ request, context }) => {
  const body = await request.formData();
  const session = await context.env.getSession(request.headers.get("cookie"));

  console.log(body.get(DARK_KEY));
  session.set(DARK_KEY, body.get(DARK_KEY));
  const cookie = await context.env.commitSession(session);

  return redirect(request.url, {
    headers: {
      "Set-Cookie": cookie,
    },
  });
};

export default function App() {
  const dark = useLoaderData<boolean>();
  console.log(dark);
  return (
    <html lang="en" className={cn({ dark: dark })}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="m-auto max-w-2xl text-stone-900 dark:bg-stone-900 dark:text-white">
        <nav className="flex items-center justify-between py-3">
          <div className="font-serif text-3xl font-extrabold text-fuchsia-700 dark:text-fuchsia-500">
            blog.pangalos.dev
          </div>
          <div>
            <Form method="post">
              <input
                className="hidden"
                readOnly
                type="text"
                name={DARK_KEY}
                value={dark ? LIGHT : DARK}
              />
              <Button type="submit">{dark ? "light" : "dark"}</Button>
            </Form>
          </div>
        </nav>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}
