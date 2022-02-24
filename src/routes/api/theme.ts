import type { RequestHandler } from "@sveltejs/kit";
import { dev } from "$app/env";

interface Cookie {
  name: string;
  value: string;
  expires?: Date;
  httpOnly?: boolean;
  maxAge?: number;
  path?: string;
  sameSite?: string;
  secrets?: string[];
  secure?: boolean;
}

function genCookie(cookie: Cookie): string {
  return [
    `${cookie.name}=${cookie.value}`,
    cookie.expires && `Expires=${cookie.expires}`,
    cookie.httpOnly && `HttpOnly=${cookie.httpOnly}`,
    cookie.maxAge && `Max-Age=${cookie.maxAge}`,
    cookie.path && `Path=${cookie.path}`,
    cookie.sameSite && `SameSite=${cookie.sameSite}`,
    cookie.secure && `SameSite=${cookie.secure}`,
  ]
    .filter((item) => item)
    .join(";");
}

export const put: RequestHandler = async ({ request }) => {
  const res = await request.json();

  const cookie: Cookie = {
    name: "theme",
    value: res.theme,
    expires: new Date(Date.now() + 60 * 60 * 24 * 30),
    httpOnly: !dev,
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
    sameSite: "lax",
    secrets: ["secret"],
    secure: !dev,
  };

  return {
    status: 200,
    headers: {
      "Set-Cookie": [genCookie(cookie)],
    },
  };
};
